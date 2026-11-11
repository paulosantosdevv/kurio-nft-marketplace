import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { nftsApi } from '../api/client'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { socketService, NFTUpdatedEvent } from '../socket/socketClient'
import { Skeleton } from '../components/ui/Skeleton'
import {
  Heart,
  ChevronLeft,
  Search,
  Check,
  AlertCircle,
  Mail,
  ShoppingBag,
} from 'lucide-react'

export const NFTDetailView: React.FC = () => {
  const { id } = useParams({ from: '/nft/$id' })
  const navigate = useNavigate()
  const { addToCart, setIsOpen } = useCart()
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()

  const [quantity, setQuantity] = useState(1)
  const [selectedEdition, setSelectedEdition] = useState('1/50')
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details')
  const [selectedThumbIndex, setSelectedThumbIndex] = useState(0)
  const [copied, setCopied] = useState(false)

  // Fetch NFT
  const {
    data: nft,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['nft', id],
    queryFn: () => nftsApi.getNFTById(id),
    retry: 1,
  })

  // Optimistic Favorite State
  const [isFav, setIsFav] = useState(false)
  const [favCount, setFavCount] = useState(0)

  useEffect(() => {
    if (nft) {
      setIsFav(nft.isFavorite || false)
      setFavCount(nft.favoritesCount)
      if (nft.edition) setSelectedEdition(nft.edition)
    }
  }, [nft])

  // Real-time Socket.IO listener for price / availability
  useEffect(() => {
    const handleNFTUpdated = (event: NFTUpdatedEvent) => {
      if (event.nftId === id) {
        queryClient.setQueryData(['nft', id], (old: any) => {
          if (!old) return old
          return {
            ...old,
            price: event.newPrice,
            availableEditions: event.availableEditions,
            version: event.version,
          }
        })
      }
    }

    socketService.on('nft.updated', handleNFTUpdated)
    return () => {
      socketService.off('nft.updated', handleNFTUpdated)
    }
  }, [id, queryClient])

  // Favorite Mutation with Rollback
  const favMutation = useMutation({
    mutationFn: () => nftsApi.toggleFavorite(id),
    onMutate: async () => {
      const prevFav = isFav
      const prevCount = favCount
      setIsFav(!prevFav)
      setFavCount(prevFav ? prevCount - 1 : prevCount + 1)
      return { prevFav, prevCount }
    },
    onError: (_err, _vars, context) => {
      if (context) {
        setIsFav(context.prevFav)
        setFavCount(context.prevCount)
      }
    },
    onSuccess: (data) => {
      setIsFav(data.isFavorite)
      setFavCount(data.favoritesCount)
    },
  })

  const handleFavoriteClick = () => {
    if (!isAuthenticated) {
      navigate({ to: '/login', search: { redirect: `/nft/${id}` } })
      return
    }
    favMutation.mutate()
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleBuyNow = async () => {
    if (!nft) return
    await addToCart(nft.id, quantity, selectedEdition)
    setIsOpen(true)
  }

  const relatedCards = [
    { id: 'nft-4', title: 'Cosmic Bloom #118', price: '1.29 ETH', image: '/assets/nfts/card_4_cosmic_bloom.webp' },
    { id: 'nft-5', title: 'Violet Nomad #314', price: '1.39 ETH', image: '/assets/nfts/card_5_violet_nomad.webp' },
    { id: 'nft-6', title: 'Ivory Baron #088', price: '1.79 ETH', image: '/assets/nfts/card_6_ivory_baron.webp' },
    { id: 'nft-7', title: 'Golden Beat #207', price: '0.99 ETH', image: '/assets/nfts/card_7_golden_beat_1.webp' },
    { id: 'nft-9', title: 'Golden Signal #160', price: '0.39 ETH', image: '/assets/nfts/card_9_golden_signal.webp' },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#140d0a] text-[#f7f4ed] font-mono">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-8 pb-32 md:pb-12">
          <Skeleton className="h-4 w-32 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-6 flex gap-4">
              <div className="hidden md:flex flex-col gap-3 w-16 lg:w-20 shrink-0">
                <Skeleton className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl" />
                <Skeleton className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl" />
                <Skeleton className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl" />
              </div>
              <Skeleton className="relative flex-1 aspect-square rounded-[28px]" />
            </div>
            <div className="md:col-span-6 space-y-6">
              <Skeleton className="h-8 w-3/4 rounded-xl" />
              <Skeleton className="h-6 w-1/3 rounded-lg" />
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-12 w-1/2 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isError || !nft) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center font-mono">
        <div className="p-10 bg-[#1c1410] border border-red-900/30 rounded-3xl space-y-4">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto" />
          <h2 className="text-2xl font-bold text-[#f7f4ed]">Ativo Digital Não Localizado</h2>
          <p className="text-xs text-[#8a7b70] max-w-md mx-auto">
            {(error as any)?.response?.data?.message || 'O NFT solicitado não existe ou foi removido do catálogo.'}
          </p>
          <div className="pt-4">
            <Link to="/">
              <button className="bg-[#d28a4c] text-[#140d0a] px-6 py-2.5 rounded-xl font-bold text-xs uppercase hover:bg-[#e0985a] transition-colors cursor-pointer">
                Voltar ao Catálogo
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const thumbImages = [
    nft.imageUrl,
    '/assets/nfts/card_1_emerald_ape.webp',
    '/assets/nfts/hero_character.webp',
    nft.imageUrl,
  ]

  return (
    <div className="min-h-screen bg-[#140d0a] text-[#f7f4ed] font-mono">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-8 pb-32 md:pb-12">
        {/* Navigation Bar / Breadcrumb */}
        <div className="flex items-center justify-between text-xs text-[#8a7b70]">
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1 hover:text-[#f7f4ed] transition-colors"
            >
              <ChevronLeft className="w-4 h-4 md:hidden" />
              <span>Início</span>
            </Link>
            <span>/</span>
            <span className="text-[#a69a8f]">Mercado</span>
          </div>

          <button
            onClick={handleFavoriteClick}
            aria-label="Favoritar este NFT"
            className="md:hidden w-10 h-10 rounded-full bg-[#1c1410] border border-[#2d1e17] flex items-center justify-center text-[#d28a4c] cursor-pointer"
          >
            <Heart className={`w-5 h-5 ${isFav ? 'fill-[#d28a4c]' : ''}`} />
          </button>
        </div>

        {/* Main 2-Column Product Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Thumbnails + Main Artwork */}
          <div className="md:col-span-6 flex gap-4">
            {/* Desktop Thumbnails Stack */}
            <div className="hidden md:flex flex-col gap-3 w-16 lg:w-20 shrink-0">
              {thumbImages.map((src, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedThumbIndex(idx)}
                  aria-label={`Visualizar miniatura ${idx + 1}`}
                  className={`w-16 h-16 lg:w-20 lg:h-20 rounded-2xl overflow-hidden bg-[#ded7cb] border-2 transition-all cursor-pointer ${
                    selectedThumbIndex === idx
                      ? 'border-[#d28a4c] shadow-md'
                      : 'border-[#2d1e17] opacity-80 hover:opacity-100'
                  }`}
                >
                  <img
                    src={src}
                    alt={`Miniatura ${idx + 1} de ${nft.title}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main Image Box */}
            <div className="relative flex-1 aspect-square rounded-[28px] overflow-hidden bg-[#ded7cb] border border-[#2d1e17] shadow-xl">
              <img
                src={thumbImages[selectedThumbIndex] || nft.imageUrl}
                alt={nft.title}
                fetchPriority="high"
                decoding="async"
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
              <button
                onClick={handleShare}
                aria-label="Ampliar arte"
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#140d0a]/60 hover:bg-[#140d0a] text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Title, Ratings, Details, Actions */}
          <div className="md:col-span-6 bg-[#1c1410] md:bg-transparent p-5 md:p-0 rounded-3xl md:rounded-none border border-[#2d1e17] md:border-0 space-y-6">
            <div>
              {/* Single H1 in the DOM */}
              <div className="flex items-start justify-between gap-2">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#f7f4ed] tracking-tight">
                  {nft.title}
                </h1>
                {/* Mobile Rating Pill */}
                <div className="md:hidden flex items-center gap-1 border border-[#d28a4c] bg-[#241712] px-2.5 py-1 rounded-full text-xs font-mono text-[#d28a4c] shrink-0">
                  <span>★</span>
                  <span>4.8({nft.reviewsCount || 19})</span>
                </div>
              </div>

              {/* Price & Desktop Rating */}
              <div className="flex flex-wrap items-center gap-4 mt-3">
                <span className="text-2xl font-black text-[#d28a4c]">
                  {nft.price} ETH
                </span>
                <div className="hidden md:flex items-center gap-1.5 text-xs text-[#8a7b70]">
                  <span className="text-[#d28a4c] tracking-wider">★★★★★</span>
                  <span className="text-[#a69a8f]">
                    {nft.reviewsCount || 19} avaliações de colecionadores
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-[#241712]" />

            <div>
              <h2 className="text-xs font-bold text-[#f7f4ed] uppercase tracking-wider mb-2">
                Sobre este NFT:
              </h2>
              <p className="text-xs text-[#a69a8f] leading-relaxed">
                {nft.description ||
                  'Um colecionável digital finalizado à mão da coleção Kurio Editions, verificado na Ethereum, com arte desbloqueável e acesso para colecionadores.'}
              </p>
            </div>

            {/* Creator / Provenance with exact text match for tests */}
            <div className="flex items-center gap-2 text-xs text-[#a69a8f]">
              <span>Criado por:</span>
              <span className="text-[#f7f4ed] font-semibold">{nft.creator.name}</span>
              <Check className="w-3.5 h-3.5 text-[#d28a4c]" />
            </div>

            {/* Edition Selector */}
            <div>
              <span className="text-xs font-bold text-[#f7f4ed] block mb-2">
                Edição:
              </span>
              <div className="flex items-center gap-2">
                {['1/1', '1/10', '1/50', 'ABERTA'].map((ed) => (
                  <button
                    key={ed}
                    onClick={() => setSelectedEdition(ed)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      selectedEdition === ed
                        ? 'border border-[#d28a4c] text-[#d28a4c] bg-[#241712]'
                        : 'border border-[#3d2b21] text-[#dcd1c4] hover:text-[#f7f4ed]'
                    }`}
                  >
                    {ed}
                  </button>
                ))}
              </div>
            </div>

            {/* Stepper & Desktop Action Buttons */}
            <div className="hidden md:flex flex-wrap items-center gap-4 pt-2">
              {/* Stepper */}
              <div className="flex items-center gap-2 bg-[#140d0a] border border-[#2d1e17] rounded-full px-2 py-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded-full bg-[#d28a4c] text-[#140d0a] font-bold flex items-center justify-center text-sm cursor-pointer hover:bg-[#e0985a]"
                  aria-label="Diminuir quantidade"
                >
                  -
                </button>
                <span className="font-bold text-sm text-[#f7f4ed] w-5 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 rounded-full bg-[#d28a4c] text-[#140d0a] font-bold flex items-center justify-center text-sm cursor-pointer hover:bg-[#e0985a]"
                  aria-label="Aumentar quantidade"
                >
                  +
                </button>
              </div>

              {/* Single COMPRAR Button */}
              <button
                onClick={handleBuyNow}
                className="bg-[#d28a4c] hover:bg-[#e0985a] text-[#140d0a] font-bold px-8 py-3 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                COMPRAR
              </button>

              {/* Favoritar Button */}
              <button
                onClick={handleFavoriteClick}
                className="flex items-center gap-2 border border-[#3d2b21] hover:border-[#d28a4c] px-6 py-3 rounded-xl text-xs text-[#f7f4ed] transition-colors cursor-pointer"
              >
                <Heart className={`w-4 h-4 ${isFav ? 'fill-[#d28a4c] text-[#d28a4c]' : 'text-[#a69a8f]'}`} />
                <span>Favoritar</span>
              </button>
            </div>

            {/* Metadata lines */}
            <div className="space-y-1.5 pt-2 text-xs text-[#a69a8f]">
              <div>
                <span>ID do token: </span>
                <span className="text-[#a69a8f]">{nft.tokenId || '#0042'}</span>
              </div>
              <div>
                <span>Coleção: </span>
                <span className="text-[#a69a8f]">{nft.collection || 'Kurio Apes'}</span>
              </div>
              <div>
                <span>Padrão do token: </span>
                <span className="text-[#a69a8f] font-semibold">{nft.standard || 'ERC-721'}</span>
              </div>
              <div>
                <span>Atributos: </span>
                <span className="text-[#a69a8f]">Óculos, Esmeralda, Raro</span>
              </div>
            </div>

            {/* Social Share */}
            <div className="flex items-center gap-3 pt-2 text-xs text-[#a69a8f]">
              <span>Compartilhar este NFT:</span>
              <div className="flex items-center gap-3 text-[#a69a8f]">
                <button
                  onClick={handleShare}
                  aria-label="Compartilhar no LinkedIn"
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:text-[#d28a4c] transition-colors cursor-pointer"
                >
                  <span aria-hidden="true" className="font-bold text-[11px] underline">in</span>
                </button>
                <button
                  onClick={handleShare}
                  aria-label="Compartilhar por E-mail"
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:text-[#d28a4c] transition-colors cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleShare}
                  aria-label="Compartilhar no Twitter X"
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:text-[#d28a4c] transition-colors cursor-pointer"
                >
                  <span aria-hidden="true" className="font-bold text-[11px]">𝕏</span>
                </button>
              </div>
              {copied && <span className="text-emerald-400 text-[11px]">Link copiado!</span>}
            </div>
          </div>
        </div>

        {/* Mobile Sticky Bottom Bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1c1410] border-t border-[#2d1e17] px-6 py-4 shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#a69a8f]">Qtd.</span>
              <div className="flex items-center gap-2 bg-[#140d0a] border border-[#2d1e17] rounded-full px-2 py-0.5">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Diminuir quantidade"
                  className="w-6 h-6 rounded-full bg-[#d28a4c] text-[#140d0a] font-bold flex items-center justify-center text-xs"
                >
                  -
                </button>
                <span className="font-bold text-xs text-[#f7f4ed] w-4 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Aumentar quantidade"
                  className="w-6 h-6 rounded-full bg-[#d28a4c] text-[#140d0a] font-bold flex items-center justify-center text-xs"
                >
                  +
                </button>
              </div>
            </div>
            <span className="text-lg font-black text-[#d28a4c]">{nft.price} ETH</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-[#d28a4c] hover:bg-[#e0985a] text-[#140d0a] font-bold py-3.5 rounded-full text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Comprar NFT
            </button>
            <button
              onClick={handleBuyNow}
              aria-label="Adicionar ao carrinho"
              className="w-12 h-12 rounded-full bg-[#241712] border border-[#3d2b21] flex items-center justify-center text-[#f7f4ed] hover:border-[#d28a4c] transition-colors shrink-0"
            >
              <ShoppingBag className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="pt-10 border-t border-[#241712]">
          <div className="flex items-center gap-8 border-b border-[#241712] overflow-x-auto">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-3 text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'details'
                  ? 'border-b-2 border-[#d28a4c] text-[#d28a4c]'
                  : 'text-[#8a7b70] hover:text-[#f7f4ed]'
              }`}
            >
              Detalhes do NFT
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'reviews'
                  ? 'border-b-2 border-[#d28a4c] text-[#d28a4c]'
                  : 'text-[#8a7b70] hover:text-[#f7f4ed]'
              }`}
            >
              Avaliações de colecionadores ({nft.reviewsCount || 19})
            </button>
          </div>

          <div className="pt-6">
            {activeTab === 'details' ? (
              <div className="max-w-4xl space-y-5 text-xs text-[#a69a8f] leading-relaxed">
                <p>
                  Emerald Ape #042 é uma obra digital 1/50 finalizada à mão da coleção Kurio Editions. Cada atributo fica armazenado nos metadados do token e verificado na Ethereum. A obra explora identidade, movimento e luz em um mundo digital sem fronteiras.
                </p>
                <p>
                  A propriedade inclui a arte em alta resolução, lançamentos exclusivos para colecionadores e um registro permanente de procedência registrada na rede. Nova Sato recebe 5% de direitos autorais nas vendas secundárias, apoiando novos trabalhos e lançamentos da comunidade.
                </p>
                <div className="space-y-3 pt-2">
                  <div>
                    <div className="font-bold text-[#f7f4ed] mb-1">Rede:</div>
                    <p className="text-[#a69a8f]">
                      Cunhado na Ethereum com procedência imutável e metadados armazenados no IPFS.
                    </p>
                  </div>
                  <div>
                    <div className="font-bold text-[#f7f4ed] mb-1">Contrato:</div>
                    <p className="text-[#a69a8f]">
                      Direitos autorais do criador: 5% nas vendas secundárias, pagos automaticamente pelos mercados compatíveis.
                    </p>
                  </div>
                  <div>
                    <div className="font-bold text-[#f7f4ed] mb-1">Direitos autorais:</div>
                    <p className="text-[#a69a8f]">
                      0x7A42...19E8 • Contrato inteligente ERC-721 verificado.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-2xl space-y-4 text-xs">
                <div className="bg-[#1c1410] p-4 rounded-xl border border-[#2d1e17] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#f7f4ed]">alex_rivers.eth</span>
                    <span className="text-[#8a7b70]">2 dias atrás</span>
                  </div>
                  <div className="text-[#d28a4c]">★★★★★</div>
                  <p className="text-[#a69a8f]">
                    Textura e iluminação volumétrica fantásticas. Obra central na minha galeria.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mais Desta Coleção */}
        <div className="pt-10 border-t border-[#241712] space-y-6">
          <div className="border-b border-[#241712] pb-3">
            <h3 className="text-base font-bold text-[#d28a4c]">
              Mais desta coleção
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
            {relatedCards.map((item) => (
              <Link
                key={item.id}
                to="/nft/$id"
                params={{ id: item.id }}
                className="group flex flex-col cursor-pointer"
              >
                <div className="aspect-square rounded-[20px] overflow-hidden bg-[#ded7cb] border border-[#2d1e17] p-2 transition-transform duration-300 group-hover:-translate-y-1 shadow-lg">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    width={200}
                    height={200}
                    className="w-full h-full object-cover rounded-[14px]"
                  />
                </div>
                <div className="mt-3">
                  <h4 className="text-xs font-bold text-[#f7f4ed] truncate">
                    {item.title}
                  </h4>
                  <span className="text-xs font-black text-[#d28a4c] block mt-1">
                    {item.price}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* 3 Pagination Dots */}
          <div className="flex justify-center items-center gap-2 pt-6">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d28a4c]" />
            <span className="w-2.5 h-2.5 rounded-full border border-[#5e4b3e]" />
            <span className="w-2.5 h-2.5 rounded-full border border-[#5e4b3e]" />
          </div>
        </div>
      </div>
    </div>
  )
}
