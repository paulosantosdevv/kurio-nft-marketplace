import { http, HttpResponse, delay } from 'msw'
import { mockStore } from '../db/mockStore'
import { scenarioManager } from '../scenarios'
import { Order, OrderItemSnapshot, OrderStatus } from '../../types/order'

export const orderHandlers = [
  // Create Order (Idempotent)
  http.post('/api/orders', async ({ request }) => {
    const idempotencyKey = request.headers.get('Idempotency-Key')
    if (!idempotencyKey) {
      return HttpResponse.json({ message: 'Idempotency-Key é obrigatório no cabeçalho.' }, { status: 400 })
    }

    const currentScenario = scenarioManager.getScenario()

    // Test scenario: Timeout simulation
    if (currentScenario === 'payment_timeout') {
      await delay(4000)
    } else {
      await delay(scenarioManager.getDelay())
    }

    const body = (await request.json()) as any
    const { items, walletAddress, walletType, network, couponCode } = body

    // Check if an order with this idempotency key already exists
    const existingOrder = mockStore.findOrderByKey(idempotencyKey)
    if (existingOrder) {
      // Compare payloads to verify it's a true retry vs key reuse conflict
      if (
        existingOrder.walletAddress === walletAddress &&
        existingOrder.network === network &&
        existingOrder.items.length === items.length
      ) {
        // Return existing order snapshot
        return HttpResponse.json(existingOrder, { status: 200 })
      } else {
        return HttpResponse.json(
          { message: 'Chave de idempotência já utilizada para uma transação com dados divergentes.' },
          { status: 409 }
        )
      }
    }

    // Build order item snapshots
    let subtotalNum = 0
    const snapshots: OrderItemSnapshot[] = []

    for (const item of items) {
      const nft = mockStore.getNFTById(item.nftId)
      if (!nft) continue

      const itemUnitPrice = parseFloat(nft.price)
      const itemSubtotal = itemUnitPrice * item.quantity
      subtotalNum += itemSubtotal

      snapshots.push({
        nftId: nft.id,
        tokenId: nft.tokenId,
        title: nft.title,
        imageUrl: nft.imageUrl,
        edition: nft.edition,
        quantity: item.quantity,
        unitPrice: nft.price,
        subtotal: itemSubtotal.toFixed(4),
      })
    }

    // Discounts & Fees
    let discountNum = 0
    if (couponCode) {
      const coupon = mockStore.getCoupon(couponCode)
      if (coupon && coupon.active) {
        discountNum = (subtotalNum * coupon.discountPercentage) / 100
      }
    }

    let networkFeeNum = network === 'polygon' ? 0.0008 : network === 'solana' ? 0.0004 : 0.0045
    const totalNum = Math.max(0, subtotalNum - discountNum + networkFeeNum)

    // Determine status based on scenario
    let status: OrderStatus = 'confirmed'
    if (currentScenario === 'payment_rejected') {
      status = 'rejected'
    }

    const orderId = `ord_${Date.now()}`
    const txHash = `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`

    const newOrder: Order = {
      id: orderId,
      transactionHash: txHash,
      createdAt: new Date().toISOString(),
      status,
      network,
      walletAddress,
      walletType: walletType || 'MetaMask',
      items: snapshots,
      subtotal: subtotalNum.toFixed(4),
      discount: discountNum.toFixed(4),
      networkFee: networkFeeNum.toFixed(4),
      total: totalNum.toFixed(4),
      couponCode,
      idempotencyKey,
      version: 1,
    }

    mockStore.saveOrder(newOrder)

    // If confirmed, decrement NFT inventory and clear user's cart
    if (status === 'confirmed') {
      for (const item of items) {
        const nft = mockStore.getNFTById(item.nftId)
        if (nft) {
          mockStore.updateNFT(nft.id, {
            availableEditions: Math.max(0, nft.availableEditions - item.quantity),
          })
        }
      }

      const auth = request.headers.get('Authorization')
      if (auth && auth.startsWith('Bearer ')) {
        const token = auth.replace('Bearer ', '')
        const userId = token.split('_')[1]
        if (userId) {
          mockStore.setCart(userId, [])
        }
      }
    }

    return HttpResponse.json(newOrder, { status: 201 })
  }),

  // Get Order By ID
  http.get('/api/orders/:id', async ({ params }) => {
    await delay(100)
    const { id } = params
    const order = mockStore.getOrder(id as string)

    if (!order) {
      return HttpResponse.json({ message: 'Pedido não localizado.' }, { status: 404 })
    }

    return HttpResponse.json(order)
  }),
]
