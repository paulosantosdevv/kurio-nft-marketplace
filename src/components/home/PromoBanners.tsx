import React from 'react'
import { Link } from '@tanstack/react-router'

export const PromoBanners: React.FC = () => {
  return (
    <section className="py-8">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Banner 1: Genesis Edition */}
          <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[#2d1c15] group">
            <Link to="/nft/$id" params={{ id: 'nft-1' }} className="block">
              <img
                src="/assets/nfts/banner_genesis.png"
                alt="Lançamentos gênesis de edição limitada"
                className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-300"
              />
            </Link>
          </div>

          {/* Banner 2: Digital Art */}
          <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[#2d1c15] group">
            <Link to="/" className="block">
              <img
                src="/assets/nfts/banner_digital_art.png"
                alt="Arte digital selecionada e muito mais"
                className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-300"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
