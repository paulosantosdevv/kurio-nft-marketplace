import React, { useState } from 'react'
import { useCart } from '../../context/CartContext'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { X, Trash2, Plus, Minus, AlertTriangle, Tag } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { cartApi } from '../../api/client'
import { useQuery } from '@tanstack/react-query'

export const CartDrawer: React.FC = () => {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, priceAlert, clearPriceAlert } = useCart()
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [couponError, setCouponError] = useState<string | null>(null)
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)
  const navigate = useNavigate()

  // Real-time quote query based on current cart items and applied coupon
  const { data: quote, refetch: refetchQuote } = useQuery({
    queryKey: ['cart-quote', items, appliedCoupon],
    queryFn: async () => {
      if (items.length === 0) return null
      return cartApi.getQuote({
        items: items.map((i) => ({ nftId: i.nftId, quantity: i.quantity })),
        couponCode: appliedCoupon || undefined,
        network: 'ethereum',
      })
    },
    enabled: isOpen && items.length > 0,
  })

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!couponCode.trim()) return

    setCouponError(null)
    setIsApplyingCoupon(true)
    try {
      await cartApi.getQuote({
        items: items.map((i) => ({ nftId: i.nftId, quantity: i.quantity })),
        couponCode: couponCode.trim(),
        network: 'ethereum',
      })
      setAppliedCoupon(couponCode.trim().toUpperCase())
      setCouponCode('')
      refetchQuote()
    } catch (err: any) {
      setCouponError(err.response?.data?.message || 'Cupom inválido ou expirado.')
    } finally {
      setIsApplyingCoupon(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponError(null)
    refetchQuote()
  }

  const handleProceedToCheckout = () => {
    setIsOpen(false)
    navigate({ to: '/pagamento' })
  }

  if (!isOpen) return null

  // Fallback calculations if quote is loading
  const subtotal = quote
    ? quote.subtotal
    : items.reduce((acc, i) => acc + parseFloat(i.unitPrice) * i.quantity, 0).toFixed(4)
  const discount = quote ? quote.discount : '0.0000'
  const networkFee = quote ? quote.networkFee : '0.0045'
  const total = quote ? quote.total : (parseFloat(subtotal) + parseFloat(networkFee)).toFixed(4)

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => setIsOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-title"
    >
      <div
        className="w-full max-w-md bg-[#1b120e] border-l border-[#3d2b21] h-full flex flex-col p-6 shadow-2xl text-[#f7f4ed] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#3d2b21] pb-4 mb-4">
          <h2 id="cart-title" className="text-xl font-bold tracking-tight">
            Carrinho de NFTs
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Fechar carrinho"
            className="p-1.5 rounded-lg text-[#a69a8f] hover:text-[#f7f4ed] hover:bg-[#241914] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real-time Socket Notification */}
        {priceAlert && (
          <div className="mb-4 p-3 bg-amber-950/40 border border-amber-600/40 rounded-xl flex items-start gap-2.5 text-xs text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">{priceAlert}</div>
            <button
              onClick={clearPriceAlert}
              aria-label="Dispensar aviso"
              className="text-amber-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Items List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {items.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-[#786b62]">
              <p className="text-base font-medium text-[#a69a8f] mb-1">Seu carrinho está vazio</p>
              <p className="text-xs">Explore a coleção e selecione obras exclusivas para adquirir.</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 bg-[#241914] border border-[#3d2b21] rounded-xl p-3 items-center"
              >
                <img
                  src={item.nft.imageUrl}
                  alt={item.nft.title}
                  className="w-16 h-16 rounded-lg object-cover bg-[#140d0a] shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold truncate text-[#f7f4ed]">{item.nft.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-[#a69a8f] mt-0.5">
                    <span>Edição: {item.edition}</span>
                    <span className="text-[#d28a4c] font-medium">{item.unitPrice} ETH</span>
                  </div>
                  {/* Quantity selector */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      aria-label="Diminuir quantidade"
                      className="w-6 h-6 rounded bg-[#1b120e] border border-[#3d2b21] flex items-center justify-center text-xs hover:border-[#d28a4c] disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-semibold px-1">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Aumentar quantidade"
                      className="w-6 h-6 rounded bg-[#1b120e] border border-[#3d2b21] flex items-center justify-center text-xs hover:border-[#d28a4c]"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  aria-label={`Remover ${item.nft.title}`}
                  className="p-2 text-[#786b62] hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Coupon & Summary Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#3d2b21] pt-4 mt-4 space-y-4">
            {/* Coupon input */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-950/30 border border-emerald-800/40 rounded-lg p-2.5 text-xs text-emerald-300">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Tag className="w-3.5 h-3.5" /> Cupom aplicado: {appliedCoupon}
                  </span>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-xs text-red-400 hover:underline cursor-pointer"
                  >
                    Remover
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <Input
                    placeholder="Código promocional (ex: KURIO10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    error={couponError || undefined}
                    className="text-xs py-2"
                  />
                  <Button
                    type="submit"
                    variant="secondary"
                    size="sm"
                    isLoading={isApplyingCoupon}
                    className="shrink-0 text-xs px-3"
                  >
                    Aplicar
                  </Button>
                </form>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-1.5 text-xs text-[#a69a8f]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[#f7f4ed] font-medium">{subtotal} ETH</span>
              </div>
              {parseFloat(discount) > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Desconto aplicado</span>
                  <span>- {discount} ETH</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Taxa de rede estimada</span>
                <span className="text-[#f7f4ed] font-medium">{networkFee} ETH</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#f7f4ed] pt-2 border-t border-[#3d2b21]">
                <span>Total</span>
                <span className="text-[#d28a4c]">{total} ETH</span>
              </div>
            </div>

            {/* Action */}
            <Button onClick={handleProceedToCheckout} className="w-full" size="md">
              Avançar para Pagamento
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
