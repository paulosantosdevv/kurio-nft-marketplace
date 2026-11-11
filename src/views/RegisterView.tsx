import React, { useState } from 'react'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useAuth } from '../context/AuthContext'
import { X, Eye, EyeOff, AlertCircle } from 'lucide-react'

export const RegisterView: React.FC = () => {
  const searchParams: any = useSearch({ from: '/cadastro' })
  const redirectPath = searchParams.redirect || '/'
  const { register } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    setIsLoading(true)

    try {
      await register(username, email, password)
      navigate({ to: redirectPath })
    } catch (err: any) {
      setError(err.response?.data?.message || 'Falha ao realizar cadastro. Tente outro e-mail.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#140d0a]/90 backdrop-blur-sm">
      {/* Centered Modal Card matching Figma Desktop/Cadastro */}
      <div className="relative w-full max-w-md bg-[#1c1410] border border-[#2d1e17] rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6 font-mono text-xs border-b-4 border-b-[#d28a4c]">
        {/* Close Button top-right */}
        <Link
          to="/"
          className="absolute top-6 right-6 text-[#8a7b70] hover:text-[#f7f4ed] transition-colors p-1"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </Link>

        {/* Logo & Header Tabs matching Mobile/Cadastro.png */}
        <div className="text-center pt-2">
          <Link
            to="/"
            className="text-2xl font-black tracking-widest text-[#f7f4ed] hover:text-[#d28a4c] transition-colors font-mono block mb-4"
          >
            KURIO
          </Link>
          <div className="inline-flex items-center gap-1.5 text-base sm:text-lg font-bold">
            <Link
              to="/login"
              search={{ redirect: redirectPath }}
              className="text-[#f7f4ed] hover:text-[#d28a4c] transition-colors"
            >
              Entrar
            </Link>
            <span className="text-[#8a7b70]">|</span>
            <span className="text-[#d28a4c]">Criar conta</span>
          </div>
          <p className="text-xs text-[#8a7b70] mt-3 leading-relaxed">
            Crie seu perfil de colecionador e conecte uma carteira quando quiser.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-800/50 rounded-xl flex items-center gap-2 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nome de usuário (ex: cryptokid)"
              required
              className="w-full bg-[#140d0a] border border-[#2d1e17] rounded-xl px-4 py-3 text-[#f7f4ed] placeholder-[#6e5d52] focus:outline-none focus:border-[#d28a4c]"
            />
          </div>

          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
              required
              className="w-full bg-[#140d0a] border border-[#2d1e17] rounded-xl px-4 py-3 text-[#f7f4ed] placeholder-[#6e5d52] focus:outline-none focus:border-[#d28a4c]"
            />
          </div>

          <div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
                required
                className="w-full bg-[#140d0a] border border-[#2d1e17] rounded-xl px-4 py-3 pr-10 text-[#f7f4ed] placeholder-[#6e5d52] focus:outline-none focus:border-[#d28a4c]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-[#8a7b70] hover:text-[#f7f4ed]"
                aria-label="Alternar visibilidade da senha"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmar senha"
              required
              className="w-full bg-[#140d0a] border border-[#2d1e17] rounded-xl px-4 py-3 text-[#f7f4ed] placeholder-[#6e5d52] focus:outline-none focus:border-[#d28a4c]"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            aria-label="Criar Perfil"
            className="w-full bg-[#d28a4c] hover:bg-[#e0985a] text-[#140d0a] font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            {isLoading ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center py-1">
          <div className="border-t border-[#241712] w-full" />
          <span className="bg-[#1c1410] px-3 text-[11px] text-[#6e5d52] absolute">
            Ou continue com
          </span>
        </div>

        {/* Social Logins */}
        <div className="space-y-2.5">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-[#140d0a] border border-[#2d1e17] hover:border-[#3d2b21] rounded-xl text-xs text-[#f7f4ed] transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continuar com Google</span>
          </button>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-[#140d0a] border border-[#2d1e17] hover:border-[#3d2b21] rounded-xl text-xs text-[#f7f4ed] transition-colors cursor-pointer"
          >
            <span className="w-4 h-4 rounded-full bg-[#1877F2] text-white flex items-center justify-center text-[10px] font-bold">
              f
            </span>
            <span>Continuar com Facebook</span>
          </button>
        </div>
      </div>
    </div>
  )
}
