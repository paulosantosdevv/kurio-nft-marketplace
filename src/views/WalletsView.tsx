import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useAuth } from '../context/AuthContext'
import { walletsApi } from '../api/client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import {
  User,
  Wallet as WalletIcon,
  Activity,
  Heart,
  Tag,
  Download,
  HelpCircle,
  LogOut,
  Trash2,
  CheckCircle2,
  Plus,
} from 'lucide-react'

export const WalletsView: React.FC = () => {
  const { user, logout } = useAuth()
  const queryClient = useQueryClient()

  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [network, setNetwork] = useState<'ethereum' | 'polygon' | 'solana'>('ethereum')
  const [type, setType] = useState<'MetaMask' | 'Coinbase' | 'WalletConnect'>('MetaMask')
  const [nickname, setNickname] = useState('')
  const [ensName, setEnsName] = useState('')
  const [isPrimary, setIsPrimary] = useState(false)
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
        name,
        address,
        network,
        type,
        isPrimary,
        nickname,
        ensName,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
      setSuccessMsg('Carteira vinculada com sucesso!')
      setName('')
      setAddress('')
      setNickname('')
      setEnsName('')
      setIsPrimary(false)
      setTimeout(() => setSuccessMsg(null), 3000)
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
    addMutation.mutate()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Sidebar */}
        <aside className="md:col-span-4 lg:col-span-3 space-y-2">
          <div className="p-4 bg-[#1b120e] border border-[#2d1e17] rounded-2xl mb-4 flex items-center gap-3">
            <img
              src={user?.avatarUrl || '/assets/avatars/default-avatar.png'}
              alt={user?.displayName}
              className="w-12 h-12 rounded-full object-cover border border-[#d28a4c]"
            />
            <div className="overflow-hidden">
              <h3 className="font-bold text-[#f7f4ed] text-sm truncate">{user?.displayName}</h3>
              <p className="text-xs text-[#d28a4c] truncate">{user?.ensName || user?.email}</p>
            </div>
          </div>

          <nav className="space-y-1 text-xs">
            <Link
              to="/perfil"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#1b120e] text-[#a69a8f] hover:text-[#f7f4ed] transition-colors"
            >
              <User className="w-4 h-4" /> Dados do perfil
            </Link>
            <Link
              to="/carteiras"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#241914] text-[#d28a4c] font-semibold border border-[#d28a4c]/30"
            >
              <WalletIcon className="w-4 h-4" /> Carteiras
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

        {/* Wallets Content */}
        <main className="md:col-span-8 lg:col-span-9 space-y-8">
          {/* Add Wallet Form */}
          <div className="bg-[#1b120e] border border-[#2d1e17] rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-black text-[#f7f4ed] tracking-tight">
                Vincular Nova Carteira
              </h2>
              <p className="text-xs text-[#a69a8f] mt-1">
                Estas carteiras ficam disponíveis no checkout e para receber a transferência direta dos tokens comprados.
              </p>
            </div>

            {successMsg && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-xl flex items-center gap-2 text-xs text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Nome da carteira"
                  placeholder="ex: MetaMask Principal"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <div>
                  <label className="text-xs font-medium text-[#a69a8f] block mb-1.5">
                    Rede Blockchain
                  </label>
                  <select
                    value={network}
                    onChange={(e) => setNetwork(e.target.value as any)}
                    className="w-full bg-[#1b120e] text-[#f7f4ed] border border-[#3d2b21] rounded-lg px-3.5 py-2.5 text-xs focus:border-[#d28a4c] outline-none"
                  >
                    <option value="ethereum">Ethereum (Mainnet)</option>
                    <option value="polygon">Polygon</option>
                    <option value="solana">Solana</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Endereço da carteira"
                  placeholder="0x..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
                <div>
                  <label className="text-xs font-medium text-[#a69a8f] block mb-1.5">
                    Tipo de Carteira
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-[#1b120e] text-[#f7f4ed] border border-[#3d2b21] rounded-lg px-3.5 py-2.5 text-xs focus:border-[#d28a4c] outline-none"
                  >
                    <option value="MetaMask">MetaMask</option>
                    <option value="Coinbase">Coinbase Wallet</option>
                    <option value="WalletConnect">WalletConnect</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Apelido da carteira (opcional)"
                  placeholder="ex: Vault Pessoal"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
                <Input
                  label="Nome ENS (.eth, opcional)"
                  placeholder="ex: colecionador.eth"
                  value={ensName}
                  onChange={(e) => setEnsName(e.target.value)}
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-[#f7f4ed] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPrimary}
                  onChange={(e) => setIsPrimary(e.target.checked)}
                  className="accent-[#d28a4c]"
                />
                <span>Definir como carteira principal padrão</span>
              </label>

              <Button type="submit" size="md" isLoading={addMutation.isPending}>
                <Plus className="w-4 h-4 mr-1.5" /> Salvar Carteira
              </Button>
            </form>
          </div>

          {/* Existing Wallets List */}
          <div className="bg-[#1b120e] border border-[#2d1e17] rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-base font-bold text-[#f7f4ed]">Carteiras Conectadas ({wallets.length})</h3>

            {wallets.length === 0 ? (
              <p className="text-xs text-[#786b62]">Nenhuma carteira vinculada.</p>
            ) : (
              <div className="space-y-3">
                {wallets.map((w) => (
                  <div
                    key={w.id}
                    className="flex items-center justify-between p-4 bg-[#241914] border border-[#2d1e17] rounded-xl"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-xs text-[#f7f4ed]">{w.name}</span>
                        {w.isPrimary ? (
                          <Badge variant="amber">Principal</Badge>
                        ) : (
                          <Badge variant="neutral">Secundária</Badge>
                        )}
                        <Badge variant={w.network}>{w.network}</Badge>
                      </div>
                      <p className="font-mono text-xs text-[#786b62]">{w.address}</p>
                      {w.ensName && (
                        <p className="text-[11px] text-[#d28a4c] mt-0.5">{w.ensName}</p>
                      )}
                    </div>

                    {!w.isPrimary && (
                      <button
                        onClick={() => deleteMutation.mutate(w.id)}
                        aria-label={`Excluir carteira ${w.name}`}
                        className="p-2 text-[#786b62] hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
