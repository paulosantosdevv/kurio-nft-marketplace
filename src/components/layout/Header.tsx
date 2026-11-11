import React, { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { Search, ShoppingBag, Menu, X, User, Wallet, LogOut } from 'lucide-react'
import { Button } from '../ui/Button'

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const { count, setIsOpen } = useCart()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const navigate = useNavigate()

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate({
      to: '/',
      search: (prev: any) => ({
        ...prev,
        search: searchValue.trim() || undefined,
        page: 1,
      }),
    })
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-[#140d0a]/90 backdrop-blur-md border-b border-[#2d1e17]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-black tracking-widest text-[#f7f4ed] group-hover:text-[#d28a4c] transition-colors">
              KURIO
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#d28a4c]" />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#a69a8f]">
            <Link
              to="/"
              className="hover:text-[#f7f4ed] transition-colors"
              activeProps={{ className: 'text-[#d28a4c] font-semibold' }}
            >
              Início
            </Link>
            <Link
              to="/"
              className="hover:text-[#f7f4ed] transition-colors"
            >
              Mercado
            </Link>
            <span className="hover:text-[#f7f4ed] cursor-pointer transition-colors">Criadores</span>
            <span className="hover:text-[#f7f4ed] cursor-pointer transition-colors">Aprenda</span>
          </nav>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center flex-1 max-w-xs relative">
          <Search className="w-4 h-4 text-[#786b62] absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar NFTs, criadores..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full bg-[#1b120e] text-[#f7f4ed] placeholder:text-[#786b62] border border-[#3d2b21] rounded-full pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-[#d28a4c] transition-colors"
          />
        </form>

        {/* Right Actions: Cart & Auth */}
        <div className="flex items-center gap-3">
          {/* Cart Button */}
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Abrir carrinho de NFTs"
            className="relative p-2.5 rounded-full bg-[#1b120e] border border-[#3d2b21] hover:border-[#d28a4c] text-[#f7f4ed] transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#d28a4c] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#140d0a]">
                {count}
              </span>
            )}
          </button>

          {/* Auth State */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                aria-expanded={isProfileDropdownOpen}
                aria-label="Menu do perfil"
                className="flex items-center gap-2.5 p-1.5 rounded-full hover:bg-[#1b120e] border border-transparent hover:border-[#3d2b21] transition-colors cursor-pointer"
              >
                <img
                  src={user.avatarUrl || '/assets/avatars/default-avatar.png'}
                  alt={user.displayName}
                  className="w-8 h-8 rounded-full object-cover border border-[#d28a4c]"
                />
                <span className="hidden sm:inline text-xs font-semibold text-[#f7f4ed]">
                  {user.displayName}
                </span>
              </button>

              {/* Profile Dropdown */}
              {isProfileDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-[#1b120e] border border-[#3d2b21] rounded-xl shadow-2xl p-2 z-50 text-xs text-[#f7f4ed] animate-in fade-in zoom-in-95"
                  onMouseLeave={() => setIsProfileDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-[#2d1e17] mb-1">
                    <p className="font-bold truncate text-[#f7f4ed]">{user.displayName}</p>
                    <p className="text-[11px] text-[#d28a4c] truncate">{user.ensName || user.email}</p>
                  </div>
                  <Link
                    to="/perfil"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#241914] text-[#a69a8f] hover:text-[#f7f4ed] transition-colors"
                  >
                    <User className="w-4 h-4" /> Dados do perfil
                  </Link>
                  <Link
                    to="/carteiras"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#241914] text-[#a69a8f] hover:text-[#f7f4ed] transition-colors"
                  >
                    <Wallet className="w-4 h-4" /> Carteiras
                  </Link>
                  <button
                    onClick={() => {
                      setIsProfileDropdownOpen(false)
                      logout()
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#241914] text-red-400 hover:text-red-300 transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" /> Sair da conta
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <Button size="sm" variant="primary" className="text-xs font-semibold px-4">
                Entrar
              </Button>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu de navegação mobile"
            className="md:hidden p-2 text-[#a69a8f] hover:text-[#f7f4ed]"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#1b120e] border-b border-[#3d2b21] p-4 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-[#786b62] absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Buscar NFTs, criadores..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full bg-[#140d0a] text-[#f7f4ed] border border-[#3d2b21] rounded-lg pl-10 pr-3 py-2 text-xs"
            />
          </form>
          <nav className="flex flex-col gap-2 text-sm text-[#a69a8f]">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded hover:bg-[#241914] hover:text-[#f7f4ed]"
            >
              Início
            </Link>
            <Link
              to="/perfil"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded hover:bg-[#241914] hover:text-[#f7f4ed]"
            >
              Meu perfil
            </Link>
            <Link
              to="/carteiras"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded hover:bg-[#241914] hover:text-[#f7f4ed]"
            >
              Carteiras
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
