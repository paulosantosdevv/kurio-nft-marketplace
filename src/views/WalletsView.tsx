import React, { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useAuth } from '../context/AuthContext'
import { walletsApi } from '../api/client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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
  CheckCircle2,
  Trash2,
} from 'lucide-react'

export const WalletsView: React.FC = () => {
  const { logout } = useAuth()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  // Form Fields matching Figma
  const [displayName, setDisplayName] = useState('')
  const [walletNickname, setWalletNickname] = useState('')
  const [selectedNetwork, setSelectedNetwork] = useState<'ethereum' | 'polygon' | 'solana'>('ethereum')
  const [profileName, setProfileName] = useState('')
  const [address, setAddress] = useState('')
  const [secondaryEns, setSecondaryEns] = useState('')
  const [walletType, setWalletType] = useState('MetaMask')
  const [referralCode, setReferralCode] = useState('')
  const [email, setEmail] = useState('')
  const [ensName, setEnsName] = useState('')

  const [sameAsPrimary, setSameAsPrimary] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Fetch wallets
  const { data: wallets = [] } = useQuery({
    queryKey: ['wallets'],
    queryFn: () => walletsApi.getWallets(),
  })

  // Add Mutation
  const addMutation = useMutation({
    mutationFn: () =>
      walletsApi.addWallet({
        name: displayName || 'Nova Carteira',
        address,
        network: selectedNetwork,
        type: walletType as any,
        isPrimary: wallets.length === 0,
        nickname: walletNickname,
        ensName,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
      setSuccessMsg('Carteira vinculada com sucesso!')
      setDisplayName('')
      setAddress('')
      setWalletNickname('')
      setEnsName('')
      setTimeout(() => setSuccessMsg(null), 3500)
    },
  })

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => walletsApi.deleteWallet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!address.trim()) return
    addMutation.mutate()
  }

  const handleLogout = async () => {
    await logout()
    navigate({ to: '/' })
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
                className="w-full flex items-center gap-3 px-3.5 py-3 text-[#8a7b70] hover:text-[#f7f4ed] transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Dados do perfil</span>
              </Link>

              <Link
                to="/carteiras"
                className="w-full flex items-center gap-3 px-3.5 py-3 border-l-2 border-[#d28a4c] bg-[#1a110d] text-[#f7f4ed] font-bold"
              >
                <MapPin className="w-4 h-4 text-[#d28a4c]" />
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

          {/* Right Content: Carteiras matching Figma Desktop/Carteiras */}
          <main className="col-span-12 md:col-span-9 space-y-8 font-mono text-xs">
            {/* Carteira Principal */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h1 className="text-base font-mono font-bold text-[#f7f4ed] tracking-wider">
                  Carteira principal
                </h1>
                <button
                  type="button"
                  onClick={() => {
                    setDisplayName('MetaMask Principal')
                    setAddress('0x7A42b89f81203a293e918239019e8b1031409042')
                  }}
                  className="text-xs font-mono text-[#d28a4c] hover:underline cursor-pointer"
                >
                  Adicionar
                </button>
              </div>
              <p className="text-xs text-[#8a7b70] mb-6">
                Estas carteiras ficam disponíveis no pagamento e para receber NFTs comprados.
              </p>

              {successMsg && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-xl flex items-center gap-2 text-xs text-emerald-300 mb-6">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* 2-Column Form Fields */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                  {/* Row 1 */}
                  <div>
                    <label className="text-[#f7f4ed] block mb-2 font-mono">
                      Nome de exibição<span className="text-[#d28a4c]">*</span>
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Nome de exibição (ex: MetaMask Principal)"
                      className="w-full bg-[#18110d] border border-[#2d1e17] rounded-lg px-4 py-3 text-[#f7f4ed] placeholder-[#6e5d52] focus:outline-none focus:border-[#d28a4c]"
                    />
                  </div>
                  <div>
                    <label className="text-[#f7f4ed] block mb-2 font-mono">
                      Apelido da carteira<span className="text-[#d28a4c]">*</span>
                    </label>
                    <input
                      type="text"
                      value={walletNickname}
                      onChange={(e) => setWalletNickname(e.target.value)}
                      className="w-full bg-[#18110d] border border-[#2d1e17] rounded-lg px-4 py-3 text-[#f7f4ed] placeholder-[#6e5d52] focus:outline-none focus:border-[#d28a4c]"
                    />
                  </div>

                  {/* Row 2 */}
                  <div>
                    <label className="text-[#f7f4ed] block mb-2 font-mono">
                      Rede <span className="text-[#d28a4c]">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={selectedNetwork}
                        onChange={(e) => setSelectedNetwork(e.target.value as any)}
                        className="w-full bg-[#18110d] border border-[#2d1e17] rounded-lg px-4 py-3 text-[#f7f4ed] appearance-none focus:outline-none focus:border-[#d28a4c] cursor-pointer"
                      >
                        <option value="ethereum">Selecione uma rede</option>
                        <option value="ethereum">Ethereum</option>
                        <option value="polygon">Polygon</option>
                        <option value="solana">Solana</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-[#8a7b70] absolute right-3 top-3.5 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[#f7f4ed] block mb-2 font-mono">
                      Nome do perfil<span className="text-[#d28a4c]">*</span>
                    </label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full bg-[#18110d] border border-[#2d1e17] rounded-lg px-4 py-3 text-[#f7f4ed] placeholder-[#6e5d52] focus:outline-none focus:border-[#d28a4c]"
                    />
                  </div>

                  {/* Row 3 */}
                  <div>
                    <label className="text-[#f7f4ed] block mb-2 font-mono">
                      Endereço da carteira<span className="text-[#d28a4c]">*</span>
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="0x..."
                      className="w-full bg-[#18110d] border border-[#2d1e17] rounded-lg px-4 py-3 text-[#f7f4ed] placeholder-[#6e5d52] font-mono text-xs focus:outline-none focus:border-[#d28a4c]"
                    />
                  </div>
                  <div>
                    <label className="text-transparent block mb-2 select-none">ENS</label>
                    <input
                      type="text"
                      value={secondaryEns}
                      onChange={(e) => setSecondaryEns(e.target.value)}
                      placeholder="ENS ou carteira secundária (opcional)"
                      className="w-full bg-[#18110d] border border-[#2d1e17] rounded-lg px-4 py-3 text-[#f7f4ed] placeholder-[#6e5d52] focus:outline-none focus:border-[#d28a4c]"
                    />
                  </div>

                  {/* Row 4 */}
                  <div>
                    <label className="text-[#f7f4ed] block mb-2 font-mono">
                      Tipo de carteira<span className="text-[#d28a4c]">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={walletType}
                        onChange={(e) => setWalletType(e.target.value)}
                        className="w-full bg-[#18110d] border border-[#2d1e17] rounded-lg px-4 py-3 text-[#f7f4ed] appearance-none focus:outline-none focus:border-[#d28a4c] cursor-pointer"
                      >
                        <option value="MetaMask">Selecione uma carteira</option>
                        <option value="MetaMask">MetaMask</option>
                        <option value="Coinbase">Coinbase</option>
                        <option value="WalletConnect">WalletConnect</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-[#8a7b70] absolute right-3 top-3.5 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[#f7f4ed] block mb-2 font-mono">
                      Código de indicação<span className="text-[#d28a4c]">*</span>
                    </label>
                    <input
                      type="text"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value)}
                      className="w-full bg-[#18110d] border border-[#2d1e17] rounded-lg px-4 py-3 text-[#f7f4ed] placeholder-[#6e5d52] focus:outline-none focus:border-[#d28a4c]"
                    />
                  </div>

                  {/* Row 5 */}
                  <div>
                    <label className="text-[#f7f4ed] block mb-2 font-mono">
                      E-mail<span className="text-[#d28a4c]">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#18110d] border border-[#2d1e17] rounded-lg px-4 py-3 text-[#f7f4ed] placeholder-[#6e5d52] focus:outline-none focus:border-[#d28a4c]"
                    />
                  </div>
                  <div>
                    <label className="text-[#f7f4ed] block mb-2 font-mono">
                      Nome ENS <span className="text-[#d28a4c]">*</span>
                    </label>
                    <div className="flex">
                      <div className="bg-[#1c1410] border border-[#2d1e17] border-r-0 rounded-l-lg px-3 py-3 flex items-center gap-1 text-[#8a7b70]">
                        <span>.eth</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="text"
                        value={ensName}
                        onChange={(e) => setEnsName(e.target.value)}
                        className="flex-1 bg-[#18110d] border border-[#2d1e17] rounded-r-lg px-4 py-3 text-[#f7f4ed] placeholder-[#6e5d52] focus:outline-none focus:border-[#d28a4c]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={addMutation.isPending}
                    aria-label="Salvar Carteira"
                    className="bg-[#d28a4c] hover:bg-[#e0985a] text-[#140d0a] font-bold px-8 py-3 rounded-lg text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    {addMutation.isPending ? 'Salvando...' : 'Salvar carteira'}
                  </button>
                </div>
              </form>

              {/* Display list of linked wallets */}
              {wallets.length > 0 && (
                <div className="mt-8 pt-6 border-t border-[#241712] space-y-3">
                  <h3 className="font-bold text-[#f7f4ed] text-xs">Carteiras Conectadas:</h3>
                  <div className="space-y-2">
                    {wallets.map((w) => (
                      <div
                        key={w.id}
                        className="flex justify-between items-center bg-[#1c1410] border border-[#2d1e17] rounded-xl p-3.5"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#f7f4ed]">{w.name}</span>
                            {w.isPrimary && (
                              <span className="text-[10px] bg-[#d28a4c]/20 text-[#d28a4c] px-2 py-0.5 rounded font-bold">
                                Principal
                              </span>
                            )}
                          </div>
                          <p className="font-mono text-[11px] text-[#8a7b70] mt-0.5">{w.address}</p>
                        </div>
                        <button
                          onClick={() => deleteMutation.mutate(w.id)}
                          className="text-[#8a7b70] hover:text-red-400 p-1 cursor-pointer"
                          aria-label={`Remover carteira ${w.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Carteira Secundária */}
            <div className="pt-8 border-t border-[#241712] space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-mono font-bold text-[#f7f4ed] tracking-wider">
                  Carteira secundária
                </h3>
                <div className="flex items-center gap-4">
                  <label
                    onClick={() => setSameAsPrimary(!sameAsPrimary)}
                    className="inline-flex items-center gap-2 text-xs font-mono text-[#8a7b70] cursor-pointer select-none"
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        sameAsPrimary ? 'border-[#d28a4c]' : 'border-[#5e4b3e]'
                      }`}
                    >
                      {sameAsPrimary && <span className="w-1.5 h-1.5 rounded-full bg-[#d28a4c]" />}
                    </span>
                    <span>Igual à carteira principal</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setDisplayName('Carteira Secundária')
                      setAddress('0x3D1182A1B8C92130F92837190283A11894019E82')
                    }}
                    className="text-xs font-mono text-[#d28a4c] hover:underline cursor-pointer"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
              <p className="text-xs text-[#8a7b70]">
                Você ainda não adicionou uma carteira secundária.
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
