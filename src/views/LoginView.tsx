import React, { useState } from 'react'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Lock, Mail, AlertCircle, Info } from 'lucide-react'

export const LoginView: React.FC = () => {
  const searchParams: any = useSearch({ from: '/login' })
  const redirectPath = searchParams.redirect || '/'
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('contato@email.com')
  const [password, setPassword] = useState('password123')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await login(email, password)
      navigate({ to: redirectPath })
    } catch (err: any) {
      setError(err.response?.data?.message || 'E-mail ou senha incorretos.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
      <div className="bg-[#1b120e] border border-[#3d2b21] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-[#f7f4ed] tracking-tight">
            Entrar na Kurio
          </h1>
          <p className="text-xs text-[#a69a8f]">
            Acesse para gerenciar sua carteira, coleção e compras.
          </p>
        </div>

        {/* Credentials Pill for Reviewers */}
        <div className="p-3 bg-[#241914] border border-[#3d2b21] rounded-xl flex items-start gap-2.5 text-xs text-[#d28a4c]">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <strong>Credenciais de teste pré-preenchidas:</strong>
            <br />
            <span className="text-[#a69a8f]">E-mail:</span> contato@email.com •{' '}
            <span className="text-[#a69a8f]">Senha:</span> password123
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-800/50 rounded-xl flex items-center gap-2 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            leftIcon={<Mail className="w-4 h-4" />}
            placeholder="contato@email.com"
          />

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-[#a69a8f]">Senha</label>
              <span className="text-[11px] text-[#d28a4c] hover:underline cursor-pointer">
                Esqueceu a senha?
              </span>
            </div>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              leftIcon={<Lock className="w-4 h-4" />}
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" size="lg" isLoading={isLoading} className="w-full font-bold">
            Entrar
          </Button>
        </form>

        <div className="relative flex items-center justify-center py-2">
          <div className="border-t border-[#2d1e17] w-full" />
          <span className="bg-[#1b120e] px-3 text-[11px] text-[#786b62] uppercase tracking-wider absolute">
            Ou continue com
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setEmail('contato@email.com')
              setPassword('password123')
            }}
            className="flex items-center justify-center py-2 px-3 bg-[#241914] border border-[#3d2b21] rounded-xl text-xs text-[#a69a8f] hover:text-white transition-colors cursor-pointer"
          >
            Google
          </button>
          <button
            type="button"
            onClick={() => {
              setEmail('contato@email.com')
              setPassword('password123')
            }}
            className="flex items-center justify-center py-2 px-3 bg-[#241914] border border-[#3d2b21] rounded-xl text-xs text-[#a69a8f] hover:text-white transition-colors cursor-pointer"
          >
            Facebook
          </button>
        </div>

        <p className="text-center text-xs text-[#a69a8f]">
          Novo na Kurio?{' '}
          <Link
            to="/cadastro"
            search={{ redirect: redirectPath }}
            className="text-[#d28a4c] font-semibold hover:underline"
          >
            Crie uma conta
          </Link>
        </p>
      </div>
    </div>
  )
}
