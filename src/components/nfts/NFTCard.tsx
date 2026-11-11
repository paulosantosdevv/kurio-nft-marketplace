import React from 'react'
import { NFTItem } from '../../types/nft'
import { Link } from '@tanstack/react-router'
import { Heart } from 'lucide-react'

export interface NFTCardProps {
  nft: NFTItem
}

export const NFTCard: React.FC<NFTCardProps> = ({ nft }) => {
  const isRare = nft.badge === 'RARO' || nft.title.includes('Neon Vessel')

  return (
    <div className="group flex flex-col font-mono">
      <Link
        to="/nft/$id"
        params={{ id: nft.id }}
        className="block relative aspect-square rounded-[24px] overflow-hidden bg-[#ded7cb] transition-transform duration-300 group-hover:scale-[1.02] shadow-lg border border-[#3d271f]"
      >
        <img
          src={nft.imageUrl}
          alt={nft.title}
          loading="lazy"
          className="w-full h-full object-cover"
        />

        {/* RARO badge if applicable matching Figma Desktop/Início */}
        {isRare && (
          <div className="absolute top-0 left-0 bg-[#d28a4c] text-[#140d0a] text-[10px] font-bold font-mono px-3 py-1 rounded-br-xl shadow-md uppercase tracking-wider">
            RARO
          </div>
        )}

        {/* Heart icon on top-right */}
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#140d0a]/50 hover:bg-[#140d0a]/80 backdrop-blur-sm flex items-center justify-center text-[#8a7b70] hover:text-[#d28a4c] transition-colors">
          <Heart className={`w-4 h-4 ${nft.isFavorite ? 'fill-[#d28a4c] text-[#d28a4c]' : ''}`} />
        </div>
      </Link>

      {/* Title & Price directly below */}
      <div className="pt-3 px-0.5 space-y-1">
        <Link to="/nft/$id" params={{ id: nft.id }} className="block">
          <h3 className="text-xs sm:text-sm font-bold text-[#f7f4ed] group-hover:text-[#d28a4c] transition-colors truncate">
            {nft.title}
          </h3>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-bold text-[#d28a4c]">
            {nft.price} ETH
          </span>
          {nft.originalPrice && (
            <span className="text-xs text-[#6e5d52] line-through">
              {nft.originalPrice} ETH
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
