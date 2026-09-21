import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductFilter } from '../components/ProductFilter';
import { FilterState, HoneyCategory, HoneyProduct, HealthIntentFilter } from '../types';
import { ProductCard } from '../components/ProductCard';
import { HONEY_PRODUCTS } from '../data/honeyProducts';
import { getEnrichedProduct } from '../utils/honeyHelpers';
import { Sparkles, ArrowUp, ShoppingBag, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

const ProductDetailModal = React.lazy(() => import('../components/ProductDetailModal').then(m => ({ default: m.ProductDetailModal })));

interface ShopPageProps {
  onAddToCart: (product: HoneyProduct, weightGrams: number, pricePln: number) => void;
  displayResolution: { width: number; height: number; deviceType: string; containerClass: string };
  toggleCompare: (product: HoneyProduct) => void;
  compareList: HoneyProduct[];
  onOpenQuiz?: () => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  onAddToCart,
  displayResolution,
  toggleCompare,
  compareList,
  onOpenQuiz,
}) => {
  const [detailProduct, setDetailProduct] = useState<HoneyProduct | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const [isMobileExpanded, setIsMobileExpanded] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('pasieka_shop_mobile_expanded') === 'true';
    } catch {
      return false;
    }
  });

  const setMobileExpandedWithStorage = (expanded: boolean) => {
    setIsMobileExpanded(expanded);
    try {
      sessionStorage.setItem('pasieka_shop_mobile_expanded', expanded ? 'true' : 'false');
    } catch {}
  };

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
      if (newFilters.flavorNote) next.set('nuta', newFilters.flavorNote);
      else next.delete('nuta');

      if (newFilters.category && newFilters.category !== 'wszystkie') next.set('kategoria', newFilters.category);
      else next.delete('kategoria');

      if (newFilters.healthIntent && newFilters.healthIntent !== 'wszystkie') next.set('intencja', newFilters.healthIntent);
      else next.delete('intencja');

      return next;
    });
  };

  const handleSelectFlavorNote = (note: string | null) => {
    handleFilterChange({
      ...filters,
      flavorNote: filters.flavorNote === note ? null : note,
    });
  };

  const filteredProducts = useMemo(() => {
    let result = [...HONEY_PRODUCTS];

    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.flavorNotes.some(n => n.toLowerCase().includes(q)) ||
          p.dominantPlant.toLowerCase().includes(q)
      );
    }

    if (filters.category !== 'wszystkie') {
      result = result.filter(p => p.category === filters.category);
    }

    if (filters.healthIntent && filters.healthIntent !== 'wszystkie') {
      result = result.filter(p => {
        const enriched = getEnrichedProduct(p.id);
        const benefits = enriched.healthBenefits.map(b => b.toLowerCase());
        const uses = p.recommendedUse.map(u => u.toLowerCase());
        const combined = [...benefits, ...uses].join(' ');

        switch (filters.healthIntent) {
          case 'odpornosc':
            return combined.includes('odporn') || combined.includes('przezięb') || combined.includes('gryp') || combined.includes('infekc');
          case 'lagodne':
            return p.flavorIntensity === 'lagodny' || p.category === 'wiosenne' || combined.includes('dzieci') || p.id.includes('rzepak') || p.id.includes('akacj');
          case 'koneser':
            return p.flavorIntensity === 'wyrazisty' || p.category === 'lesne-spadz' || p.id.includes('grycz') || p.id.includes('spadz') || p.id.includes('wrzos');
          case 'prezent':
            return p.isBestseller || p.isLimitedBatch || p.category === 'z-dodatkami' || p.category === 'zestawy';
          default:
            return true;
        }
      });
    }

    if (filters.consistency !== 'all') {
      result = result.filter(p => p.consistency === filters.consistency);
    }

    if (filters.intensity !== 'all') {
      result = result.filter(p => p.flavorIntensity === filters.intensity);
    }

    if (filters.flavorNote) {
      result = result.filter(p =>
        p.flavorNotes.some(note => note.toLowerCase() === filters.flavorNote?.toLowerCase())
      );
    }

    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => (a.sizes[0]?.pricePln || 0) - (b.sizes[0]?.pricePln || 0));
        break;
      case 'price-desc':
        result.sort((a, b) => (b.sizes[0]?.pricePln || 0) - (a.sizes[0]?.pricePln || 0));
        break;
      case 'harvest':
        result.sort((a, b) => b.harvestYear - a.harvestYear);
        break;
      case 'popular':
      default:
        result.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
        break;
    }

    return result;
  }, [filters]);

  return (
    <main className="min-h-screen bg-[#FAF7F2] pb-24">
      {/* Header Banner */}
      <section className="bg-[#2D2821] text-[#FAF5ED] pt-12 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#D9821E_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        <div className={`adaptive-container ${displayResolution.containerClass} px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4`}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#3F372C] text-[#E5983A] text-xs font-semibold">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Sklep Pasieki Wędrownej „Usza”</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#FAF5ED] tracking-tight">
            Prawdziwy miodowy zbiór z Dolnego Śląska
          </h1>
          <p className="text-sm sm:text-base text-[#C7BDB0] max-w-2xl mx-auto leading-relaxed">
            Nie standaryzujemy miodu – każdy słoik to unikatowy zapis kwiatów, pożytków leśnych i pracy naszych pszczół. Wybierz swój ulubiony smak prosto z pasieki w Ciechowie.
          </p>

          {/* Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-[#E5983A]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> 100% Surowy miód (RAW)
            </span>
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4" /> Bezpieczna dostawa w tekturowych tubach
            </span>
            <span className="flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4" /> Gwarancja świeżości i pochodzenia
            </span>
          </div>
        </div>
      </section>

      {/* Catalog & Filter Section */}
      <section id="katalog" className={`adaptive-container ${displayResolution.containerClass} px-4 sm:px-6 lg:px-8 mt-10 space-y-8`}>
        <ProductFilter
          filters={filters}
          onFilterChange={handleFilterChange}
          totalCount={HONEY_PRODUCTS.length}
          filteredCount={filteredProducts.length}
        />

        {filteredProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProducts.map(product => (
                <div key={product.id} className="h-full">
                  <ProductCard
                    product={product}
                    onAddToCart={onAddToCart}
                    onOpenDetail={setDetailProduct}
                    onToggleCompare={toggleCompare}
                    isCompared={compareList.some(p => p.id === product.id)}
                    onSelectFlavorNote={handleSelectFlavorNote}
                    activeFlavorNote={filters.flavorNote}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-[#FAF8F5] rounded-3xl border border-[#E7DCCE] space-y-3">
            <span className="text-3xl">🔍</span>
            <h3 className="font-serif text-lg font-bold text-[#23201C]">
              Nie znaleźliśmy miodu o takich parametrach
            </h3>
            <p className="text-xs text-[#716556] max-w-sm mx-auto">
              Spróbuj zmienić filtry lub wyczyścić pole wyszukiwania, by zobaczyć pełną ofertę pasieki.
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
              {onOpenQuiz && (
                <button
                  onClick={onOpenQuiz}
                  className="px-4 py-2 rounded-xl bg-[#1B4332] text-white text-xs font-semibold hover:bg-[#143326] cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#E0A94F]" />
                  <span>Rozwiąż quiz i dobierz miód</span>
                </button>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Modal szczegółów produktu */}
      <React.Suspense fallback={null}>
        <ProductDetailModal
          product={detailProduct}
          onClose={() => setDetailProduct(null)}
          onAddToCart={onAddToCart}
          onOpenCompare={toggleCompare}
          onSelectFlavorNote={handleSelectFlavorNote}
        />
      </React.Suspense>
    </main>
  );
};
