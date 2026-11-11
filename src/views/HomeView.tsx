import React from 'react'
import { HeroBanner } from '../components/home/HeroBanner'
import { NFTFilters } from '../components/nfts/NFTFilters'
import { NFTGrid } from '../components/nfts/NFTGrid'
import { PromoBanners } from '../components/home/PromoBanners'
import { MintDiary } from '../components/home/MintDiary'
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
    <div className="space-y-4">
      {/* 1. Hero Section */}
      <HeroBanner />

      {/* 2. Main Catalog Grid & Filters */}
      <section id="catalogo" className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Filters & Featured Sidebar Card */}
          <div className="lg:col-span-3">
            <NFTFilters
              currentCategory={category}
              currentPriceMin={priceMin}
              currentPriceMax={priceMax}
              currentNetwork={network}
            />
          </div>

          {/* Right Column: Catalog Grid */}
          <div className="lg:col-span-9">
            <NFTGrid
              nfts={data?.items || []}
              isLoading={isLoading}
              isError={isError}
              error={error}
              refetch={refetch}
              total={data?.total || 0}
              page={page}
              totalPages={data?.totalPages || 1}
              sortBy={sortBy}
            />
          </div>
        </div>
      </section>

      {/* 3. Promo Banners: Lançamentos Gênesis & Arte Digital */}
      <PromoBanners />

      {/* 4. Diário da Cunhagem (Articles Grid) */}
      <MintDiary />
    </div>
  )
}
