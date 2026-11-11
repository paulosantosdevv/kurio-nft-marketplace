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
    <div className="space-y-6">
      {/* Box 1: Filters Box */}
      <div className="bg-[#18120e] border border-[#2d1c15] rounded-2xl p-5 text-xs text-[#8a7b70]">
        {/* Coleções */}
        <div>
          <h4 className="text-xs font-bold text-[#f5efe6] uppercase tracking-wider mb-3.5">
            Coleções
          </h4>
          <div className="space-y-2">
            {categories.map((cat) => {
              const isSelected = currentCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => updateSearch({ category: isSelected ? undefined : cat.id })}
                  className={`w-full flex items-center justify-between text-left py-0.5 hover:text-[#f5efe6] transition-colors cursor-pointer ${
                    isSelected ? 'text-[#d28a4c] font-semibold' : 'text-[#8a7b70]'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className="text-[11px] text-[#5e5148]">({cat.count})</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Faixa de Preço */}
        <div className="pt-5 mt-5 border-t border-[#241712]">
          <h4 className="text-xs font-bold text-[#f5efe6] uppercase tracking-wider mb-1.5">
            Faixa de preço
          </h4>
          <span className="text-[11px] text-[#8a7b70] block mb-2.5">
            Preço: 0,02 - {sliderVal.toFixed(2)} ETH
          </span>

          <form onSubmit={handleApplyPrice} className="space-y-3">
            <input
              type="range"
              min="0.1"
              max="15.0"
              step="0.1"
              value={sliderVal}
              onChange={(e) => setSliderVal(parseFloat(e.target.value))}
              className="w-full h-1 bg-[#3d281e] rounded-lg appearance-none cursor-pointer"
            />
            <button
              type="submit"
              className="bg-[#d28a4c] hover:bg-[#b87438] text-white text-[11px] font-bold px-4 py-1.5 rounded-md uppercase tracking-wider transition-colors cursor-pointer"
            >
              Aplicar
            </button>
          </form>
        </div>

        {/* Rede */}
        <div className="pt-5 mt-5 border-t border-[#241712]">
          <h4 className="text-xs font-bold text-[#f5efe6] uppercase tracking-wider mb-3">
            Rede
          </h4>
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
                  <span className={isSelected ? 'text-[#f5efe6] font-medium' : 'text-[#8a7b70]'}>
                    {net.label} ({net.count})
                  </span>
                </label>
              )
            })}
          </div>
        </div>
      </div>

      {/* Box 2: NFT em Destaque — Oferta Limitada */}
      <div className="bg-[#18120e] border border-[#2d1c15] rounded-2xl p-4 text-xs">
        <h4 className="text-xs font-bold text-[#d28a4c] tracking-wider uppercase">
          NFT EM DESTAQUE
        </h4>
        <p className="text-[10px] text-[#8a7b70] tracking-wider uppercase mb-3">
          OFERTA LIMITADA
        </p>

        <Link
          to="/nft/$id"
          params={{ id: 'nft-2' }}
          className="block rounded-xl overflow-hidden aspect-square bg-[#ded7cb] border border-[#2d1c15] hover:opacity-95 transition-opacity"
        >
          <img
            src="/assets/nfts/sidebar_nft.png"
            alt="Sage Nomad — NFT em Destaque"
            className="w-full h-full object-cover"
          />
        </Link>
      </div>
    </div>
  )
}
