import React, { useState } from 'react'
import { useParams, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ordersApi } from '../api/client'
import { Button } from '../components/ui/Button'
import { Skeleton } from '../components/ui/Skeleton'
import { CheckCircle2, Copy, Check, ExternalLink, ArrowRight, AlertCircle } from 'lucide-react'

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
      <div className="max-w-3xl mx-auto px-4 py-20 space-y-8">
        <Skeleton className="h-16 w-3/4 mx-auto" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    )
  }

  if (isError || !order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto" />
        <h2 className="text-2xl font-bold text-[#f7f4ed]">Pedido Não Encontrado</h2>
        <p className="text-xs text-[#a69a8f]">Não conseguimos localizar os registros desta transação.</p>
        <Link to="/">
          <Button variant="primary">Voltar ao Catálogo</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Thank you celebration header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-emerald-950/40 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400 mb-2">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="text-xs font-bold text-[#d28a4c] tracking-widest uppercase">THANK YOU</span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#f7f4ed] tracking-tight">
          Seus NFTs agora estão na sua carteira
        </h1>
        <p className="text-xs text-[#a69a8f] max-w-md mx-auto">
          A transação foi confirmada com sucesso na rede e o smart contract transferiu a titularidade definitiva para sua conta.
        </p>
      </div>

      {/* Receipt Box (Snapshot) */}
      <div className="bg-[#1b120e] border border-[#3d2b21] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-xs text-[#a69a8f]">
        {/* Meta Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-[#2d1e17]">
          <div>
            <span className="text-[10px] text-[#786b62] block uppercase tracking-wider">ID da Transação</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-mono font-semibold text-[#f7f4ed] truncate max-w-[120px]">
                {order.transactionHash}
              </span>
              <button
                onClick={handleCopyTx}
                aria-label="Copiar hash da transação"
                className="text-[#d28a4c] hover:text-white"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div>
            <span className="text-[10px] text-[#786b62] block uppercase tracking-wider">Data</span>
            <span className="font-semibold text-[#f7f4ed] block mt-0.5">
              {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-[#786b62] block uppercase tracking-wider">Carteira</span>
            <span className="font-semibold text-[#f7f4ed] block mt-0.5">
              {order.walletType} ({order.network.toUpperCase()})
            </span>
          </div>

          <div>
            <span className="text-[10px] text-[#786b62] block uppercase tracking-wider">Status</span>
            <span className="font-bold text-emerald-400 block mt-0.5 uppercase">
              {order.status === 'confirmed' ? 'Confirmado' : order.status}
            </span>
          </div>
        </div>

        {/* Purchased Items List */}
        <div className="space-y-4">
          <h3 className="font-bold text-[#f7f4ed] text-xs uppercase tracking-wider">
            Itens Adquiridos ({order.items.length})
          </h3>

          <div className="space-y-3">
            {order.items.map((item) => (
              <div
                key={item.nftId}
                className="flex items-center justify-between p-3 bg-[#241914] border border-[#2d1e17] rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-12 h-12 rounded-lg object-cover bg-[#140d0a]"
                  />
                  <div>
                    <h4 className="font-bold text-[#f7f4ed] text-xs">{item.title}</h4>
                    <p className="text-[11px] text-[#786b62]">
                      Token {item.tokenId} • Edição: {item.edition} • Qtd: {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#d28a4c] text-xs">{item.subtotal} ETH</span>
                  <span className="text-[10px] text-[#786b62] block">({item.unitPrice} ETH unid.)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="pt-4 border-t border-[#2d1e17] space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-semibold text-[#f7f4ed]">{order.subtotal} ETH</span>
          </div>
          {parseFloat(order.discount) > 0 && (
            <div className="flex justify-between text-emerald-400">
              <span>Desconto de Lançamento</span>
              <span>- {order.discount} ETH</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Taxa de Rede</span>
            <span className="font-semibold text-[#f7f4ed]">{order.networkFee} ETH</span>
          </div>
          <div className="flex justify-between text-base font-black text-[#f7f4ed] pt-3 border-t border-[#2d1e17]">
            <span>Valor Total Pago</span>
            <span className="text-[#d28a4c]">{order.total} ETH</span>
          </div>
        </div>

        {/* Etherscan Verification Message */}
        <div className="p-4 bg-[#140d0a] border border-[#2d1e17] rounded-xl flex items-center justify-between">
          <p className="text-xs text-[#a69a8f] pr-4">
            Transação confirmada na {order.network.toUpperCase()}. A propriedade foi transferida para sua carteira conectada e registrada na rede.
          </p>
          <a
            href={`https://etherscan.io/tx/${order.transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[#d28a4c] font-semibold hover:underline shrink-0"
          >
            Ver no Etherscan <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="flex justify-center pt-4">
        <Link to="/">
          <Button size="lg" variant="primary">
            Voltar ao Catálogo de Obras <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
