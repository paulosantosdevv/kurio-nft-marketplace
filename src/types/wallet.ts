import { BlockchainNetwork } from './nft'

export interface Wallet {
  id: string
  name: string
  address: string
  network: BlockchainNetwork
  type: 'MetaMask' | 'Coinbase' | 'WalletConnect'
  isPrimary: boolean
  nickname?: string
  ensName?: string
}
