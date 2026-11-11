import React from 'react'

export const MintDiary: React.FC = () => {
  const articles = [
    {
      id: 1,
      image: '/assets/nfts/exact_diary_1.png',
      date: '12 de setembro | Leitura de 4 min',
      title: 'Como funciona a propriedade de NFTs',
      description: 'Aprenda a colecionar, negociar e verificar ativos digitais.',
    },
    {
      id: 2,
      image: '/assets/nfts/exact_diary_2.png',
      date: '13 de setembro | Leitura de 2 min',
      title: '10 artistas digitais para acompanhar',
      description: 'Conheça criadores que moldam a cultura digital.',
    },
    {
      id: 3,
      image: '/assets/nfts/exact_diary_3.png',
      date: '15 de setembro | Leitura de 3 min',
      title: 'Raridade, atributos e procedência',
      description: 'Entenda raridade, procedência, direitos autorais e utilidade.',
    },
    {
      id: 4,
      image: '/assets/nfts/exact_diary_4.png',
      date: '15 de setembro | Leitura de 2 min',
      title: 'Como proteger sua carteira',
      description: 'Proteja sua carteira, seus ativos e sua identidade.',
    },
  ]

  return (
    <section className="py-14 font-mono">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-[#f7f4ed]">
            Diário da Cunhagem
          </h2>
          <p className="text-xs text-[#8a7b70] max-w-xl mx-auto">
            Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((art) => (
            <article
              key={art.id}
              className="bg-[#1c1410] border border-[#2d1e17] rounded-2xl p-4 flex flex-col group hover:border-[#d28a4c] transition-colors shadow-lg"
            >
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#ded7cb] border border-[#2d1e17] mb-4">
                <img
                  src={art.image}
                  alt={art.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="flex flex-col flex-1 justify-between space-y-3">
                <div className="space-y-1.5">
                  <span className="text-[10px] text-[#8a7b70] block">
                    {art.date}
                  </span>
                  <h3 className="text-xs font-bold text-[#f7f4ed] leading-snug group-hover:text-[#d28a4c] transition-colors">
                    {art.title}
                  </h3>
                  <p className="text-[11px] text-[#8a7b70] leading-relaxed">
                    {art.description}
                  </p>
                </div>

                <div className="pt-2">
                  <span className="text-xs text-[#d28a4c] font-bold flex items-center gap-1 cursor-pointer hover:underline">
                    Ler mais →
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
