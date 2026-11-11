import React, { useState } from 'react'
import { NFTItem } from '../../types/nft'
import { NFTCard } from './NFTCard'
import { Skeleton } from '../ui/Skeleton'
import { useNavigate } from '@tanstack/react-router'
import { AlertCircle, ChevronRight } from 'lucide-react'

export interface NFTGridProps {
  nfts: NFTItem[]
  isLoading: boolean
  isError: boolean
  error?: any
  refetch: () => void
  total: number
  page: number
  totalPages: number
  sortBy?: string
}

export const NFTGrid: React.FC<NFTGridProps> = ({
  nfts,
  isLoading,
  isError,
  error,
  refetch,
  page,
  sortBy = 'recent',
}) => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'trending'>('all')

  const handlePageChange = (newPage: number) => {
    navigate({
      to: '/',
      search: (prev: any) => ({
        ...prev,
        page: newPage,
      }),
    })
    window.scrollTo({ top: 500, behavior: 'smooth' })
  }

  const handleSortChange = (newSort: string) => {
    navigate({
      to: '/',
      search: (prev: any) => ({
        ...prev,
        sortBy: newSort,
        page: 1,
      }),
    })
  }

  return (
    <div className="space-y-6">
      {/* Top Filter Tabs & Sort Dropdown */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-[#241712]">
        {/* Left Tabs */}
        <div className="flex items-center gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('all')}
            className={`relative py-1 transition-colors cursor-pointer ${
              activeTab === 'all' ? 'text-[#f5efe6]' : 'text-[#8a7b70] hover:text-[#f5efe6]'
            }`}
          >
            Todos os NFTs
            {activeTab === 'all' && (
              <span className="absolute -bottom-[13px] left-0 right-0 h-[2px] bg-[#d28a4c] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('new')}
            className={`relative py-1 transition-colors cursor-pointer ${
              activeTab === 'new' ? 'text-[#f5efe6]' : 'text-[#8a7b70] hover:text-[#f5efe6]'
            }`}
          >
            Novos lançamentos
            {activeTab === 'new' && (
              <span className="absolute -bottom-[13px] left-0 right-0 h-[2px] bg-[#d28a4c] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('trending')}
            className={`relative py-1 transition-colors cursor-pointer ${
              activeTab === 'trending' ? 'text-[#f5efe6]' : 'text-[#8a7b70] hover:text-[#f5efe6]'
            }`}
          >
            Em alta
            {activeTab === 'trending' && (
              <span className="absolute -bottom-[13px] left-0 right-0 h-[2px] bg-[#d28a4c] rounded-full" />
            )}
          </button>
        </div>

        {/* Right Sort Selector */}
        <div className="flex items-center gap-2 text-xs text-[#a69a8f]">
          <label htmlFor="sort-by-select" className="text-[11px]">
            Ordenar por:
          </label>
          <select
            id="sort-by-select"
            aria-label="Ordenar catálogo de NFTs"
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="bg-transparent text-[#f5efe6] font-medium text-xs focus:outline-none cursor-pointer"
          >
            <option value="recent" className="bg-[#1a110d]">Listados recentemente</option>
            <option value="price-asc" className="bg-[#1a110d]">Menor preço</option>
            <option value="price-desc" className="bg-[#1a110d]">Maior preço</option>
            <option value="popular" className="bg-[#1a110d]">Mais populares</option>
          </select>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {Array.from({ length: 9 }).map((_, idx) => (
            <div key={idx} className="space-y-3">
              <Skeleton className="w-full aspect-square rounded-[22px]" />
              <Skeleton className="h-4 w-3/4 rounded" />
              <Skeleton className="h-3 w-1/3 rounded" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="min-h-72 flex flex-col items-center justify-center text-center p-8 bg-[#18120e] border border-red-900/30 rounded-2xl">
          <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
          <h3 className="text-base font-bold text-[#f5efe6] mb-1">Falha na consulta</h3>
          <p className="text-xs text-[#a69a8f] max-w-sm mb-4">
            {error?.response?.data?.message || 'Erro ao carregar o catálogo de obras.'}
          </p>
          <button
            onClick={() => refetch()}
            className="bg-[#d28a4c] text-[#140d0a] text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer"
          >
            Tentar novamente
          </button>
        </div>
      ) : nfts.length === 0 ? (
        <div className="min-h-72 flex flex-col items-center justify-center text-center p-8 bg-[#18120e] border border-[#2d1c15] rounded-2xl">
          <p className="text-sm font-semibold text-[#f5efe6] mb-1">Nenhum NFT encontrado</p>
          <p className="text-xs text-[#a69a8f] mb-4">Tente ajustar seus filtros de busca.</p>
          <button
            onClick={() => navigate({ to: '/', search: () => ({ page: 1 }) })}
            className="text-xs text-[#d28a4c] underline cursor-pointer"
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        /* The 2-column mobile / 3-column desktop Card Grid matching Figma */
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {nfts.map((nft) => (
            <NFTCard key={nft.id} nft={nft} />
          ))}
        </div>
      )}

      {/* Pagination Numbers Matching Reference [1][2][3][4][>] */}
      <div className="flex items-center justify-end gap-1.5 pt-6">
        {[1, 2, 3, 4].map((p) => {
          const isCurrent = page === p
          return (
            <button
              key={p}
              aria-label={`Página ${p}`}
              onClick={() => handlePageChange(p)}
              className={`w-7 h-7 rounded text-xs font-bold flex items-center justify-center transition-colors cursor-pointer ${
                isCurrent
                  ? 'bg-[#d28a4c] text-[#140d0a] shadow-sm font-bold'
                  : 'text-[#dcd1c4] hover:text-[#f5efe6] hover:bg-[#1a110d]'
              }`}
            >
              {p}
            </button>
          )
        })}
        <button
          onClick={() => handlePageChange(Math.min(4, page + 1))}
          aria-label="Próxima página"
          className="w-7 h-7 rounded text-xs font-bold text-[#dcd1c4] hover:text-[#f5efe6] flex items-center justify-center cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
