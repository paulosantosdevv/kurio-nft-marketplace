import React, { useState } from 'react'
import { useNavigate, Link } from '@tanstack/react-router'

export interface NFTFiltersProps {
  currentCategory?: string
  currentPriceMin?: string
  currentPriceMax?: string
  currentNetwork?: string
}

export const NFTFilters: React.FC<NFTFiltersProps> = ({
  currentCategory = 'todas',
  currentPriceMax = '12.38',
  currentNetwork,
}) => {
  const navigate = useNavigate()
  const [sliderVal, setSliderVal] = useState(parseFloat(currentPriceMax) || 12.38)

  const categories = [
    { id: 'arte-digital', label: 'Arte digital', count: 33 },
    { id: 'fotografia', label: 'Fotografia', count: 12 },
    { id: 'musica', label: 'Música', count: 65 },
    { id: 'arte-3d', label: 'Arte 3D', count: 39 },
    { id: 'colecionaveis', label: 'Colecionáveis', count: 23 },
    { id: 'generativa', label: 'Generativa', count: 17 },
    { id: 'jogos', label: 'Jogos', count: 19 },
    { id: 'assinaturas', label: 'Assinaturas', count: 13 },
    { id: 'utilidade', label: 'Utilidade', count: 18 },
  ]

  const networks = [
    { id: 'ethereum', label: 'Ethereum', count: 119 },
    { id: 'polygon', label: 'Polygon', count: 78 },
    { id: 'solana', label: 'Solana', count: 86 },
  ]

  const updateSearch = (updates: Record<string, any>) => {
    navigate({
      to: '/',
      search: (prev: any) => ({
        ...prev,
        ...updates,
        page: 1,
      }),
    })
  }

  const handleApplyPrice = (e: React.FormEvent) => {
    e.preventDefault()
    updateSearch({
      priceMin: '0.02',
      priceMax: sliderVal.toString(),
    })
  }

  return (
    <div className="space-y-6 font-mono">
      {/* Box 1: Filters Box */}
      <div className="bg-[#241612] border border-[#3d271f] rounded-2xl p-5 text-xs text-[#dcd1c4]">
        {/* Coleções */}
        <div>
          <h3 className="text-xs font-bold text-[#f5efe6] uppercase tracking-wider mb-3.5">
            Coleções
          </h3>
          <div className="space-y-2">
            {categories.map((cat) => {
              const isSelected = currentCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => updateSearch({ category: cat.id })}
                  className="w-full flex items-center justify-between text-xs py-1 transition-colors cursor-pointer group"
                >
                  <span className={isSelected ? 'text-[#f5efe6] font-bold' : 'text-[#dcd1c4] group-hover:text-[#f5efe6]'}>
                    {cat.label}
                  </span>
                  <span className="text-[11px] text-[#a69a8f]">
                    ({cat.count})
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Faixa de preço */}
        <div className="pt-5 mt-5 border-t border-[#241712]">
          <h3 className="text-xs font-bold text-[#f5efe6] uppercase tracking-wider mb-2">
            Faixa de preço
          </h3>
          <span className="text-[11px] text-[#a69a8f] block mb-2.5">
            Preço: 0,02 - {sliderVal.toFixed(2)} ETH
          </span>

          <form onSubmit={handleApplyPrice} className="space-y-3">
            <input
              type="range"
              aria-label="Faixa de preço em ETH"
              min="0.1"
              max="15.0"
              step="0.1"
              value={sliderVal}
              onChange={(e) => setSliderVal(parseFloat(e.target.value))}
              className="w-full h-1 bg-[#3d281e] rounded-lg appearance-none cursor-pointer"
            />
            <button
              type="submit"
              className="bg-[#d28a4c] hover:bg-[#b87438] text-[#140d0a] text-[11px] font-bold px-4 py-1.5 rounded-md uppercase tracking-wider transition-colors cursor-pointer"
            >
              Aplicar
            </button>
          </form>
        </div>

        {/* Rede */}
        <div className="pt-5 mt-5 border-t border-[#241712]">
          <h3 className="text-xs font-bold text-[#f5efe6] uppercase tracking-wider mb-3">
            Rede
          </h3>
          <div className="space-y-2.5">
            {networks.map((net) => {
              const isSelected = currentNetwork === net.id
              return (
                <label
                  key={net.id}
                  className="flex items-center gap-2.5 text-xs hover:text-[#f5efe6] cursor-pointer"
                >
                  <input
                    type="radio"
                    name="network_filter"
                    value={net.id}
                    checked={isSelected}
                    onChange={() => updateSearch({ network: net.id })}
                    onClick={() => updateSearch({ network: net.id })}
                    className="accent-[#d28a4c]"
                  />
                  <span className={isSelected ? 'text-[#f5efe6] font-medium' : 'text-[#dcd1c4]'}>
                    {net.label} ({net.count})
                  </span>
                </label>
              )
            })}
          </div>
        </div>
      </div>

      {/* Box 2: NFT em Destaque — Oferta Limitada */}
      <div className="bg-[#241612] border border-[#3d271f] rounded-2xl p-4 text-xs font-mono">
        <h3 className="text-xs font-bold text-[#d28a4c] tracking-wider uppercase">
          NFT EM DESTAQUE
        </h3>
        <p className="text-[10px] text-[#b5a79b] tracking-wider uppercase mb-3">
          OFERTA LIMITADA
        </p>

        <Link
          to="/nft/$id"
          params={{ id: 'nft-2' }}
          className="block rounded-xl overflow-hidden aspect-square bg-[#ded7cb] border border-[#3d271f] hover:opacity-95 transition-opacity"
        >
          <img
            src="/assets/nfts/sidebar_nft.webp"
            alt="Sage Nomad — NFT em Destaque"
            loading="lazy"
            decoding="async"
            width={240}
            height={240}
            className="w-full h-full object-cover"
          />
        </Link>
      </div>
    </div>
  )
}
