import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from '@tanstack/react-router'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useQuery, useMutation } from '@tanstack/react-query'
import { walletsApi, cartApi, ordersApi } from '../api/client'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import {
  Wallet as WalletIcon,
  AlertTriangle,
  ChevronLeft,
  XCircle,
  Tag,
  Lock,
} from 'lucide-react'

export const CheckoutView: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const { items, clearCart } = useCart()
  const navigate = useNavigate()

  // State
  const [selectedWalletId, setSelectedWalletId] = useState<string>('')
  const [selectedNetwork, setSelectedNetwork] = useState<'ethereum' | 'polygon' | 'solana'>('ethereum')
  const [walletConnected, setWalletConnected] = useState<boolean>(true)
  const [collectorNote, setCollectorNote] = useState<string>('')
  const [couponCode, setCouponCode] = useState<string>('')
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [couponError, setCouponError] = useState<string | null>(null)

  // Revalidation and Change Warning State
  const [priceChangeWarning, setPriceChangeWarning] = useState<string | null>(null)
  const [priceChangeAcknowledged, setPriceChangeAcknowledged] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Stable Idempotency Key (persisted in session per checkout attempt to prevent duplicates)
  const [idempotencyKey] = useState<string>(() => {
    const existing = sessionStorage.getItem('kurio_checkout_idempotency_key')
    if (existing) return existing
    const newKey = `idem_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    sessionStorage.setItem('kurio_checkout_idempotency_key', newKey)
    return newKey
  })

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate({ to: '/login', search: { redirect: '/pagamento' } })
    }
  }, [authLoading, isAuthenticated, navigate])

  // Fetch Wallets
  const { data: wallets = [] } = useQuery({
    queryKey: ['wallets'],
    queryFn: () => walletsApi.getWallets(),
    enabled: isAuthenticated,
  })

  // Auto-select primary wallet
  useEffect(() => {
    if (wallets.length > 0 && !selectedWalletId) {
      const primary = wallets.find((w) => w.isPrimary) || wallets[0]
      setSelectedWalletId(primary.id)
      setSelectedNetwork(primary.network as any)
    }
  }, [wallets, selectedWalletId])

  // Real-time Quote Query
  const { data: quote, refetch: refetchQuote } = useQuery({
    queryKey: ['checkout-quote', items, appliedCoupon, selectedNetwork],
    queryFn: async () => {
      if (items.length === 0) return null
      const res = await cartApi.getQuote({
        items: items.map((i) => ({ nftId: i.nftId, quantity: i.quantity })),
        couponCode: appliedCoupon || undefined,
        network: selectedNetwork,
      })

      // Check for price changes
      if (res.priceChanges && res.priceChanges.length > 0) {
        const changesText = res.priceChanges
          .map((c) => `"${c.title}" alterado de ${c.oldPrice} ETH para ${c.newPrice} ETH`)
          .join(', ')
        setPriceChangeWarning(
          `Cotação atualizada na rede: ${changesText}. É necessário confirmar a nova cotação antes de enviar.`
        )
        setPriceChangeAcknowledged(false)
      }

      // Check for out of stock
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

  // Handle Coupon
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

  // Order Submission Mutation
  const orderMutation = useMutation({
    mutationFn: async () => {
      const activeWallet = wallets.find((w) => w.id === selectedWalletId)
      return ordersApi.createOrder({
        items: items.map((i) => ({ nftId: i.nftId, quantity: i.quantity })),
        walletAddress: activeWallet?.address || '0x7A42b89f81203a293e918239019e8b1031409042',
        walletType: activeWallet?.type || 'MetaMask',
        network: selectedNetwork,
        couponCode: appliedCoupon || undefined,
        idempotencyKey,
      })
    },
    onSuccess: (order) => {
      // Clear checkout key and cart
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
        err.response?.data?.message || 'Falha ao processar a transação. Verifique a conexão com a carteira.'
      )
    },
  })

  const handleSubmitOrder = () => {
    setErrorMessage(null)
    if (!walletConnected) {
      setErrorMessage('A carteira está desconectada. Conecte sua carteira para continuar.')
      return
    }

    if (priceChangeWarning && !priceChangeAcknowledged) {
      setErrorMessage('Por favor, confirme as alterações de preço antes de finalizar a compra.')
      return
    }

    orderMutation.mutate()
  }

  if (authLoading) {
    return <div className="p-20 text-center text-[#a69a8f]">Carregando sessão de checkout...</div>
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-[#f7f4ed]">Seu carrinho está vazio</h2>
        <p className="text-xs text-[#a69a8f]">Adicione itens antes de prosseguir para o pagamento.</p>
        <Link to="/">
          <Button variant="primary">Explorar Catálogo</Button>
        </Link>
      </div>
    )
  }

  const subtotal = quote ? quote.subtotal : '0.0000'
  const discount = quote ? quote.discount : '0.0000'
  const networkFee = quote ? quote.networkFee : '0.0045'
  const total = quote ? quote.total : '0.0000'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb Back */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#a69a8f] hover:text-[#f7f4ed] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Início / Mercado / Pagamento
        </Link>
      </div>

      <div className="border-b border-[#2d1e17] pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-[#f7f4ed] tracking-tight">
          Finalizar Pedido de NFTs
        </h1>
        <p className="text-xs text-[#a69a8f] mt-1">
          Revise os detalhes, conecte sua carteira Web3 e assine a transação na rede.
        </p>
      </div>

      {/* Warnings & Errors */}
      {errorMessage && (
        <div className="p-4 bg-red-950/40 border border-red-800/50 rounded-xl flex items-start gap-3 text-xs text-red-300">
          <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{errorMessage}</div>
        </div>
      )}

      {priceChangeWarning && (
        <div className="p-4 bg-amber-950/40 border border-amber-600/50 rounded-xl space-y-3 text-xs text-amber-200">
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form & Wallet Selection */}
        <div className="lg:col-span-7 space-y-6">
          {/* Dados do Colecionador */}
          <div className="bg-[#1b120e] border border-[#2d1e17] rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-[#f7f4ed] uppercase tracking-wider">
              Dados do Colecionador
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nome de usuário"
                value={user?.username || ''}
                disabled
                className="opacity-75"
              />
              <Input
                label="E-mail"
                value={user?.email || ''}
                disabled
                className="opacity-75"
              />
            </div>
            <Input
              label="Observação do colecionador (opcional)"
              placeholder="Notas ou instruções sobre o recebimento..."
              value={collectorNote}
              onChange={(e) => setCollectorNote(e.target.value)}
            />
          </div>

          {/* Seleção de Carteira e Rede */}
          <div className="bg-[#1b120e] border border-[#2d1e17] rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#f7f4ed] uppercase tracking-wider flex items-center gap-2">
                <WalletIcon className="w-4 h-4 text-[#d28a4c]" /> Carteira e Rede
              </h3>
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    walletConnected ? 'bg-emerald-500' : 'bg-red-500'
                  }`}
                />
                <span className="text-xs text-[#a69a8f]">
                  {walletConnected ? 'Conectada' : 'Desconectada'}
                </span>
                <button
                  type="button"
                  onClick={() => setWalletConnected(!walletConnected)}
                  className="text-xs text-[#d28a4c] underline hover:text-[#e0985a] ml-2 cursor-pointer"
                >
                  {walletConnected ? 'Desconectar' : 'Conectar'}
                </button>
              </div>
            </div>

            {/* Wallets Radio List */}
            <div className="space-y-3">
              <span className="text-xs text-[#a69a8f] block font-medium">Selecione a Carteira para Envio:</span>
              {wallets.length === 0 ? (
                <div className="p-4 bg-[#241914] rounded-xl text-xs text-[#a69a8f]">
                  Nenhuma carteira cadastrada. Usando carteira simulada padrão.
                </div>
              ) : (
                wallets.map((w) => (
                  <label
                    key={w.id}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-colors cursor-pointer ${
                      selectedWalletId === w.id
                        ? 'bg-[#241914] border-[#d28a4c]'
                        : 'bg-[#140d0a] border-[#2d1e17] hover:border-[#3d2b21]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="wallet"
                        value={w.id}
                        checked={selectedWalletId === w.id}
                        onChange={() => {
                          setSelectedWalletId(w.id)
                          setSelectedNetwork(w.network as any)
                        }}
                        className="accent-[#d28a4c]"
                      />
                      <div>
                        <div className="font-semibold text-xs text-[#f7f4ed] flex items-center gap-2">
                          {w.name}
                          {w.isPrimary && (
                            <span className="text-[10px] bg-[#d28a4c]/20 text-[#d28a4c] px-1.5 py-0.5 rounded font-bold">
                              Principal
                            </span>
                          )}
                        </div>
                        <p className="font-mono text-[11px] text-[#786b62] truncate max-w-xs sm:max-w-md">
                          {w.address}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#f7f4ed] uppercase">{w.type}</span>
                  </label>
                ))
              )}
            </div>

            {/* Network Selector */}
            <div>
              <span className="text-xs text-[#a69a8f] block mb-2 font-medium">Rede de Liquidação:</span>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'ethereum', label: 'Ethereum', fee: '~0.0045 ETH' },
                  { id: 'polygon', label: 'Polygon', fee: '~0.0008 ETH' },
                  { id: 'solana', label: 'Solana', fee: '~0.0004 ETH' },
                ].map((net) => (
                  <button
                    key={net.id}
                    type="button"
                    onClick={() => setSelectedNetwork(net.id as any)}
                    className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                      selectedNetwork === net.id
                        ? 'bg-[#241914] border-[#d28a4c]'
                        : 'bg-[#140d0a] border-[#2d1e17] hover:border-[#3d2b21]'
                    }`}
                  >
                    <div className="font-bold text-xs text-[#f7f4ed]">{net.label}</div>
                    <span className="text-[10px] text-[#786b62] block mt-1">{net.fee}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Confirmation */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#1b120e] border border-[#3d2b21] rounded-2xl p-6 space-y-6">
            <h3 className="text-sm font-bold text-[#f7f4ed] uppercase tracking-wider pb-3 border-b border-[#2d1e17]">
              Resumo do Pedido ({items.length} itens)
            </h3>

            {/* Items list */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 text-xs">
                  <img
                    src={item.nft.imageUrl}
                    alt={item.nft.title}
                    className="w-12 h-12 rounded-lg object-cover bg-[#140d0a] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#f7f4ed] truncate">{item.nft.title}</p>
                    <p className="text-[11px] text-[#786b62]">
                      Qtd: {item.quantity} • {item.edition}
                    </p>
                  </div>
                  <span className="font-bold text-[#d28a4c]">
                    {(parseFloat(item.unitPrice) * item.quantity).toFixed(2)} ETH
                  </span>
                </div>
              ))}
            </div>

            {/* Coupon input */}
            <div className="pt-3 border-t border-[#2d1e17]">
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-950/30 border border-emerald-800/40 rounded-lg p-2.5 text-xs text-emerald-300">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Tag className="w-3.5 h-3.5" /> {appliedCoupon}
                  </span>
                  <button
                    onClick={() => {
                      setAppliedCoupon(null)
                      refetchQuote()
                    }}
                    className="text-xs text-red-400 hover:underline"
                  >
                    Remover
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <Input
                    placeholder="Código de cupom (ex: KURIO10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    error={couponError || undefined}
                    className="text-xs py-2"
                  />
                  <Button type="submit" variant="secondary" size="sm" className="shrink-0 text-xs px-3">
                    Aplicar
                  </Button>
                </form>
              )}
            </div>

            {/* Totals */}
            <div className="space-y-2 text-xs text-[#a69a8f] pt-3 border-t border-[#2d1e17]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[#f7f4ed] font-medium">{subtotal} ETH</span>
              </div>
              {parseFloat(discount) > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Desconto de cupom</span>
                  <span>- {discount} ETH</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Taxa de rede ({selectedNetwork})</span>
                <span className="text-[#f7f4ed] font-medium">{networkFee} ETH</span>
              </div>
              <div className="flex justify-between text-base font-black text-[#f7f4ed] pt-3 border-t border-[#2d1e17]">
                <span>Total a Pagar</span>
                <span className="text-[#d28a4c]">{total} ETH</span>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              size="lg"
              onClick={handleSubmitOrder}
              isLoading={orderMutation.isPending}
              disabled={
                !walletConnected ||
                (priceChangeWarning !== null && !priceChangeAcknowledged)
              }
              className="w-full font-bold shadow-xl"
            >
              <Lock className="w-4 h-4 mr-2" /> Confirmar Compra
            </Button>

            <p className="text-[10px] text-center text-[#786b62]">
              Ao confirmar, você autoriza a criação do pedido simulado com garantia de idempotência.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
