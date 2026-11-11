import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = () => {
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <footer className="w-full bg-[#140d0a] pt-12 pb-8 mt-16 text-xs font-mono">
      <h2 className="sr-only">Informações Institucionais e Rodapé</h2>
      {/* Unified Footer Card matching user reference and Figma */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#241612] border border-[#3d271f] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
          {/* Top Feature Highlights (features + newsletter) */}
          <div className="p-6 lg:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-[#3d271f] items-start">
              {/* Box 1: Segurança da carteira */}
              <div className="lg:pr-6 space-y-3">
                <div className="w-10 h-10 rounded-full bg-[#d28a4c] text-[#140d0a] font-black flex items-center justify-center text-sm">
                  W
                </div>
                <h3 className="font-bold text-[#f7f4ed] text-xs">Segurança da carteira</h3>
                <p className="text-[11px] leading-relaxed text-[#a69a8f]">
                  Proteja sua carteira e colecione arte digital verificada com confiança.
                </p>
              </div>

              {/* Box 2: Criadores em destaque */}
              <div className="lg:px-6 space-y-3">
                <div className="w-10 h-10 rounded-full bg-[#d28a4c] text-[#140d0a] font-black flex items-center justify-center text-sm">
                  C
                </div>
                <h3 className="font-bold text-[#f7f4ed] text-xs">Criadores em destaque</h3>
                <p className="text-[11px] leading-relaxed text-[#a69a8f]">
                  Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.
                </p>
              </div>

              {/* Box 3: Alertas de lançamentos */}
              <div className="lg:px-6 space-y-3">
                <div className="w-10 h-10 rounded-full bg-[#d28a4c] text-[#140d0a] font-black flex items-center justify-center text-sm">
                  D
                </div>
                <h3 className="font-bold text-[#f7f4ed] text-xs">Alertas de lançamentos</h3>
                <p className="text-[11px] leading-relaxed text-[#a69a8f]">
                  Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado.
                </p>
              </div>

              {/* Box 4: Newsletter */}
              <div className="lg:pl-6 space-y-3">
                <h3 className="font-bold text-[#f7f4ed] text-xs">Antecipe-se ao próximo lançamento</h3>
                {subscribed ? (
                  <span className="text-[11px] text-emerald-400 block pt-1">
                    E-mail cadastrado com sucesso!
                  </span>
                ) : (
                  <div className="flex gap-2 pt-1">
                    <input
                      type="email"
                      id="newsletter_email"
                      name="newsletter_email"
                      aria-label="Digite seu e-mail para receber novidades"
                      placeholder="digite seu e-mail..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleSubscribe()
                        }
                      }}
                      required
                      className="flex-1 bg-[#1a0f0d] text-[#f7f4ed] border border-[#3d271f] rounded-lg px-3 py-2 text-[11px] focus:outline-none focus:border-[#d28a4c] placeholder-[#a69a8f]"
                    />
                    <button
                      type="button"
                      onClick={() => handleSubscribe()}
                      aria-label="Enviar inscrição na newsletter"
                      className="bg-[#d28a4c] hover:bg-[#c37c3e] text-[#140d0a] px-4 py-2 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      Enviar
                    </button>
                  </div>
                )}
                <p className="text-[10px] leading-relaxed text-[#a69a8f]">
                  Receba lançamentos selecionados, histórias de criadores e novidades do mercado.
                </p>
              </div>
            </div>
          </div>

          {/* Middle Brand Bar: integrated stripe inside the container */}
          <div className="bg-[#38220f] border-y border-[#4a2e1c] px-6 lg:px-8 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center text-xs">
              <span className="font-black text-xl text-[#f7f4ed] tracking-wider font-mono">KURIO</span>
              <span className="text-[#a69a8f] text-[11px] leading-tight">
                Feito para colecionadores,<br className="hidden sm:inline" />criadores e cultura
              </span>
              <span className="text-[#a69a8f] text-[11px]">contato@email.com</span>
              <span className="text-[#a69a8f] text-[11px] lg:text-right">+55 11 4002 8922</span>
            </div>
          </div>

          {/* Bottom Links: inside the same unified container */}
          <div className="px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-[11px]">
              {/* Column 1: Meu perfil */}
              <div>
                <h4 className="font-bold text-[#f7f4ed] mb-3 uppercase tracking-wider text-[11px]">Meu perfil</h4>
                <ul className="space-y-1 text-[#a69a8f]">
                  <li><Link to="/perfil" className="hover:text-[#f7f4ed] inline-block py-1">Meu perfil</Link></li>
                  <li><span className="hover:text-[#f7f4ed] cursor-pointer inline-block py-1">Minha coleção</span></li>
                  <li><span className="hover:text-[#f7f4ed] cursor-pointer inline-block py-1">Atividade</span></li>
                  <li><span className="hover:text-[#f7f4ed] cursor-pointer inline-block py-1">Estúdio do criador</span></li>
                  <li><span className="hover:text-[#f7f4ed] cursor-pointer inline-block py-1">Lista de interesse</span></li>
                </ul>
              </div>

              {/* Column 2: Central de ajuda */}
              <div>
                <h4 className="font-bold text-[#f7f4ed] mb-3 uppercase tracking-wider text-[11px]">Central de ajuda</h4>
                <ul className="space-y-1 text-[#a69a8f]">
                  <li><span className="hover:text-[#f7f4ed] cursor-pointer inline-block py-1">Central de ajuda</span></li>
                  <li><span className="hover:text-[#f7f4ed] cursor-pointer inline-block py-1">Como comprar NFTs</span></li>
                  <li><span className="hover:text-[#f7f4ed] cursor-pointer inline-block py-1">Carteira e segurança</span></li>
                  <li><span className="hover:text-[#f7f4ed] cursor-pointer inline-block py-1">Política do mercado</span></li>
                  <li><span className="hover:text-[#f7f4ed] cursor-pointer inline-block py-1">Denunciar item</span></li>
                </ul>
              </div>

              {/* Column 3: Coleções */}
              <div>
                <h4 className="font-bold text-[#f7f4ed] mb-3 uppercase tracking-wider text-[11px]">Coleções</h4>
                <ul className="space-y-1 text-[#a69a8f]">
                  <li><Link to="/" search={{ category: 'arte-digital', page: 1 }} className="hover:text-[#f7f4ed] inline-block py-1">Arte digital</Link></li>
                  <li><Link to="/" search={{ category: 'fotografia', page: 1 }} className="hover:text-[#f7f4ed] inline-block py-1">Fotografia</Link></li>
                  <li><Link to="/" search={{ category: 'musica', page: 1 }} className="hover:text-[#f7f4ed] inline-block py-1">Música</Link></li>
                  <li><Link to="/" search={{ category: 'arte-3d', page: 1 }} className="hover:text-[#f7f4ed] inline-block py-1">Arte 3D</Link></li>
                  <li><Link to="/" search={{ category: 'utilidade', page: 1 }} className="hover:text-[#f7f4ed] inline-block py-1">Utilidade</Link></li>
                </ul>
              </div>

              {/* Column 4: Redes sociais & Carteiras compatíveis */}
              <div className="space-y-5">
                <div>
                  <h4 className="font-bold text-[#f7f4ed] mb-2 uppercase tracking-wider text-[11px]">Redes sociais</h4>
                  <div className="flex items-center gap-2 text-[#a69a8f]">
                    <a
                      href="#facebook"
                      className="w-7 h-7 rounded border border-[#3d271f] flex items-center justify-center hover:border-[#d28a4c] hover:text-[#d28a4c] transition-colors"
                      aria-label="Facebook"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                      </svg>
                    </a>
                    <a
                      href="#instagram"
                      className="w-7 h-7 rounded border border-[#3d271f] flex items-center justify-center hover:border-[#d28a4c] hover:text-[#d28a4c] transition-colors"
                      aria-label="Instagram"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                    <a
                      href="#twitter"
                      className="w-7 h-7 rounded border border-[#3d271f] flex items-center justify-center hover:border-[#d28a4c] hover:text-[#d28a4c] transition-colors"
                      aria-label="Twitter"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                    <a
                      href="#linkedin"
                      className="w-7 h-7 rounded border border-[#3d271f] flex items-center justify-center hover:border-[#d28a4c] hover:text-[#d28a4c] transition-colors"
                      aria-label="LinkedIn"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                    <a
                      href="#youtube"
                      className="w-7 h-7 rounded border border-[#3d271f] flex items-center justify-center hover:border-[#d28a4c] hover:text-[#d28a4c] transition-colors"
                      aria-label="YouTube"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    </a>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-[#f7f4ed] mb-2 uppercase tracking-wider text-[11px]">Carteiras compatíveis</h4>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#3d271f] bg-[#1a0f0d] text-[10px] font-bold text-[#d28a4c] tracking-wider uppercase font-mono">
                    <span>METAMASK</span>
                    <span>·</span>
                    <span>WALLETCONNECT</span>
                    <span>·</span>
                    <span>COINBASE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 pb-2 text-center text-[#a69a8f] text-[11px]">
          © 2026 Kurio. Propriedade digital para todos.
        </div>
      </div>
    </footer>
  )
}
