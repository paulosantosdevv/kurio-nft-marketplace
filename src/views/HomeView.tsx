import React from 'react'
import { HeroBanner } from '../components/home/HeroBanner'
import { NFTFilters } from '../components/nfts/NFTFilters'
import { NFTGrid } from '../components/nfts/NFTGrid'
import { PromoBanners } from '../components/home/PromoBanners'
import { MintDiary } from '../components/home/MintDiary'
import { useQuery } from '@tanstack/react-query'
import { nftsApi } from '../api/client'
import { useSearch, useNavigate } from '@tanstack/react-router'
import { Search, SlidersHorizontal } from 'lucide-react'

export const HomeView: React.FC = () => {
  const navigate = useNavigate()
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

  const handleMobileSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const input = (form.elements.namedItem('mobile_search') as HTMLInputElement)?.value
    navigate({
      to: '/',
      search: (prev: any) => ({
        ...prev,
        search: input ? input.trim() : undefined,
        page: 1,
      }),
    })
  }

  return (
    <div className="space-y-4">
      {/* Mobile Search Bar matching Mobile/Início.png */}
      <div className="block md:hidden px-4 pt-3">
        <div className="flex items-center gap-3">
          <form onSubmit={handleMobileSearchSubmit} className="relative flex-1">
            <input
              type="text"
              name="mobile_search"
              placeholder="Explorar coleções"
              defaultValue={search || ''}
              className="w-full bg-[#1c1410] text-[#f7f4ed] border border-[#2d1e17] rounded-xl pl-9 pr-3 py-2 text-xs font-mono placeholder-[#6e5d52] focus:outline-none focus:border-[#d28a4c]"
            />
            <Search className="w-4 h-4 text-[#8a7b70] absolute left-3 top-2.5 pointer-events-none" />
          </form>
          <button
            onClick={() => {
              const filtersEl = document.getElementById('catalogo')
              filtersEl?.scrollIntoView({ behavior: 'smooth' })
            }}
            aria-label="Filtros"
            className="w-9 h-9 rounded-xl bg-[#d28a4c] hover:bg-[#e0985a] flex items-center justify-center text-[#140d0a] shrink-0 transition-colors shadow-md cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 1. Hero Section */}
      <HeroBanner />

      {/* 2. Main Catalog Grid & Filters */}
      <section id="catalogo" aria-label="Catálogo de NFTs" className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h2 className="sr-only">Catálogo de Obras e Filtros</h2>
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
