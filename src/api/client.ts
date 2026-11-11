import axios, { AxiosError } from 'axios'
import { NFTFilterParams, NFTItem, PaginatedResult } from '../types/nft'
import { CartItem, QuoteRequest, QuoteResponse } from '../types/cart'
import { AuthResponse, UserProfile } from '../types/auth'
import { Order } from '../types/order'
import { Wallet } from '../types/wallet'

export const apiClient = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor: Attach Auth Token
apiClient.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('kurio_auth_token') : null
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response Interceptor: Handle Global 401
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('kurio:auth:unauthorized'))
      }
    }
    return Promise.reject(error)
  }
)

// Typed API modules
export const authApi = {
  login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/api/auth/login', credentials)
    return data
  },
  register: async (payload: { username: string; email: string; password: string }): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/api/auth/register', payload)
    return data
  },
  getSession: async (): Promise<{ user: UserProfile | null }> => {
    const { data } = await apiClient.get('/api/auth/session')
    return data
  },
  logout: async (): Promise<void> => {
    await apiClient.post('/api/auth/logout')
  },
}

export const nftsApi = {
  getNFTs: async (params?: NFTFilterParams): Promise<PaginatedResult<NFTItem>> => {
    const { data } = await apiClient.get('/api/nfts', { params })
    return data
  },
  getNFTById: async (id: string): Promise<NFTItem> => {
    const { data } = await apiClient.get(`/api/nfts/${id}`)
    return data
  },
  getFavorites: async (): Promise<string[]> => {
    const { data } = await apiClient.get('/api/favorites')
    return data
  },
  toggleFavorite: async (id: string): Promise<{ nftId: string; isFavorite: boolean; favoritesCount: number }> => {
    const { data } = await apiClient.post(`/api/favorites/${id}`)
    return data
  },
}

export const cartApi = {
  getCart: async (): Promise<CartItem[]> => {
    const { data } = await apiClient.get('/api/cart')
    return data
  },
  addToCart: async (payload: { nftId: string; quantity?: number; edition?: string }): Promise<CartItem[]> => {
    const { data } = await apiClient.post('/api/cart', payload)
    return data
  },
  updateQuantity: async (id: string, quantity: number): Promise<CartItem[]> => {
    const { data } = await apiClient.patch(`/api/cart/${id}`, { quantity })
    return data
  },
  removeItem: async (id: string): Promise<CartItem[]> => {
    const { data } = await apiClient.delete(`/api/cart/${id}`)
    return data
  },
  getQuote: async (payload: QuoteRequest): Promise<QuoteResponse> => {
    const { data } = await apiClient.post('/api/checkout/quote', payload)
    return data
  },
}

export const ordersApi = {
  createOrder: async (payload: {
    items: Array<{ nftId: string; quantity: number }>
    walletAddress: string
    walletType: string
    network: string
    couponCode?: string
    idempotencyKey: string
  }): Promise<Order> => {
    const { data } = await apiClient.post('/api/orders', payload, {
      headers: {
        'Idempotency-Key': payload.idempotencyKey,
      },
    })
    return data
  },
  getOrder: async (id: string): Promise<Order> => {
    const { data } = await apiClient.get(`/api/orders/${id}`)
    return data
  },
}

export const profileApi = {
  getProfile: async (): Promise<UserProfile> => {
    const { data } = await apiClient.get('/api/profile')
    return data
  },
  updateProfile: async (payload: Partial<UserProfile>): Promise<UserProfile> => {
    const { data } = await apiClient.patch('/api/profile', payload)
    return data
  },
  changePassword: async (payload: { currentPassword: string; newPassword: string }): Promise<{ success: boolean }> => {
    const { data } = await apiClient.post('/api/profile/password', payload)
    return data
  },
}

export const walletsApi = {
  getWallets: async (): Promise<Wallet[]> => {
    const { data } = await apiClient.get('/api/wallets')
    return data
  },
  addWallet: async (payload: Omit<Wallet, 'id'>): Promise<Wallet> => {
    const { data } = await apiClient.post('/api/wallets', payload)
    return data
  },
  updateWallet: async (id: string, payload: Partial<Wallet>): Promise<Wallet> => {
    const { data } = await apiClient.patch(`/api/wallets/${id}`, payload)
    return data
  },
  deleteWallet: async (id: string): Promise<{ success: boolean }> => {
    const { data } = await apiClient.delete(`/api/wallets/${id}`)
    return data
  },
}
