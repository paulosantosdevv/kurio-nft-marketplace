# Arquitetura — Kurio NFT Marketplace

Este documento detalha as decisões de engenharia, estratégias de estado, protocolos de comunicação e padrões arquiteturais adotados no desenvolvimento do marketplace **Kurio**.

---

## 1. Visão Geral da Arquitetura

A aplicação foi estruturada seguindo o princípio da separação estrita de responsabilidades, garantindo que componentes visuais sejam puramente declarativos e desacoplados dos detalhes de transporte e persistência:

```
┌────────────────────────────────────────────────────────┐
│             Camada Visual & Interação                  │
│       (React 19 + Tailwind CSS + shadcn/ui)            │
└───────────────▲────────────────────────▲───────────────┘
                │                        │
┌───────────────┴───────────────┐ ┌──────┴───────────────┐
│     Roteamento & Estado       │ │    Gerenciamento     │
│       (TanStack Router)       │ │     de Sessão        │
│    URL Search Params / Zod    │ │   (AuthContext)      │
└───────────────▲───────────────┘ └──────▲───────────────┘
                │                        │
┌───────────────┴────────────────────────┴───────────────┐
│              Camada de Estado Remoto                   │
│         (TanStack Query + Axios Client)                │
│    Cache / Invalidações / Rollback Otimista            │
└───────────────▲────────────────────────▲───────────────┘
                │                        │
┌───────────────┴───────────────┐ ┌──────┴───────────────┐
│    Mocking de Rede (MSW)      │ │   Tempo Real         │
│  Service Worker / Idempotência│ │ (Socket.IO Client)   │
│  Fixtures / Cenários de Falha │ │ Version Guard Rails  │
└───────────────────────────────┘ └──────────────────────┘
```

---

## 2. Roteamento & Estado de Navegação (TanStack Router)

* **Sincronização com a URL**: Parâmetros de catálogo (`search`, `category`, `priceMin`, `priceMax`, `network`, `sortBy`, `page`) residem na query string da URL via schemas tipados do TanStack Router.
* **Sobrevivência a Refresh e Histórico**: Navegação pelo botão "Voltar/Avançar" do navegador restaura o estado exato da listagem sem disparar fetches redundantes.
* **Proteção de Rotas Privadas**: O fluxo de checkout (`/pagamento`), dados cadastrais (`/perfil`) e carteiras (`/carteiras`) validam a existência da sessão ativa. Caso ausente, o usuário é direcionado para `/login?redirect=<rota>`, preservando a intenção de navegação para após a autenticação.

---

## 3. Camada de Estado Remoto & Cache (TanStack Query)

### 3.1 Política de Cache e Retentativas
* `staleTime`: Definido em 30 a 60 segundos para consultas de catálogo e detalhe, permitindo navegação instantânea.
* `retry`: Erros HTTP na faixa `4xx` (não autorizado, validação, recurso inexistente) são imediatamente rejeitados sem tentativas repetidas desnecessárias. Apenas falhas transitórias de rede sofrem retry com backoff exponencial.
* `Isolamento por Usuário`: Chaves de cache como `['cart']`, `['favorites']` e `['wallets']` são invalidadas e limpas no momento do logout via `queryClient.clear()`, impedindo vazamento de dados entre perfis.

### 3.2 Atualizações Otimistas & Rollback
A ação de favoritar ativos digitais (`POST /api/favorites/:id`) aplica atualização otimista imediata na UI:
1. O estado local do coração e contador incrementa/decrementa antes da resposta do servidor.
2. Caso a chamada falhe (ex: queda de rede ou cenário de erro), o callback `onError` restaura o snapshot anterior salvo no contexto de mutation.

---

## 4. Camada de Mocking (MSW - Mock Service Worker)

Os mocks operam no nível de transporte de rede via Service Worker no navegador, garantindo que o código da aplicação e o cliente Axios realizem requisições HTTP padrão.

### 4.1 Persistência e Reset
O estado dos mocks (usuários, acervo de NFTs, pedidos, carteiras e cupons) é mantido em `localStorage` para sustentar refreshes durante testes manuais. O método `mockStore.reset()` restaura integralmente o banco mock para o estado inicial determinístico.

### 4.2 Idempotência de Pedidos
O endpoint `POST /api/orders` requer o cabeçalho `Idempotency-Key`:
* Requisições repetidas com a **mesma chave e mesmo payload** retornam a ordem já criada com status HTTP 200 (evitando cobranças duplicadas em cliques rápidos ou reconexões).
* Tentativas de reutilizar a mesma chave com payload divergente retornam HTTP 409 (Conflict).

### 4.3 Cenários Determinísticos de Falha
Controláveis via painel flutuante e fixtures:
* `slow_network`: latência injetada de 2200ms para teste de skeletons;
* `server_error`: injeção de HTTP 500 no catálogo e mutations;
* `session_expired`: retorno de HTTP 401 simulando expiração de token;
* `price_surge`: alteração de cotação durante a etapa de checkout, exigindo revalidação do usuário;
* `stock_out`: esgotamento de edições durante o envio;
* `payment_timeout`: criação do pedido com timeout na resposta para exercitar idempotência;
* `payment_rejected`: pedido gravado com estado recusado pela rede.

---

## 5. Tempo Real com Socket.IO

### 5.1 Especificação de Eventos
* `nft.updated`: Emite `{ nftId, newPrice, availableEditions, version, timestamp }`.
* `order.updated`: Emite `{ orderId, status, version, timestamp }`.

### 5.2 Version Guard Rails (Descarte de Eventos Obsoletos)
Para evitar que respostas antigas ou eventos fora de ordem regridam um estado mais recente:
* Cada NFT mantém um contador de `version` monotônico.
* O cliente armazena a versão mais recente processada. Se um evento recebido possui `event.version <= lastKnownVersion`, ele é sumariamente descartado.

### 5.3 Reconciliação no Carrinho e Checkout
Quando o usuário está no carrinho ou checkout e um evento `nft.updated` é recebido:
1. Um banner de alerta em tempo real é exibido informando a variação do ativo.
2. A cotação é recalculada via `POST /api/checkout/quote`.
3. O botão de finalização exige confirmação expressa do usuário caso o total tenha aumentado.

---

## 6. Acessibilidade e Performance

* **Skeletons com Shimmer**: Componentes dependentes de dados utilizam skeletons com animação shimmer respeitando `prefers-reduced-motion`.
* **Navegação por Teclado**: Foco visível em todos os elementos interativos com `focus-visible`.
* **Semântica WAI-ARIA**: Modais e drawers com `role="dialog"`, `aria-modal="true"` e fechamento via tecla `Escape`.
* **Tipagem dos Valores**: Cotações em ETH trafegam estritamente como strings decimais, preservando precisão e evitando erros de arredondamento de ponto flutuante em JavaScript.
