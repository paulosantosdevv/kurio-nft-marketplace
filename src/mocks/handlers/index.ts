import { authHandlers } from './auth'
import { nftHandlers } from './nfts'
import { cartHandlers } from './cart'
import { orderHandlers } from './orders'
import { profileHandlers } from './profile'
import { walletHandlers } from './wallets'

export const handlers = [
  ...authHandlers,
  ...nftHandlers,
  ...cartHandlers,
  ...orderHandlers,
  ...profileHandlers,
  ...walletHandlers,
]
