import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { ShieldCheck, CheckCircle2 } from 'lucide-react'

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <footer className="w-full bg-[#140d0a] border-t border-[#2d1e17] text-[#a69a8f] pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Newsletter & Security Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12 border-b border-[#2d1e17]">
          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold text-[#f7f4ed] mb-2">
              Antecipe-se ao próximo lançamento
            </h3>
            <p className="text-xs text-[#a69a8f] mb-4">
              Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/30 p-3 rounded-lg border border-emerald-800/40">
                <CheckCircle2 className="w-4 h-4" /> E-mail cadastrado com sucesso para alertas!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
                <Input
                  type="email"
                  placeholder="Digite seu e-mail..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-[#1b120e] text-xs py-2"
                />
                <Button type="submit" size="sm" variant="primary" className="shrink-0 text-xs px-5">
                  Enviar
                </Button>
              </form>
            )}
          </div>

          {/* Wallet Security */}
          <div className="flex items-start gap-4 p-5 bg-[#1b120e] border border-[#2d1e17] rounded-xl">
            <ShieldCheck className="w-8 h-8 text-[#d28a4c] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-[#f7f4ed] mb-1">Segurança da carteira</h4>
              <p className="text-xs text-[#a69a8f] leading-relaxed">
                Proteja sua carteira e colecione arte digital verificada com total transparência e integridade na rede.
              </p>
            </div>
          </div>
        </div>

        {/* Links Navigation Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-12 text-xs">
          <div>
            <h4 className="font-bold text-[#f7f4ed] mb-4 uppercase tracking-wider text-[11px]">Meu Perfil</h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/perfil" className="hover:text-[#f7f4ed] transition-colors">
                  Dados do perfil
                </Link>
              </li>
              <li>
                <Link to="/carteiras" className="hover:text-[#f7f4ed] transition-colors">
                  Carteiras conectadas
                </Link>
              </li>
              <li>
                <span className="hover:text-[#f7f4ed] cursor-pointer transition-colors">Minha coleção</span>
              </li>
              <li>
                <span className="hover:text-[#f7f4ed] cursor-pointer transition-colors">Lista de interesse</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#f7f4ed] mb-4 uppercase tracking-wider text-[11px]">Coleções</h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" search={{ category: 'arte-digital' }} className="hover:text-[#f7f4ed]">
                  Arte digital
                </Link>
              </li>
              <li>
                <Link to="/" search={{ category: 'fotografia' }} className="hover:text-[#f7f4ed]">
                  Fotografia
                </Link>
              </li>
              <li>
                <Link to="/" search={{ category: 'musica' }} className="hover:text-[#f7f4ed]">
                  Música
                </Link>
              </li>
              <li>
                <Link to="/" search={{ category: 'arte-3d' }} className="hover:text-[#f7f4ed]">
                  Arte 3D
                </Link>
              </li>
              <li>
                <Link to="/" search={{ category: 'jogos' }} className="hover:text-[#f7f4ed]">
                  Jogos & Web3
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#f7f4ed] mb-4 uppercase tracking-wider text-[11px]">Central de Ajuda</h4>
            <ul className="space-y-2.5">
              <li>
                <span className="hover:text-[#f7f4ed] cursor-pointer">Como comprar NFTs</span>
              </li>
              <li>
                <span className="hover:text-[#f7f4ed] cursor-pointer">Carteira e segurança</span>
              </li>
              <li>
                <span className="hover:text-[#f7f4ed] cursor-pointer">Política do mercado</span>
              </li>
              <li>
                <span className="hover:text-[#f7f4ed] cursor-pointer">Denunciar item</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#f7f4ed] mb-4 uppercase tracking-wider text-[11px]">Kurio</h4>
            <p className="text-xs leading-relaxed text-[#786b62] mb-3">
              Feito para colecionadores, criadores e cultura. Propriedade digital verificada em blockchain.
            </p>
            <p className="text-[11px] text-[#d28a4c]">contato@kurio.art</p>
          </div>
        </div>

        {/* Bottom Wallets & Copyright */}
        <div className="pt-8 border-t border-[#2d1e17] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div className="flex items-center gap-6">
            <span className="text-[#786b62] uppercase tracking-wider text-[10px]">Carteiras compatíveis:</span>
            <span className="font-semibold text-[#f7f4ed]">METAMASK</span>
            <span className="font-semibold text-[#f7f4ed]">COINBASE</span>
            <span className="font-semibold text-[#f7f4ed]">WALLETCONNECT</span>
          </div>
          <div>© 2026 KURIO Inc. Todos os direitos reservados.</div>
        </div>
      </div>
    </footer>
  )
}
