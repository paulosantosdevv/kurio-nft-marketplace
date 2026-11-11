import { BlockchainNetwork } from './nft'

export type OrderStatus = 'pending' | 'confirmed' | 'rejected'

export interface OrderItemSnapshot {
  nftId: string
  tokenId: string
  title: string
  imageUrl: string
  edition: string
  quantity: number
  unitPrice: string
  subtotal: string
}

export interface Order {
  id: string
  transactionHash: string
  createdAt: string
  status: OrderStatus
  network: BlockchainNetwork
  walletAddress: string
  walletType: string
  items: OrderItemSnapshot[]
  subtotal: string
  discount: string
  networkFee: string
  total: string
  couponCode?: string
  idempotencyKey: string
  version: number
}
