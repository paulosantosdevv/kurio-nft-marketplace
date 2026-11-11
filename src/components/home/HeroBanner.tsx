import React from 'react'

export const HeroBanner: React.FC = () => {
  const handleScrollToCatalog = () => {
    const catalogElement = document.getElementById('catalogo')
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative pt-6 pb-10 sm:pt-8 sm:pb-14">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Hero Card matching Mobile/Início.png */}
        <div className="block md:hidden bg-gradient-to-r from-[#2a170f] via-[#3a2014] to-[#1e130e] border border-[#3d251a] rounded-3xl p-5 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 space-y-2">
              <span className="text-[10px] text-[#a69a8f] font-mono block">
                Bem-vindo à Kurio
              </span>
              <p className="text-lg font-black text-[#f7f4ed] leading-tight font-mono">
                SEJA DONO DO FUTURO <br />DA ARTE DIGITAL
              </p>
              <p className="text-[10px] text-[#a69a8f] leading-relaxed font-mono">
                Descubra NFTs selecionados de criadores do mundo todo.
              </p>
              <div className="pt-1">
                <button
                  onClick={handleScrollToCatalog}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#d28a4c] hover:underline cursor-pointer"
                >
                  <span>EXPLORAR</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Mobile Hero Graphic */}
            <div className="relative w-32 shrink-0">
              <div className="aspect-square rounded-2xl overflow-hidden bg-[#ded7cb] border border-[#2d1e17] shadow-lg">
                <img
                  src="/assets/nfts/card_1_emerald_ape.webp"
                  alt="Emerald Ape #042"
                  fetchPriority="high"
                  decoding="async"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -left-2 w-10 h-10 rounded-xl overflow-hidden bg-[#ded7cb] border-2 border-[#1c1410] shadow-md">
                <img
                  src="/assets/nfts/card_2_sage_nomad.webp"
                  alt="Sage Nomad"
                  loading="lazy"
                  decoding="async"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center items-center gap-1.5 pt-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d28a4c]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#5e4b3e]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#5e4b3e]" />
          </div>
        </div>

        {/* Desktop Hero Layout matching Desktop/Início.png */}
        <div className="hidden md:block space-y-6">
          <div className="grid grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Text & CTA */}
            <div className="col-span-7 space-y-6">
              <p className="text-xs text-[#a69a8f] font-mono tracking-wider">
                Bem-vindo à Kurio
              </p>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#f7f4ed] tracking-tight leading-[1.15] font-mono">
                SEJA DONO DO FUTURO <br />DA ARTE DIGITAL
              </h1>

              <p className="text-xs sm:text-sm text-[#a69a8f] max-w-lg leading-relaxed font-mono">
                Descubra NFTs selecionados de criadores emergentes e consagrados. Colecione arte digital rara, apoie artistas e tenha uma parte da cultura da internet.
              </p>

              <div className="pt-2">
                <button
                  onClick={handleScrollToCatalog}
                  className="bg-[#d28a4c] hover:bg-[#e0985a] text-[#140d0a] font-mono text-xs font-bold px-8 py-3 rounded-xl tracking-wider uppercase transition-colors cursor-pointer shadow-md"
                >
                  EXPLORAR
                </button>
              </div>
            </div>

            {/* Right Column: Hero Character Artwork (Figma Desktop/Início) */}
            <div className="col-span-5 flex justify-end">
              <div className="relative w-full max-w-[460px] aspect-square rounded-[32px] overflow-hidden shadow-2xl border border-[#3d271f] bg-[#ded7cb]">
                <img
                  src="/assets/nfts/hero_character.webp"
                  alt="Emerald Ape NFT em destaque — Kurio"
                  fetchPriority="high"
                  decoding="async"
                  width={460}
                  height={460}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Carousel dots indicator centered */}
          <div className="flex justify-center items-center gap-2 pt-2">
            <span className="w-2 h-2 rounded-full bg-[#d28a4c]" />
            <span className="w-2 h-2 rounded-full bg-[#3d2b21]" />
            <span className="w-2 h-2 rounded-full bg-[#3d2b21]" />
          </div>
        </div>
      </div>
    </section>
  )
}
