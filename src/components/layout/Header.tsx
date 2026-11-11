import React, { useState } from 'react'
import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { Search, ShoppingBag, User, Wallet, LogOut, Menu, X, LogIn } from 'lucide-react'

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const { count, setIsOpen } = useCart()
  const [searchValue, setSearchValue] = useState('')
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname
  const isHome = currentPath === '/'
  const isMarket = currentPath.startsWith('/nft') || currentPath.startsWith('/carrinho') || currentPath.startsWith('/pagamento') || currentPath.startsWith('/confirmacao')

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      navigate({
        to: '/',
        search: (prev: any) => ({
          ...prev,
          search: searchValue.trim(),
          page: 1,
        }),
      })
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-[#140d0a] border-b border-[#241712]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Link
            to="/"
            className="text-xl sm:text-2xl font-black tracking-widest text-[#f7f4ed] hover:text-[#d28a4c] transition-colors font-mono"
          >
            KURIO
          </Link>
        </div>

        {/* Center: Navigation Links matching Figma Desktop/Início */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10 text-xs font-mono">
          <Link
            to="/"
            className={`relative py-6 font-bold transition-colors ${
              isHome ? 'text-[#d28a4c]' : 'text-[#d8d4cf] hover:text-[#f7f4ed]'
            }`}
          >
            Início
            {isHome && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#d28a4c]" />
            )}
          </Link>
          <Link
            to="/carrinho"
            className={`relative py-6 font-bold transition-colors ${
              isMarket ? 'text-[#d28a4c]' : 'text-[#d8d4cf] hover:text-[#f7f4ed]'
            }`}
          >
            Mercado
            {isMarket && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#d28a4c]" />
            )}
          </Link>
          <span className="py-6 text-[#d8d4cf] hover:text-[#f7f4ed] transition-colors cursor-pointer">
            Criadores
          </span>
          <span className="py-6 text-[#d8d4cf] hover:text-[#f7f4ed] transition-colors cursor-pointer">
            Aprenda
          </span>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              placeholder="Buscar NFTs, coleções..."
              aria-label="Buscar NFTs e coleções"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="bg-[#1c1410] text-[#f7f4ed] text-xs font-mono border border-[#2d1e17] rounded-xl pl-8 pr-3 py-1.5 w-32 sm:w-44 focus:w-56 focus:outline-none focus:border-[#d28a4c] placeholder-[#a69a8f] transition-all"
            />
            <Search className="w-3.5 h-3.5 text-[#a69a8f] absolute left-2.5 pointer-events-none" />
          </form>

          {/* Cart Icon with Badge */}
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Abrir carrinho de NFTs"
            className="relative text-[#a69a8f] hover:text-[#f7f4ed] p-1.5 transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5 text-[#f7f4ed]" />
            <span aria-hidden="true" className="absolute -top-1 -right-1 bg-[#d28a4c] text-[#140d0a] text-[10px] font-bold font-mono w-4 h-4 rounded-full flex items-center justify-center">
              {count}
            </span>
          </button>

          {/* Auth Button / Profile Menu */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-[#1c1410] transition-colors cursor-pointer"
              >
                <img
                  src={user.avatarUrl || '/assets/nfts/card_1_emerald_ape.png'}
                  alt={user.displayName}
                  className="w-8 h-8 rounded-full object-cover border border-[#d28a4c]"
                />
                <span className="text-xs font-mono font-bold text-[#f7f4ed]">
                  {user.displayName}
                </span>
              </button>

              {isProfileDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 bg-[#1c1410] border border-[#2d1e17] rounded-xl shadow-2xl p-2 z-50 text-xs font-mono text-[#f7f4ed]"
                  onMouseLeave={() => setIsProfileDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-[#241712] mb-1">
                    <p className="font-bold truncate">{user.displayName}</p>
                    <p className="text-[10px] text-[#d28a4c] truncate">{user.ensName || user.email}</p>
                  </div>
                  <Link
                    to="/perfil"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#241712] text-[#8a7b70] hover:text-[#f7f4ed]"
                  >
                    <User className="w-3.5 h-3.5" /> Meu Perfil
                  </Link>
                  <Link
                    to="/carteiras"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#241712] text-[#8a7b70] hover:text-[#f7f4ed]"
                  >
                    <Wallet className="w-3.5 h-3.5" /> Carteiras
                  </Link>
                  <button
                    onClick={() => {
                      setIsProfileDropdownOpen(false)
                      logout()
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#241712] text-red-400 hover:text-red-300 text-left cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <button className="bg-[#d28a4c] hover:bg-[#e0985a] text-[#140d0a] font-mono text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-sm">
                <LogIn className="w-3.5 h-3.5" />
                <span>Entrar</span>
              </button>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Abrir menu"
            className="md:hidden text-[#8a7b70] hover:text-[#f7f4ed] p-1"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#1c1410] border-b border-[#2d1e17] px-4 py-3 space-y-3 text-xs font-mono">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Buscar NFTs, coleções..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full bg-[#140d0a] text-[#f7f4ed] text-xs font-mono border border-[#2d1e17] rounded-xl pl-8 pr-3 py-2 focus:outline-none focus:border-[#d28a4c]"
            />
            <Search className="w-3.5 h-3.5 text-[#8a7b70] absolute left-2.5 top-2.5" />
          </form>

          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block py-1.5 text-[#f7f4ed] font-bold">
            Início
          </Link>
          <Link to="/carrinho" onClick={() => setIsMobileMenuOpen(false)} className="block py-1.5 text-[#8a7b70]">
            Mercado
          </Link>
          <span className="block py-1.5 text-[#8a7b70]">Criadores</span>
          <span className="block py-1.5 text-[#8a7b70]">Aprenda</span>
        </div>
      )}
    </header>
  )
}
