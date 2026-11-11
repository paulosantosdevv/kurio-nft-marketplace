import React, { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useQuery } from '@tanstack/react-query'
import { cartApi } from '../api/client'
import { ChevronLeft, Trash2 } from 'lucide-react'

export const CartView: React.FC = () => {
  const { items, updateQuantity, removeItem } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [couponError, setCouponError] = useState<string | null>(null)

  // Real-time Quote query
  const { data: quote, refetch: refetchQuote } = useQuery({
    queryKey: ['cart-page-quote', items, appliedCoupon],
    queryFn: async () => {
      if (items.length === 0) return null
      return cartApi.getQuote({
        items: items.map((i) => ({ nftId: i.nftId, quantity: i.quantity })),
        couponCode: appliedCoupon || undefined,
        network: 'ethereum',
      })
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
        network: 'ethereum',
      })
      setAppliedCoupon(couponCode.trim().toUpperCase())
      setCouponCode('')
      refetchQuote()
    } catch (err: any) {
      setCouponError(err.response?.data?.message || 'Cupom inválido ou inexistente.')
    }
  }

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate({ to: '/login', search: { redirect: '/pagamento' } })
    } else {
      navigate({ to: '/pagamento' })
    }
  }

  const relatedCards = [
    { id: 'nft-4', title: 'Cosmic Bloom #118', price: '1.29 ETH', image: '/assets/nfts/card_4_cosmic_bloom.png' },
    { id: 'nft-5', title: 'Violet Nomad #314', price: '1.39 ETH', image: '/assets/nfts/card_5_violet_nomad.png' },
    { id: 'nft-6', title: 'Ivory Baron #088', price: '1.79 ETH', image: '/assets/nfts/card_6_ivory_baron.png' },
    { id: 'nft-7', title: 'Golden Beat #207', price: '0.99 ETH', image: '/assets/nfts/card_7_golden_beat_1.png' },
    { id: 'nft-9', title: 'Golden Signal #160', price: '0.39 ETH', image: '/assets/nfts/card_9_golden_signal.png' },
  ]

  const subtotal = quote ? quote.subtotal : items.reduce((acc, i) => acc + parseFloat(i.unitPrice) * i.quantity, 0).toFixed(2)
  const discount = quote ? quote.discount : '00.00'
  const networkFee = quote ? quote.networkFee : '0.016'
  const total = quote ? quote.total : (parseFloat(subtotal) + parseFloat(networkFee) - parseFloat(discount)).toFixed(3)

  return (
    <div className="min-h-screen bg-[#140d0a] text-[#f7f4ed]">
      {/* Mobile Cart View (Figma 414px) */}
      <div className="block md:hidden">
        {/* Mobile Header Bar */}
        <div className="flex items-center gap-4 px-5 py-4 border-b border-[#241712]">
          <Link
            to="/"
            className="w-10 h-10 rounded-full bg-[#1b120e] border border-[#3d2b21] flex items-center justify-center text-[#f7f4ed]"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-base font-mono font-bold text-[#f7f4ed]">
            Carrinho de NFTs
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="p-8 text-center space-y-4">
            <p className="text-sm font-mono text-[#8a7b70]">Seu carrinho está vazio.</p>
            <Link
              to="/"
              className="inline-block bg-[#d28a4c] text-[#140d0a] font-bold px-6 py-2.5 rounded-xl text-xs uppercase"
            >
              Explorar NFTs
            </Link>
          </div>
        ) : (
          <div className="px-4 py-5 space-y-3 pb-72">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-[#1c1410] border border-[#2d1e17] rounded-2xl p-3 flex items-center gap-3"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#ded7cb] shrink-0">
                  <img
                    src={item.nft.imageUrl}
                    alt={item.nft.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-mono font-bold text-[#f7f4ed] truncate">
                    {item.nft.title}
                  </h4>
                  <span className="text-[11px] font-mono text-[#8a7b70] block">
                    Edição: {item.edition}
                  </span>
                  <span className="text-xs font-mono font-black text-[#d28a4c] block mt-1">
                    {item.unitPrice} ETH
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-[#140d0a] border border-[#2d1e17] rounded-full px-1.5 py-0.5">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-full bg-[#d28a4c] text-[#140d0a] font-bold flex items-center justify-center text-xs cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-mono text-xs font-bold text-[#f7f4ed] w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-full bg-[#d28a4c] text-[#140d0a] font-bold flex items-center justify-center text-xs cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-[#8a7b70] hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mobile Sticky Bottom Sheet */}
        {items.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#1c1410] border-t border-[#2e1d15] rounded-t-[32px] px-5 py-5 shadow-2xl space-y-4">
            {/* Promo Code Input */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="Digite o código promocional..."
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 bg-[#140d0a] border border-[#3d2b21] rounded-xl px-3 py-2 text-xs font-mono text-[#f7f4ed] placeholder-[#6e5d52] focus:outline-none focus:border-[#d28a4c]"
              />
              <button
                type="submit"
                className="bg-[#d28a4c] text-[#140d0a] font-bold px-4 py-2 rounded-xl text-xs font-mono cursor-pointer"
              >
                Aplicar
              </button>
            </form>

            {couponError && (
              <p className="text-[11px] font-mono text-red-400">{couponError}</p>
            )}
            {appliedCoupon && (
              <p className="text-[11px] font-mono text-emerald-400">Cupom aplicado: {appliedCoupon}</p>
            )}

            <div className="space-y-1.5 text-xs font-mono text-[#8a7b70]">
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
              <div className="flex justify-between text-sm font-black font-heading text-[#f7f4ed] pt-2 border-t border-[#2d1e17]">
                <span>Total</span>
                <span className="text-[#d28a4c]">{total} ETH</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-[#d28a4c] hover:bg-[#e0985a] text-[#140d0a] font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Conectar e finalizar
            </button>
          </div>
        )}
      </div>

      {/* Desktop Cart View (Figma 1440px) */}
      <div className="hidden md:block max-w-[1280px] mx-auto px-6 lg:px-8 py-8 space-y-12">
        {/* Breadcrumb */}
        <div className="text-xs font-mono text-[#8a7b70]">
          <Link to="/" className="hover:text-[#f7f4ed] transition-colors">Início</Link>
          <span className="mx-2">/</span>
          <Link to="/" className="hover:text-[#f7f4ed] transition-colors">Mercado</Link>
          <span className="mx-2">/</span>
          <span className="text-[#a69a8f]">Carrinho</span>
        </div>

        {items.length === 0 ? (
          <div className="p-16 text-center bg-[#18110d] border border-[#2d1e17] rounded-3xl space-y-4">
            <h2 className="text-xl font-mono font-bold text-[#f7f4ed]">Seu carrinho está vazio</h2>
            <p className="text-xs font-mono text-[#8a7b70]">Adicione NFTs colecionáveis ao seu carrinho para prosseguir.</p>
            <div className="pt-2">
              <Link
                to="/"
                className="inline-block bg-[#d28a4c] text-[#140d0a] font-bold px-8 py-3 rounded-xl text-xs uppercase tracking-wider"
              >
                Explorar Catálogo
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-8 items-start">
            {/* Left: Table of Items */}
            <div className="col-span-8 space-y-4">
              {/* Table Header */}
              <div className="grid grid-cols-12 text-xs font-mono font-bold text-[#8a7b70] px-4 pb-2 border-b border-[#241712]">
                <div className="col-span-5">NFTs</div>
                <div className="col-span-2 text-center">Preço</div>
                <div className="col-span-2 text-center">Edições</div>
                <div className="col-span-2 text-center">Total</div>
                <div className="col-span-1 text-right"></div>
              </div>

              {/* Table Rows */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 items-center bg-[#1c1410] border border-[#2d1e17] rounded-2xl p-4 hover:border-[#3d2b21] transition-colors"
                  >
                    {/* Item info */}
                    <div className="col-span-5 flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#ded7cb] shrink-0 border border-[#2d1e17]">
                        <img
                          src={item.nft.imageUrl}
                          alt={item.nft.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-mono font-bold text-[#f7f4ed] truncate">
                          {item.nft.title}
                        </h4>
                        <span className="text-[11px] font-mono text-[#8a7b70] block">
                          ID do token: {item.nft.tokenId || '#0042'}
                        </span>
                      </div>
                    </div>

                    {/* Preço */}
                    <div className="col-span-2 text-center font-mono text-xs font-bold text-[#f7f4ed]">
                      {item.unitPrice} ETH
                    </div>

                    {/* Stepper Edições */}
                    <div className="col-span-2 flex justify-center items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-full bg-[#d28a4c] text-[#140d0a] font-bold flex items-center justify-center text-xs cursor-pointer hover:bg-[#e0985a]"
                      >
                        -
                      </button>
                      <span className="font-mono text-xs font-bold text-[#f7f4ed] w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-full bg-[#d28a4c] text-[#140d0a] font-bold flex items-center justify-center text-xs cursor-pointer hover:bg-[#e0985a]"
                      >
                        +
                      </button>
                    </div>

                    {/* Total */}
                    <div className="col-span-2 text-center font-mono text-xs font-bold text-[#d28a4c]">
                      {(parseFloat(item.unitPrice) * item.quantity).toFixed(2)} ETH
                    </div>

                    {/* Remove */}
                    <div className="col-span-1 text-right">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[#8a7b70] hover:text-red-400 transition-colors p-1 cursor-pointer"
                        aria-label={`Remover ${item.nft.title} do carrinho`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Resumo da carteira */}
            <div className="col-span-4 bg-[#18110d] border border-[#2d1e17] rounded-3xl p-6 space-y-6">
              <h3 className="text-sm font-mono font-bold text-[#f7f4ed] tracking-wider">
                Resumo da carteira
              </h3>

              {/* Promo Code Form */}
              <div>
                <label className="text-xs font-mono text-[#8a7b70] block mb-2">
                  Código promocional
                </label>
                <form onSubmit={handleApplyCoupon} className="flex">
                  <input
                    type="text"
                    placeholder="Digite o código promocional..."
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 bg-[#140d0a] border border-[#3d2b21] rounded-l-xl px-3 py-2 text-xs font-mono text-[#f7f4ed] placeholder-[#6e5d52] focus:outline-none focus:border-[#d28a4c]"
                  />
                  <button
                    type="submit"
                    className="bg-[#d28a4c] hover:bg-[#e0985a] text-[#140d0a] font-bold px-4 py-2 rounded-r-xl text-xs font-mono uppercase tracking-wider cursor-pointer"
                  >
                    Aplicar
                  </button>
                </form>
                {couponError && (
                  <p className="text-[11px] font-mono text-red-400 mt-1">{couponError}</p>
                )}
                {appliedCoupon && (
                  <p className="text-[11px] font-mono text-emerald-400 mt-1">
                    Cupom aplicado: {appliedCoupon}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 pt-3 border-t border-[#241712] text-xs font-mono text-[#8a7b70]">
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
                <div className="flex justify-between text-sm font-black font-heading text-[#f7f4ed] pt-3 border-t border-[#241712]">
                  <span>Total</span>
                  <span className="text-[#d28a4c]">{total} ETH</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleCheckout}
                className="w-full bg-[#d28a4c] hover:bg-[#e0985a] text-[#140d0a] font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Conectar e finalizar
              </button>

              <div className="text-center">
                <Link
                  to="/"
                  className="text-xs font-mono text-[#8a7b70] hover:text-[#f7f4ed] transition-colors"
                >
                  Continuar explorando
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Colecionadores também viram */}
        <div className="pt-10 border-t border-[#241712] space-y-6">
          <div className="border-b border-[#241712] pb-3">
            <h3 className="text-base font-mono font-bold text-[#d28a4c]">
              Colecionadores também viram
            </h3>
          </div>

          <div className="grid grid-cols-5 gap-5">
            {relatedCards.map((item) => (
              <Link
                key={item.id}
                to="/nft/$id"
                params={{ id: item.id }}
                className="group flex flex-col cursor-pointer"
              >
                <div className="aspect-square rounded-[20px] overflow-hidden bg-[#ded7cb] border border-[#2d1c15] p-2 transition-transform duration-300 group-hover:-translate-y-1 shadow-lg">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover rounded-[14px]"
                  />
                </div>
                <div className="mt-3">
                  <h4 className="text-xs font-mono font-bold text-[#f7f4ed] truncate">
                    {item.title}
                  </h4>
                  <span className="text-xs font-mono font-black text-[#d28a4c] block mt-1">
                    {item.price}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* 3 Pagination Dots */}
          <div className="flex justify-center items-center gap-2 pt-6">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d28a4c]" />
            <span className="w-2.5 h-2.5 rounded-full border border-[#5e4b3e]" />
            <span className="w-2.5 h-2.5 rounded-full border border-[#5e4b3e]" />
          </div>
        </div>
      </div>
    </div>
  )
}
