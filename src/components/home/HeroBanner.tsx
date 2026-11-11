import React from 'react'
import { Button } from '../ui/Button'
import { Link } from '@tanstack/react-router'
import { Sparkles, ArrowRight } from 'lucide-react'

export const HeroBanner: React.FC = () => {
  const handleScrollToCatalog = () => {
    const catalogElement = document.getElementById('catalogo')
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative overflow-hidden py-12 md:py-20 border-b border-[#2d1e17]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#d28a4c]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#241914] border border-[#d28a4c]/30 text-xs text-[#d28a4c] font-medium">
              <Sparkles className="w-3.5 h-3.5" /> Bem-vindo à Kurio
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#f7f4ed] tracking-tight leading-[1.1]">
              SEJA DONO DO FUTURO DA ARTE DIGITAL
            </h1>

            <p className="text-base sm:text-lg text-[#a69a8f] max-w-xl leading-relaxed">
              Descubra NFTs selecionados de criadores mundiais em arte digital verificada. Coleções raras, proveniência imutável e comunidade exclusiva.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Button size="lg" onClick={handleScrollToCatalog} className="font-bold">
                EXPLORAR CATÁLOGO <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <Link to="/cadastro">
                <Button size="lg" variant="secondary">
                  Criar Perfil
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Featured Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md bg-[#1b120e] border border-[#3d2b21] rounded-3xl p-4 shadow-2xl group transition-all duration-300 hover:border-[#d28a4c]/50">
              <Link to="/nft/$id" params={{ id: 'nft-1' }} className="block">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#140d0a] mb-4">
                  <img
                    src="/assets/nfts/emerald-ape.png"
                    alt="Emerald Ape #842 - Obra em destaque"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-[#d28a4c] text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-md uppercase tracking-wider">
                    Destaque da Semana
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[#f7f4ed] group-hover:text-[#d28a4c] transition-colors">
                      Emerald Ape #842
                    </h3>
                    <p className="text-xs text-[#a69a8f]">Coleção Kurio Editions • Criador Nova Sato</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#786b62] block uppercase tracking-wider">Preço Atual</span>
                    <span className="text-base font-extrabold text-[#d28a4c]">1.19 ETH</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
