import { http, HttpResponse, delay } from 'msw'
import { mockStore } from '../db/mockStore'
import { scenarioManager } from '../scenarios'
import { NFTItem } from '../../types/nft'
import { getUserIdFromRequest } from './authHelper'

export const nftHandlers = [
  // List NFTs with search, filters, sorting, pagination
  http.get('/api/nfts', async ({ request }) => {
    await delay(scenarioManager.getDelay())

    if (scenarioManager.getScenario() === 'server_error') {
      return HttpResponse.json({ message: 'Falha ao buscar catálogo de NFTs.' }, { status: 500 })
    }

    const url = new URL(request.url)
    const search = url.searchParams.get('search')?.toLowerCase() || ''
    const category = url.searchParams.get('category') || ''
    const priceMin = parseFloat(url.searchParams.get('priceMin') || '0')
    const priceMax = parseFloat(url.searchParams.get('priceMax') || '999999')
    const network = url.searchParams.get('network') || ''
    const sortBy = url.searchParams.get('sortBy') || 'recent'
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    const limit = parseInt(url.searchParams.get('limit') || '9', 10)

    const userId = getUserIdFromRequest(request)
    const userFavorites = userId ? mockStore.getFavorites(userId) : []

    let list = [...mockStore.getNFTs()]

    // Filter by search
    if (search) {
      list = list.filter(
        (nft) =>
          nft.title.toLowerCase().includes(search) ||
          nft.tokenId.toLowerCase().includes(search) ||
          nft.collection.toLowerCase().includes(search) ||
          nft.creator.name.toLowerCase().includes(search)
      )
    }

    // Filter by category
    if (category && category !== 'todas') {
      list = list.filter((nft) => nft.category === category)
    }

    // Filter by network
    if (network && network !== 'todas') {
      list = list.filter((nft) => nft.network === network)
    }

    // Filter by price range
    list = list.filter((nft) => {
      const p = parseFloat(nft.price)
      return p >= priceMin && p <= priceMax
    })

    // Sort
    switch (sortBy) {
      case 'price-asc':
        list.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
        break
      case 'price-desc':
        list.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
        break
      case 'popular':
        list.sort((a, b) => b.favoritesCount - a.favoritesCount)
        break
      case 'recent':
      default:
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
    }

    // Add isFavorite per item
    const total = list.length
    const startIndex = (page - 1) * limit
    const paginatedItems = list.slice(startIndex, startIndex + limit).map((nft) => ({
      ...nft,
      isFavorite: userFavorites.includes(nft.id),
    }))

    return HttpResponse.json({
      items: paginatedItems,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    })
  }),

  // Get Single NFT
  http.get('/api/nfts/:id', async ({ params, request }) => {
    await delay(scenarioManager.getDelay())

    if (scenarioManager.getScenario() === 'server_error') {
      return HttpResponse.json({ message: 'Erro ao carregar ativo digital.' }, { status: 500 })
    }

    const { id } = params
    const nft = mockStore.getNFTById(id as string)

    if (!nft) {
      return HttpResponse.json({ message: 'NFT não encontrado ou inexistente.' }, { status: 404 })
    }

    const userId = getUserIdFromRequest(request)
    const userFavorites = userId ? mockStore.getFavorites(userId) : []

    const result: NFTItem = {
      ...nft,
      isFavorite: userFavorites.includes(nft.id),
    }

    return HttpResponse.json(result)
  }),

  // Favorites
  http.get('/api/favorites', async ({ request }) => {
    await delay(100)
    const userId = getUserIdFromRequest(request)
    if (!userId) {
      return HttpResponse.json({ message: 'Autenticação necessária.' }, { status: 401 })
    }
    const favs = mockStore.getFavorites(userId)
    return HttpResponse.json(favs)
  }),

  http.post('/api/favorites/:id', async ({ params, request }) => {
    await delay(150)
    const userId = getUserIdFromRequest(request)
    if (!userId) {
      return HttpResponse.json({ message: 'Autenticação necessária.' }, { status: 401 })
    }
    const { id } = params
    const isFav = mockStore.toggleFavorite(userId, id as string)
    const nft = mockStore.getNFTById(id as string)

    return HttpResponse.json({
      nftId: id,
      isFavorite: isFav,
      favoritesCount: nft?.favoritesCount || 0,
    })
  }),
]
