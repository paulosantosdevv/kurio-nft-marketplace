import React, { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Filter, RotateCcw } from 'lucide-react'

export interface NFTFiltersProps {
  currentCategory?: string
  currentPriceMin?: string
  currentPriceMax?: string
  currentNetwork?: string
  currentSortBy?: string
}

export const NFTFilters: React.FC<NFTFiltersProps> = ({
  currentCategory = 'todas',
  currentPriceMin = '',
  currentPriceMax = '',
  currentNetwork = 'todas',
  currentSortBy = 'recent',
}) => {
  const navigate = useNavigate()
  const [minPrice, setMinPrice] = useState(currentPriceMin)
  const [maxPrice, setMaxPrice] = useState(currentPriceMax)

  const categories = [
    { id: 'todas', label: 'Todas as coleções', count: 119 },
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
    { id: 'todas', label: 'Todas as redes' },
    { id: 'ethereum', label: 'Ethereum' },
    { id: 'polygon', label: 'Polygon' },
    { id: 'solana', label: 'Solana' },
  ]

  const sortOptions = [
    { id: 'recent', label: 'Listados recentemente' },
    { id: 'price-asc', label: 'Menor preço' },
    { id: 'price-desc', label: 'Maior preço' },
    { id: 'popular', label: 'Mais populares' },
  ]

  const updateSearch = (updates: Record<string, any>) => {
    navigate({
      to: '/',
      search: (prev: any) => ({
        ...prev,
        ...updates,
        page: 1, // Reset pagination on any filter change
      }),
    })
  }

  const handleApplyPrice = (e: React.FormEvent) => {
    e.preventDefault()
    updateSearch({
      priceMin: minPrice ? minPrice : undefined,
      priceMax: maxPrice ? maxPrice : undefined,
    })
  }

  const handleResetFilters = () => {
    setMinPrice('')
    setMaxPrice('')
    navigate({
      to: '/',
      search: () => ({
        page: 1,
      }),
    })
  }

  return (
    <aside className="w-full space-y-8 text-xs text-[#a69a8f]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#2d1e17]">
        <div className="flex items-center gap-2 font-bold text-[#f7f4ed] text-sm">
          <Filter className="w-4 h-4 text-[#d28a4c]" /> Filtros
        </div>
        <button
          onClick={handleResetFilters}
          className="text-xs text-[#d28a4c] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" /> Limpar
        </button>
      </div>

      {/* Ordenação */}
      <div>
        <label htmlFor="sort-by-select" className="block text-xs font-bold text-[#f7f4ed] uppercase tracking-wider mb-2">
          Ordenar por
        </label>
        <select
          id="sort-by-select"
          value={currentSortBy}
          onChange={(e) => updateSearch({ sortBy: e.target.value })}
          className="w-full bg-[#1b120e] text-[#f7f4ed] border border-[#3d2b21] rounded-lg p-2.5 text-xs focus:border-[#d28a4c] outline-none"
        >
          {sortOptions.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Coleções / Categorias */}
      <div>
        <h4 className="text-xs font-bold text-[#f7f4ed] uppercase tracking-wider mb-3">Coleções</h4>
        <div className="space-y-1">
          {categories.map((cat) => {
            const isSelected = currentCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => updateSearch({ category: cat.id === 'todas' ? undefined : cat.id })}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#241914] text-[#d28a4c] font-semibold border border-[#d28a4c]/30'
                    : 'hover:bg-[#1b120e] text-[#a69a8f]'
                }`}
              >
                <span>{cat.label}</span>
                <span className="text-[11px] text-[#786b62]">({cat.count})</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Faixa de Preço */}
      <div>
        <h4 className="text-xs font-bold text-[#f7f4ed] uppercase tracking-wider mb-3">Faixa de preço (ETH)</h4>
        <form onSubmit={handleApplyPrice} className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Mín"
              type="number"
              step="0.01"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="py-1.5 text-xs"
            />
            <Input
              placeholder="Máx"
              type="number"
              step="0.01"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="py-1.5 text-xs"
            />
          </div>
          <Button type="submit" variant="secondary" size="sm" className="w-full text-xs">
            Aplicar
          </Button>
        </form>
      </div>

      {/* Redes */}
      <div>
        <h4 className="text-xs font-bold text-[#f7f4ed] uppercase tracking-wider mb-3">Rede Blockchain</h4>
        <div className="space-y-1.5">
          {networks.map((net) => {
            const isSelected = currentNetwork === net.id
            return (
              <label
                key={net.id}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-[#1b120e] cursor-pointer"
              >
                <input
                  type="radio"
                  name="network"
                  value={net.id}
                  checked={isSelected}
                  onChange={() => updateSearch({ network: net.id === 'todas' ? undefined : net.id })}
                  className="accent-[#d28a4c]"
                />
                <span className={isSelected ? 'text-[#f7f4ed] font-medium' : 'text-[#a69a8f]'}>
                  {net.label}
                </span>
              </label>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
