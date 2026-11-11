import { mockStore } from '../mocks/db/mockStore'

export interface NFTUpdatedEvent {
  nftId: string
  newPrice: string
  availableEditions: number
  version: number
  timestamp: string
}

export interface OrderUpdatedEvent {
  orderId: string
  status: 'pending' | 'confirmed' | 'rejected'
  transactionHash?: string
  version: number
  timestamp: string
}

type EventCallback<T = any> = (data: T) => void

/**
 * Socket client managing real-time subscriptions, deduplication,
 * and version guard rails against stale updates.
 */
class SocketService {
  private listeners: Map<string, Set<EventCallback>> = new Map()
  private nftVersions: Map<string, number> = new Map()
  public connected: boolean = true

  constructor() {
    // Listen to simulated custom events on window for seamless integration in dev & browser
    if (typeof window !== 'undefined') {
      window.addEventListener('kurio:socket:nft.updated', ((e: CustomEvent<NFTUpdatedEvent>) => {
        this.handleNFTUpdated(e.detail)
      }) as EventListener)

      window.addEventListener('kurio:socket:order.updated', ((e: CustomEvent<OrderUpdatedEvent>) => {
        this.handleOrderUpdated(e.detail)
      }) as EventListener)
    }
  }

  public on<T = any>(event: string, callback: EventCallback<T>) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(callback as EventCallback)
  }

  public off<T = any>(event: string, callback: EventCallback<T>) {
    const set = this.listeners.get(event)
    if (set) {
      set.delete(callback as EventCallback)
    }
  }

  public emit(event: string, data: any) {
    if (!this.connected) return

    // If simulating from browser
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(`kurio:socket:${event}`, { detail: data }))
    }
  }

  private handleNFTUpdated(data: NFTUpdatedEvent) {
    if (!this.connected) return

    // Replay / Stale event guard: discard if received version is <= last known version
    const lastVersion = this.nftVersions.get(data.nftId) || 0
    if (data.version <= lastVersion) {
      console.warn(`[Socket] Ignored stale/duplicate event for NFT ${data.nftId} (v${data.version} <= v${lastVersion})`)
      return
    }

    this.nftVersions.set(data.nftId, data.version)

    // Notify listeners
    const callbacks = this.listeners.get('nft.updated')
    if (callbacks) {
      callbacks.forEach((cb) => cb(data))
    }
  }

  private handleOrderUpdated(data: OrderUpdatedEvent) {
    if (!this.connected) return

    const callbacks = this.listeners.get('order.updated')
    if (callbacks) {
      callbacks.forEach((cb) => cb(data))
    }
  }

  public simulateNFTPriceChange(nftId: string, newPrice: string, newAvailable?: number) {
    const nft = mockStore.getNFTById(nftId)
    const newVersion = (nft?.version || 1) + 1
    const editions = newAvailable !== undefined ? newAvailable : nft?.availableEditions || 1

    // Update in mock store
    mockStore.updateNFT(nftId, {
      price: newPrice,
      availableEditions: editions,
    })

    const event: NFTUpdatedEvent = {
      nftId,
      newPrice,
      availableEditions: editions,
      version: newVersion,
      timestamp: new Date().toISOString(),
    }

    this.emit('nft.updated', event)
  }

  public simulateOrderUpdate(orderId: string, status: 'confirmed' | 'rejected') {
    const order = mockStore.getOrder(orderId)
    if (order) {
      order.status = status
      mockStore.saveOrder(order)
    }

    const event: OrderUpdatedEvent = {
      orderId,
      status,
      version: (order?.version || 1) + 1,
      timestamp: new Date().toISOString(),
    }

    this.emit('order.updated', event)
  }

  public disconnect() {
    this.connected = false
  }

  public reconnect() {
    this.connected = true
  }
}

export const socketService = new SocketService()
