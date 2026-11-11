import React, { useState } from 'react'
import { useParams, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ordersApi } from '../api/client'
import { Skeleton } from '../components/ui/Skeleton'
import { X, Copy, Check, AlertCircle } from 'lucide-react'

export const OrderConfirmationView: React.FC = () => {
  const { orderId } = useParams({ from: '/confirmacao/$orderId' })
  const [copied, setCopied] = useState(false)

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => ordersApi.getOrder(orderId),
  })

  const handleCopyTx = () => {
    if (order?.transactionHash) {
      navigator.clipboard.writeText(order.transactionHash)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Skeleton className="h-[600px] w-full max-w-xl rounded-3xl" />
      </div>
    )
  }

  if (isError || !order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto" />
        <h2 className="text-2xl font-mono font-bold text-[#f7f4ed]">Pedido Não Encontrado</h2>
        <p className="text-xs font-mono text-[#8a7b70]">Não conseguimos localizar os registros desta transação.</p>
        <Link to="/">
          <button className="bg-[#d28a4c] text-[#140d0a] font-bold px-6 py-2.5 rounded-xl text-xs uppercase cursor-pointer">
            Voltar ao Catálogo
          </button>
        </Link>
      </div>
    )
  }

  const shortTxHash = order.transactionHash
    ? `${order.transactionHash.slice(0, 6)}...${order.transactionHash.slice(-4)}`
    : '0xA91F...E82C'

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#140d0a]/90 backdrop-blur-md">
      {/* Modal Dialog Card matching Figma Desktop/Confirmação de Pedido */}
      <div className="relative w-full max-w-xl bg-[#1c1410] border border-[#2d1e17] rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6 font-mono text-xs border-b-4 border-b-[#d28a4c]">
        {/* Close Button top-right */}
        <Link
          to="/"
          className="absolute top-6 right-6 text-[#8a7b70] hover:text-[#f7f4ed] transition-colors p-1"
          aria-label="Fechar confirmação"
        >
          <X className="w-5 h-5" />
        </Link>

        {/* Envelope Thank You Icon */}
        <div className="flex flex-col items-center text-center space-y-3 pt-2">
          <div className="w-16 h-16 flex items-center justify-center">
            <img
              src="/assets/thank_you_envelope.png"
              alt="THANK YOU"
              className="w-14 h-auto object-contain"
            />
          </div>
          <span className="text-xs font-black text-[#d28a4c] tracking-widest uppercase">
            THANK YOU
          </span>
          <h1 className="text-base sm:text-lg font-black text-[#f7f4ed] tracking-wide">
            Seus NFTs agora estão na sua carteira
          </h1>
        </div>

        {/* 4-Column Bar */}
        <div className="grid grid-cols-4 gap-2 py-4 border-y border-[#2d1e17] text-center">
          <div>
            <span className="text-[10px] text-[#8a7b70] block mb-1">ID da transação</span>
            <button
              onClick={handleCopyTx}
              className="text-[#f7f4ed] font-bold hover:text-[#d28a4c] transition-colors inline-flex items-center gap-1"
            >
              <span>{shortTxHash}</span>
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-[#8a7b70]" />}
            </button>
          </div>
          <div>
            <span className="text-[10px] text-[#8a7b70] block mb-1">Data</span>
            <span className="text-[#f7f4ed] font-bold">
              {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[#8a7b70] block mb-1">Total</span>
            <span className="text-[#d28a4c] font-black">{order.total} ETH</span>
          </div>
          <div>
            <span className="text-[10px] text-[#8a7b70] block mb-1">Carteira</span>
            <span className="text-[#f7f4ed] font-bold">{order.walletType}</span>
          </div>
        </div>

        {/* Detalhes da transação */}
        <div className="space-y-3">
          <h3 className="font-bold text-[#f7f4ed] text-xs">
            Detalhes da transação
          </h3>

          {/* Table Header */}
          <div className="flex justify-between text-[#8a7b70] text-[11px] pb-1 border-b border-[#241712]">
            <span>NFTs</span>
            <span>Edições</span>
            <span>Subtotal</span>
          </div>

          {/* Items List */}
          <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
            {order.items.map((item) => (
              <div key={item.nftId} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#ded7cb] shrink-0 border border-[#2d1e17]">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#f7f4ed] text-xs">{item.title}</h4>
                    <p className="text-[10px] text-[#8a7b70]">ID do token: {item.tokenId}</p>
                  </div>
                </div>
                <div className="text-center text-[#8a7b70]">
                  (x {item.quantity})
                </div>
                <div className="text-right text-[#d28a4c] font-bold">
                  {item.subtotal} ETH
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="pt-2 border-t border-[#241712] space-y-1.5 text-[#8a7b70]">
            <div className="flex justify-between">
              <span>Taxa de rede</span>
              <span className="text-[#f7f4ed]">{order.networkFee} ETH</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-[#f7f4ed] pt-1">
              <span>Total</span>
              <span className="text-[#d28a4c]">{order.total} ETH</span>
            </div>
          </div>
        </div>

        {/* Transaction confirmation info */}
        <div className="pt-2 border-t border-[#2d1e17] text-center space-y-4">
          <p className="text-[11px] text-[#8a7b70] leading-relaxed">
            Transação confirmada na {order.network === 'ethereum' ? 'Ethereum' : order.network}. A propriedade foi transferida para sua carteira conectada e registrada na rede.
          </p>

          <a
            href={`https://etherscan.io/tx/${order.transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#d28a4c] hover:bg-[#e0985a] text-[#140d0a] font-bold px-8 py-3 rounded-xl text-xs uppercase tracking-wider transition-colors"
          >
            Ver no Etherscan
          </a>
        </div>
      </div>
    </div>
  )
}
