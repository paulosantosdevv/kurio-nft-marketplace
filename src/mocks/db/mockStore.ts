import { NFTItem } from '../../types/nft'
import { CartItem } from '../../types/cart'
import { UserProfile } from '../../types/auth'
import { Order } from '../../types/order'
import { Wallet } from '../../types/wallet'

const STORAGE_KEY = 'kurio_mock_db_v3'

export interface MockDatabase {
  users: Array<UserProfile & { passwordHash: string }>
  nfts: NFTItem[]
  favorites: Record<string, string[]> // userId -> nftId[]
  carts: Record<string, CartItem[]> // userId or "guest" -> CartItem[]
  wallets: Record<string, Wallet[]> // userId -> Wallet[]
  orders: Order[]
  coupons: Array<{
    code: string
    discountPercentage: number
    active: boolean
    expiresAt: string
  }>
}

const DEFAULT_USERS: Array<UserProfile & { passwordHash: string }> = [
  {
    id: 'usr_collector_1',
    username: 'novasato',
    email: 'contato@email.com',
    displayName: 'Nova Sato',
    nickname: 'novacrypto',
    avatarUrl: '/assets/avatars/default-avatar.png',
    ensName: 'novasato.eth',
    bio: 'Colecionador de arte generativa e entusiasta do protocolo Ethereum.',
    createdAt: '2024-01-15T10:00:00Z',
    passwordHash: 'password123',
  },
  {
    id: 'usr_collector_2',
    username: 'alex_art',
    email: 'alex@email.com',
    displayName: 'Alex Rivers',
    nickname: 'arivers',
    avatarUrl: '/assets/avatars/default-avatar.png',
    ensName: 'arivers.eth',
    bio: 'Curador e colecionador Web3.',
    createdAt: '2024-02-01T14:30:00Z',
    passwordHash: 'password123',
  },
]

