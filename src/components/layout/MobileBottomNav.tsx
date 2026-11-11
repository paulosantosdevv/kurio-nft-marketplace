import React from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { Home, Heart, Scan, ShoppingBag, User } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'

export const MobileBottomNav: React.FC = () => {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname
  const { count } = useCart()
  const { isAuthenticated } = useAuth()

  // The curved bottom dock only appears on the mobile home screen (Mobile/Início.png)
  if (currentPath !== '/') {
    return null
  }

  return (
    <nav
      aria-label="Navegação móvel inferior"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#1c1410] border-t border-[#2d1e17] px-6 py-2.5 flex items-center justify-between md:hidden shadow-2xl"
    >
      {/* 1. Home */}
      <Link
        to="/"
        className={`flex flex-col items-center justify-center p-2 min-w-[44px] min-h-[44px] transition-colors ${
          currentPath === '/' ? 'text-[#d28a4c]' : 'text-[#dcd1c4] hover:text-[#f7f4ed]'
        }`}
        aria-label="Página Inicial"
      >
        <Home className="w-5 h-5" />
      </Link>

      {/* 2. Favoritos / Lista */}
      <Link
        to={isAuthenticated ? '/perfil' : '/login'}
        className="flex flex-col items-center justify-center p-2 min-w-[44px] min-h-[44px] text-[#dcd1c4] hover:text-[#f7f4ed] transition-colors"
        aria-label="Favoritos"
      >
        <Heart className="w-5 h-5" />
      </Link>

      {/* 3. Center Elevated Scanner Button */}
      <div className="relative -top-4">
        <Link
          to="/"
          className="w-12 h-12 rounded-full bg-[#d28a4c] hover:bg-[#e0985a] flex items-center justify-center text-[#140d0a] shadow-lg border-2 border-[#140d0a] transition-transform active:scale-95"
          aria-label="Escanear ou Explorar Coleções"
        >
          <Scan className="w-5 h-5 text-[#140d0a]" />
        </Link>
      </div>

      {/* 4. Carrinho */}
      <Link
        to="/carrinho"
        className={`relative flex flex-col items-center justify-center p-2 min-w-[44px] min-h-[44px] transition-colors ${
          currentPath.startsWith('/carrinho') ? 'text-[#d28a4c]' : 'text-[#dcd1c4] hover:text-[#f7f4ed]'
        }`}
        aria-label="Carrinho de NFTs"
      >
        <ShoppingBag className="w-5 h-5" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#d28a4c] text-[#140d0a] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-mono">
            {count}
          </span>
        )}
      </Link>

      {/* 5. Perfil */}
      <Link
        to={isAuthenticated ? '/perfil' : '/login'}
        className={`flex flex-col items-center justify-center p-2 min-w-[44px] min-h-[44px] transition-colors ${
          currentPath.startsWith('/perfil') || currentPath.startsWith('/carteiras')
            ? 'text-[#d28a4c]'
            : 'text-[#dcd1c4] hover:text-[#f7f4ed]'
        }`}
        aria-label="Perfil do Usuário"
      >
        <User className="w-5 h-5" />
      </Link>
    </nav>
  )
}
