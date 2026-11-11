# Kurio — Marketplace de NFTs

Implementação completa do marketplace de NFTs **Kurio** em **React 19** e **TypeScript**, baseada no layout do Figma com fidelidade visual para Desktop e Mobile.

A aplicação utiliza arquitetura orientada a contratos, roteamento com sincronização de URL, gerenciamento de estado assíncrono com TanStack Query, camada de mocks via MSW com cenários determinísticos de falha, eventos em tempo real com Socket.IO e suíte de testes E2E com Playwright.

---

## 🚀 Quick Start

### Pré-requisitos
* Node.js >= 20.x
* npm >= 10.x

### Instalação
```bash
# Instalar dependências
npm install
```

### Executar em Desenvolvimento
```bash
npm run dev
```
Acesse `http://localhost:5173`. O Mock Service Worker (MSW) é inicializado automaticamente no navegador.

### Build e Preview de Produção
```bash
npm run build
npm run preview
```

---

## 🔑 Credenciais Fictícias e Dados de Teste

Para avaliação dos fluxos autenticados, estão disponíveis as seguintes contas de teste no banco mock:

| Usuário | E-mail | Senha | Perfil |
| :--- | :--- | :--- | :--- |
| **Nova Sato** | `contato@email.com` | `password123` | Colecionador principal com carteiras e favoritos pré-configurados |
| **Alex Rivers** | `alex@email.com` | `password123` | Colecionador secundário para teste de isolamento de sessão |

### Cupons Promocionais Cadastrados
* `KURIO10`: 10% de desconto no subtotal (ativo)
* `LAUNCH20`: 20% de desconto no subtotal (ativo)
* `EXPIRED50`: Simulação de cupom expirado

---

## 🕹️ Testando Cenários de Falha e Tempo Real (Painel de Avaliação)

No canto inferior direito da tela, há um **painel flutuante de simulação** que permite reproduzir diretamente os cenários descritos no enunciado:

1. **Rede Lenta (`slow_network`)**: Adiciona 2200ms de latência artificial para observar os skeletons com animação shimmer.
2. **Erro 500 no Servidor (`server_error`)**: Força respostas HTTP 500 no catálogo e mutations para testar telas de erro e botões de retry.
3. **Sessão Expirada (`session_expired`)**: Retorna HTTP 401 durante navegação ou checkout, exercitando o redirecionamento com preservação do contexto.
4. **Preço Alterado no Checkout (`price_surge`)**: Simula variação de cotação do ativo antes do envio da ordem, exigindo revalidação do usuário.
5. **Edição Esgotada (`stock_out`)**: Simula concorrência onde as edições restantes se esgotam no momento do pagamento.
6. **Timeout no Pedido (`payment_timeout`)**: Simula atraso na resposta da criação do pedido para demonstrar a recuperação pela mesma `Idempotency-Key`.
7. **Pagamento Recusado (`payment_rejected`)**: Simula rejeição de pagamento pela rede blockchain.
8. **Disparar `nft.updated` (Socket.IO)**: Dispara um evento de tempo real alterando o preço do *Emerald Ape* de 1.19 ETH para 1.89 ETH.
9. **Restaurar Banco Mock**: Restaura o estado inicial limpo do banco de dados em `localStorage`.

---

## 🧪 Testes E2E com Playwright

A suíte cobre os cenários obrigatórios do desafio (busca, filtros compostos, detalhes, 404, cadastro, login, persistência de carrinho, checkout idempotente, atualizações via socket e gerenciamento de carteiras):

```bash
# Executar todos os testes E2E
npm run test:e2e

# Executar com interface gráfica interativa
npm run test:e2e:ui

# Visualizar o relatório HTML dos testes
npm run test:e2e:report
```

---

## 📊 Auditoria de Performance e Qualidade (Lighthouse)

Metas estabelecidas e auditadas:
* **Performance**: >= 90
* **Accessibility**: >= 95
* **Best Practices**: >= 95
* **SEO**: >= 90

Para rodar uma auditoria local:
```bash
npm run build
npm run preview -- --port 4173
npx lighthouse http://localhost:4173 --output html --output-path ./reports/lighthouse/home-desktop.html --preset=desktop --chrome-flags="--headless"
```

---

## 🌐 Deploy em Produção

O projeto está otimizado para deploy em plataformas de borda (Vercel, Netlify ou Cloudflare Pages):

### Vercel
1. Conecte o repositório no dashboard da [Vercel](https://vercel.com).
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`
4. Output Directory: `dist`

### Netlify
O build gera a pasta `dist` estática com service worker incluído.

---

## 📚 Documentação Adicional

Consulte o arquivo [`ARCHITECTURE.md`](./ARCHITECTURE.md) para detalhes aprofundados sobre:
* Contratos REST e schemas de dados;
* Política de versionamento e deduplicação de eventos do Socket.IO;
* Estratégia de cache do TanStack Query e rollback otimista;
* Garantias de idempotência contra cliques duplicados no checkout.