const DEFAULT_NFTS: NFTItem[] = [
  {
    id: 'nft-1',
    tokenId: '#9042',
    title: 'Emerald Ape #842',
    collection: 'Kurio Editions',
    creator: {
      name: 'Nova Sato',
      avatar: '/assets/avatars/default-avatar.png',
      verified: true,
      royaltyPercentage: 5,
    },
    description:
      'Emerald Ape #842 é uma obra digital finalizada à mão da coleção Kurio Editions. Cada atributo fica armazenado nos metadados do token e verificado na Ethereum.',
    price: '1.19',
    category: 'arte-digital',
    network: 'ethereum',
    edition: '1/50',
    totalEditions: 50,
    availableEditions: 19,
    imageUrl: '/assets/nfts/card_1_emerald_ape.png',
    contractAddress: '0x7A4289B842F81203A293E918239019E8',
    standard: 'ERC-721',
    ipfsHash: 'ipfs://QmZ8F91B...42EmeraldApe',
    isFavorite: false,
    favoritesCount: 142,
    rating: 4.9,
    reviewsCount: 19,
    createdAt: '2024-05-20T12:00:00Z',
    version: 1,
  },
  {
    id: 'nft-2',
    tokenId: '#0589',
    title: 'Sage Nomad #589',
    collection: 'Kurio Editions',
    creator: {
      name: 'Kaelen Thorne',
      avatar: '/assets/avatars/default-avatar.png',
      verified: true,
      royaltyPercentage: 7.5,
    },
    description:
      'A variante eremita da série Nomad, envolta em tecidos inteligentes e camuflagem biocromática.',
    price: '1.69',
    category: 'arte-digital',
    network: 'ethereum',
    edition: '1/30',
    totalEditions: 30,
    availableEditions: 7,
    imageUrl: '/assets/nfts/card_2_sage_nomad.png',
    contractAddress: '0x589A8192837190283A918239019E80589',
    standard: 'ERC-721',
    ipfsHash: 'ipfs://QmS589...Nomad',
    isFavorite: false,
    favoritesCount: 174,
    rating: 4.9,
    reviewsCount: 22,
    createdAt: '2024-05-19T16:45:00Z',
    version: 1,
  },
  {
    id: 'nft-3',
    tokenId: '#0552',
    title: 'Neon Vessel #552',
    collection: 'Kurio Editions',
    creator: {
      name: 'Vector Studio',
      avatar: '/assets/avatars/default-avatar.png',
      verified: true,
      royaltyPercentage: 5,
    },
    description:
      'Estrutura naval futurista equipada com reatores de plasma neon e malha geométrica de baixa densidade.',
    price: '1.99',
    originalPrice: '2.29',
    category: 'jogos',
    network: 'ethereum',
    edition: '1/20',
    totalEditions: 20,
    availableEditions: 5,
    imageUrl: '/assets/nfts/card_3_neon_vessel.png',
    contractAddress: '0x552F8192837190283A918239019E80552',
    standard: 'ERC-721',
    ipfsHash: 'ipfs://QmV552...Vessel',
    isFavorite: false,
    favoritesCount: 205,
    rating: 4.8,
    reviewsCount: 31,
    createdAt: '2024-05-18T20:30:00Z',
    version: 1,
  },
  {
    id: 'nft-4',
    tokenId: '#0118',
    title: 'Cosmic Bloom #118',
    collection: 'Kurio Editions',
    creator: {
      name: 'Elena Rostova',
      avatar: '/assets/avatars/default-avatar.png',
      verified: true,
      royaltyPercentage: 5,
    },
    description:
      'Uma representação botânica fractal com geração geométrica procedural baseada em ondas sonoras.',
    price: '1.29',
    category: 'generativa',
    network: 'ethereum',
    edition: '01/10',
    totalEditions: 10,
    availableEditions: 4,
    imageUrl: '/assets/nfts/card_4_cosmic_bloom.png',
    contractAddress: '0x3D1182A1B8C92130F92837190283A118',
    standard: 'ERC-721',
    ipfsHash: 'ipfs://QmC118...Bloom',
    isFavorite: false,
    favoritesCount: 89,
    rating: 4.8,
    reviewsCount: 12,
    createdAt: '2024-05-17T09:00:00Z',
    version: 1,
  },
  {
    id: 'nft-5',
    tokenId: '#0314',
    title: 'Violet Nomad #314',
    collection: 'Kurio Editions',
    creator: {
      name: 'Kaelen Thorne',
      avatar: '/assets/avatars/default-avatar.png',
      verified: true,
      royaltyPercentage: 7.5,
    },
    description:
      'Retrato cibernético explorando a solidão no espaço profundo com iluminação volumétrica violeta.',
    price: '1.39',
    category: 'arte-3d',
    network: 'ethereum',
    edition: '1/25',
    totalEditions: 25,
    availableEditions: 8,
    imageUrl: '/assets/nfts/card_5_violet_nomad.png',
    contractAddress: '0x8B3141F90238C198273901A832B10314',
    standard: 'ERC-721',
    ipfsHash: 'ipfs://QmV314...Nomad',
    isFavorite: false,
    favoritesCount: 230,
    rating: 5.0,
    reviewsCount: 34,
    createdAt: '2024-05-16T15:20:00Z',
    version: 1,
  },
  {
    id: 'nft-6',
    tokenId: '#0888',
    title: 'Ivory Baron #888',
    collection: 'Kurio Editions',
    creator: {
      name: 'Marcus Vance',
      avatar: '/assets/avatars/default-avatar.png',
      verified: true,
      royaltyPercentage: 5,
    },
    description:
      'Figura aristocrática pós-humana esculpida em marfim sintético e detalhes em ouro escovado.',
    price: '1.79',
    category: 'arte-digital',
    network: 'ethereum',
    edition: '1/15',
    totalEditions: 15,
    availableEditions: 2,
    imageUrl: '/assets/nfts/card_6_ivory_baron.png',
    contractAddress: '0x9E888127391BCA829371029381A00888',
    standard: 'ERC-721',
    ipfsHash: 'ipfs://QmI888...Baron',
    isFavorite: false,
    favoritesCount: 312,
    rating: 4.9,
    reviewsCount: 45,
    createdAt: '2024-05-15T18:00:00Z',
    version: 1,
  },
  {
    id: 'nft-7',
    tokenId: '#0287',
    title: 'Golden Beat #287',
    collection: 'Kurio Editions',
    creator: {
      name: 'Synthetix Sound',
      avatar: '/assets/avatars/default-avatar.png',
      verified: true,
      royaltyPercentage: 10,
    },
    description:
      'Áudio imersivo reativo a BPM com visualizador tridimensional áureo gerado em WebGL.',
    price: '0.99',
    category: 'musica',
    network: 'polygon',
    edition: 'ABERTA',
    totalEditions: 100,
    availableEditions: 63,
    imageUrl: '/assets/nfts/card_7_golden_beat_1.png',
    contractAddress: '0x287B9C18273910A92837190283A10287',
    standard: 'ERC-1155',
    ipfsHash: 'ipfs://QmG287...Beat',
    isFavorite: false,
    favoritesCount: 95,
    rating: 4.7,
    reviewsCount: 16,
    createdAt: '2024-05-14T11:00:00Z',
    version: 1,
  },
  {
    id: 'nft-8',
    tokenId: '#0288',
    title: 'Golden Beat #287',
    collection: 'Kurio Editions',
    creator: {
      name: 'Synthetix Sound',
      avatar: '/assets/avatars/default-avatar.png',
      verified: true,
      royaltyPercentage: 10,
    },
    description:
      'Segunda tiragem de áudio imersivo áureo gerado proceduralmente com sintetizadores modulares.',
    price: '0.99',
    category: 'musica',
    network: 'polygon',
    edition: 'ABERTA',
    totalEditions: 100,
    availableEditions: 51,
    imageUrl: '/assets/nfts/card_8_golden_beat_2.png',
    contractAddress: '0x288B9C18273910A92837190283A10288',
    standard: 'ERC-1155',
    ipfsHash: 'ipfs://QmG288...Beat',
    isFavorite: false,
    favoritesCount: 88,
    rating: 4.7,
    reviewsCount: 11,
    createdAt: '2024-05-13T13:00:00Z',
    version: 1,
  },
  {
    id: 'nft-9',
    tokenId: '#0160',
    title: 'Golden Signal #160',
    collection: 'Kurio Editions',
    creator: {
      name: 'Mira Chen',
      avatar: '/assets/avatars/default-avatar.png',
      verified: true,
      royaltyPercentage: 5,
    },
    description:
      'Transmissão de rádio convertida em espectrograma e renderizada como escultura de luz dourada.',
    price: '0.39',
    category: 'fotografia',
    network: 'solana',
    edition: '1/100',
    totalEditions: 100,
    availableEditions: 42,
    imageUrl: '/assets/nfts/card_9_golden_signal.png',
    contractAddress: '0x160C8192837190283A918239019E80160',
    standard: 'ERC-721',
    ipfsHash: 'ipfs://QmS160...Signal',
    isFavorite: false,
    favoritesCount: 68,
    rating: 4.6,
    reviewsCount: 9,
    createdAt: '2024-05-12T14:10:00Z',
    version: 1,
  },
]

