import React from 'react'
import { NFTItem } from '../../types/nft'
import { Link } from '@tanstack/react-router'

export interface NFTCardProps {
  nft: NFTItem
}

export const NFTCard: React.FC<NFTCardProps> = ({ nft }) => {
  return (
    <div className="group flex flex-col">
      <Link
        to="/nft/$id"
        params={{ id: nft.id }}
        className="block relative aspect-square rounded-2xl overflow-hidden bg-[#ded7cb] transition-transform duration-300 group-hover:scale-[1.02] shadow-md border border-[#2d1c15]"
      >
        <img
          src={nft.imageUrl}
          alt={nft.title}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </Link>

      {/* Title & Price directly below */}
      <div className="pt-2.5 px-0.5">
        <Link to="/nft/$id" params={{ id: nft.id }} className="block">
          <h3 className="text-xs font-bold text-[#f5efe6] group-hover:text-[#d28a4c] transition-colors truncate">
            {nft.title}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs font-bold text-[#d28a4c]">
            {nft.price} ETH
          </span>
          {nft.originalPrice && (
            <span className="text-[11px] text-[#786b62] line-through">
              {nft.originalPrice} ETH
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
