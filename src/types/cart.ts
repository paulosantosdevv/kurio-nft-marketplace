import { NFTItem } from './nft'

export interface CartItem {
  id: string // cart item id
  nftId: string
  nft: NFTItem
  quantity: number
  edition: string
  unitPrice: string // ETH decimal string
}

export interface QuoteRequest {
  items: Array<{ nftId: string; quantity: number }>
  couponCode?: string
  network: string
}

export interface QuoteResponse {
  subtotal: string
  discount: string
  networkFee: string
  total: string
  couponApplied?: {
    code: string
    discountPercentage: number
    discountAmount: string
  }
  priceChanges: Array<{
    nftId: string
    title: string
    oldPrice: string
    newPrice: string
  }>
  outOfStock: Array<{
    nftId: string
    title: string
    requested: number
    available: number
  }>
  validUntil: string
}
