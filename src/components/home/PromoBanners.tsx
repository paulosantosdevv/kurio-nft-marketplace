import React from 'react'
import { Link } from '@tanstack/react-router'

export const PromoBanners: React.FC = () => {
  return (
    <section className="py-8 font-mono">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Banner 1: Genesis Edition matching user reference */}
          <div className="bg-[#241612] border border-[#3d271f] rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-row items-center gap-5 sm:gap-6 shadow-xl">
            <div className="w-28 sm:w-44 aspect-square rounded-2xl overflow-hidden bg-[#ded7cb] border border-[#3d271f] shrink-0">
              <img
                src="/assets/nfts/banner_genesis_portrait.png"
                alt="Lançamentos gênesis de edição limitada"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 flex flex-col justify-between items-end text-right space-y-2.5 sm:space-y-3">
              <h3 className="text-sm sm:text-base font-bold text-[#f7f4ed] leading-snug text-right">
                Lançamentos gênesis <br />de edição limitada
              </h3>
              <p className="text-[11px] sm:text-xs text-[#a69a8f] leading-relaxed text-right">
                Colecione edições escassas <br className="hidden sm:inline" />diretamente dos criadores antes <br className="hidden sm:inline" />da revelação pública.
              </p>
              <div className="pt-1 flex justify-end w-full">
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
          <div className="bg-[#241612] border border-[#3d271f] rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-row items-center gap-5 sm:gap-6 shadow-xl">
            <div className="w-28 sm:w-44 aspect-square rounded-2xl overflow-hidden bg-[#ded7cb] border border-[#3d271f] shrink-0">
              <img
                src="/assets/nfts/banner_digital_art_portrait.png"
                alt="Arte digital selecionada e muito mais"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 flex flex-col justify-between items-end text-right space-y-2.5 sm:space-y-3">
              <h3 className="text-sm sm:text-base font-bold text-[#f7f4ed] leading-snug text-right">
                Arte digital selecionada <br />e muito mais
              </h3>
              <p className="text-[11px] sm:text-xs text-[#a69a8f] leading-relaxed text-right">
                Explore novos artistas, <br className="hidden sm:inline" />coleções verificadas e obras <br className="hidden sm:inline" />digitais que definem a.
              </p>
              <div className="pt-1 flex justify-end w-full">
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
