# Kurio — Marketplace de NFTs | Desafio Frontend

[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.3-61dafb?logo=react)](https://react.dev/)
[![TanStack Router](https://img.shields.io/badge/TanStack_Router-1.170-ff4154)](https://tanstack.com/router)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-5.107-ff4154)](https://tanstack.com/query)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Playwright Tests](https://img.shields.io/badge/Playwright_E2E-32%2F32_Passed-success?logo=playwright)](https://playwright.dev/)

Implementação completa e orientada a contratos do marketplace de arte digital **Kurio**, desenvolvida com **React 19**, **TypeScript** e **Tailwind CSS v4**, seguindo estritamente os layouts do Figma para visualizações Desktop (1440px) e Mobile (414px/390px).

A aplicação conta com arquitetura modular, estado de navegação com sincronização de URL, chamadas REST mockadas no nível de rede com **Mock Service Worker (MSW)**, simulação de eventos em tempo real com **Socket.IO**, proteção contra cliques duplicados via **Idempotency-Key** e suíte completa de **32 testes E2E automatizados** com Playwright.

---

## 📋 Sumário
- [Destaques Técnicos](#-destaques-técnicos)
- [Quick Start](#-quick-start)
- [Credenciais e Dados de Teste](#-credenciais-e-dados-de-teste)
- [Simulação de Cenários de Rede e Falhas (MSW)](#-simulação-de-cenários-de-rede-e-falhas-msw)
- [Testes Automatizados (Playwright E2E)](#-testes-automatizados-playwright-e2e)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Como Subir no GitHub](#-como-subir-no-github)
- [Como Colocar no Ar (Deploy)](#-como-colocar-no-ar-deploy)
- [Decisões Arquiteturais](#-decisões-arquiteturais)

---

## ⚡ Destaques Técnicos

1. **Fidelidade Visual Pixel-Perfect**:
   - Layouts Desktop e Mobile fiéis às referências do Figma (cores, tipografia mono, bordas quentes `#3d271f`, cards `#241612`, proporções de imagem e espaçamentos).
   - Componentes responsivos fluidos: Navbar com indicador ativo, Hero com artes exclusivas, Banners promocionais com alinhamento à direita, Diário de Cunhagem com 4 artigos e Rodapé unificado em container contínuo.

2. **Roteamento & Sincronização de URL (TanStack Router)**:
   - Filtros do catálogo (`search`, `category`, `priceMin`, `priceMax`, `network`, `sortBy`, `page`) refletidos na URL Search Params com schema tipado.
   - Histórico de navegação nativo (botões Voltar/Avançar preservam o estado da listagem sem recarregar a tela).
   - Proteção de rotas privadas (`/pagamento`, `/perfil`, `/carteiras`) com redirecionamento para `/login?redirect=...` e retorno automático após autenticação.

3. **Gerenciamento de Estado Remoto & Cache (TanStack Query)**:
   - Cache otimizado com `staleTime`, deduplicação de requisições e isolamento de cache por usuário.
   - Atualizações otimistas na ação de favoritar NFTs com rollback automático em caso de falha de rede.

4. **Idempotência no Checkout**:
   - Requisições para `POST /api/orders` utilizam cabeçalho `Idempotency-Key` persistido por sessão.
   - Previne compras duplicadas e cobranças acidentais em caso de duplo clique ou perda transitória de conexão.

5. **Tempo Real com Socket.IO & Version Guard Rails**:
   - Eventos `nft.updated` para sincronização dinâmica de preços e edições disponíveis.
   - Reconciliação em tempo real no carrinho e checkout com alerta visual caso o valor de um item selecionado sofra alteração.
   - Descarte determinístico de eventos obsoletos através de contador de versão monotônico (`version`).

---

## 🚀 Quick Start

### Pré-requisitos
* **Node.js** >= 20.x
* **npm** >= 10.x

### 1. Clonar e Instalar Dependências
```bash
git clone <URL_DO_REPOSITORIO>
cd kurio-nft-marketplace
npm install
```

### 2. Rodar em Modo de Desenvolvimento
```bash
npm run dev
```
Abra o navegador em [http://localhost:5173](http://localhost:5173). O Mock Service Worker (MSW) será registrado automaticamente para interceptar as requisições de API no navegador.

### 3. Build de Produção e Preview
```bash
# Validação de tipos TypeScript e build do Vite
npm run build

# Pré-visualização do bundle gerado
npm run preview
```

---

## 🔑 Credenciais e Dados de Teste

Para navegar e validar todos os fluxos autenticados, utilize as contas pré-configuradas no banco mock:

| Usuário | E-mail | Senha | Função / Dados Pré-carregados |
| :--- | :--- | :--- | :--- |
| **Nova Sato** | `contato@email.com` | `password123` | Colecionador principal com carteiras conectadas e favoritos |
| **Alex Rivers** | `alex@email.com` | `password123` | Colecionador secundário para teste de isolamento de sessão |

### Cupons Promocionais Disponíveis:
* `KURIO10`: Aplica **10% de desconto** no subtotal da compra (Ativo).
* `LAUNCH20`: Aplica **20% de desconto** no subtotal da compra (Ativo).
* `EXPIRED50`: Simula cupom expirado/inválido com retorno de erro amigável.

---

## 🕹️ Simulação de Cenários de Rede e Falhas (MSW)

No canto inferior direito da tela, há um **painel flutuante de avaliação** que permite acionar em tempo real os cenários de contingência solicitados no desafio:

1. **Rede Lenta (`slow_network`)**: Injeta latência artificial de 2200ms nas respostas da API para observar o comportamento dos skeletons com animação shimmer.
2. **Erro 500 no Servidor (`server_error`)**: Força respostas HTTP 500 para validar as telas de erro amigáveis e botões de nova tentativa (*retry*).
3. **Sessão Expirada (`session_expired`)**: Retorna HTTP 401 durante navegação ou checkout, testando o redirecionamento com preservação de rota de retorno.
4. **Preço Alterado no Checkout (`price_surge`)**: Simula variação de cotação do ativo durante a finalização do pedido, exigindo confirmação explícita do usuário.
5. **Edição Esgotada (`stock_out`)**: Simula concorrência onde as edições do NFT se esgotam no momento do pagamento.
6. **Timeout no Pedido (`payment_timeout`)**: Simula timeout na resposta da ordem, demonstrando a recuperação idempotente pela mesma `Idempotency-Key`.
7. **Pagamento Recusado (`payment_rejected`)**: Simula rejeição da transação pela rede blockchain.
8. **Disparar `nft.updated` (Socket.IO)**: Dispara um evento de tempo real alterando o preço do *Emerald Ape #842* (de 1.19 ETH para 1.89 ETH) com reconciliação imediata na interface.
9. **Restaurar Banco Mock**: Reseta o estado do `localStorage` para o padrão inicial limpo.

> **Nota**: No mobile, o botão do painel se posiciona automaticamente acima da barra de navegação inferior (`MobileBottomNav`), sem obstruir menus ou botões fixos de ação.

---

## 🧪 Testes Automatizados (Playwright E2E)

A aplicação conta com uma suíte completa de **32 testes automatizados** cobrindo todos os fluxos críticos de ponta a ponta, executados tanto no perfil **Desktop** (1440x900) quanto no **Mobile** (Pixel 5 / 390x844):

```bash
# Executar todos os 32 testes E2E em modo headless
npm run test:e2e

# Executar com a interface gráfica interativa do Playwright
npm run test:e2e:ui

# Exibir o relatório visual HTML após a execução
npm run test:e2e:report
```

### Escopo dos Testes:
* **Catálogo, Filtros e Busca**: Carregamento da grade 3x3, busca por texto, filtros de categoria, faixa de preço por slider e filtros por rede blockchain com persistência no histórico (`catalog.spec.ts`).
* **Detalhes do NFT e Tratamento de Erros**: Carregamento dinâmico de metadados, cálculo de quantidade, atualização de favoritos e página 404 para identificador inexistente (`nft-detail.spec.ts`).
* **Carrinho, Cupons e Persistência**: Adição de múltiplos itens, drawer/página de carrinho, validação de cupons promocionais e persistência após recarregamento da página (`cart.spec.ts`).
* **Autenticação, Checkout Idempotente e Confirmação**: Cadastro com bloqueio de e-mail duplicado, login com redirecionamento inteligente, checkout com proteção contra duplo clique e recibo completo com snapshot (`auth-checkout.spec.ts`).
* **Tempo Real com Socket.IO**: Atualização de preço via socket durante a navegação e alerta de reconciliação com bloqueio de avanço caso o preço mude no carrinho (`realtime-socket.spec.ts`).
* **Perfil do Colecionador e Carteiras**: Edição de dados cadastrais, adição de nova carteira e alternância de carteira primária/secundária (`profile-wallets.spec.ts`).

---

## 📁 Estrutura do Projeto

```
kurio-nft-marketplace/
├── e2e/                           # Suíte de testes ponta a ponta (Playwright)
│   ├── auth-checkout.spec.ts
│   ├── cart.spec.ts
│   ├── catalog.spec.ts
│   ├── nft-detail.spec.ts
│   ├── profile-wallets.spec.ts
│   └── realtime-socket.spec.ts
├── public/
│   ├── assets/nfts/               # Imagens e artes originais dos personagens
│   └── mockServiceWorker.js       # Service worker do MSW
├── src/
│   ├── api/                       # Clientes HTTP e contratos tipados (Axios)
│   ├── components/
│   │   ├── cart/                  # Drawer e itens do carrinho
│   │   ├── home/                  # HeroBanner, PromoBanners, MintDiary
│   │   ├── layout/                # Header, Footer, ScenarioBar, MobileBottomNav
│   │   ├── nfts/                  # NFTCard, NFTGrid, NFTFilters
│   │   └── ui/                    # Componentes base (Button, Input, Skeleton)
│   ├── context/                   # Contextos globais (Auth, Cart, Scenario)
│   ├── mocks/                     # Handlers MSW, fixtures e mock store
│   │   ├── db/mockStore.ts        # Banco mock em memória/localStorage
│   │   ├── handlers/              # Endpoints mockados (auth, nfts, cart, orders)
│   │   └── scenarios.ts           # Definição dos cenários de teste
│   ├── routes/                    # Configuração de rotas (TanStack Router)
│   ├── socket/                    # Serviço e listener de eventos Socket.IO
│   ├── types/                     # Interfaces TypeScript (NFT, User, Order, Wallet)
│   └── views/                     # Páginas da aplicação (Home, NFTDetail, Cart, Checkout, etc.)
├── ARCHITECTURE.md                # Detalhamento arquitetural completo
├── package.json
├── playwright.config.ts           # Configuração de viewports e projetos Playwright
└── vite.config.ts
```

---

## 📤 Como Subir no GitHub

Para publicar o projeto em seu repositório pessoal no GitHub:

1. **Crie um repositório vazio** no GitHub (ex: `kurio-nft-marketplace`).
2. No terminal do projeto, execute os comandos:

```bash
# 1. Renomear o branch atual para main (padrão do GitHub)
git branch -M main

# 2. Vincular o repositório remoto (substitua pelo seu usuário e repositório)
git remote add origin https://github.com/<SEU_USUARIO>/kurio-nft-marketplace.git

# 3. Enviar o código com o histórico de commits
git push -u origin main
```

---

Feito com foco em qualidade de engenharia, acessibilidade e atenção a cada detalhe visual.
