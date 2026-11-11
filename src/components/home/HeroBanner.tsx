import React from 'react'

export const HeroBanner: React.FC = () => {
  const handleScrollToCatalog = () => {
    const catalogElement = document.getElementById('catalogo')
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative pt-12 pb-16">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Text & CTA */}
          <div className="lg:col-span-7 space-y-5">
            <p className="text-xs text-[#8a7b70] tracking-wide">
              — Bem-vindo à Kurio
            </p>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#f5efe6] tracking-tight leading-[1.15] font-heading">
              SEJA DONO DO FUTURO<br />DA ARTE DIGITAL
            </h1>

            <p className="text-xs sm:text-sm text-[#8a7b70] max-w-lg leading-relaxed">
              Descubra NFTs selecionados de criadores emergentes e consagrados. Colecione arte digital rara, apoie artistas e tenha uma parte da cultura da internet.
            </p>

            <div className="pt-2">
              <button
                onClick={handleScrollToCatalog}
                className="bg-[#d28a4c] hover:bg-[#b87438] text-white text-xs font-bold px-6 py-2.5 rounded-lg tracking-wider uppercase transition-colors cursor-pointer shadow-md"
              >
                EXPLORAR
              </button>
            </div>

            {/* Carousel dots indicator */}
            <div className="flex items-center gap-2 pt-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3d281e]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#d28a4c]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#3d281e]" />
            </div>
          </div>

          {/* Right Column: Hero Character Artwork */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[420px] rounded-[28px] overflow-hidden shadow-2xl border border-[#2d1c15]">
              <img
                src="/assets/nfts/hero_character.png"
                alt="Ape NFT em destaque - Kurio Marketplace"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
