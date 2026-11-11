import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from '@tanstack/react-router'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useQuery, useMutation } from '@tanstack/react-query'
import { walletsApi, cartApi, ordersApi } from '../api/client'
import {
  ChevronLeft,
  XCircle,
  AlertTriangle,
  ChevronDown,
} from 'lucide-react'

export const CheckoutView: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const { items, clearCart } = useCart()
  const navigate = useNavigate()

  // Form Fields matching Figma
  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [profileName, setProfileName] = useState('')
  const [selectedNetwork, setSelectedNetwork] = useState<'ethereum' | 'polygon' | 'solana'>('ethereum')
  const [walletAddress, setWalletAddress] = useState('')
  const [ensSecondary, setEnsSecondary] = useState('')
  const [walletType, setWalletType] = useState('MetaMask')
  const [referralCode, setReferralCode] = useState('')
  const [email, setEmail] = useState('')
  const [ensName, setEnsName] = useState('')
  const [useOtherWallet, setUseOtherWallet] = useState(false)
  const [collectorNote, setCollectorNote] = useState('')

  // Promo Code
  const [showCouponInput, setShowCouponInput] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [couponError, setCouponError] = useState<string | null>(null)

  // Warnings / Errors / Idempotency
  const [priceChangeWarning, setPriceChangeWarning] = useState<string | null>(null)
  const [priceChangeAcknowledged, setPriceChangeAcknowledged] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [idempotencyKey] = useState<string>(() => {
    const existing = sessionStorage.getItem('kurio_checkout_idempotency_key')
    if (existing) return existing
    const newKey = `idem_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    sessionStorage.setItem('kurio_checkout_idempotency_key', newKey)
    return newKey
  })

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate({ to: '/login', search: { redirect: '/pagamento' } })
    }
  }, [authLoading, isAuthenticated, navigate])

  // Pre-fill user data
  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || 'Nova Sato')
      setUsername(user.username || 'novasato')
      setProfileName(user.nickname || 'Nova Sato Profile')
      setEmail(user.email || 'contato@email.com')
      setEnsName(user.ensName || 'novasato.eth')
    }
  }, [user])

  // Fetch wallets
  const { data: wallets = [] } = useQuery({
    queryKey: ['wallets'],
    queryFn: () => walletsApi.getWallets(),
    enabled: isAuthenticated,
  })

  useEffect(() => {
    if (wallets.length > 0 && !walletAddress) {
      const primary = wallets.find((w) => w.isPrimary) || wallets[0]
      setWalletAddress(primary.address)
      setWalletType(primary.type)
      setSelectedNetwork(primary.network as any)
    } else if (!walletAddress) {
      setWalletAddress('0x7A42b89f81203a293e918239019e8b1031409042')
    }
  }, [wallets, walletAddress])

  // Quote Query
  const { data: quote, refetch: refetchQuote } = useQuery({
    queryKey: ['checkout-quote', items, appliedCoupon, selectedNetwork],
    queryFn: async () => {
      if (items.length === 0) return null
      const res = await cartApi.getQuote({
        items: items.map((i) => ({ nftId: i.nftId, quantity: i.quantity })),
        couponCode: appliedCoupon || undefined,
        network: selectedNetwork,
      })

      if (res.priceChanges && res.priceChanges.length > 0) {
        const changesText = res.priceChanges
          .map((c) => `"${c.title}" alterado de ${c.oldPrice} ETH para ${c.newPrice} ETH`)
          .join(', ')
        setPriceChangeWarning(
          `Cotação atualizada na rede: ${changesText}. Confirme a nova cotação para continuar.`
        )
        setPriceChangeAcknowledged(false)
      }

      if (res.outOfStock && res.outOfStock.length > 0) {
        const oosText = res.outOfStock
          .map((o) => `"${o.title}" (apenas ${o.available} disponíveis)`)
          .join(', ')
        setErrorMessage(`Disponibilidade alterada: ${oosText}. Atualize seu carrinho.`)
      }

      return res
    },
    enabled: items.length > 0,
  })

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!couponCode.trim()) return

    setCouponError(null)
    try {
      await cartApi.getQuote({
        items: items.map((i) => ({ nftId: i.nftId, quantity: i.quantity })),
        couponCode: couponCode.trim(),
        network: selectedNetwork,
      })
      setAppliedCoupon(couponCode.trim().toUpperCase())
      setCouponCode('')
      refetchQuote()
    } catch (err: any) {
      setCouponError(err.response?.data?.message || 'Cupom inválido ou expirado.')
    }
  }

  // Order Mutation
  const orderMutation = useMutation({
    mutationFn: async () => {
      return ordersApi.createOrder({
        items: items.map((i) => ({ nftId: i.nftId, quantity: i.quantity })),
        walletAddress: walletAddress || '0x7A42b89f81203a293e918239019e8b1031409042',
        walletType: walletType as any,
        network: selectedNetwork,
        couponCode: appliedCoupon || undefined,
        idempotencyKey,
      })
    },
    onSuccess: (order) => {
      sessionStorage.removeItem('kurio_checkout_idempotency_key')
      if (order.status === 'confirmed') {
        clearCart()
        navigate({ to: '/confirmacao/$orderId', params: { orderId: order.id } })
      } else {
        setErrorMessage(
          'O pedido foi recusado pela rede blockchain ou saldo insuficiente na carteira.'
        )
      }
    },
    onError: (err: any) => {
      setErrorMessage(
        err.response?.data?.message || 'Falha ao processar a transação. Verifique a carteira.'
      )
    },
  })

  const handleSubmitOrder = () => {
    setErrorMessage(null)
    if (priceChangeWarning && !priceChangeAcknowledged) {
      setErrorMessage('Por favor, confirme as alterações de preço antes de finalizar a compra.')
      return
    }
    orderMutation.mutate()
  }

  if (authLoading) {
    return <div className="p-20 text-center font-mono text-[#a69a8f]">Carregando sessão de pagamento...</div>
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-mono font-bold text-[#f7f4ed]">Seu carrinho está vazio</h2>
        <p className="text-xs font-mono text-[#8a7b70]">Adicione itens antes de prosseguir para o pagamento.</p>
        <Link to="/">
          <button className="bg-[#d28a4c] text-[#140d0a] font-bold px-6 py-2.5 rounded-xl text-xs uppercase cursor-pointer">
            Explorar Catálogo
          </button>
        </Link>
      </div>
    )
  }

  const subtotal = quote ? quote.subtotal : items.reduce((acc, i) => acc + parseFloat(i.unitPrice) * i.quantity, 0).toFixed(2)
  const discount = quote ? quote.discount : '00.00'
  const networkFee = quote ? quote.networkFee : '0.016'
  const total = quote ? quote.total : (parseFloat(subtotal) + parseFloat(networkFee) - parseFloat(discount)).toFixed(3)

  return (
    <div className="min-h-screen bg-[#140d0a] text-[#f7f4ed]">
      {/* Mobile Pagamento View (Figma 414px) */}
      <div className="block md:hidden">
        {/* Mobile Header */}
        <div className="flex items-center gap-4 px-5 py-4 border-b border-[#241712]">
          <Link
            to="/carrinho"
            className="w-10 h-10 rounded-full bg-[#1b120e] border border-[#3d2b21] flex items-center justify-center text-[#f7f4ed]"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-base font-mono font-bold text-[#f7f4ed]">
            Pagamento
          </h1>
        </div>

        <div className="px-5 py-6 space-y-6 pb-6">
          {errorMessage && (
            <div className="p-3 bg-red-950/40 border border-red-800/50 rounded-xl flex items-start gap-2 text-xs font-mono text-red-300">
              <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {priceChangeWarning && (
            <div className="p-3 bg-amber-950/40 border border-amber-600/50 rounded-xl space-y-2 text-xs font-mono text-amber-200">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{priceChangeWarning}</span>
              </div>
              <label className="flex items-center gap-2 pt-1 font-mono text-[#f7f4ed]">
                <input
                  type="checkbox"
                  checked={priceChangeAcknowledged}
                  onChange={(e) => setPriceChangeAcknowledged(e.target.checked)}
                  className="accent-[#d28a4c]"
                />
                <span>Aceito a cotação atualizada</span>
              </label>
            </div>
          )}

          {/* Form fields */}
          <div className="space-y-4 font-mono text-xs">
            <h3 className="font-bold text-[#f7f4ed] uppercase tracking-wider text-sm">
              Perfil do colecionador
            </h3>
            <div>
              <label className="text-[#8a7b70] block mb-1">Nome de exibição*</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-[#1c1410] border border-[#2d1e17] rounded-xl px-3 py-2.5 text-[#f7f4ed] focus:outline-none focus:border-[#d28a4c]"
              />
            </div>
            <div>
              <label className="text-[#8a7b70] block mb-1">Nome de usuário*</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#1c1410] border border-[#2d1e17] rounded-xl px-3 py-2.5 text-[#f7f4ed] focus:outline-none focus:border-[#d28a4c]"
              />
            </div>
            <div>
              <label className="text-[#8a7b70] block mb-1">E-mail*</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1c1410] border border-[#2d1e17] rounded-xl px-3 py-2.5 text-[#f7f4ed] focus:outline-none focus:border-[#d28a4c]"
              />
            </div>
          </div>

          {/* Wallet and Network */}
          <div className="space-y-3 font-mono text-xs">
            <h3 className="font-bold text-[#f7f4ed] uppercase tracking-wider text-sm">
              Carteira e rede
            </h3>
            {['MetaMask', 'Coinbase Wallet'].map((wType) => (
              <label
                key={wType}
                onClick={() => setWalletType(wType.includes('Coinbase') ? 'Coinbase' : 'MetaMask')}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${
                  (wType.includes('Coinbase') && walletType === 'Coinbase') ||
                  (!wType.includes('Coinbase') && walletType === 'MetaMask')
                    ? 'border-[#d28a4c] bg-[#1c1410]'
                    : 'border-[#2d1e17] bg-[#140d0a]'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    (wType.includes('Coinbase') && walletType === 'Coinbase') ||
                    (!wType.includes('Coinbase') && walletType === 'MetaMask')
                      ? 'border-[#d28a4c]'
                      : 'border-[#5e4b3e]'
                  }`}
                >
                  {((wType.includes('Coinbase') && walletType === 'Coinbase') ||
                    (!wType.includes('Coinbase') && walletType === 'MetaMask')) && (
                    <span className="w-2 h-2 rounded-full bg-[#d28a4c]" />
                  )}
                </span>
                <span className="font-bold text-[#f7f4ed]">{wType}</span>
              </label>
            ))}
          </div>

          {/* Summary Box */}
          <div className="bg-[#1c1410] border border-[#2d1e17] rounded-2xl p-4 space-y-3 font-mono text-xs">
            <h4 className="font-bold text-[#f7f4ed]">Seus NFTs</h4>
            <div className="space-y-2">
              {items.map((i) => (
                <div key={i.id} className="flex justify-between items-center text-[11px]">
                  <span className="text-[#a69a8f] truncate max-w-[180px]">{i.nft.title} (x{i.quantity})</span>
                  <span className="text-[#d28a4c] font-bold">{(parseFloat(i.unitPrice) * i.quantity).toFixed(2)} ETH</span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-[#2d1e17] space-y-1 text-[#8a7b70]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[#f7f4ed]">{subtotal} ETH</span>
              </div>
              <div className="flex justify-between">
                <span>Taxa de rede</span>
                <span className="text-[#f7f4ed]">{networkFee} ETH</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#f7f4ed] pt-1 border-t border-[#2d1e17]">
                <span>Total</span>
                <span className="text-[#d28a4c]">{total} ETH</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Confirm Button matching Mobile/Pagamento.png */}
        <div className="pt-4 pb-12">
          <button
            onClick={handleSubmitOrder}
            disabled={orderMutation.isPending || (priceChangeWarning !== null && !priceChangeAcknowledged)}
            className="w-full bg-[#d28a4c] hover:bg-[#e0985a] text-[#140d0a] font-bold py-4 rounded-full text-sm font-mono tracking-wider transition-colors cursor-pointer disabled:opacity-50"
          >
            {orderMutation.isPending ? 'Confirmando...' : 'Confirmar compra'}
          </button>
        </div>
      </div>

      {/* Desktop Pagamento View (Figma 1440px) */}
      <div className="hidden md:block max-w-[1280px] mx-auto px-6 lg:px-8 py-8 space-y-10">
        {/* Breadcrumb */}
        <div className="text-xs font-mono text-[#8a7b70]">
          <Link to="/" className="hover:text-[#f7f4ed] transition-colors">Início</Link>
          <span className="mx-2">/</span>
          <Link to="/carrinho" className="hover:text-[#f7f4ed] transition-colors">Mercado</Link>
          <span className="mx-2">/</span>
          <span className="text-[#a69a8f]">Pagamento</span>
        </div>

        {/* Warnings & Errors */}
        {errorMessage && (
          <div className="p-4 bg-red-950/40 border border-red-800/50 rounded-xl flex items-start gap-3 text-xs font-mono text-red-300">
            <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{errorMessage}</div>
          </div>
        )}

        {priceChangeWarning && (
          <div className="p-4 bg-amber-950/40 border border-amber-600/50 rounded-xl space-y-3 text-xs font-mono text-amber-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1">{priceChangeWarning}</div>
            </div>
            <label className="flex items-center gap-2 pt-1 font-medium text-[#f7f4ed] cursor-pointer">
              <input
                type="checkbox"
                checked={priceChangeAcknowledged}
                onChange={(e) => setPriceChangeAcknowledged(e.target.checked)}
                className="accent-[#d28a4c]"
              />
              <span>Estou ciente e aceito a cotação atualizada dos itens.</span>
            </label>
          </div>
        )}

        {/* 2-Column Grid */}
        <div className="grid grid-cols-12 gap-10 items-start">
          {/* Left Column: Perfil do Colecionador Form */}
          <div className="col-span-7 space-y-6">
            <h2 className="text-base font-mono font-bold text-[#f7f4ed] tracking-wide">
              Perfil do colecionador
            </h2>

            {/* 2-Column Fields Grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 font-mono text-xs">
              {/* Row 1 */}
              <div>
                <label className="text-[#f7f4ed] block mb-2 font-mono">
                  Nome de exibição<span className="text-[#d28a4c]">*</span>
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-[#18110d] border border-[#2d1e17] rounded-lg px-4 py-3 text-[#f7f4ed] placeholder-[#6e5d52] focus:outline-none focus:border-[#d28a4c]"
                />
              </div>
              <div>
                <label className="text-[#f7f4ed] block mb-2 font-mono">
                  Nome de usuário<span className="text-[#d28a4c]">*</span>
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="Endereço 0x da carteira"
                  className="w-full bg-[#18110d] border border-[#2d1e17] rounded-lg px-4 py-3 text-[#f7f4ed] placeholder-[#6e5d52] font-mono text-[11px] focus:outline-none focus:border-[#d28a4c]"
                />
              </div>
              <div>
                <label className="text-transparent block mb-2 select-none">ENS</label>
                <input
                  type="text"
                  value={ensSecondary}
                  onChange={(e) => setEnsSecondary(e.target.value)}
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

            {/* Checkbox / Radio "Usar outra carteira?" */}
            <div className="pt-2">
              <label
                onClick={() => setUseOtherWallet(!useOtherWallet)}
                className="inline-flex items-center gap-3 cursor-pointer select-none font-mono text-xs text-[#f7f4ed]"
              >
                <span
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    useOtherWallet ? 'border-[#d28a4c]' : 'border-[#5e4b3e]'
                  }`}
                >
                  {useOtherWallet && <span className="w-2 h-2 rounded-full bg-[#d28a4c]" />}
                </span>
                <span>Usar outra carteira?</span>
              </label>
            </div>

            {/* Textarea */}
            <div>
              <label className="text-[#f7f4ed] block mb-2 font-mono text-xs">
                Observação do colecionador (opcional)
              </label>
              <textarea
                rows={4}
                value={collectorNote}
                onChange={(e) => setCollectorNote(e.target.value)}
                className="w-full bg-[#18110d] border border-[#2d1e17] rounded-xl p-4 text-[#f7f4ed] placeholder-[#6e5d52] font-mono text-xs focus:outline-none focus:border-[#d28a4c]"
              />
            </div>
          </div>

          {/* Right Column: Seus NFTs + Breakdown + Carteira e rede */}
          <div className="col-span-5 space-y-6">
            <div className="flex justify-between items-center pb-2 border-b border-[#241712]">
              <h2 className="text-base font-mono font-bold text-[#f7f4ed]">
                Seus NFTs
              </h2>
              <span className="text-xs font-mono font-bold text-[#8a7b70]">
                Subtotal
              </span>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-[#1c1410] border border-[#2d1e17] rounded-2xl p-3.5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#ded7cb] shrink-0 border border-[#2d1e17]">
                      <img
                        src={item.nft.imageUrl}
                        alt={item.nft.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-mono font-bold text-[#f7f4ed]">
                        {item.nft.title}
                      </h4>
                      <p className="text-[11px] font-mono text-[#8a7b70]">
                        ID do token: {item.nft.tokenId || '#0042'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-[11px] text-[#8a7b70] mr-2">(x {item.quantity})</span>
                    <span className="text-xs font-bold text-[#d28a4c]">
                      {(parseFloat(item.unitPrice) * item.quantity).toFixed(2)} ETH
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code Link / Form */}
            <div>
              {!showCouponInput && !appliedCoupon ? (
                <button
                  onClick={() => setShowCouponInput(true)}
                  className="text-xs font-mono text-[#8a7b70] hover:text-[#d28a4c] transition-colors cursor-pointer"
                >
                  Tem um código promocional? Aplique aqui
                </button>
              ) : (
                <div className="space-y-2">
                  <form onSubmit={handleApplyCoupon} className="flex">
                    <input
                      type="text"
                      placeholder="Código promocional..."
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 bg-[#140d0a] border border-[#3d2b21] rounded-l-xl px-3 py-2 text-xs font-mono text-[#f7f4ed] placeholder-[#6e5d52] focus:outline-none focus:border-[#d28a4c]"
                    />
                    <button
                      type="submit"
                      className="bg-[#d28a4c] text-[#140d0a] font-bold px-4 py-2 rounded-r-xl text-xs font-mono uppercase cursor-pointer"
                    >
                      Aplicar
                    </button>
                  </form>
                  {couponError && <p className="text-[11px] font-mono text-red-400">{couponError}</p>}
                  {appliedCoupon && (
                    <p className="text-[11px] font-mono text-emerald-400">Cupom aplicado: {appliedCoupon}</p>
                  )}
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 text-xs font-mono text-[#8a7b70] pt-2 border-t border-[#241712]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[#f7f4ed]">{subtotal} ETH</span>
              </div>
              <div className="flex justify-between">
                <span>Desconto do lançamento</span>
                <span className="text-[#f7f4ed]">(-) {discount}</span>
              </div>
              <div>
                <div className="flex justify-between">
                  <span>Taxa de rede</span>
                  <span className="text-[#f7f4ed]">{networkFee} ETH</span>
                </div>
                <span className="text-[10px] text-[#5e4f45] block">Taxa estimada</span>
              </div>
              <div className="flex justify-between text-base font-black font-heading text-[#f7f4ed] pt-2 border-t border-[#241712]">
                <span>Total</span>
                <span className="text-[#d28a4c]">{total} ETH</span>
              </div>
            </div>

            {/* Carteira e rede Section */}
            <div className="space-y-3 pt-4 border-t border-[#241712]">
              <h3 className="text-xs font-mono font-bold text-[#f7f4ed] tracking-wider">
                Carteira e rede
              </h3>

              {/* Radio 1: Supported badges */}
              <div
                onClick={() => setWalletType('MetaMask')}
                className="flex items-center gap-3 p-3.5 rounded-xl border border-[#2d1e17] bg-[#140d0a] cursor-pointer hover:border-[#3d2b21]"
              >
                <span className="w-4 h-4 rounded-full border border-[#5e4b3e] flex items-center justify-center"></span>
                <span className="text-[11px] font-mono font-bold text-[#d28a4c] tracking-wider uppercase">
                  METAMASK • WALLETCONNECT • COINBASE
                </span>
              </div>

              {/* Radio 2: MetaMask */}
              <div
                onClick={() => setWalletType('MetaMask')}
                className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer ${
                  walletType === 'MetaMask'
                    ? 'border-[#d28a4c] bg-[#1c1410]'
                    : 'border-[#2d1e17] bg-[#140d0a]'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    walletType === 'MetaMask' ? 'border-[#d28a4c]' : 'border-[#5e4b3e]'
                  }`}
                >
                  {walletType === 'MetaMask' && <span className="w-2 h-2 rounded-full bg-[#d28a4c]" />}
                </span>
                <span className="text-xs font-mono text-[#f7f4ed]">MetaMask</span>
              </div>

              {/* Radio 3: Coinbase Wallet */}
              <div
                onClick={() => setWalletType('Coinbase')}
                className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer ${
                  walletType === 'Coinbase'
                    ? 'border-[#d28a4c] bg-[#1c1410]'
                    : 'border-[#2d1e17] bg-[#140d0a]'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    walletType === 'Coinbase' ? 'border-[#d28a4c]' : 'border-[#5e4b3e]'
                  }`}
                >
                  {walletType === 'Coinbase' && <span className="w-2 h-2 rounded-full bg-[#d28a4c]" />}
                </span>
                <span className="text-xs font-mono text-[#f7f4ed]">Coinbase Wallet</span>
              </div>

              {/* Confirm Purchase Button */}
              <div className="pt-2">
                <button
                  onClick={handleSubmitOrder}
                  disabled={orderMutation.isPending || (priceChangeWarning !== null && !priceChangeAcknowledged)}
                  className="w-full bg-[#d28a4c] hover:bg-[#e0985a] text-[#140d0a] font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
                >
                  {orderMutation.isPending ? 'Confirmando...' : 'Confirmar compra'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
