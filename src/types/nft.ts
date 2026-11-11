export type BlockchainNetwork = 'ethereum' | 'polygon' | 'solana'

export type NFTCategory =
  | 'arte-digital'
  | 'fotografia'
  | 'musica'
  | 'arte-3d'
  | 'colecionaveis'
  | 'generativa'
  | 'jogos'
  | 'assinaturas'
  | 'utilidade'

export interface NFTAttribute {
  traitType: string
  value: string
  rarity?: string
}

export interface NFTItem {
  id: string
  tokenId: string
  title: string
  collection: string
  creator: {
    name: string
    avatar: string
    verified: boolean
    royaltyPercentage: number
  }
  description: string
  price: string // ETH decimal string, e.g. "1.19"
  originalPrice?: string
  category: NFTCategory
  network: BlockchainNetwork
  edition: string // e.g. "01/10", "1/50", "ABERTA"
  totalEditions: number
  availableEditions: number
  imageUrl: string
  badge?: string // "RARO", "ED. LIMITADA", "POPULAR"
  contractAddress: string
  standard: 'ERC-721' | 'ERC-1155'
  ipfsHash: string
  isFavorite?: boolean
  favoritesCount: number
  rating: number
  reviewsCount: number
  createdAt: string
  version: number // for optimistic lock / socket updates
}

export interface NFTFilterParams {
  search?: string
  category?: string
  priceMin?: string
  priceMax?: string
  network?: string
  sortBy?: 'recent' | 'price-asc' | 'price-desc' | 'popular'
  page?: number
  limit?: number
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
