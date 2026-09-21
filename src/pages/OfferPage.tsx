import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Heart, Droplets, Flame, BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react';

interface OfferPageProps {
  displayResolution: { width: number; height: number; deviceType: string; containerClass: string };
}

export const OfferPage: React.FC<OfferPageProps> = ({ displayResolution }) => {
  const offerItems = [
    {
      id: 'miody',
      title: 'Miód Pszczeli – Odmianowy & Surowy',
      badge: 'Baza Pasieki',
      image: 'https://pasiekausza.pl/wp-content/uploads/2022/02/oferta-miody-infobox.jpg',
      icon: Droplets,
      description:
        'Wiesz, że to właśnie prawdziwy miód jest jednym z najbogatszych w składniki odżywcze darów natury? W naszej wędrownej pasiece nie standaryzujemy miodu – każdy słoiczek różni się smakiem, barwą i aromatem w zależności od leśnych i łąkowych pożytków Dolnego Śląska.',
      bullets: [
        '100% naturalny, surowy miód bez podgrzewania powyżej 36°C',
        'Bogaty w aktywne enzymy (inhibina, lizozym, apidycyna)',
        'Miód lipowy, rzepakowy, akacjowy, spadziowy, wrzosowy, wielokwiat',
      ],
      ctaText: 'Zobacz miody w sklepie',
      ctaLink: '/sklep',
    },
    {
      id: 'pierzga',
      title: 'Pierzga Pszczela (Bee Bread)',
      badge: 'Superfood Ula',
      image: 'https://pasiekausza.pl/wp-content/uploads/2022/02/oferta-pierzga.jpg',
      icon: Sparkles,
      description:
        'Pierzga to pyłek kwiatowy zebrany przez pszczoły, wzbogacony miodem i enzymami ślinowymi, a następnie poddany naturalnej fermentacji mlekowej w plastrze pszczelim. Wartość odżywcza i profilaktyczna pierzgi jest znacznie wyższa niż zwykłego pyłku dzięki doskonałej bioprzyswajalności.',
      bullets: [
        'Silne wsparcie przy rekonwalescencji, anemiach i osłabieniu',
        'Naturalny probiotyk regenerujący florę bakteryjną jelit',
        'Pokarm, którym pszczoły karmią matkę i młode larwy',
      ],
      ctaText: 'Zobacz pierzgę w sklepie',
      ctaLink: '/produkt/pierzga-pszczela',
    },
    {
      id: 'propolis',
      title: 'Propolis – Kit Pszczeli',
      badge: 'Naturalny Antybiotyk',
      image: 'https://pasiekausza.pl/wp-content/uploads/2022/02/oferta-propolis.jpg',
      icon: ShieldCheck,
      description:
        'Substancja żywiczna wytwarzana przez pszczoły do sterylizacji i uszczelniania ula przed bakteriami, wirusami i grzybami. W skład kitu pszczelego wchodzi ponad 300 aktywnych związków organicznych (flawonoidy, olejki eteryczne, mikroelementy).',
      bullets: [
        'Wybitne działanie antybakteryjne, przeciwgrzybicze i gojące',
        'Błyskawiczna ulga przy bólach gardła, infekcjach jamy ustnej i dziąseł',
        'Naturalna tarcza układu oddechowego i odpornościowego',
      ],
      ctaText: 'Zobacz propolis w sklepie',
      ctaLink: '/produkt/propolis-kit',
    },
    {
      id: 'pylek',
      title: 'Pyłek Pszczeli Kwiatowy',
      badge: 'Bomba Witaminowa',
      image: 'https://pasiekausza.pl/wp-content/uploads/2022/02/pylek-pszczeli.jpg',
      icon: Heart,
      description:
        'Miód to nie jedyny skarb pozyskiwany z pasieki. Pyłek kwiatowy zebrany w postaci różnobarwnych obnóży wzmacnia organizm, zwiększa liczbę czerwonych ciałek krwi, stabilizuje poziom żelaza i wspomaga naturalny detoks organizmu.',
      bullets: [
        'Bogaty w białko roślinne, aminokwasy egzogenne i witaminy z grupy B',
        'Wspomaga prawidłową pracę układu krążenia i obniża cholesterol',
        'Znakomicie wpływa na witalność, pamięć oraz stan skóry, włosów i paznokci',
      ],
      ctaText: 'Zobacz pyłek w sklepie',
      ctaLink: '/produkt/pylek-pszczeli',
    },
    {
      id: 'wosk',
      title: 'Wosk Pszczeli & Świece',
      badge: 'Czyste Światło',
      image: 'https://pasiekausza.pl/wp-content/uploads/2022/02/oferta-wosk-pszeczeli.jpg',
      icon: Flame,
      description:
        'Wytwarzany przez młode pszczoły robotnice za pomocą gruczołów woskowych w spektakularnym procesie łączenia się w łańcuchy. Przez stulecia wosk pszczeli służył do wyrobu pachnących świec, które jonizują powietrze i oczyszczają dom z kurzu i alergenów.',
      bullets: [
        '100% czysty wosk z naszej pasieki bez grama szkodliwej parafiny',
        'Piękny, miodowo-propolisowy aromat palącej się świecy',
        'Świece odlewane i zwijane z naturalnej węzy pszczelej',
      ],
      ctaText: 'Zobacz świece w sklepie',
      ctaLink: '/produkt/swieca-wosk-pszczeli',
    },
    {
      id: 'szkolenia',
      title: 'Odkłady Pszczele & Szkolenia',
      badge: 'Dla Pszczelarzy',
      image: 'https://pasiekausza.pl/wp-content/uploads/2022/02/oferta-oklady-683x1024.jpg',
      icon: BookOpen,
      description:
        'Z pasją dzielimy się naszą wiedzą pszczelarską zdobytą przez lata pracy. Oferujemy zdrowe odkłady pszczele na ramkach wielkopolskich z młodymi matkami oraz indywidualne pakiety szkoleniowe dla początkujących pasjonatów pszczelarstwa.',
      bullets: [
        'Odkłady pod stałą kontrolą Powiatowego Lekarza Weterynarii',
        'Praktyczna nauka pracy przy ulu bez stresu i dróg na skróty',
        'Wsparcie merytoryczne i doradztwo w doborze sprzętu',
      ],
      ctaText: 'Szczegóły odkładów & szkoleń',
      ctaLink: '/produkt/odklad-szkolenie-pszczele',
    },
  ];

  return (
    <main className="min-h-screen bg-[#FAF7F2] pb-24">
      {/* Header Banner */}
      <section className="bg-[#2D2821] text-[#FAF5ED] pt-14 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#D9821E_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        <div className={`adaptive-container ${displayResolution.containerClass} px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4 max-w-3xl mx-auto`}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#3F372C] text-[#E5983A] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Oferta Pasieki Wędrownej Usza</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#FAF5ED] tracking-tight">
            Poznaj Skarby Naszej Pasieki
          </h1>
          <p className="text-sm sm:text-base text-[#C7BDB0] leading-relaxed">
            Miód to dopiero początek. W naszej pasiece pozyskujemy najcenniejsze dary ula: pierzgę, propolis, pyłek kwiatowy, wosk pszczeli oraz zdrowe rodziny pszczele.
          </p>
        </div>
      </section>

      {/* Offer Grid */}
      <section className={`adaptive-container ${displayResolution.containerClass} px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 space-y-12`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offerItems.map(item => {
            const Icon = item.icon;
            return (
              <div 
                key={item.id}
                className="bg-white rounded-3xl overflow-hidden border border-[#E7DCCE] shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Card Image */}
                <div className="h-56 overflow-hidden relative">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-[#2D2821]/85 backdrop-blur-md text-[#E5983A] text-[11px] font-bold tracking-wide">
                      {item.badge}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#8B5337] shadow-xs">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <h3 className="font-serif text-xl font-bold text-[#23201C] tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#615444] leading-relaxed">
                      {item.description}
                    </p>

                    <div className="pt-2 border-t border-[#EFE5D8] space-y-2">
                      {item.bullets.map((bullet, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-[11px] text-[#524536]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#52B788] shrink-0 mt-0.5" />
                          <span>{bullet}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4">
                    <Link
                      to={item.ctaLink}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#FAF5EE] hover:bg-[#8B5337] text-[#8B5337] hover:text-white border border-[#DFCBB5] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>{item.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Vet Care & Quality Banner */}
      <section className={`adaptive-container ${displayResolution.containerClass} px-4 sm:px-6 lg:px-8 mt-20`}>
        <div className="rounded-3xl bg-[#2D2821] text-[#FAF5ED] p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-4 shadow-xl">
          <ShieldCheck className="w-10 h-10 text-[#52B788] mx-auto" />
          <h3 className="font-serif text-2xl font-bold text-[#FAF5ED]">
            Bezpieczeństwo i Pewność Pochodzenia
          </h3>
          <p className="text-xs sm:text-sm text-[#CFC2B0] leading-relaxed">
            Wszystkie nasze produkty pszczele – zarówno miód, jak i pyłek, pierzga oraz propolis – pochodzą wyłącznie z naszych rodzin pszczelich będących pod stałą opieką Powiatowego Lekarza Weterynarii. Kupując u nas, wspierasz polskie pszczelarstwo wędrowne.
          </p>
          <div className="pt-2">
            <Link 
              to="/sklep" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E5983A] hover:bg-[#D4892A] text-[#24211D] text-xs font-bold transition-all shadow-md"
            >
              <span>Przejdź do zamawiania w sklepie</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};
