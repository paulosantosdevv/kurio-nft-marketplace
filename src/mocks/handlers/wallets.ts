import { http, HttpResponse, delay } from 'msw'
import { mockStore } from '../db/mockStore'
import { Wallet } from '../../types/wallet'

function getUserId(request: Request): string | null {
  const auth = request.headers.get('Authorization')
  if (auth && auth.startsWith('Bearer ')) {
    return auth.replace('Bearer ', '').split('_')[1] || null
  }
  return null
}

export const walletHandlers = [
  http.get('/api/wallets', async ({ request }) => {
    await delay(100)
    const userId = getUserId(request)
    if (!userId) {
      return HttpResponse.json({ message: 'Não autorizado.' }, { status: 401 })
    }

    const wallets = mockStore.getWallets(userId)
    return HttpResponse.json(wallets)
  }),

  http.post('/api/wallets', async ({ request }) => {
    await delay(150)
    const userId = getUserId(request)
    if (!userId) {
      return HttpResponse.json({ message: 'Não autorizado.' }, { status: 401 })
    }

    const body = (await request.json()) as any
    const { name, address, network, type, isPrimary, nickname, ensName } = body

    if (!name || !address || !network || !type) {
      return HttpResponse.json({ message: 'Campos obrigatórios não preenchidos.' }, { status: 400 })
    }

    const newWallet: Wallet = {
      id: `wlt_${Date.now()}`,
      name,
      address,
      network,
      type,
      isPrimary: !!isPrimary,
      nickname,
      ensName,
    }

    const saved = mockStore.addWallet(userId, newWallet)
    return HttpResponse.json(saved, { status: 201 })
  }),

  http.patch('/api/wallets/:id', async ({ params, request }) => {
    await delay(100)
    const userId = getUserId(request)
    if (!userId) {
      return HttpResponse.json({ message: 'Não autorizado.' }, { status: 401 })
    }

    const { id } = params
    const body = (await request.json()) as any
    const updated = mockStore.updateWallet(userId, id as string, body)

    if (!updated) {
      return HttpResponse.json({ message: 'Carteira não localizada.' }, { status: 404 })
    }

    return HttpResponse.json(updated)
  }),

  http.delete('/api/wallets/:id', async ({ params, request }) => {
    await delay(100)
    const userId = getUserId(request)
    if (!userId) {
      return HttpResponse.json({ message: 'Não autorizado.' }, { status: 401 })
    }

    const { id } = params
    mockStore.deleteWallet(userId, id as string)
    return HttpResponse.json({ success: true })
  }),
]
