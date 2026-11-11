import React, { useState } from 'react'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Lock, Mail, User, AlertCircle } from 'lucide-react'

export const RegisterView: React.FC = () => {
  const searchParams: any = useSearch({ from: '/cadastro' })
  const redirectPath = searchParams.redirect || '/'
  const { register } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('As senhas digitadas não coincidem.')
      return
    }

    if (password.length < 6) {
      setError('A senha deve conter pelo menos 6 caracteres.')
      return
    }

    setIsLoading(true)

    try {
      await register(username, email, password)
      navigate({ to: redirectPath })
    } catch (err: any) {
      setError(err.response?.data?.message || 'Falha ao realizar cadastro.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
      <div className="bg-[#1b120e] border border-[#3d2b21] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-[#f7f4ed] tracking-tight">
            Criar Perfil de Colecionador
          </h1>
          <p className="text-xs text-[#a69a8f]">
            Crie seu perfil e conecte suas carteiras quando quiser.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-800/50 rounded-xl flex items-center gap-2 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome de usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            leftIcon={<User className="w-4 h-4" />}
            placeholder="ex: cryptokid"
          />

          <Input
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            leftIcon={<Mail className="w-4 h-4" />}
            placeholder="seu@email.com"
          />

          <Input
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            leftIcon={<Lock className="w-4 h-4" />}
            placeholder="••••••••"
          />

          <Input
            label="Confirmar senha"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            leftIcon={<Lock className="w-4 h-4" />}
            placeholder="••••••••"
          />

          <Button type="submit" size="lg" isLoading={isLoading} className="w-full font-bold">
            Criar Perfil
          </Button>
        </form>

        <p className="text-center text-xs text-[#a69a8f]">
          Já tem uma conta?{' '}
          <Link
            to="/login"
            search={{ redirect: redirectPath }}
            className="text-[#d28a4c] font-semibold hover:underline"
          >
            Entre
          </Link>
        </p>
      </div>
    </div>
  )
}
