import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'

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
    <footer className="w-full bg-[#140d0a] border-t border-[#241712] text-[#8a7b70] pt-12 pb-8 mt-16 text-xs font-mono">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Feature Container matching Figma */}
        <div className="bg-[#1c1410] border border-[#2d1e17] rounded-3xl p-6 lg:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-start">
            {/* Box 1: Segurança da carteira */}
            <div className="lg:col-span-3 space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#d28a4c] text-[#140d0a] font-black flex items-center justify-center text-sm">
                W
              </div>
              <h4 className="font-bold text-[#f7f4ed] text-xs">Segurança da carteira</h4>
              <p className="text-[11px] leading-relaxed text-[#8a7b70]">
                Proteja sua carteira e colecione arte digital verificada com confiança.
              </p>
            </div>

            {/* Box 2: Criadores em destaque */}
            <div className="lg:col-span-3 space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#d28a4c] text-[#140d0a] font-black flex items-center justify-center text-sm">
                C
              </div>
              <h4 className="font-bold text-[#f7f4ed] text-xs">Criadores em destaque</h4>
              <p className="text-[11px] leading-relaxed text-[#8a7b70]">
                Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.
              </p>
            </div>

            {/* Box 3: Alertas de lançamentos */}
            <div className="lg:col-span-3 space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#d28a4c] text-[#140d0a] font-black flex items-center justify-center text-sm">
                D
              </div>
              <h4 className="font-bold text-[#f7f4ed] text-xs">Alertas de lançamentos</h4>
              <p className="text-[11px] leading-relaxed text-[#8a7b70]">
                Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado.
              </p>
            </div>

            {/* Box 4: Newsletter */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="font-bold text-[#f7f4ed] text-xs">Antecipe-se ao próximo lançamento</h4>
              {subscribed ? (
                <span className="text-[11px] text-emerald-400 block pt-1">
                  E-mail cadastrado com sucesso!
                </span>
              ) : (
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    inputMode="email"
                    name="newsletter_email"
                    placeholder="digite seu e-mail..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleSubscribe(e)
                      }
                    }}
                    required
                    className="flex-1 bg-[#140d0a] text-[#f7f4ed] border border-[#2d1e17] rounded-xl px-3 py-2 text-[11px] focus:outline-none focus:border-[#d28a4c] placeholder-[#6e5d52]"
                  />
                  <button
                    type="button"
                    onClick={handleSubscribe}
                    className="bg-[#d28a4c] hover:bg-[#e0985a] text-[#140d0a] px-4 py-2 rounded-xl text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    Enviar
                  </button>
                </div>
              )}
              <p className="text-[10px] leading-relaxed text-[#8a7b70]">
                Receba lançamentos selecionados, histórias de criadores e novidades do mercado.
              </p>
            </div>
          </div>
        </div>

        {/* Middle Brand Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center pb-8 border-b border-[#241712] text-xs">
          <span className="font-black text-xl text-[#f7f4ed] tracking-wider font-mono">KURIO</span>
          <span className="text-[#8a7b70] text-[11px]">Feito para colecionadores, criadores e cultura</span>
          <span className="text-[#f7f4ed] text-[11px]">contato@email.com</span>
          <span className="text-[#f7f4ed] text-[11px] lg:text-right">+55 11 4002 8922</span>
        </div>

        {/* Links Navigation Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 text-[11px]">
          <div>
            <h5 className="font-bold text-[#f7f4ed] mb-3 uppercase tracking-wider text-[11px]">Meu perfil</h5>
            <ul className="space-y-2 text-[#8a7b70]">
              <li><Link to="/perfil" className="hover:text-[#f7f4ed]">Meu perfil</Link></li>
              <li><span className="hover:text-[#f7f4ed] cursor-pointer">Minha coleção</span></li>
              <li><span className="hover:text-[#f7f4ed] cursor-pointer">Atividade</span></li>
              <li><span className="hover:text-[#f7f4ed] cursor-pointer">Estúdio do criador</span></li>
              <li><span className="hover:text-[#f7f4ed] cursor-pointer">Lista de interesse</span></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-[#f7f4ed] mb-3 uppercase tracking-wider text-[11px]">Central de ajuda</h5>
            <ul className="space-y-2 text-[#8a7b70]">
              <li><span className="hover:text-[#f7f4ed] cursor-pointer">Central de ajuda</span></li>
              <li><span className="hover:text-[#f7f4ed] cursor-pointer">Como comprar NFTs</span></li>
              <li><span className="hover:text-[#f7f4ed] cursor-pointer">Carteira e segurança</span></li>
              <li><span className="hover:text-[#f7f4ed] cursor-pointer">Política do mercado</span></li>
              <li><span className="hover:text-[#f7f4ed] cursor-pointer">Denunciar item</span></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-[#f7f4ed] mb-3 uppercase tracking-wider text-[11px]">Coleções</h5>
            <ul className="space-y-2 text-[#8a7b70]">
              <li><Link to="/" search={{ category: 'arte-digital', page: 1 }} className="hover:text-[#f7f4ed]">Arte digital</Link></li>
              <li><Link to="/" search={{ category: 'fotografia', page: 1 }} className="hover:text-[#f7f4ed]">Fotografia</Link></li>
              <li><Link to="/" search={{ category: 'musica', page: 1 }} className="hover:text-[#f7f4ed]">Música</Link></li>
              <li><Link to="/" search={{ category: 'arte-3d', page: 1 }} className="hover:text-[#f7f4ed]">Arte 3D</Link></li>
              <li><Link to="/" search={{ category: 'utilidade', page: 1 }} className="hover:text-[#f7f4ed]">Utilidade</Link></li>
            </ul>
          </div>

          <div className="col-span-2 space-y-4">
            <div>
              <h5 className="font-bold text-[#f7f4ed] mb-2 uppercase tracking-wider text-[11px]">Redes sociais</h5>
              <div className="flex items-center gap-2.5 text-[#8a7b70]">
                {/* Facebook */}
                <a href="#facebook" className="w-8 h-8 rounded-lg border border-[#2d1e17] flex items-center justify-center hover:border-[#d28a4c] hover:text-[#f7f4ed] transition-colors" aria-label="Facebook">
                  <span className="font-bold text-xs">f</span>
                </a>
                {/* Instagram */}
                <a href="#instagram" className="w-8 h-8 rounded-lg border border-[#2d1e17] flex items-center justify-center hover:border-[#d28a4c] hover:text-[#f7f4ed] transition-colors" aria-label="Instagram">
                  <span className="text-xs">◎</span>
                </a>
                {/* Twitter */}
                <a href="#twitter" className="w-8 h-8 rounded-lg border border-[#2d1e17] flex items-center justify-center hover:border-[#d28a4c] hover:text-[#f7f4ed] transition-colors" aria-label="Twitter">
                  <span className="font-bold text-xs">𝕏</span>
                </a>
                {/* LinkedIn */}
                <a href="#linkedin" className="w-8 h-8 rounded-lg border border-[#2d1e17] flex items-center justify-center hover:border-[#d28a4c] hover:text-[#f7f4ed] transition-colors" aria-label="LinkedIn">
                  <span className="font-bold text-xs underline">in</span>
                </a>
                {/* YouTube */}
                <a href="#youtube" className="w-8 h-8 rounded-lg border border-[#2d1e17] flex items-center justify-center hover:border-[#d28a4c] hover:text-[#f7f4ed] transition-colors" aria-label="YouTube">
                  <span className="text-xs">▶</span>
                </a>
              </div>
            </div>

            <div>
              <h5 className="font-bold text-[#f7f4ed] mb-2 uppercase tracking-wider text-[11px]">Carteiras compatíveis</h5>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#2d1e17] bg-[#140d0a] text-[10px] font-bold text-[#8a7b70] tracking-wider uppercase">
                <span>METAMASK</span>
                <span>•</span>
                <span>WALLETCONNECT</span>
                <span>•</span>
                <span>COINBASE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-[#241712] text-center text-[#6e5d52] text-[11px]">
          © 2026 Kurio. Propriedade digital para todos.
        </div>
      </div>
    </footer>
  )
}
