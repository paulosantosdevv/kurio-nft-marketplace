import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useAuth } from '../context/AuthContext'
import { profileApi } from '../api/client'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import {
  User,
  Wallet,
  Activity,
  Heart,
  Tag,
  Download,
  HelpCircle,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Camera,
} from 'lucide-react'

export const ProfileView: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading, logout, refreshUser } = useAuth()
  const navigate = useNavigate()

  const [displayName, setDisplayName] = useState('')
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [ensName, setEnsName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  // Password state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Feedback
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isSavingPassword, setIsSavingPassword] = useState(false)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate({ to: '/login', search: { redirect: '/perfil' } })
    }
  }, [authLoading, isAuthenticated, navigate])

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '')
      setNickname(user.nickname || '')
      setEmail(user.email || '')
      setEnsName(user.ensName || '')
      setAvatarUrl(user.avatarUrl || '/assets/avatars/default-avatar.png')
    }
  }, [user])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileError(null)
    setProfileSuccess(null)
    setIsSavingProfile(true)

    try {
      await profileApi.updateProfile({
        displayName,
        nickname,
        email,
        ensName,
        avatarUrl,
      })
      await refreshUser()
      setProfileSuccess('Dados cadastrais salvos com sucesso!')
      setTimeout(() => setProfileSuccess(null), 3500)
    } catch (err: any) {
      setProfileError(err.response?.data?.message || 'Falha ao atualizar dados do perfil.')
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError(null)
    setPasswordSuccess(null)

    if (newPassword !== confirmPassword) {
      setPasswordError('As senhas digitadas não coincidem.')
      return
    }

    if (newPassword.length < 6) {
      setPasswordError('A nova senha deve ter no mínimo 6 caracteres.')
      return
    }

    setIsSavingPassword(true)

    try {
      await profileApi.changePassword({ currentPassword, newPassword })
      setPasswordSuccess('Senha alterada com sucesso!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setPasswordSuccess(null), 3500)
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || 'A senha atual está incorreta.')
    } finally {
      setIsSavingPassword(false)
    }
  }

  if (authLoading || !user) {
    return <div className="p-20 text-center text-[#a69a8f]">Carregando perfil...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Sidebar Menu */}
        <aside className="md:col-span-4 lg:col-span-3 space-y-2">
          <div className="p-4 bg-[#1b120e] border border-[#2d1e17] rounded-2xl mb-4 flex items-center gap-3">
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-12 h-12 rounded-full object-cover border border-[#d28a4c]"
            />
            <div className="overflow-hidden">
              <h3 className="font-bold text-[#f7f4ed] text-sm truncate">{displayName}</h3>
              <p className="text-xs text-[#d28a4c] truncate">{ensName || email}</p>
            </div>
          </div>

          <nav className="space-y-1 text-xs">
            <Link
              to="/perfil"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#241914] text-[#d28a4c] font-semibold border border-[#d28a4c]/30"
            >
              <User className="w-4 h-4" /> Dados do perfil
            </Link>
            <Link
              to="/carteiras"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#1b120e] text-[#a69a8f] hover:text-[#f7f4ed] transition-colors"
            >
              <Wallet className="w-4 h-4" /> Carteiras
            </Link>
            <span className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#786b62] cursor-not-allowed">
              <Activity className="w-4 h-4" /> Atividade
            </span>
            <span className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#786b62] cursor-not-allowed">
              <Heart className="w-4 h-4" /> Lista de interesse
            </span>
            <span className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#786b62] cursor-not-allowed">
              <Tag className="w-4 h-4" /> Ofertas
            </span>
            <span className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#786b62] cursor-not-allowed">
              <Download className="w-4 h-4" /> Arquivos baixados
            </span>
            <span className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#786b62] cursor-not-allowed">
              <HelpCircle className="w-4 h-4" /> Suporte
            </span>
            <button
              onClick={() => logout()}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-[#241914] hover:text-red-300 transition-colors text-left cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Sair da conta
            </button>
          </nav>
        </aside>

        {/* Right Main Profile Content */}
        <main className="md:col-span-8 lg:col-span-9 space-y-8">
          <div className="bg-[#1b120e] border border-[#2d1e17] rounded-3xl p-6 sm:p-8 space-y-8">
            <div>
              <h2 className="text-xl font-black text-[#f7f4ed] tracking-tight">
                Dados do Colecionador
              </h2>
              <p className="text-xs text-[#a69a8f] mt-1">
                Atualize suas informações visíveis no mercado e identidade pública.
              </p>
            </div>

            {/* Avatar Section */}
            <div className="flex items-center gap-6 pb-6 border-b border-[#2d1e17]">
              <div className="relative">
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#d28a4c]"
                />
                <label className="absolute bottom-0 right-0 p-1.5 bg-[#d28a4c] rounded-full text-white cursor-pointer hover:bg-[#b87438]">
                  <Camera className="w-3.5 h-3.5" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const fakeUrl = URL.createObjectURL(file)
                        setAvatarUrl(fakeUrl)
                      }
                    }}
                  />
                </label>
              </div>
              <div className="space-y-1 text-xs">
                <h4 className="font-bold text-[#f7f4ed]">Foto de Perfil</h4>
                <p className="text-[#786b62]">JPG, PNG ou GIF. Máximo de 5MB.</p>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setAvatarUrl('/assets/avatars/default-avatar.png')}
                    className="text-[11px] text-[#a69a8f] hover:text-red-400 cursor-pointer"
                  >
                    Restaurar avatar padrão
                  </button>
                </div>
              </div>
            </div>

            {/* Feedback messages */}
            {profileSuccess && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-xl flex items-center gap-2 text-xs text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{profileSuccess}</span>
              </div>
            )}
            {profileError && (
              <div className="p-3 bg-red-950/40 border border-red-800/50 rounded-xl flex items-center gap-2 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{profileError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Nome de exibição"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                />
                <Input
                  label="Apelido da carteira"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="E-mail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  label="Nome ENS (.eth)"
                  value={ensName}
                  onChange={(e) => setEnsName(e.target.value)}
                  placeholder="ex: seunome.eth"
                />
              </div>

              <Button type="submit" size="md" isLoading={isSavingProfile}>
                Salvar Alterações
              </Button>
            </form>

            {/* Change Password Section */}
            <div className="pt-8 border-t border-[#2d1e17] space-y-4">
              <div>
                <h3 className="text-base font-bold text-[#f7f4ed]">Alterar Senha</h3>
                <p className="text-xs text-[#a69a8f]">
                  Atualize sua senha de segurança para proteger seus ativos digitais.
                </p>
              </div>

              {passwordSuccess && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-xl flex items-center gap-2 text-xs text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{passwordSuccess}</span>
                </div>
              )}
              {passwordError && (
                <div className="p-3 bg-red-950/40 border border-red-800/50 rounded-xl flex items-center gap-2 text-xs text-red-300">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                <Input
                  label="Senha atual"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <Input
                  label="Nova senha"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <Input
                  label="Confirmar nova senha"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Button type="submit" variant="secondary" size="md" isLoading={isSavingPassword}>
                  Atualizar Senha
                </Button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
