import React from 'react'
import { NFTItem } from '../../types/nft'
import { NFTCard } from './NFTCard'
import { Skeleton } from '../ui/Skeleton'
import { Button } from '../ui/Button'
import { useNavigate } from '@tanstack/react-router'
import { AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'

export interface NFTGridProps {
  nfts: NFTItem[]
  isLoading: boolean
  isError: boolean
  error?: any
  refetch: () => void
  total: number
  page: number
  totalPages: number
}

export const NFTGrid: React.FC<NFTGridProps> = ({
  nfts,
  isLoading,
  isError,
  error,
  refetch,
  page,
  totalPages,
}) => {
  const navigate = useNavigate()

  const handlePageChange = (newPage: number) => {
    navigate({
      to: '/',
      search: (prev: any) => ({
        ...prev,
        page: newPage,
      }),
    })
    window.scrollTo({ top: 400, behavior: 'smooth' })
  }

  // Loading State with Shimmer Skeletons
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="bg-[#1b120e] border border-[#2d1e17] rounded-2xl overflow-hidden flex flex-col"
          >
            {/* Shimmer Image */}
            <Skeleton className="w-full aspect-square" />
            {/* Shimmer Info */}
            <div className="p-4 space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
              <div className="pt-3 border-t border-[#2d1e17] flex justify-between">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Error State
  if (isError) {
    return (
      <div className="min-h-96 flex flex-col items-center justify-center text-center p-8 bg-[#1b120e] border border-red-900/30 rounded-2xl">
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
        <h3 className="text-lg font-bold text-[#f7f4ed] mb-1">Falha na consulta do catálogo</h3>
        <p className="text-xs text-[#a69a8f] max-w-md mb-6">
          {error?.response?.data?.message || 'Ocorreu um erro ao carregar as obras digitais. Tente novamente.'}
        </p>
        <Button onClick={() => refetch()} variant="secondary" size="sm">
          Recarregar Ativos
        </Button>
      </div>
    )
  }

  // Empty State
  if (nfts.length === 0) {
    return (
      <div className="min-h-96 flex flex-col items-center justify-center text-center p-8 bg-[#1b120e] border border-[#2d1e17] rounded-2xl">
        <p className="text-base font-semibold text-[#f7f4ed] mb-1">Nenhum NFT localizado</p>
        <p className="text-xs text-[#a69a8f] max-w-sm mb-6">
          Não encontramos nenhum ativo que corresponda aos filtros de busca e categoria selecionados.
        </p>
        <Button
          onClick={() => navigate({ to: '/', search: () => ({ page: 1 }) })}
          variant="outline"
          size="sm"
        >
          Limpar Filtros de Busca
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {nfts.map((nft) => (
          <NFTCard key={nft.id} nft={nft} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-6 border-t border-[#2d1e17]">
          <Button
            variant="secondary"
            size="sm"
            disabled={page <= 1}
            onClick={() => handlePageChange(page - 1)}
            aria-label="Página anterior"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
          </Button>

          <span className="text-xs text-[#a69a8f] font-medium px-4">
            Página <strong className="text-[#f7f4ed]">{page}</strong> de{' '}
            <strong className="text-[#f7f4ed]">{totalPages}</strong>
          </span>

          <Button
            variant="secondary"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => handlePageChange(page + 1)}
            aria-label="Próxima página"
          >
            Próxima <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  )
}
