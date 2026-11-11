import React from 'react'
import { Link } from '@tanstack/react-router'

export const PromoBanners: React.FC = () => {
  return (
    <section className="py-8 font-mono">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Banner 1: Genesis Edition matching user reference */}
          <div className="bg-[#1c1410] border border-[#2d1e17] rounded-2xl p-5 sm:p-6 flex flex-row items-center gap-5 shadow-xl">
            <div className="w-28 sm:w-44 aspect-square rounded-2xl overflow-hidden bg-[#ded7cb] border border-[#2d1e17] shrink-0">
              <img
                src="/assets/nfts/banner_genesis_portrait.png"
                alt="Lançamentos gênesis de edição limitada"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 space-y-2.5">
              <h3 className="text-sm sm:text-base font-bold text-[#f7f4ed] leading-snug">
                Lançamentos gênesis <br className="hidden sm:inline" />de edição limitada
              </h3>
              <p className="text-[11px] sm:text-xs text-[#a69a8f] leading-relaxed">
                Colecione edições escassas diretamente dos criadores antes da revelação pública.
              </p>
              <div className="pt-1">
                <Link
                  to="/nft/$id"
                  params={{ id: 'nft-1' }}
                  className="inline-flex items-center gap-1.5 bg-[#d28a4c] hover:bg-[#c37c3e] text-[#140d0a] font-bold px-4 sm:px-5 py-2 rounded-lg text-xs transition-colors cursor-pointer shadow-md"
                >
                  <span>Explorar</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Banner 2: Digital Art matching user reference */}
          <div className="bg-[#1c1410] border border-[#2d1e17] rounded-2xl p-5 sm:p-6 flex flex-row items-center gap-5 shadow-xl">
            <div className="w-28 sm:w-44 aspect-square rounded-2xl overflow-hidden bg-[#ded7cb] border border-[#2d1e17] shrink-0">
              <img
                src="/assets/nfts/banner_digital_art_portrait.png"
                alt="Arte digital selecionada e muito mais"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 space-y-2.5">
              <h3 className="text-sm sm:text-base font-bold text-[#f7f4ed] leading-snug">
                Arte digital selecionada <br className="hidden sm:inline" />e muito mais
              </h3>
              <p className="text-[11px] sm:text-xs text-[#a69a8f] leading-relaxed">
                Explore novos artistas, coleções verificadas e obras digitais que definem a cultura.
              </p>
              <div className="pt-1">
                <Link
                  to="/"
                  search={{ category: 'arte-digital', page: 1 }}
                  className="inline-flex items-center gap-1.5 bg-[#d28a4c] hover:bg-[#c37c3e] text-[#140d0a] font-bold px-4 sm:px-5 py-2 rounded-lg text-xs transition-colors cursor-pointer shadow-md"
                >
                  <span>Explorar</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
