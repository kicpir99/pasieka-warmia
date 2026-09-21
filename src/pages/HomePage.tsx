import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { HoneyQualitySection } from '../components/HoneyQualitySection';
import { HoneyFAQSection } from '../components/HoneyFAQSection';
import { ProductCard } from '../components/ProductCard';
import { PagePreloader } from '../components/PagePreloader';
import { HoneyProduct } from '../types';
import { HONEY_PRODUCTS, HONEY_VARIETIES } from '../data/honeyProducts';
import { Sparkles, ArrowRight, ShieldCheck, Heart, Droplets, Star, Quote, MapPin } from 'lucide-react';

const ProductDetailModal = React.lazy(() => import('../components/ProductDetailModal').then(m => ({ default: m.ProductDetailModal })));
const HoneyFinderQuiz = React.lazy(() => import('../components/HoneyFinderQuiz').then(m => ({ default: m.HoneyFinderQuiz })));

interface HomePageProps {
  onAddToCart: (product: HoneyProduct, weightGrams: number, pricePln: number) => void;
  displayResolution: { width: number; height: number; deviceType: string; containerClass: string };
  toggleCompare: (product: HoneyProduct) => void;
  compareList: HoneyProduct[];
  scrollToProducts: () => void;
  onOpenQuiz?: () => void;
  hasPreloadedHome?: boolean;
  onPreloadComplete?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onAddToCart,
  displayResolution,
  toggleCompare,
  compareList,
  scrollToProducts,
  onOpenQuiz,
  hasPreloadedHome = false,
  onPreloadComplete,
}) => {
  const [detailProduct, setDetailProduct] = useState<HoneyProduct | null>(null);
  const [localQuizOpen, setLocalQuizOpen] = useState(false);
  const [preloaderDoneLocally, setPreloaderDoneLocally] = useState(false);

  const handleOpenQuiz = onOpenQuiz || (() => setLocalQuizOpen(true));

  // Top 3 bestsellers for featured preview
  const featuredProducts = HONEY_PRODUCTS.filter(p => p.isBestseller).slice(0, 3);

  const reviews = [
    {
      author: 'Anna',
      role: 'Wielbicielka miodów',
      text: 'Pierwszym krokiem do zostania odnoszącym sukcesy pszczelarzem jest nauczenie się jak najwięcej o samych pszczołach. Ule wymagają dobrego zarządzania i opieki, co wymaga czasu – pasieka Usza nad wszystkim panuje ;)',
      rating: 5,
    },
    {
      author: 'Julia',
      role: 'Smakuje wszystkie miody',
      text: 'Miody bardzo dobre jakościowo i smakowo, za każdym razem kupuję coś nowego i na żadnym miodzie się nie zawiodłam – polecam serdecznie wyroby z pasieki Usza.',
      rating: 5,
    },
    {
      author: 'Marek z Wrocławia',
      role: 'Klient stały',
      text: 'Niezwykły miód wrzosowy i leśny. Czuć, że nikt go nie przegrzewał ani nie standaryzował. Zupełnie inna kategoria niż to, co można kupić w sklepach.',
      rating: 5,
    },
  ];

  return (
    <>
      {/* Preloader tylko przy pierwszym załadowaniu strony głównej */}
      {!hasPreloadedHome && !preloaderDoneLocally && (
        <PagePreloader
          onComplete={() => {
            setPreloaderDoneLocally(true);
            if (onPreloadComplete) onPreloadComplete();
          }}
        />
      )}

      <main className="flex-1">
        {/* Hero z interaktywną karuzelą 3D i obrotowym słoikiem 360° */}
        <Hero
          onAddToCart={onAddToCart}
          containerClass={displayResolution.containerClass}
          scrollToProducts={scrollToProducts}
          onOpenQuiz={handleOpenQuiz}
          onToggleCompare={toggleCompare}
          isCompared={(p) => compareList.some(item => item.id === p.id)}
        />

        {/* Sekcja: Nasza Filozofia – Pasieka Usza */}
        <section className="py-20 bg-white border-b border-[#E8DECFA0]">
          <div className={`adaptive-container ${displayResolution.containerClass} px-4 sm:px-6 lg:px-8`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              <div className="lg:col-span-6 space-y-5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF0E1] text-[#8B5337] text-xs font-semibold">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Ciechów • Dolny Śląsk</span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#23201C] tracking-tight leading-tight">
                  Wędrowna pasieka z pasją i szacunkiem do pszczół
                </h2>

                <p className="text-sm sm:text-base text-[#594C3F] leading-relaxed">
                  Jesteśmy rodzinną pasieką wędrowną prowadzoną przez Magdalenę i Piotra Szymkowicz. Nasze ule wędrują za najczystszymi pożytkami Dolnego Śląska – od wiosennych sadów i mniszka, przez aleje lipowe i lasy, po fioletowe wrzosowiska.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E7DCCE] space-y-1.5">
                    <span className="text-sm font-bold text-[#8B5337] flex items-center gap-1.5">
                      🍯 Brak standaryzacji
                    </span>
                    <p className="text-xs text-[#6B5E4F] leading-relaxed">
                      Nie mieszamy całego miodu w jedną masę. Każdy słoik ma unikatowy charakter i smak stworzony przez pszczoły.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E7DCCE] space-y-1.5">
                    <span className="text-sm font-bold text-[#8B5337] flex items-center gap-1.5">
                      🌸 Promień 2 kilometrów
                    </span>
                    <p className="text-xs text-[#6B5E4F] leading-relaxed">
                      Pszczoły same decydują, który nektar i pyłek najbardziej im smakuje w otoczeniu leśnym i łąkowym.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/o-nas"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#8B5337] hover:bg-[#6D3F28] text-white text-xs font-bold transition-all shadow-sm"
                  >
                    <span>Poznaj całą naszą historię</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6 grid grid-cols-2 gap-4">
                <div className="rounded-2xl overflow-hidden border border-[#E7DCCE] shadow-md">
                  <img
                    src="https://pasiekausza.pl/wp-content/uploads/2022/02/DSC02154-683x1024.jpg"
                    alt="Praca przy ulach"
                    className="w-full h-72 sm:h-80 object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden border border-[#E7DCCE] shadow-md mt-6">
                  <img
                    src="https://pasiekausza.pl/wp-content/uploads/2022/02/DSC01985-683x1024.jpg"
                    alt="Plaster miodu w ulu"
                    className="w-full h-72 sm:h-80 object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Wybrane Odmiany Miodów – Bestsellery ze Sklepu */}
        <section className="py-20 bg-[#FAF7F2] border-b border-[#E8DECFA0]">
          <div className={`adaptive-container ${displayResolution.containerClass} px-4 sm:px-6 lg:px-8 space-y-12`}>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFE4D2] text-[#713F0C] text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-[#A05C12]" />
                  <span>Zbiory Wędrowne</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#23201C] tracking-tight">
                  Najchętniej Wybierane Miody
                </h2>
                <p className="text-xs sm:text-sm text-[#6B5E4F] max-w-xl">
                  Poznaj nasze tegoroczne zbiory surowego miodu niepoddanego obróbce termicznej.
                </p>
              </div>

              <div>
                <Link
                  to="/sklep"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1B4332] hover:bg-[#143326] text-white text-xs font-bold transition-all shadow-sm"
                >
                  <span>Przejdź do pełnego sklepu ({HONEY_VARIETIES.length} odmian miodu)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {featuredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                  onOpenDetail={setDetailProduct}
                  onToggleCompare={toggleCompare}
                  isCompared={compareList.some(p => p.id === product.id)}
                />
              ))}
            </div>

            {/* Skarby Ula Teaser */}
            <div className="bg-[#2D2821] text-[#FAF5ED] rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl">
              <div className="max-w-2xl space-y-4 relative z-10">
                <span className="px-3 py-1 rounded-full bg-[#3F372C] text-[#E5983A] text-xs font-bold">
                  Apiterapia & Odporność
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#FAF5ED]">
                  Pierzga, Propolis, Pyłek kwiatowy i Wosk
                </h3>
                <p className="text-xs sm:text-sm text-[#C7BDB0] leading-relaxed">
                  Odkryj najsilniejsze naturalne biostymulatory prosto z pasieki. Pomagają w rekonwalescencji, odbudowują odporność i wzmacniają cały organizm.
                </p>
                <div className="pt-2">
                  <Link
                    to="/oferta"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E5983A] hover:bg-[#D4892A] text-[#24211D] text-xs font-bold transition-all shadow-md"
                  >
                    <span>Poznaj właściwości pierzgi i propolisu</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Opinie Klientów */}
        <section className="py-20 bg-white border-b border-[#E8DECFA0]">
          <div className={`adaptive-container ${displayResolution.containerClass} px-4 sm:px-6 lg:px-8 space-y-12`}>
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF0E1] text-[#8B5337] text-xs font-semibold">
                <Heart className="w-3.5 h-3.5" />
                <span>Głosy Naszych Odbiorców</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#23201C] tracking-tight">
                Opinie o Miodach z Pasieki Usza
              </h2>
              <p className="text-xs sm:text-sm text-[#665848]">
                Nasze miody trafiają zarówno do domów koneserów, jak i do lokalnych sklepów ze zdrową żywnością.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.map((rev, idx) => (
                <div 
                  key={idx} 
                  className="bg-[#FAF8F5] rounded-2xl p-6 sm:p-8 border border-[#E7DCCE] shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-1 text-[#E5983A]">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-[#524536] italic leading-relaxed">
                      „{rev.text}”
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#EFE5D8]">
                    <span className="font-serif text-sm font-bold text-[#23201C] block">
                      {rev.author}
                    </span>
                    <span className="text-[11px] text-[#8A7966]">
                      {rev.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Standard Quality & FAQ */}
        <HoneyQualitySection containerClass={displayResolution.containerClass} />
        <HoneyFAQSection containerClass={displayResolution.containerClass} />
      </main>

      <React.Suspense fallback={null}>
        <ProductDetailModal
          product={detailProduct}
          onClose={() => setDetailProduct(null)}
          onAddToCart={onAddToCart}
          onOpenCompare={toggleCompare}
        />
        {!onOpenQuiz && (
          <HoneyFinderQuiz
            isOpen={localQuizOpen}
            onClose={() => setLocalQuizOpen(false)}
            onSelectProduct={(p) => setDetailProduct(p)}
          />
        )}
      </React.Suspense>
    </>
  );
};
