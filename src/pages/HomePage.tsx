import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { HoneyCraftingJourney } from '../components/HoneyCraftingJourney';
import { HoneyQualitySection } from '../components/HoneyQualitySection';
import { HoneyFAQSection } from '../components/HoneyFAQSection';
import { ProductFilter } from '../components/ProductFilter';
import { FilterState, HoneyCategory, HoneyProduct, HealthIntentFilter } from '../types';
import { ProductCard } from '../components/ProductCard';
import { ApiaryStory } from '../components/ApiaryStory';
import { HoneyFinderQuiz } from '../components/HoneyFinderQuiz';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { PagePreloader } from '../components/PagePreloader';
import { HONEY_PRODUCTS } from '../data/honeyProducts';
import { getEnrichedProduct } from '../utils/honeyHelpers';
import { Sparkles, ArrowRight, ArrowUp } from 'lucide-react';

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
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const handleOpenQuiz = onOpenQuiz || (() => setLocalQuizOpen(true));
  const [searchParams, setSearchParams] = useSearchParams();

  const urlFlavorNote = searchParams.get('nuta');
  const urlCategory = searchParams.get('kategoria') as HoneyCategory | null;
  const urlHealthIntent = searchParams.get('intencja') as HealthIntentFilter | null;
  const validCategories: HoneyCategory[] = ['wszystkie', 'wiosenne', 'letnie', 'lesne-spadz', 'z-dodatkami', 'zestawy'];
  const validIntents: HealthIntentFilter[] = ['wszystkie', 'odpornosc', 'lagodne', 'koneser', 'prezent'];
  const initialCategory = urlCategory && validCategories.includes(urlCategory) ? urlCategory : 'wszystkie';
  const initialIntent = urlHealthIntent && validIntents.includes(urlHealthIntent) ? urlHealthIntent : 'wszystkie';

  const [filters, setFilters] = useState<FilterState>({
    category: initialCategory,
    healthIntent: initialIntent,
    consistency: 'all',
    intensity: 'all',
    flavorNote: urlFlavorNote || null,
    searchQuery: '',
    sortBy: 'popular',
  });

  const scrollToCatalogIfNeeded = () => {
    const catalogEl = document.getElementById('katalog');
    if (!catalogEl) return;
    const rect = catalogEl.getBoundingClientRect();
    // If the catalog is already comfortably visible, avoid jarring scroll jump
    const isAlreadyInView = rect.top >= -80 && rect.top <= 220;
    if (!isAlreadyInView) {
      scrollToProducts();
    }
  };

  // Keep filters in sync when URL search params change (e.g. navigation, back button, category links)
  useEffect(() => {
    const noteParam = searchParams.get('nuta') || null;
    const catParam = searchParams.get('kategoria') as HoneyCategory | null;
    const intentParam = searchParams.get('intencja') as HealthIntentFilter | null;
    const targetCat = catParam && validCategories.includes(catParam) ? catParam : 'wszystkie';
    const targetIntent = intentParam && validIntents.includes(intentParam) ? intentParam : 'wszystkie';

    setFilters(prev => {
      if (
        prev.flavorNote === noteParam && 
        prev.category === targetCat && 
        prev.healthIntent === targetIntent
      ) {
        return prev;
      }
      return {
        ...prev,
        flavorNote: noteParam,
        category: targetCat,
        healthIntent: targetIntent,
      };
    });
  }, [searchParams]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (newFilters.flavorNote) {
        next.set('nuta', newFilters.flavorNote);
      } else {
        next.delete('nuta');
      }
      if (newFilters.category && newFilters.category !== 'wszystkie') {
        next.set('kategoria', newFilters.category);
      } else {
        next.delete('kategoria');
      }
      if (newFilters.healthIntent && newFilters.healthIntent !== 'wszystkie') {
        next.set('intencja', newFilters.healthIntent);
      } else {
        next.delete('intencja');
      }
      return next;
    }, { replace: true });
  };

  const handleSelectFlavorNote = (note: string) => {
    const isCurrent = filters.flavorNote?.toLowerCase() === note.toLowerCase();
    const nextNote = isCurrent ? null : note;
    handleFilterChange({
      ...filters,
      flavorNote: nextNote
    });
    scrollToCatalogIfNeeded();
  };

  const filteredProducts = useMemo(() => {
    let result = HONEY_PRODUCTS;
    if (filters.category !== 'wszystkie') {
      result = result.filter((p) => p.category === filters.category);
    }
    if (filters.healthIntent && filters.healthIntent !== 'wszystkie') {
      result = result.filter((p) => {
        const enriched = getEnrichedProduct(p);
        return enriched.healthIntents.includes(filters.healthIntent as any);
      });
    }
    if (filters.consistency !== 'all') {
      result = result.filter((p) => p.consistency === filters.consistency);
    }
    if (filters.intensity !== 'all') {
      result = result.filter((p) => p.flavorIntensity === filters.intensity);
    }
    if (filters.flavorNote) {
      const target = filters.flavorNote.toLowerCase().trim();
      result = result.filter((p) =>
        p.flavorNotes.some((n) => {
          const lower = n.toLowerCase();
          return lower === target || lower.includes(target) || target.includes(lower);
        })
      );
    }
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.subtitle.toLowerCase().includes(query) ||
          p.flavorNotes.some((n) => n.toLowerCase().includes(query))
      );
    }
    if (filters.sortBy === 'price-asc') {
      result.sort((a, b) => a.sizes[0].pricePln - b.sizes[0].pricePln);
    } else if (filters.sortBy === 'price-desc') {
      result.sort((a, b) => b.sizes[0].pricePln - a.sizes[0].pricePln);
    }
    return result;
  }, [filters]);

  return (
    <>
      {!hasPreloadedHome && !preloaderDoneLocally && (
        <PagePreloader
          onComplete={() => {
            setTimeout(() => {
              setPreloaderDoneLocally(true);
              if (onPreloadComplete) {
                onPreloadComplete();
              }
            }, 800);
          }}
        />
      )}
      <main className="flex-1">
        <Hero
          onScrollToProducts={scrollToProducts}
          onOpenQuiz={handleOpenQuiz}
          onAddToCart={onAddToCart}
          onOpenProductDetail={setDetailProduct}
          displayResolution={displayResolution}
        />
        <HoneyCraftingJourney />
        <section id="katalog" className={`py-16 md:py-20 adaptive-container ${displayResolution.containerClass} px-4 sm:px-6 lg:px-8 2xl:px-10`}>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5983A]/10 border border-[#E5983A]/20 text-[#9E5A12] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Prosto z naszej pracowni
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#23201C] tracking-tight">
                Nasze Miody – Prawdziwe i Naturalne
              </h2>
              <p className="text-[15px] text-[#665A4B] leading-relaxed max-w-xl">
                Nie poprawiamy natury. Każdy słoik to autentyczny smak tegorocznych zbiorów, z zachowaniem pełni wartości odżywczych. Takie jak dawniej – dla Ciebie i Twojej rodziny.
              </p>
            </div>

            {/* DEDYKOWANY PRZYCISK DORADCY PASIECZNEGO (QUIZ) W SEKCJI 3 */}
            <div className="shrink-0">
              <button
                onClick={handleOpenQuiz}
                id="catalog-quiz-cta-btn"
                className="group w-full sm:w-auto flex items-center gap-3.5 px-5 py-3.5 rounded-2xl bg-[#1B4332] hover:bg-[#143326] text-white border border-[#2D5A45] shadow-md hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <div className="w-10 h-10 rounded-xl bg-[#E0A94F]/20 text-[#E0A94F] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-5 h-5 text-[#E0A94F]" />
                </div>
                <div className="text-left">
                  <div className="text-[11px] font-bold text-[#E0A94F] uppercase tracking-wider flex items-center gap-1">
                    <span>Nie wiesz, co wybrać?</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <span className="text-sm font-serif font-bold text-[#FAF7F2] block leading-tight">
                    Dobierz miód dla siebie
                  </span>
                </div>
              </button>
            </div>
          </div>
          <div className="mb-10">
            <ProductFilter
              filters={filters}
              onFilterChange={handleFilterChange}
              totalProductsCount={HONEY_PRODUCTS.length}
              filteredProductsCount={filteredProducts.length}
            />
          </div>
          {filteredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-5 gap-6">
                {filteredProducts.map((product, idx) => (
                  <div
                    key={product.id}
                    className={idx >= 6 && !isMobileExpanded ? 'hidden sm:block' : 'block'}
                  >
                    <ProductCard
                      product={product}
                      onAddToCart={onAddToCart}
                      onOpenDetails={(p) => setDetailProduct(p)}
                      onToggleCompare={toggleCompare}
                      isCompared={compareList.some(p => p.id === product.id)}
                      onSelectFlavorNote={handleSelectFlavorNote}
                      activeFlavorNote={filters.flavorNote}
                    />
                  </div>
                ))}
              </div>

              {/* Mobile Load More & Back to Top Controller */}
              {filteredProducts.length > 6 && (
                <div className="sm:hidden mt-8 p-4 bg-[#FAF6EE] rounded-2xl border border-[#D9821E]/20 text-center space-y-3">
                  {!isMobileExpanded ? (
                    <>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-semibold text-[#594D42]">
                          <span>Wyświetlasz 6 z {filteredProducts.length} miodów</span>
                          <span className="text-[#945209] font-bold">
                            {Math.round((6 / filteredProducts.length) * 100)}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-[#EADCCB] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#D9821E] to-[#1B4332] rounded-full transition-all duration-300"
                            style={{ width: `${(6 / filteredProducts.length) * 100}%` }}
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsMobileExpanded(true)}
                        className="w-full py-3.5 px-4 rounded-xl bg-[#1B4332] hover:bg-[#143326] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                        id="btn-pokaz-wszystkie-miody-mobile"
                      >
                        <span>🍯 Pokaż wszystkie miody ({filteredProducts.length})</span>
                      </button>
                    </>
                  ) : (
                    <div className="space-y-2.5">
                      <p className="text-xs font-semibold text-[#1B4332] flex items-center justify-center gap-1.5">
                        <span>✓ Wyświetlasz pełną ofertę {filteredProducts.length} miodów</span>
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const catalogElem = document.getElementById('katalog');
                            if (catalogElem) {
                              catalogElem.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                          className="flex-1 py-3 px-3 rounded-xl bg-[#2D2821] hover:bg-[#433B31] text-[#FAF5ED] text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                          id="btn-wroc-do-gory-katalogu-mobile"
                        >
                          <ArrowUp className="w-4 h-4 text-[#E6C065]" />
                          <span>Wróć do góry katalogu</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsMobileExpanded(false);
                            const catalogElem = document.getElementById('katalog');
                            if (catalogElem) {
                              catalogElem.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                          className="py-3 px-3 rounded-xl bg-white border border-[#DFCBB5] text-[#594D42] text-xs font-bold hover:bg-[#F5EDE0] transition-colors cursor-pointer shrink-0"
                          title="Zwiń listę do 6 miodów"
                          id="btn-zwin-miody-mobile"
                        >
                          <span>Zwiń listę</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 bg-[#FAF8F5] rounded-3xl border border-[#E7DCCE] space-y-3">
              <span className="text-3xl">🔍</span>
              <h3 className="font-serif text-lg font-bold text-[#23201C]">
                Nie znaleźliśmy miodu o takich parametrach
              </h3>
              <p className="text-xs text-[#716556] max-w-sm mx-auto">
                {filters.flavorNote 
                  ? `Brak miodów z wybraną nutą „${filters.flavorNote}”. Wybierz inną nutę lub wyczyść filtry.`
                  : 'Spróbuj zmienić filtry lub wyczyścić pole wyszukiwania, by zobaczyć pełną ofertę pasieki.'}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() =>
                    handleFilterChange({
                      category: 'wszystkie',
                      consistency: 'all',
                      intensity: 'all',
                      flavorNote: null,
                      searchQuery: '',
                      sortBy: 'popular',
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-[#2D2821] text-[#FAF5ED] text-xs font-semibold hover:bg-[#433B31] cursor-pointer transition-colors"
                >
                  Resetuj filtry
                </button>
                <button
                  onClick={handleOpenQuiz}
                  className="px-4 py-2 rounded-xl bg-[#1B4332] text-white text-xs font-semibold hover:bg-[#143326] cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#E0A94F]" />
                  <span>Rozwiąż quiz i dobierz miód</span>
                </button>
              </div>
            </div>
          )}
        </section>
        <HoneyQualitySection containerClass={displayResolution.containerClass} />
        <HoneyFAQSection containerClass={displayResolution.containerClass} />
        <ApiaryStory containerClass={displayResolution.containerClass} />
      </main>

      <ProductDetailModal
        product={detailProduct}
        onClose={() => setDetailProduct(null)}
        onAddToCart={onAddToCart}
        onOpenCompare={toggleCompare}
        onSelectFlavorNote={handleSelectFlavorNote}
      />
      {/* Fallback lokalny quiz, jeśli HomePage używany poza App.tsx */}
      {!onOpenQuiz && (
        <HoneyFinderQuiz
          isOpen={localQuizOpen}
          onClose={() => setLocalQuizOpen(false)}
          onSelectProduct={(p) => setDetailProduct(p)}
        />
      )}
    </>
  );
};
