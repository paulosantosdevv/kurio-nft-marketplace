import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useAuth } from '../context/AuthContext'
import { profileApi } from '../api/client'
import {
  User,
  MapPin,
  ShoppingCart,
  Heart,
  TrendingUp,
  Download,
  AlertTriangle,
  LogOut,
  ChevronDown,
  Eye,
  EyeOff,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'

export const ProfileView: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading, logout, refreshUser } = useAuth()
  const navigate = useNavigate()

  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [ensName, setEnsName] = useState('')
  const [walletNickname, setWalletNickname] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPass, setShowCurrentPass] = useState(false)
  const [showNewPass, setShowNewPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)

  // Status feedback
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate({ to: '/login', search: { redirect: '/perfil' } })
    }
  }, [authLoading, isAuthenticated, navigate])

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || 'Nova Sato')
      setUsername(user.username || 'novasato')
      setEmail(user.email || 'contato@email.com')
      setEnsName(user.ensName || 'novasato.eth')
      setWalletNickname(user.nickname || 'Main Vault')
      setAvatarUrl(user.avatarUrl || '')
    }
  }, [user])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileError(null)
    setProfileSuccess(null)
    setIsSaving(true)

    try {
      await profileApi.updateProfile({
        displayName,
        username,
        email,
        ensName,
        nickname: walletNickname,
        avatarUrl,
      })

      // If new password provided
      if (newPassword) {
        if (newPassword !== confirmPassword) {
          throw new Error('As senhas não coincidem.')
        }
        await profileApi.changePassword({ currentPassword, newPassword })
      }

      await refreshUser()
      setProfileSuccess('Dados cadastrais salvos com sucesso!')
      setTimeout(() => setProfileSuccess(null), 4000)
    } catch (err: any) {
      setProfileError(err.message || err.response?.data?.message || 'Falha ao atualizar dados.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate({ to: '/' })
  }

  if (authLoading || !user) {
    return <div className="p-20 text-center font-mono text-[#a69a8f]">Carregando dados do perfil...</div>
  }

  return (
    <div className="min-h-screen bg-[#140d0a] text-[#f7f4ed]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-10">
        <div className="grid grid-cols-12 gap-10 items-start">
          {/* Left Sidebar Menu matching Figma */}
          <aside className="col-span-12 md:col-span-3 space-y-4">
            <h2 className="text-base font-mono font-bold text-[#f7f4ed] tracking-wider px-3">
              Meu perfil
            </h2>

            <nav className="space-y-1 font-mono text-xs">
              <Link
                to="/perfil"
                className="w-full flex items-center gap-3 px-3.5 py-3 border-l-2 border-[#d28a4c] bg-[#1a110d] text-[#f7f4ed] font-bold"
              >
                <User className="w-4 h-4 text-[#d28a4c]" />
                <span>Dados do perfil</span>
              </Link>

              <Link
                to="/carteiras"
                className="w-full flex items-center gap-3 px-3.5 py-3 text-[#8a7b70] hover:text-[#f7f4ed] transition-colors"
              >
                <MapPin className="w-4 h-4" />
                <span>Carteiras</span>
              </Link>

              <div className="w-full flex items-center gap-3 px-3.5 py-3 text-[#8a7b70] hover:text-[#f7f4ed] cursor-pointer">
                <ShoppingCart className="w-4 h-4" />
                <span>Atividade</span>
              </div>

              <div className="w-full flex items-center gap-3 px-3.5 py-3 text-[#8a7b70] hover:text-[#f7f4ed] cursor-pointer">
                <Heart className="w-4 h-4" />
                <span>Lista de interesse</span>
              </div>

              <div className="w-full flex items-center gap-3 px-3.5 py-3 text-[#8a7b70] hover:text-[#f7f4ed] cursor-pointer">
                <TrendingUp className="w-4 h-4" />
                <span>Ofertas</span>
              </div>

              <div className="w-full flex items-center gap-3 px-3.5 py-3 text-[#8a7b70] hover:text-[#f7f4ed] cursor-pointer">
                <Download className="w-4 h-4" />
                <span>Arquivos baixados</span>
              </div>

              <div className="w-full flex items-center gap-3 px-3.5 py-3 text-[#8a7b70] hover:text-[#f7f4ed] cursor-pointer">
                <AlertTriangle className="w-4 h-4" />
                <span>Suporte</span>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3.5 py-3 text-[#8a7b70] hover:text-red-400 transition-colors cursor-pointer text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </button>
            </nav>
          </aside>

          {/* Right Column: Perfil do Colecionador Form */}
          <main className="col-span-12 md:col-span-9 space-y-8 font-mono text-xs">
            <div>
              <h1 className="text-base font-mono font-bold text-[#f7f4ed] tracking-wider mb-6">
                Perfil do colecionador
              </h1>

              <div className="flex items-center gap-3 p-4 bg-[#18110d] border border-[#2d1e17] rounded-2xl mb-6">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-[#ded7cb] border border-[#d28a4c] shrink-0">
                  <img
                    src={avatarUrl || '/assets/nfts/card_1_emerald_ape.png'}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#f7f4ed]">{displayName}</h3>
                  <p className="text-xs text-[#d28a4c]">{ensName || email}</p>
                </div>
              </div>

              {profileSuccess && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-xl flex items-center gap-2 text-xs text-emerald-300 mb-6">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{profileSuccess}</span>
                </div>
              )}

              {profileError && (
                <div className="p-3 bg-red-950/40 border border-red-800/50 rounded-xl flex items-center gap-2 text-xs text-red-300 mb-6">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{profileError}</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-8">
                {/* 2-Column Personal Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                  {/* Row 1 */}
                  <div>
                    <label htmlFor="Nome de exibição" className="text-[#f7f4ed] block mb-2 font-mono">
                      Nome de exibição<span className="text-[#d28a4c]">*</span>
                    </label>
                    <input
                      id="Nome de exibição"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full bg-[#18110d] border border-[#2d1e17] rounded-lg px-4 py-3 text-[#f7f4ed] focus:outline-none focus:border-[#d28a4c]"
                    />
                  </div>
                  <div>
                    <label htmlFor="Nome de usuário" className="text-[#f7f4ed] block mb-2 font-mono">
                      Nome de usuário<span className="text-[#d28a4c]">*</span>
                    </label>
                    <input
                      id="Nome de usuário"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-[#18110d] border border-[#2d1e17] rounded-lg px-4 py-3 text-[#f7f4ed] focus:outline-none focus:border-[#d28a4c]"
                    />
                  </div>

                  {/* Row 2 */}
                  <div>
                    <label htmlFor="E-mail" className="text-[#f7f4ed] block mb-2 font-mono">
                      E-mail<span className="text-[#d28a4c]">*</span>
                    </label>
                    <input
                      id="E-mail"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#18110d] border border-[#2d1e17] rounded-lg px-4 py-3 text-[#f7f4ed] focus:outline-none focus:border-[#d28a4c]"
                    />
                  </div>
                  <div>
                    <label htmlFor="Nome ENS" className="text-[#f7f4ed] block mb-2 font-mono">
                      Nome ENS <span className="text-[#d28a4c]">*</span>
                    </label>
                    <div className="flex">
                      <div className="bg-[#1c1410] border border-[#2d1e17] border-r-0 rounded-l-lg px-3 py-3 flex items-center gap-1 text-[#8a7b70]">
                        <span>.eth</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </div>
                      <input
                        id="Nome ENS"
                        type="text"
                        value={ensName}
                        onChange={(e) => setEnsName(e.target.value)}
                        className="flex-1 bg-[#18110d] border border-[#2d1e17] rounded-r-lg px-4 py-3 text-[#f7f4ed] focus:outline-none focus:border-[#d28a4c]"
                      />
                    </div>
                  </div>

                  {/* Row 3 */}
                  <div>
                    <label htmlFor="Apelido da carteira" className="text-[#f7f4ed] block mb-2 font-mono">
                      Apelido da carteira<span className="text-[#d28a4c]">*</span>
                    </label>
                    <input
                      id="Apelido da carteira"
                      type="text"
                      value={walletNickname}
                      onChange={(e) => setWalletNickname(e.target.value)}
                      className="w-full bg-[#18110d] border border-[#2d1e17] rounded-lg px-4 py-3 text-[#f7f4ed] focus:outline-none focus:border-[#d28a4c]"
                    />
                  </div>
                  <div>
                    <label className="text-[#f7f4ed] block mb-2 font-mono">Avatar</label>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#1c1410] border border-[#2d1e17] flex items-center justify-center text-[#8a7b70] overflow-hidden">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-5 h-5" />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setAvatarUrl('/assets/nfts/card_1_emerald_ape.png')}
                        className="bg-[#d28a4c] hover:bg-[#e0985a] text-[#140d0a] font-bold px-5 py-2 rounded-lg text-xs cursor-pointer transition-colors"
                      >
                        Alterar
                      </button>
                      <button
                        type="button"
                        onClick={() => setAvatarUrl('')}
                        className="text-xs text-[#8a7b70] hover:text-white transition-colors cursor-pointer"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </div>

                {/* Alterar Senha Section */}
                <div className="space-y-5 pt-6 border-t border-[#241712]">
                  <h3 className="text-sm font-mono font-bold text-[#f7f4ed] tracking-wider">
                    Alterar senha
                  </h3>

                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="text-[#8a7b70] block mb-1">Senha atual</label>
                      <div className="relative">
                        <input
                          type={showCurrentPass ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full bg-[#18110d] border border-[#2d1e17] rounded-lg px-4 py-3 pr-10 text-[#f7f4ed] focus:outline-none focus:border-[#d28a4c]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPass(!showCurrentPass)}
                          className="absolute right-3 top-3.5 text-[#8a7b70] hover:text-[#f7f4ed]"
                        >
                          {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-[#8a7b70] block mb-1">Nova senha</label>
                      <div className="relative">
                        <input
                          type={showNewPass ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full bg-[#18110d] border border-[#2d1e17] rounded-lg px-4 py-3 pr-10 text-[#f7f4ed] focus:outline-none focus:border-[#d28a4c]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPass(!showNewPass)}
                          className="absolute right-3 top-3.5 text-[#8a7b70] hover:text-[#f7f4ed]"
                        >
                          {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-[#8a7b70] block mb-1">Confirmar nova senha</label>
                      <div className="relative">
                        <input
                          type={showConfirmPass ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full bg-[#18110d] border border-[#2d1e17] rounded-lg px-4 py-3 pr-10 text-[#f7f4ed] focus:outline-none focus:border-[#d28a4c]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPass(!showConfirmPass)}
                          className="absolute right-3 top-3.5 text-[#8a7b70] hover:text-[#f7f4ed]"
                        >
                          {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    aria-label="Salvar Alterações"
                    className="bg-[#d28a4c] hover:bg-[#e0985a] text-[#140d0a] font-bold px-8 py-3 rounded-lg text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
