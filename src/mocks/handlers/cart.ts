import { http, HttpResponse, delay } from 'msw'
import { mockStore } from '../db/mockStore'
import { scenarioManager } from '../scenarios'
import { CartItem, QuoteResponse } from '../../types/cart'

function getSessionCartKey(request: Request): string {
  const auth = request.headers.get('Authorization')
  if (auth && auth.startsWith('Bearer ')) {
    const token = auth.replace('Bearer ', '')
    const userId = token.split('_')[1]
    if (userId) return userId
  }
  return 'guest'
}

export const cartHandlers = [
  // Get Cart
  http.get('/api/cart', async ({ request }) => {
    await delay(150)
    const key = getSessionCartKey(request)
    const items = mockStore.getCart(key)
    return HttpResponse.json(items)
  }),

  // Add Item to Cart
  http.post('/api/cart', async ({ request }) => {
    await delay(150)
    const key = getSessionCartKey(request)
    const body = (await request.json()) as any
    const { nftId, quantity = 1, edition } = body

    const nft = mockStore.getNFTById(nftId)
    if (!nft) {
      return HttpResponse.json({ message: 'NFT não encontrado.' }, { status: 404 })
    }

    if (nft.availableEditions <= 0) {
      return HttpResponse.json({ message: 'Edição esgotada.' }, { status: 400 })
    }

    const currentCart = mockStore.getCart(key)
    const existingIndex = currentCart.findIndex((i) => i.nftId === nftId)

    if (existingIndex !== -1) {
      const newQty = currentCart[existingIndex].quantity + quantity
      if (newQty > nft.availableEditions) {
        return HttpResponse.json(
          { message: `Limite máximo atingido. Apenas ${nft.availableEditions} edições disponíveis.` },
          { status: 400 }
        )
      }
      currentCart[existingIndex].quantity = newQty
    } else {
      const newItem: CartItem = {
        id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        nftId,
        nft,
        quantity,
        edition: edition || nft.edition,
        unitPrice: nft.price,
      }
      currentCart.push(newItem)
    }

    mockStore.setCart(key, currentCart)
    return HttpResponse.json(currentCart)
  }),

  // Update Cart Item Quantity
  http.patch('/api/cart/:id', async ({ params, request }) => {
    await delay(100)
    const key = getSessionCartKey(request)
    const { id } = params
    const body = (await request.json()) as any
    const { quantity } = body

    const currentCart = mockStore.getCart(key)
    const item = currentCart.find((i) => i.id === id)

    if (!item) {
      return HttpResponse.json({ message: 'Item não encontrado no carrinho.' }, { status: 404 })
    }

    const nft = mockStore.getNFTById(item.nftId)
    if (nft && quantity > nft.availableEditions) {
      return HttpResponse.json(
        { message: `Apenas ${nft.availableEditions} disponíveis no momento.` },
        { status: 400 }
      )
    }

    if (quantity <= 0) {
      const filtered = currentCart.filter((i) => i.id !== id)
      mockStore.setCart(key, filtered)
      return HttpResponse.json(filtered)
    }

    item.quantity = quantity
    mockStore.setCart(key, currentCart)
    return HttpResponse.json(currentCart)
  }),

  // Remove Cart Item
  http.delete('/api/cart/:id', async ({ params, request }) => {
    await delay(100)
    const key = getSessionCartKey(request)
    const { id } = params

    const currentCart = mockStore.getCart(key)
    const filtered = currentCart.filter((i) => i.id !== id)
    mockStore.setCart(key, filtered)
    return HttpResponse.json(filtered)
  }),

  // Quote / Checkout revalidation
  http.post('/api/checkout/quote', async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as any
    const { items, couponCode, network = 'ethereum' } = body

    let subtotalNum = 0
    const priceChanges: Array<{ nftId: string; title: string; oldPrice: string; newPrice: string }> = []
    const outOfStock: Array<{ nftId: string; title: string; requested: number; available: number }> = []

    const currentScenario = scenarioManager.getScenario()

    for (const item of items) {
      const nft = mockStore.getNFTById(item.nftId)
      if (!nft) continue

      let currentPrice = parseFloat(nft.price)

      // Test scenario: Price surge during checkout
      if (currentScenario === 'price_surge') {
        const higherPrice = (currentPrice + 0.5).toFixed(2)
        priceChanges.push({
          nftId: nft.id,
          title: nft.title,
          oldPrice: nft.price,
          newPrice: higherPrice,
        })
        currentPrice = parseFloat(higherPrice)
      }

      // Test scenario: Stock out during checkout
      if (currentScenario === 'stock_out') {
        outOfStock.push({
          nftId: nft.id,
          title: nft.title,
          requested: item.quantity,
          available: 0,
        })
      } else if (item.quantity > nft.availableEditions) {
        outOfStock.push({
          nftId: nft.id,
          title: nft.title,
          requested: item.quantity,
          available: nft.availableEditions,
        })
      }

      subtotalNum += currentPrice * item.quantity
    }

    // Network fee based on blockchain
    let networkFeeNum = 0.0045 // Ethereum
    if (network === 'polygon') networkFeeNum = 0.0008
    if (network === 'solana') networkFeeNum = 0.0004

    // Coupon calculation
    let discountNum = 0
    let couponApplied = undefined

    if (couponCode) {
      const coupon = mockStore.getCoupon(couponCode)
      if (!coupon) {
        return HttpResponse.json({ message: 'Código promocional inválido ou inexistente.' }, { status: 400 })
      }
      if (!coupon.active || new Date(coupon.expiresAt).getTime() < Date.now()) {
        return HttpResponse.json({ message: 'Este código promocional está expirado.' }, { status: 400 })
      }
      discountNum = (subtotalNum * coupon.discountPercentage) / 100
      couponApplied = {
        code: coupon.code,
        discountPercentage: coupon.discountPercentage,
        discountAmount: discountNum.toFixed(4),
      }
    }

    const totalNum = Math.max(0, subtotalNum - discountNum + networkFeeNum)

    const response: QuoteResponse = {
      subtotal: subtotalNum.toFixed(4),
      discount: discountNum.toFixed(4),
      networkFee: networkFeeNum.toFixed(4),
      total: totalNum.toFixed(4),
      couponApplied,
      priceChanges,
      outOfStock,
      validUntil: new Date(Date.now() + 60000).toISOString(),
    }

    return HttpResponse.json(response)
  }),
]
