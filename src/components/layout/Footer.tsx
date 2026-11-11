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
    <footer className="w-full bg-[#140d0a] border-t border-[#241712] text-[#8a7b70] pt-12 pb-8 mt-16 text-xs">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 space-y-12">
        {/* Top Feature Boxes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-[#241712]">
          {/* Box 1 */}
          <div className="space-y-2">
            <div className="w-7 h-7 rounded-full bg-[#d28a4c] text-[#140d0a] font-black flex items-center justify-center text-xs">
              W
            </div>
            <h4 className="font-bold text-[#f5efe6] text-xs">Segurança da carteira</h4>
            <p className="text-[11px] leading-relaxed text-[#8a7b70]">
              Proteja sua carteira e colecione arte digital verificada com confiança.
            </p>
          </div>

          {/* Box 2 */}
          <div className="space-y-2">
            <div className="w-7 h-7 rounded-full bg-[#d28a4c] text-[#140d0a] font-black flex items-center justify-center text-xs">
              C
            </div>
            <h4 className="font-bold text-[#f5efe6] text-xs">Criadores em destaque</h4>
            <p className="text-[11px] leading-relaxed text-[#8a7b70]">
              Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.
            </p>
          </div>

          {/* Box 3 */}
          <div className="space-y-2">
            <div className="w-7 h-7 rounded-full bg-[#d28a4c] text-[#140d0a] font-black flex items-center justify-center text-xs">
              D
            </div>
            <h4 className="font-bold text-[#f5efe6] text-xs">Alertas de lançamentos</h4>
            <p className="text-[11px] leading-relaxed text-[#8a7b70]">
              Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado.
            </p>
          </div>

          {/* Box 4: Newsletter */}
          <div className="space-y-2">
            <h4 className="font-bold text-[#f5efe6] text-xs">Antecipe-se ao próximo lançamento</h4>
            <p className="text-[11px] leading-relaxed text-[#8a7b70]">
              Receba lançamentos selecionados, histórias de criadores e novidades do mercado.
            </p>
            {subscribed ? (
              <span className="text-[11px] text-emerald-400 block pt-1">
                E-mail cadastrado com sucesso!
              </span>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 pt-1">
                <input
                  type="email"
                  placeholder="digite seu e-mail..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-[#1a110d] text-[#f5efe6] border border-[#2d1c15] rounded px-3 py-1.5 text-[11px] focus:outline-none focus:border-[#d28a4c]"
                />
                <button
                  type="submit"
                  className="bg-[#d28a4c] hover:bg-[#b87438] text-white px-3 py-1.5 rounded text-[11px] font-bold transition-colors cursor-pointer"
                >
                  Enviar
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Middle Brand Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center pb-8 border-b border-[#241712] text-xs">
          <span className="font-black text-lg text-[#f5efe6] tracking-wider font-heading">KURIO</span>
          <span className="text-[#8a7b70] text-[11px]">Feito para colecionadores, criadores e cultura</span>
          <span className="text-[#f5efe6] text-[11px]">contato@email.com</span>
          <span className="text-[#f5efe6] text-[11px] md:text-right">+55 11 4002 8922</span>
        </div>

        {/* Links Navigation Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 text-[11px]">
          <div>
            <h5 className="font-bold text-[#f5efe6] mb-3 uppercase tracking-wider text-[10px]">Meu perfil</h5>
            <ul className="space-y-1.5 text-[#8a7b70]">
              <li><Link to="/perfil" className="hover:text-[#f5efe6]">Meu perfil</Link></li>
              <li><span className="hover:text-[#f5efe6] cursor-pointer">Minha coleção</span></li>
              <li><span className="hover:text-[#f5efe6] cursor-pointer">Atividade</span></li>
              <li><span className="hover:text-[#f5efe6] cursor-pointer">Estúdio do criador</span></li>
              <li><span className="hover:text-[#f5efe6] cursor-pointer">Lista de interesse</span></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-[#f5efe6] mb-3 uppercase tracking-wider text-[10px]">Central de ajuda</h5>
            <ul className="space-y-1.5 text-[#8a7b70]">
              <li><span className="hover:text-[#f5efe6] cursor-pointer">Central de ajuda</span></li>
              <li><span className="hover:text-[#f5efe6] cursor-pointer">Como comprar NFTs</span></li>
              <li><span className="hover:text-[#f5efe6] cursor-pointer">Carteira e segurança</span></li>
              <li><span className="hover:text-[#f5efe6] cursor-pointer">Política do mercado</span></li>
              <li><span className="hover:text-[#f5efe6] cursor-pointer">Denunciar item</span></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-[#f5efe6] mb-3 uppercase tracking-wider text-[10px]">Coleções</h5>
            <ul className="space-y-1.5 text-[#8a7b70]">
              <li><Link to="/" search={{ category: 'arte-digital' }} className="hover:text-[#f5efe6]">Arte digital</Link></li>
              <li><Link to="/" search={{ category: 'fotografia' }} className="hover:text-[#f5efe6]">Fotografia</Link></li>
              <li><Link to="/" search={{ category: 'musica' }} className="hover:text-[#f5efe6]">Música</Link></li>
              <li><Link to="/" search={{ category: 'arte-3d' }} className="hover:text-[#f5efe6]">Arte 3D</Link></li>
              <li><Link to="/" search={{ category: 'utilidade' }} className="hover:text-[#f5efe6]">Utilidade</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-[#f5efe6] mb-3 uppercase tracking-wider text-[10px]">Redes sociais</h5>
            <div className="flex items-center gap-2 pt-1 text-[#8a7b70]">
              {/* Facebook */}
              <span className="w-6 h-6 rounded bg-[#1a110d] border border-[#2d1c15] flex items-center justify-center hover:text-white cursor-pointer">
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </span>
              {/* Twitter / X */}
              <span className="w-6 h-6 rounded bg-[#1a110d] border border-[#2d1c15] flex items-center justify-center hover:text-white cursor-pointer">
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </span>
              {/* LinkedIn */}
              <span className="w-6 h-6 rounded bg-[#1a110d] border border-[#2d1c15] flex items-center justify-center hover:text-white cursor-pointer">
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </span>
              {/* YouTube */}
              <span className="w-6 h-6 rounded bg-[#1a110d] border border-[#2d1c15] flex items-center justify-center hover:text-white cursor-pointer">
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </span>
              {/* Instagram */}
              <span className="w-6 h-6 rounded bg-[#1a110d] border border-[#2d1c15] flex items-center justify-center hover:text-white cursor-pointer">
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </span>
            </div>
          </div>

          <div>
            <h5 className="font-bold text-[#f5efe6] mb-3 uppercase tracking-wider text-[10px]">Carteiras compatíveis</h5>
            <div className="space-y-1 text-[10px] font-bold text-[#8a7b70] tracking-wider uppercase">
              <span className="block hover:text-[#f5efe6]">METAMASK</span>
              <span className="block hover:text-[#f5efe6]">WALLETCONNECT</span>
              <span className="block hover:text-[#f5efe6]">COINBASE</span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-[#241712] text-center text-[10px] text-[#5e5148]">
          © 2026 KURIO. Propriedade digital para todos.
        </div>
      </div>
    </footer>
  )
}
