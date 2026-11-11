import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { nftsApi } from '../api/client'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { socketService, NFTUpdatedEvent } from '../socket/socketClient'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Skeleton } from '../components/ui/Skeleton'
import {
  Heart,
  ShoppingBag,
  Share2,
  ShieldCheck,
  Star,
  ChevronLeft,
  Check,
  AlertCircle,
} from 'lucide-react'

export const NFTDetailView: React.FC = () => {
  const { id } = useParams({ from: '/nft/$id' })
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()

  const [quantity, setQuantity] = useState(1)
  const [selectedEdition, setSelectedEdition] = useState('1/50')
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details')
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

  // Fetch Related NFTs from same collection
  const { data: relatedData } = useQuery({
    queryKey: ['related-nfts', nft?.category],
    queryFn: () => nftsApi.getNFTs({ limit: 4 }),
    enabled: !!nft,
  })

  // Optimistic Favorite State
  const [isFav, setIsFav] = useState(false)
  const [favCount, setFavCount] = useState(0)

  useEffect(() => {
    if (nft) {
      setIsFav(nft.isFavorite || false)
      setFavCount(nft.favoritesCount)
      setSelectedEdition(nft.edition)
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
      alert('Você precisa estar conectado para favoritar.')
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
    navigate({ to: '/pagamento' })
  }

  // Loading skeleton with shimmer
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        <Skeleton className="h-6 w-32" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-6">
            <Skeleton className="w-full aspect-square rounded-3xl" />
          </div>
          <div className="lg:col-span-6 space-y-6">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-1/3" />
            <Skeleton className="h-14 w-full" />
          </div>
        </div>
      </div>
    )
  }

  // 404 / Error State
  if (isError || !nft) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="p-10 bg-[#1b120e] border border-red-900/30 rounded-3xl space-y-4">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto" />
          <h2 className="text-2xl font-bold text-[#f7f4ed]">Ativo Digital Não Localizado</h2>
          <p className="text-sm text-[#a69a8f] max-w-md mx-auto">
            {(error as any)?.response?.data?.message || 'O NFT solicitado não existe ou foi removido do catálogo.'}
          </p>
          <div className="pt-4">
            <Link to="/">
              <Button variant="primary">Voltar ao Catálogo</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Breadcrumb Back */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#a69a8f] hover:text-[#f7f4ed] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Voltar ao Início / {nft.collection}
        </Link>
      </div>

      {/* Main Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Artwork & Metadata */}
        <div className="lg:col-span-6 space-y-8">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-[#140d0a] border border-[#2d1e17] shadow-2xl">
            <img
              src={nft.imageUrl}
              alt={nft.title}
              className="w-full h-full object-cover"
            />
            {nft.badge && (
              <div className="absolute top-4 left-4">
                <Badge variant="amber" className="text-xs px-3 py-1">
                  {nft.badge}
                </Badge>
              </div>
            )}
          </div>

          {/* Blockchain Provenance Box */}
          <div className="bg-[#1b120e] border border-[#2d1e17] rounded-2xl p-6 space-y-4 text-xs text-[#a69a8f]">
            <h4 className="font-bold text-[#f7f4ed] uppercase tracking-wider text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#d28a4c]" /> Proveniência e Contrato Inteligente
            </h4>
            <div className="space-y-2 pt-2 border-t border-[#2d1e17]">
              <div className="flex justify-between py-1">
                <span>Rede</span>
                <span className="font-semibold text-[#f7f4ed] uppercase">{nft.network}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Padrão do Token</span>
                <span className="font-semibold text-[#f7f4ed]">{nft.standard}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Contrato</span>
                <span className="font-mono text-[#d28a4c] truncate max-w-[200px]">
                  {nft.contractAddress}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span>Royalties do Criador</span>
                <span className="font-semibold text-[#f7f4ed]">{nft.creator.royaltyPercentage}% nas vendas secundárias</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Armazenamento</span>
                <span className="font-mono text-[#a69a8f] truncate max-w-[200px]">
                  {nft.ipfsHash}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Title, Actions & Purchase */}
        <div className="lg:col-span-6 space-y-8">
          <div>
            <div className="flex items-center gap-3 text-xs text-[#a69a8f] mb-2">
              <span className="font-mono text-[#d28a4c] font-semibold">{nft.tokenId}</span>
              <span>•</span>
              <span className="font-medium">{nft.collection}</span>
              <span>•</span>
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold">{nft.rating}</span>
                <span className="text-[#786b62]">({nft.reviewsCount} avaliações)</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-[#f7f4ed] tracking-tight mb-4">
              {nft.title}
            </h1>

            {/* Creator Pill */}
            <div className="inline-flex items-center gap-3 p-2 pr-4 bg-[#1b120e] border border-[#2d1e17] rounded-full mb-6">
              <img
                src={nft.creator.avatar}
                alt={nft.creator.name}
                className="w-8 h-8 rounded-full object-cover border border-[#d28a4c]"
              />
              <div className="text-xs">
                <span className="text-[#786b62] block text-[10px] uppercase">Criador</span>
                <span className="font-bold text-[#f7f4ed] flex items-center gap-1">
                  {nft.creator.name}
                  {nft.creator.verified && <Check className="w-3 h-3 text-[#d28a4c]" />}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-[#a69a8f] leading-relaxed mb-8">
              {nft.description}
            </p>
          </div>

          {/* Pricing Box */}
          <div className="bg-[#1b120e] border border-[#3d2b21] rounded-2xl p-6 space-y-6">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-xs text-[#786b62] uppercase tracking-wider block mb-1">
                  Preço Atual
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-[#d28a4c]">{nft.price} ETH</span>
                  <span className="text-xs text-[#a69a8f]">
                    (~ ${(parseFloat(nft.price) * 3200).toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-[#786b62] uppercase tracking-wider block mb-1">
                  Disponibilidade
                </span>
                <span className="text-xs font-bold text-emerald-400">
                  {nft.availableEditions} de {nft.totalEditions} restantes
                </span>
              </div>
            </div>

            {/* Edition Options */}
            <div>
              <span className="text-xs text-[#a69a8f] block mb-2 font-medium">Selecione a Edição:</span>
              <div className="flex gap-2">
                {['01/10', '1/19', '1/50', 'ABERTA'].map((ed) => (
                  <button
                    key={ed}
                    onClick={() => setSelectedEdition(ed)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                      selectedEdition === ed
                        ? 'bg-[#d28a4c] text-white border-[#d28a4c]'
                        : 'bg-[#241914] text-[#a69a8f] border-[#3d2b21] hover:text-[#f7f4ed]'
                    }`}
                  >
                    {ed}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-xs text-[#a69a8f] font-medium">Quantidade:</span>
              <div className="flex items-center border border-[#3d2b21] rounded-lg bg-[#241914]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="px-3 py-1.5 text-xs text-[#a69a8f] hover:text-white disabled:opacity-30"
                >
                  -
                </button>
                <span className="px-3 py-1.5 text-xs font-bold text-[#f7f4ed]">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(nft.availableEditions, quantity + 1))}
                  disabled={quantity >= nft.availableEditions}
                  className="px-3 py-1.5 text-xs text-[#a69a8f] hover:text-white disabled:opacity-30"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Button
                size="lg"
                onClick={handleBuyNow}
                disabled={nft.availableEditions <= 0}
                className="w-full font-bold flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" /> COMPRAR AGORA
              </Button>

              <Button
                size="lg"
                variant="secondary"
                onClick={handleFavoriteClick}
                className="w-full font-semibold flex items-center justify-center gap-2"
              >
                <Heart className={`w-5 h-5 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
                {isFav ? 'Favoritado' : 'Favoritar'} ({favCount})
              </Button>
            </div>

            {/* Share link */}
            <div className="pt-2 text-center">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 text-xs text-[#a69a8f] hover:text-[#f7f4ed] cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                {copied ? 'Link copiado para a área de transferência!' : 'Compartilhar este NFT'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Details vs Reviews */}
      <div className="pt-12 border-t border-[#2d1e17]">
        <div className="flex gap-8 border-b border-[#2d1e17] mb-6">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-4 text-sm font-bold tracking-tight border-b-2 transition-colors cursor-pointer ${
              activeTab === 'details'
                ? 'border-[#d28a4c] text-[#f7f4ed]'
                : 'border-transparent text-[#786b62] hover:text-[#a69a8f]'
            }`}
          >
            Detalhes da Obra
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 text-sm font-bold tracking-tight border-b-2 transition-colors cursor-pointer ${
              activeTab === 'reviews'
                ? 'border-[#d28a4c] text-[#f7f4ed]'
                : 'border-transparent text-[#786b62] hover:text-[#a69a8f]'
            }`}
          >
            Avaliações de Colecionadores ({nft.reviewsCount})
          </button>
        </div>

        {activeTab === 'details' ? (
          <div className="space-y-4 max-w-3xl text-xs text-[#a69a8f] leading-relaxed">
            <p>
              A obra {nft.title} foi finalizada à mão e autenticada via contrato inteligente. Cada atributo é imutável e registrado para garantir valor perpétuo e autenticidade ao colecionador.
            </p>
            <p>
              Ao colecionar esta edição, você ganha acesso exclusivo ao Discord de curadoria de {nft.creator.name}, lançamentos airdrop antecipados e direito de voto em propostas de exposições digitais da Kurio.
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-w-2xl">
            <div className="bg-[#1b120e] p-4 rounded-xl border border-[#2d1e17] text-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-[#f7f4ed]">alex_rivers.eth</span>
                <span className="text-[10px] text-[#786b62]">2 dias atrás</span>
              </div>
              <div className="flex items-center gap-1 text-amber-400 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400" />
                ))}
              </div>
              <p className="text-[#a69a8f]">
                Textura e iluminação volumétrica fantásticas. Ficou impecável na minha galeria digital no OnCyber.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Related NFTs */}
      {relatedData && relatedData.items.length > 0 && (
        <div className="pt-12 border-t border-[#2d1e17]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-[#f7f4ed]">Mais desta coleção</h3>
            <Link to="/" className="text-xs text-[#d28a4c] hover:underline">
              Ver catálogo completo
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedData.items
              .filter((item) => item.id !== nft.id)
              .slice(0, 4)
              .map((item) => (
                <Link
                  key={item.id}
                  to="/nft/$id"
                  params={{ id: item.id }}
                  className="bg-[#1b120e] border border-[#2d1e17] rounded-2xl overflow-hidden group hover:border-[#d28a4c]/50 transition-all"
                >
                  <div className="aspect-square bg-[#140d0a] overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="text-xs font-bold text-[#f7f4ed] truncate">{item.title}</h4>
                    <span className="text-xs text-[#d28a4c] font-bold mt-1 block">{item.price} ETH</span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
