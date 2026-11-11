import React from 'react'

export const MintDiary: React.FC = () => {
  const articles = [
    {
      id: 1,
      image: '/assets/nfts/blog_1.png',
      date: '12 de setembro | Leitura de 4 min',
      title: 'Como funciona a propriedade de NFTs',
      description: 'Aprenda a colecionar, negociar e verificar ativos digitais.',
    },
    {
      id: 2,
      image: '/assets/nfts/blog_2.png',
      date: '10 de setembro | Leitura de 5 min',
      title: '10 artistas digitais para acompanhar',
      description: 'Conheça criadores que moldam a cultura digital.',
    },
    {
      id: 3,
      image: '/assets/nfts/blog_3.png',
      date: '08 de setembro | Leitura de 3 min',
      title: 'Raridade, atributos e procedência',
      description: 'Entenda raridade, procedência, direitos autorais e utilidade.',
    },
    {
      id: 4,
      image: '/assets/nfts/blog_4.png',
      date: '05 de setembro | Leitura de 2 min',
      title: 'Como proteger sua carteira',
      description: 'Proteja sua carteira, seus ativos e sua identidade.',
    },
  ]

  return (
    <section className="py-12">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#f5efe6] font-heading">
            Diário da Cunhagem
          </h2>
          <p className="text-xs text-[#8a7b70] mt-1">
            Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {articles.map((art) => (
            <article
              key={art.id}
              className="bg-[#1a110d] border border-[#2d1c15] rounded-2xl overflow-hidden flex flex-col group hover:border-[#d28a4c]/40 transition-colors"
            >
              <div className="h-36 overflow-hidden bg-[#241712]">
                <img
                  src={art.image}
                  alt={art.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <span className="text-[10px] text-[#786b62] block mb-1">
                    {art.date}
                  </span>
                  <h3 className="text-xs font-bold text-[#f5efe6] leading-snug group-hover:text-[#d28a4c] transition-colors">
                    {art.title}
                  </h3>
                  <p className="text-[11px] text-[#8a7b70] mt-1.5 line-clamp-2">
                    {art.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-[#241712]">
                  <span className="text-[11px] text-[#d28a4c] font-semibold flex items-center gap-1 cursor-pointer hover:underline">
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
