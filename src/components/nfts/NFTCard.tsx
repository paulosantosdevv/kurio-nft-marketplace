import React, { useState } from 'react'
import { NFTItem } from '../../types/nft'
import { Badge } from '../ui/Badge'
import { Heart, ShoppingBag } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { nftsApi } from '../../api/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export interface NFTCardProps {
  nft: NFTItem
}

export const NFTCard: React.FC<NFTCardProps> = ({ nft }) => {
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()
  const [isHovered, setIsHovered] = useState(false)

  // Local optimistic favorite state
  const [isFav, setIsFav] = useState(nft.isFavorite || false)
  const [favCount, setFavCount] = useState(nft.favoritesCount)

  // Optimistic Mutation with Rollback on error
  const favoriteMutation = useMutation({
    mutationFn: () => nftsApi.toggleFavorite(nft.id),
    onMutate: async () => {
      // Optimistic update
      const prevFav = isFav
      const prevCount = favCount
      setIsFav(!prevFav)
      setFavCount(prevFav ? prevCount - 1 : prevCount + 1)
      return { prevFav, prevCount }
    },
    onError: (_err, _vars, context) => {
      // Rollback
      if (context) {
        setIsFav(context.prevFav)
        setFavCount(context.prevCount)
      }
    },
    onSuccess: (data) => {
      setIsFav(data.isFavorite)
      setFavCount(data.favoritesCount)
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) {
      alert('Faça login para salvar obras em seus favoritos.')
      return
    }
    favoriteMutation.mutate()
  }

  const handleQuickBuy = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await addToCart(nft.id, 1, nft.edition)
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-[#1b120e] border border-[#2d1e17] hover:border-[#d28a4c]/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col"
    >
      <Link to="/nft/$id" params={{ id: nft.id }} className="block relative aspect-square overflow-hidden bg-[#140d0a]">
        <img
          src={nft.imageUrl}
          alt={nft.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badge */}
        {nft.badge && (
          <div className="absolute top-3 left-3 z-10">
            <Badge variant="amber">{nft.badge}</Badge>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          aria-label={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:text-red-400 transition-colors"
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : 'text-white'}`} />
        </button>

        {/* Quick Add Overlay on Hover */}
        {isHovered && (
          <div className="absolute inset-x-3 bottom-3 z-10 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <button
              onClick={handleQuickBuy}
              className="w-full bg-[#d28a4c] hover:bg-[#b87438] text-white py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-lg transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" /> Adicionar ao Carrinho
            </button>
          </div>
        )}
      </Link>

      {/* Info Container */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-[#a69a8f] mb-1">
            <span className="truncate">{nft.collection}</span>
            <span>Edição: {nft.edition}</span>
          </div>

          <Link to="/nft/$id" params={{ id: nft.id }} className="block">
            <h3 className="text-base font-bold text-[#f7f4ed] group-hover:text-[#d28a4c] transition-colors truncate">
              {nft.title}
            </h3>
          </Link>
        </div>

        <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#2d1e17] text-xs">
          <div>
            <span className="text-[10px] text-[#786b62] block uppercase tracking-wider">Preço</span>
            <span className="font-bold text-[#d28a4c] text-sm">{nft.price} ETH</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[#786b62] block uppercase tracking-wider">Favoritos</span>
            <span className="text-xs text-[#a69a8f] font-medium">{favCount}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
