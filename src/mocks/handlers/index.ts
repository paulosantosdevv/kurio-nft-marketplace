import { http, HttpResponse } from 'msw'
import { authHandlers } from './auth'
import { nftHandlers } from './nfts'
import { cartHandlers } from './cart'
import { orderHandlers } from './orders'
import { profileHandlers } from './profile'
import { walletHandlers } from './wallets'
import { mockStore } from '../db/mockStore'
import { scenarioManager } from '../scenarios'

export const handlers = [
  http.post('/api/reset', () => {
    mockStore.reset()
    scenarioManager.reset()
    return HttpResponse.json({ ok: true })
  }),
  ...authHandlers,
  ...nftHandlers,
  ...cartHandlers,
  ...orderHandlers,
  ...profileHandlers,
  ...walletHandlers,
]
