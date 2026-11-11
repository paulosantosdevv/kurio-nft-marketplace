import React from 'react'
import { HeroBanner } from '../components/home/HeroBanner'
import { NFTFilters } from '../components/nfts/NFTFilters'
import { NFTGrid } from '../components/nfts/NFTGrid'
import { useQuery } from '@tanstack/react-query'
import { nftsApi } from '../api/client'
import { useSearch } from '@tanstack/react-router'

export const HomeView: React.FC = () => {
  const searchParams: any = useSearch({ from: '/' })

  const category = searchParams.category
  const search = searchParams.search
  const priceMin = searchParams.priceMin
  const priceMax = searchParams.priceMax
  const network = searchParams.network
  const sortBy = searchParams.sortBy || 'recent'
  const page = searchParams.page ? Number(searchParams.page) : 1

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['nfts', { category, search, priceMin, priceMax, network, sortBy, page }],
    queryFn: () =>
      nftsApi.getNFTs({
        category,
        search,
        priceMin,
        priceMax,
        network,
        sortBy,
        page,
        limit: 9,
      }),
    staleTime: 1000 * 60,
  })

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <HeroBanner />

      {/* Catalog & Filter Section */}
      <section id="catalogo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Left Sidebar Filters */}
          <div className="w-full md:w-64 lg:w-72 shrink-0">
            <NFTFilters
              currentCategory={category}
              currentPriceMin={priceMin}
              currentPriceMax={priceMax}
              currentNetwork={network}
              currentSortBy={sortBy}
            />
          </div>

          {/* Right Cards Grid */}
          <div className="flex-1 min-w-0">
            {/* Header info */}
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#2d1e17]">
              <div>
                <h2 className="text-xl font-bold text-[#f7f4ed]">Explorar Obras</h2>
                <p className="text-xs text-[#a69a8f] mt-0.5">
                  {data ? `${data.total} obras disponíveis na plataforma` : 'Carregando acervo...'}
                </p>
              </div>
            </div>

            <NFTGrid
              nfts={data?.items || []}
              isLoading={isLoading}
              isError={isError}
              error={error}
              refetch={refetch}
              total={data?.total || 0}
              page={page}
              totalPages={data?.totalPages || 1}
            />
          </div>
        </div>
      </section>
    </div>
  )
}