const DEFAULT_WALLETS: Record<string, Wallet[]> = {
  usr_collector_1: [
    {
      id: 'wlt_1',
      name: 'MetaMask Principal',
      address: '0x7A42b89f81203a293e918239019e8b1031409042',
      network: 'ethereum',
      type: 'MetaMask',
      isPrimary: true,
      nickname: 'Main Vault',
      ensName: 'novasato.eth',
    },
    {
      id: 'wlt_2',
      name: 'Coinbase Hot Wallet',
      address: '0x3D1182A1B8C92130F92837190283A11894019E82',
      network: 'polygon',
      type: 'Coinbase',
      isPrimary: false,
      nickname: 'Trading Bag',
    },
  ],
}

const DEFAULT_COUPONS = [
  {
    code: 'KURIO10',
    discountPercentage: 10,
    active: true,
    expiresAt: '2027-12-31T23:59:59Z',
  },
  {
    code: 'LAUNCH20',
    discountPercentage: 20,
    active: true,
    expiresAt: '2027-12-31T23:59:59Z',
  },
  {
    code: 'EXPIRED50',
    discountPercentage: 50,
    active: false,
    expiresAt: '2024-01-01T00:00:00Z',
  },
]

class MockStore {
  private db: MockDatabase

  constructor() {
    this.db = this.load()
  }

  private load(): MockDatabase {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (e) {
      console.warn('Failed to read mock db from localStorage', e)
    }
    return this.createDefault()
  }

