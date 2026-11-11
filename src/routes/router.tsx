import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { MobileBottomNav } from '../components/layout/MobileBottomNav'
import { CartDrawer } from '../components/cart/CartDrawer'
import { ScenarioBar } from '../components/layout/ScenarioBar'
import { HomeView } from '../views/HomeView'
import { NFTDetailView } from '../views/NFTDetailView'
import { CartView } from '../views/CartView'
import { CheckoutView } from '../views/CheckoutView'
import { OrderConfirmationView } from '../views/OrderConfirmationView'
import { LoginView } from '../views/LoginView'
import { RegisterView } from '../views/RegisterView'
import { ProfileView } from '../views/ProfileView'
import { WalletsView } from '../views/WalletsView'

// Root Route
const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen flex flex-col bg-[#140d0a] text-[#f7f4ed] overflow-x-hidden w-full max-w-full">
      <Header />
      <CartDrawer />
      <main className="flex-1 w-full max-w-full overflow-x-hidden pb-16 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
      <ScenarioBar />
    </div>
  ),
  notFoundComponent: () => (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-4xl font-black text-[#f7f4ed] mb-2">404</h1>
      <p className="text-sm text-[#a69a8f] mb-6">Página não encontrada no universo Kurio.</p>
      <a href="/" className="bg-[#d28a4c] text-white px-5 py-2.5 rounded-xl text-xs font-bold">
        Voltar para a Página Inicial
      </a>
    </div>
  ),
})

export interface HomeSearch {
  category?: string
  search?: string
  priceMin?: string
  priceMax?: string
  network?: string
  sortBy?: string
  page?: number
}

// Index Route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  validateSearch: (search: Record<string, unknown>): HomeSearch => ({
    category: (search.category as string) || undefined,
    search: (search.search as string) || undefined,
    priceMin: (search.priceMin as string) || undefined,
    priceMax: (search.priceMax as string) || undefined,
    network: (search.network as string) || undefined,
    sortBy: (search.sortBy as string) || undefined,
    page: search.page ? Number(search.page) : undefined,
  }),
  component: HomeView,
})

// NFT Detail Route
const nftDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/nft/$id',
  component: NFTDetailView,
})

// Dedicated Cart Route
const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/carrinho',
  component: CartView,
})

// Checkout Route
const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pagamento',
  component: CheckoutView,
})

// Order Confirmation Route
const confirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/confirmacao/$orderId',
  component: OrderConfirmationView,
})

export interface AuthSearch {
  redirect?: string
}

// Login Route
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  validateSearch: (search: Record<string, unknown>): AuthSearch => ({
    redirect: (search.redirect as string) || undefined,
  }),
  component: LoginView,
})

// Register Route
const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cadastro',
  validateSearch: (search: Record<string, unknown>): AuthSearch => ({
    redirect: (search.redirect as string) || undefined,
  }),
  component: RegisterView,
})

// Profile Route
const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/perfil',
  component: ProfileView,
})

// Wallets Route
const walletsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/carteiras',
  component: WalletsView,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  nftDetailRoute,
  cartRoute,
  checkoutRoute,
  confirmationRoute,
  loginRoute,
  registerRoute,
  profileRoute,
  walletsRoute,
])

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
