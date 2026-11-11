import React, { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { Search, ShoppingBag, LogIn, User, Wallet, LogOut, Menu, X } from 'lucide-react'

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const { count, setIsOpen } = useCart()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

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
      setIsSearchOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-[#140d0a] border-b border-[#241712]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Left: Logo */}
        <Link to="/" className="text-xl font-black tracking-wider text-[#f5efe6] hover:text-[#d28a4c] transition-colors font-heading">
          KURIO
        </Link>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium">
          <Link
            to="/"
            className="relative py-2 text-[#f5efe6] font-semibold"
          >
            Início
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#d28a4c] rounded-full" />
          </Link>
          <a
            href="#catalogo"
            className="py-2 text-[#8a7b70] hover:text-[#f5efe6] transition-colors"
          >
            Mercado
          </a>
          <span className="py-2 text-[#8a7b70] hover:text-[#f5efe6] transition-colors cursor-pointer">
            Criadores
          </span>
          <span className="py-2 text-[#8a7b70] hover:text-[#f5efe6] transition-colors cursor-pointer">
            Aprenda
          </span>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Search Toggle / Input */}
          <div className="relative">
            {isSearchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                  type="text"
                  placeholder="Buscar NFTs, coleções..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  autoFocus
                  className="bg-[#1a110d] text-[#f5efe6] text-xs border border-[#3d281e] rounded-full pl-8 pr-3 py-1.5 w-48 sm:w-64 focus:outline-none focus:border-[#d28a4c]"
                />
                <Search className="w-3.5 h-3.5 text-[#8a7b70] absolute left-2.5 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="ml-1 text-[#8a7b70] hover:text-white p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                aria-label="Buscar"
                className="text-[#8a7b70] hover:text-[#f5efe6] p-1.5 transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Cart Icon with Badge */}
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Carrinho"
            className="relative text-[#8a7b70] hover:text-[#f5efe6] p-1.5 transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 bg-[#d28a4c] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {count}
            </span>
          </button>

          {/* Auth State */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-[#1a110d] transition-colors cursor-pointer"
              >
                <img
                  src={user.avatarUrl || '/assets/avatars/default-avatar.png'}
                  alt={user.displayName}
                  className="w-7 h-7 rounded-full object-cover border border-[#d28a4c]"
                />
                <span className="hidden sm:inline text-xs font-medium text-[#f5efe6]">
                  {user.displayName}
                </span>
              </button>

              {isProfileDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 bg-[#1a110d] border border-[#2d1c15] rounded-xl shadow-2xl p-2 z-50 text-xs text-[#f5efe6]"
                  onMouseLeave={() => setIsProfileDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-[#241712] mb-1">
                    <p className="font-bold truncate">{user.displayName}</p>
                    <p className="text-[10px] text-[#d28a4c] truncate">{user.ensName || user.email}</p>
                  </div>
                  <Link
                    to="/perfil"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#241712] text-[#8a7b70] hover:text-[#f5efe6]"
                  >
                    <User className="w-3.5 h-3.5" /> Meu Perfil
                  </Link>
                  <Link
                    to="/carteiras"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#241712] text-[#8a7b70] hover:text-[#f5efe6]"
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
              <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#d28a4c] hover:bg-[#b87438] text-white text-xs font-semibold tracking-wide transition-colors cursor-pointer">
                <LogIn className="w-3.5 h-3.5" />
                <span>Entrar</span>
              </button>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-[#8a7b70] hover:text-white p-1"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#1a110d] border-b border-[#2d1c15] px-4 py-3 space-y-2 text-xs">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block py-1.5 text-[#f5efe6]">
            Início
          </Link>
          <a href="#catalogo" onClick={() => setIsMobileMenuOpen(false)} className="block py-1.5 text-[#8a7b70]">
            Mercado
          </a>
          <span className="block py-1.5 text-[#8a7b70]">Criadores</span>
          <span className="block py-1.5 text-[#8a7b70]">Aprenda</span>
        </div>
      )}
    </header>
  )
}