  private persist() {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.db))
      }
    } catch (e) {
      console.warn('Failed to persist mock db to localStorage', e)
    }
  }

  public createDefault(): MockDatabase {
    const db: MockDatabase = {
      users: JSON.parse(JSON.stringify(DEFAULT_USERS)),
      nfts: JSON.parse(JSON.stringify(DEFAULT_NFTS)),
      favorites: {
        usr_collector_1: ['nft-1', 'nft-3'],
      },
      carts: {
        guest: [],
        usr_collector_1: [],
      },
      wallets: JSON.parse(JSON.stringify(DEFAULT_WALLETS)),
      orders: [],
      coupons: JSON.parse(JSON.stringify(DEFAULT_COUPONS)),
    }
    this.db = db
    this.persist()
    return db
  }

  public reset() {
    return this.createDefault()
  }

  public getDatabase(): MockDatabase {
    return this.db
  }

  public findUserByEmail(email: string) {
    return this.db.users.find((u) => u.email.toLowerCase() === email.toLowerCase())
  }

  public findUserById(id: string) {
    return this.db.users.find((u) => u.id === id)
  }

  public createUser(user: UserProfile & { passwordHash: string }) {
    this.db.users.push(user)
    this.db.wallets[user.id] = []
    this.db.favorites[user.id] = []
    this.db.carts[user.id] = []
    this.persist()
    return user
  }

  public updateUser(id: string, updates: Partial<UserProfile>) {
    const idx = this.db.users.findIndex((u) => u.id === id)
    if (idx !== -1) {
      this.db.users[idx] = { ...this.db.users[idx], ...updates }
      this.persist()
      return this.db.users[idx]
    }
    return null
  }

  public getNFTs() {
    return this.db.nfts
  }

  public getNFTById(id: string) {
    return this.db.nfts.find((n) => n.id === id || n.tokenId === id)
  }

  public updateNFT(id: string, updates: Partial<NFTItem>) {
    const idx = this.db.nfts.findIndex((n) => n.id === id)
    if (idx !== -1) {
      this.db.nfts[idx] = {
        ...this.db.nfts[idx],
        ...updates,
        version: (this.db.nfts[idx].version || 1) + 1,
      }
      this.persist()
      return this.db.nfts[idx]
    }
    return null
  }

  public getFavorites(userId: string): string[] {
    return this.db.favorites[userId] || []
  }

  public toggleFavorite(userId: string, nftId: string): boolean {
    if (!this.db.favorites[userId]) {
      this.db.favorites[userId] = []
    }
    const idx = this.db.favorites[userId].indexOf(nftId)
    let isFav = false
    if (idx >= 0) {
      this.db.favorites[userId].splice(idx, 1)
      const nft = this.getNFTById(nftId)
      if (nft) nft.favoritesCount = Math.max(0, nft.favoritesCount - 1)
      isFav = false
    } else {
      this.db.favorites[userId].push(nftId)
      const nft = this.getNFTById(nftId)
      if (nft) nft.favoritesCount += 1
      isFav = true
    }
    this.persist()
    return isFav
  }

  public getCart(userIdOrGuest: string): CartItem[] {
    return this.db.carts[userIdOrGuest] || []
  }

  public setCart(userIdOrGuest: string, items: CartItem[]) {
    this.db.carts[userIdOrGuest] = items
    this.persist()
  }

  public mergeGuestCart(userId: string) {
    const guestItems = this.db.carts['guest'] || []
    if (guestItems.length === 0) return
    const userItems = this.db.carts[userId] || []

    for (const gItem of guestItems) {
      const existing = userItems.find((u) => u.nftId === gItem.nftId)
      if (existing) {
        existing.quantity += gItem.quantity
      } else {
        userItems.push(gItem)
      }
    }
    this.db.carts[userId] = userItems
    this.db.carts['guest'] = []
    this.persist()
  }

  public getWallets(userId: string): Wallet[] {
    return this.db.wallets[userId] || []
  }

  public addWallet(userId: string, wallet: Wallet) {
    if (!this.db.wallets[userId]) this.db.wallets[userId] = []
    if (wallet.isPrimary) {
      this.db.wallets[userId].forEach((w) => (w.isPrimary = false))
    }
    this.db.wallets[userId].push(wallet)
    this.persist()
    return wallet
  }

  public updateWallet(userId: string, walletId: string, updates: Partial<Wallet>) {
    const list = this.db.wallets[userId] || []
    const idx = list.findIndex((w) => w.id === walletId)
    if (idx !== -1) {
      if (updates.isPrimary) {
        list.forEach((w) => (w.isPrimary = false))
      }
      list[idx] = { ...list[idx], ...updates }
      this.persist()
      return list[idx]
    }
    return null
  }

  public deleteWallet(userId: string, walletId: string) {
    const list = this.db.wallets[userId] || []
    this.db.wallets[userId] = list.filter((w) => w.id !== walletId)
    this.persist()
  }

  public getOrder(id: string) {
    return this.db.orders.find((o) => o.id === id)
  }

  public findOrderByKey(key: string) {
    return this.db.orders.find((o) => o.idempotencyKey === key)
  }

  public saveOrder(order: Order) {
    const existingIdx = this.db.orders.findIndex((o) => o.id === order.id)
    if (existingIdx !== -1) {
      this.db.orders[existingIdx] = order
    } else {
      this.db.orders.push(order)
    }
    this.persist()
    return order
  }

  public getCoupon(code: string) {
    return this.db.coupons.find((c) => c.code.toUpperCase() === code.toUpperCase())
  }
}

export const mockStore = new MockStore()
