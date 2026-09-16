import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLenis } from 'lenis/react';
import { HONEY_PRODUCTS } from '../data/honeyProducts';
import { HoneyProduct } from '../types';
import { getEnrichedProduct, CATEGORY_METADATA } from '../utils/honeyHelpers';
import { ProductReviews } from '../components/ProductReviews';
import { 
  ArrowLeft, 
  ArrowRight, 
  Share2, 
  Check, 
  ShoppingBag, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  MapPin, 
  Leaf, 
  Star, 
  FileText, 
  Heart, 
  Clock, 
  Truck, 
  ChevronRight, 
  CheckCircle2, 
  Droplet,
  Beaker,
  MessageSquare,
  AlertCircle,
  Scale,
  HelpCircle,
  Info,
  ShieldAlert
} from 'lucide-react';

interface ProductPageProps {
  onAddToCart: (product: HoneyProduct, weightGrams: number, pricePln: number) => void;
  onOpenCompare?: (product: HoneyProduct) => void;
}

export const ProductPage: React.FC<ProductPageProps> = ({ onAddToCart, onOpenCompare }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const lenis = useLenis();

  const rawProduct = HONEY_PRODUCTS.find((p) => p.id === id);

  useLayoutEffect(() => {
    setActiveTab('opis');
    setSelectedSizeIdx(0);
    setActiveImageIndex(0);

    const resetScroll = () => {
      if (lenis) {
        lenis.scrollTo(0, { immediate: true, force: true });
        lenis.resize();
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    resetScroll();
    const rafId = requestAnimationFrame(resetScroll);
    const t1 = setTimeout(resetScroll, 30);
    const t2 = setTimeout(resetScroll, 100);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [id, lenis]);

  if (!rawProduct) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-[#FAF6EE]">
        <h1 className="text-3xl font-serif font-bold text-[#241D17] mb-4">Nie znaleziono miodu</h1>
        <p className="text-[#594D42] mb-8">Miód, którego szukasz, mógł zostać wyprzedany lub adres jest niepoprawny.</p>
        <Link to="/" className="px-6 py-3 bg-[#1B4332] text-white rounded-xl font-bold hover:bg-[#143326] transition-colors">
          Wróć do katalogu miodów
        </Link>
      </div>
    );
  }

  const product = getEnrichedProduct(rawProduct);

  const [selectedSizeIdx, setSelectedSizeIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'opis' | 'zdrowie' | 'kulinaria' | 'badania' | 'opinie'>('opis');
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showConsistencyExplainer, setShowConsistencyExplainer] = useState(false);

  const [purchaseMode, setPurchaseMode] = useState<'one-time' | 'subscription'>('one-time');

  const currentSize = product.sizesList[selectedSizeIdx] || product.sizesList[0];
  const images = product.images && product.images.length > 0 ? product.images : [product.imageUrl];
  const activeImage = images[activeImageIndex] || images[0];

  const basePrice = currentSize?.price || 0;
  const effectivePrice = purchaseMode === 'subscription' ? Math.round(basePrice * 0.9) : basePrice;

  // Sibling products for Next / Prev navigation
  const currentIndex = HONEY_PRODUCTS.findIndex(p => p.id === rawProduct.id);
  const prevProduct = currentIndex > 0 ? HONEY_PRODUCTS[currentIndex - 1] : HONEY_PRODUCTS[HONEY_PRODUCTS.length - 1];
  const nextProduct = currentIndex < HONEY_PRODUCTS.length - 1 ? HONEY_PRODUCTS[currentIndex + 1] : HONEY_PRODUCTS[0];

  // Related products - prioritize honeys sharing flavor notes or same category
  const relatedProducts = [...HONEY_PRODUCTS]
    .filter(p => p.id !== rawProduct.id)
    .sort((a, b) => {
      const aSharedNotes = a.flavorNotes.filter(n => rawProduct.flavorNotes.includes(n)).length;
      const bSharedNotes = b.flavorNotes.filter(n => rawProduct.flavorNotes.includes(n)).length;
      if (bSharedNotes !== aSharedNotes) return bSharedNotes - aSharedNotes;
      const aCat = a.category === rawProduct.category ? 1 : 0;
      const bCat = b.category === rawProduct.category ? 1 : 0;
      return bCat - aCat;
    })
    .slice(0, 3)
    .map(getEnrichedProduct);

  const handleAddToCart = () => {
    if (!currentSize) return;
    onAddToCart(rawProduct, currentSize.weightGrams, effectivePrice);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1800);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleBackToCatalog = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/#katalog');
    }
  };

  const pricePerKg = currentSize ? Math.round((effectivePrice / currentSize.weightGrams) * 1000) : 0;
  const catInfo = CATEGORY_METADATA[product.category] || {
    label: product.category,
    shortLabel: product.category,
    icon: '🍯',
  };

  // Reusable Product Header (Category badge, Region, Title, Botanical source, Rating stars)
  const renderProductHeader = () => (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-2.5">
        <Link
          to={`/?kategoria=${product.category}#katalog`}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#1B4332]/10 hover:bg-[#1B4332] text-[#1B4332] hover:text-white border border-[#1B4332]/25 transition-all shadow-2xs cursor-pointer group"
          title={`Zobacz wszystkie miody w kategorii: ${catInfo.label}`}
        >
          <span>{catInfo.icon}</span>
          <span>{catInfo.label}</span>
          <span className="text-[10px] opacity-60 group-hover:opacity-100 ml-0.5">→</span>
        </Link>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FAF3E5] text-[#8C4609] border border-[#D9821E]/20">
          <MapPin className="w-3.5 h-3.5 text-[#D9821E]" />
          <span>{product.region}</span>
          <span className="text-[#D9821E]/50">•</span>
          <span className="text-[#1B4332]">Zbiór {product.harvestYear}</span>
        </div>
      </div>

      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#241D17] leading-tight mb-1.5 sm:mb-2">
        {product.name}
      </h1>

      <p className="text-xs sm:text-sm italic text-[#7A6A5A] mb-2.5 sm:mb-3">
        Nektar botaniczny: <span className="font-serif font-semibold text-[#594D42] not-italic">{product.botanicalSource}</span>
      </p>

      {/* Rating & Reviews anchor */}
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <div className="flex items-center text-amber-500">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-amber-200'}`} 
            />
          ))}
        </div>
        <span className="text-sm font-bold text-[#241D17]">{product.rating.toFixed(1)}</span>
        <span className="text-xs text-[#7A6A5A]">
          ({product.reviewsCount} zweryfikowanych opinii)
        </span>
        <button
          type="button"
          onClick={() => {
            setActiveTab('opinie');
            if (lenis) {
              lenis.scrollTo('#tabs-section');
            } else {
              document.getElementById('tabs-section')?.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="text-xs text-[#D9821E] hover:underline cursor-pointer ml-1 font-semibold"
        >
          Zobacz recenzje →
        </button>
      </div>
    </div>
  );

  // Reusable Flavor Notes Chips
  const renderFlavorNotes = () => (
    product.flavorNotes && product.flavorNotes.length > 0 ? (
      <div className="bg-[#FAF3E5]/70 p-4 rounded-2xl border border-[#D9821E]/20 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#594D42] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#D9821E]" />
            Dominujące nuty smakowe i aromatyczne:
          </span>
          <span className="text-[11px] text-[#8C7A6B] font-medium hidden sm:inline">Kliknij nutę, aby filtrować katalog</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {product.flavorNotes.map((note, idx) => (
            <button 
              key={idx}
              type="button"
              onClick={() => navigate(`/?nuta=${encodeURIComponent(note)}#katalog`)}
              className="px-3.5 py-1.5 bg-white hover:bg-[#1B4332] text-[#594D42] hover:text-white border border-[#D9821E]/30 hover:border-[#1B4332] rounded-full text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer group"
              title={`Zobacz wszystkie miody z nutą: ${note}`}
            >
              <Sparkles className="w-3 h-3 text-[#D9821E] group-hover:text-[#F3C06B] transition-colors" />
              <span>{note}</span>
              <span className="text-[10px] text-[#8C7A6B] group-hover:text-white/80 ml-0.5">🔍</span>
            </button>
          ))}
        </div>
      </div>
    ) : null
  );

  // Reusable Sensory Profile Card
  const renderSensoryAndShipping = () => (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#D9821E]/25 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-[#D9821E]/15 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FAF3E5] flex items-center justify-center text-sm shadow-2xs">
            🍯
          </div>
          <div>
            <h3 className="font-serif font-bold text-[#241D17] text-base leading-tight">
              Profil sensoryczny odmiany
            </h3>
            <p className="text-[11px] text-[#7A6A5A]">Karta degustacyjna ulowego nektaru</p>
          </div>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#1B4332]/10 text-[#1B4332] border border-[#1B4332]/20 uppercase tracking-wider">
          Autentyczna Partia
        </span>
      </div>

        {/* Paski sensoryczne: Słodycz, Kwasowość, Aromat */}
        <div className="space-y-3 pt-1">
          {/* Poziom słodyczy */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-[#594D42]">Poziom słodyczy</span>
              <span className="font-bold text-[#8C4609]">{product.tasteProfile.sweetness} / 5</span>
            </div>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <div
                  key={lvl}
                  className={`h-2 flex-1 rounded-full transition-all ${
                    lvl <= product.tasteProfile.sweetness ? 'bg-[#D9821E]' : 'bg-[#EADDC7]'
                  }`}
                />
              ))}
            </div>
            <p className="text-[10px] text-[#7A6A5A]">
              {product.tasteProfile.sweetness <= 2 ? 'Wytrawny, mało słodki' : product.tasteProfile.sweetness <= 4 ? 'Umiarkowanie zbalansowany' : 'Głęboka, aksamitna słodycz'}
            </p>
          </div>

          {/* Kwasowość / Rześkość */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-[#594D42]">Kwasowość / Rześkość</span>
              <span className="font-bold text-[#1B4332]">{product.tasteProfile.acidity} / 5</span>
            </div>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <div
                  key={lvl}
                  className={`h-2 flex-1 rounded-full transition-all ${
                    lvl <= product.tasteProfile.acidity ? 'bg-[#1B4332]' : 'bg-[#EADDC7]'
                  }`}
                />
              ))}
            </div>
            <p className="text-[10px] text-[#7A6A5A]">
              {product.tasteProfile.acidity <= 2 ? 'Łagodny, maślany finisz' : 'Rześka, świeża nuta cytrusowo-kwiatowa'}
            </p>
          </div>

          {/* Intensywność aromatu */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-[#594D42]">Intensywność aromatu</span>
              <span className="font-bold text-[#D9821E]">{product.tasteProfile.aroma} / 5</span>
            </div>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <div
                  key={lvl}
                  className={`h-2 flex-1 rounded-full transition-all ${
                    lvl <= product.tasteProfile.aroma ? 'bg-[#D9821E]' : 'bg-[#EADDC7]'
                  }`}
                />
              ))}
            </div>
            <p className="text-[10px] text-[#7A6A5A]">
              Wyraźny bukiet wyczuwalny natychmiast po odkręceniu słoika.
            </p>
          </div>
        </div>

        {/* Barwa & Krystalizacja - 2 kompaktowe boksy */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E7DDCE] text-xs space-y-1">
            <span className="font-bold text-[#8C4609] text-[11px] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#D9821E]" />
              Krystalizacja
            </span>
            <p className="text-[11px] text-[#594D42] leading-tight">{product.tasteProfile.crystallization}</p>
          </div>

          <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E7DDCE] text-xs space-y-1">
            <span className="font-bold text-[#1B4332] text-[11px] flex items-center gap-1">
              <Droplet className="w-3.5 h-3.5 text-[#1B4332]" />
              Barwa miodu
            </span>
            <p className="text-[11px] text-[#594D42] leading-tight">{product.tasteProfile.color}</p>
          </div>
        </div>
      </div>
  );

  return (
    <div className="w-full bg-[#FAF6EE] min-h-screen pt-4 pb-20 animate-in fade-in duration-300">
      
      {/* Top Breadcrumb & Quick Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-3 sm:mb-6">
        
        {/* MOBILE ONLY (< sm): Single sleek row with Back button on left + Quick Actions on right */}
        <div className="flex sm:hidden items-center justify-between gap-2 py-2 border-b border-[#D9821E]/15">
          <Link
            to="/#katalog"
            onClick={handleBackToCatalog}
            className="inline-flex items-center gap-1.5 font-bold text-xs text-[#1B4332] hover:text-[#D9821E] transition-colors bg-white px-3 py-1.5 rounded-xl border border-[#D9821E]/20 shadow-2xs shrink-0"
            id="btn-powrot-katalog-mobile"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Katalog miodów</span>
          </Link>

          {/* Compact Action Icons Group on Mobile */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => navigate(`/produkt/${prevProduct.id}`)}
              className="p-1.5 text-[#594D42] hover:text-[#241D17] bg-white rounded-xl border border-[#D9821E]/20 hover:border-[#D9821E] transition-colors cursor-pointer shadow-2xs"
              title={`Poprzedni: ${prevProduct.name}`}
              aria-label="Poprzedni miód"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => navigate(`/produkt/${nextProduct.id}`)}
              className="p-1.5 text-[#594D42] hover:text-[#241D17] bg-white rounded-xl border border-[#D9821E]/20 hover:border-[#D9821E] transition-colors cursor-pointer shadow-2xs"
              title={`Kolejny: ${nextProduct.name}`}
              aria-label="Kolejny miód"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            {onOpenCompare && (
              <button
                type="button"
                onClick={() => onOpenCompare(rawProduct)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-[#1B4332] bg-white rounded-xl border border-[#1B4332]/25 hover:bg-[#1B4332] hover:text-white transition-all cursor-pointer shadow-2xs"
                title="Porównaj ten miód w tabeli"
                aria-label="Porównaj ten miód"
              >
                <Scale className="w-3.5 h-3.5 text-[#D9821E]" />
                <span className="text-[11px]">Porównaj</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleShare}
              className="p-1.5 text-[#594D42] hover:text-[#D9821E] bg-white rounded-xl border border-[#D9821E]/20 hover:border-[#D9821E] transition-colors cursor-pointer relative shadow-2xs"
              title="Kopiuj link do tego miodu"
              aria-label="Kopiuj link"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-[#1B4332]" /> : <Share2 className="w-3.5 h-3.5" />}
              {copiedLink && (
                <span className="absolute -bottom-8 right-0 bg-[#1B4332] text-white text-[10px] px-2 py-0.5 rounded shadow-md whitespace-nowrap font-medium z-30">
                  Skopiowano!
                </span>
              )}
            </button>
          </div>
        </div>

        {/* DESKTOP ONLY (>= sm): Full breadcrumb path + Detailed Honey switcher */}
        <div className="hidden sm:flex items-center justify-between gap-4 py-3 border-b border-[#D9821E]/20">
          <div className="flex items-center flex-wrap gap-2 text-sm text-[#7A6A5A]">
            <Link
              to="/#katalog"
              onClick={handleBackToCatalog}
              className="inline-flex items-center gap-1.5 font-bold text-[#1B4332] hover:text-[#D9821E] transition-colors bg-white px-3.5 py-1.5 rounded-xl border border-[#D9821E]/20 shadow-xs"
              id="btn-powrot-katalog-desktop"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Katalog miodów</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#D9821E]/60" />
            
            <Link
              to={`/?kategoria=${product.category}#katalog`}
              className="inline-flex items-center gap-1.5 font-semibold text-[#594D42] hover:text-[#1B4332] hover:bg-white bg-white/70 px-3 py-1.5 rounded-xl border border-[#D9821E]/20 hover:border-[#1B4332]/30 shadow-2xs transition-all cursor-pointer group"
              title={`Filtruj zbiory: ${catInfo.label}`}
            >
              <span>{catInfo.icon}</span>
              <span className="group-hover:underline">{catInfo.label}</span>
            </Link>

            <ChevronRight className="w-3.5 h-3.5 text-[#D9821E]/60" />
            <span className="font-semibold text-[#241D17] truncate max-w-[300px]">
              {product.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate(`/produkt/${prevProduct.id}`)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#594D42] hover:text-[#241D17] bg-white rounded-xl border border-[#D9821E]/20 hover:border-[#D9821E] transition-colors cursor-pointer"
              title={`Poprzedni: ${prevProduct.name}`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Poprzedni miód</span>
            </button>

            <button
              type="button"
              onClick={() => navigate(`/produkt/${nextProduct.id}`)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#594D42] hover:text-[#241D17] bg-white rounded-xl border border-[#D9821E]/20 hover:border-[#D9821E] transition-colors cursor-pointer"
              title={`Kolejny: ${nextProduct.name}`}
            >
              <span>Kolejny miód</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {onOpenCompare && (
              <button
                type="button"
                onClick={() => onOpenCompare(rawProduct)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#1B4332] hover:text-white hover:bg-[#1B4332] bg-white rounded-xl border border-[#1B4332]/30 transition-all cursor-pointer shadow-xs"
                title="Porównaj ten miód z inną odmianą w tabeli"
              >
                <Scale className="w-3.5 h-3.5 text-[#D9821E]" />
                <span>Porównaj</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleShare}
              className="p-2 text-[#594D42] hover:text-[#D9821E] bg-white rounded-xl border border-[#D9821E]/20 hover:border-[#D9821E] transition-colors cursor-pointer relative"
              title="Kopiuj link do tego miodu"
            >
              {copiedLink ? <Check className="w-4 h-4 text-[#1B4332]" /> : <Share2 className="w-4 h-4" />}
              {copiedLink && (
                <span className="absolute -top-8 right-0 bg-[#1B4332] text-white text-[11px] px-2.5 py-1 rounded-md shadow-md whitespace-nowrap font-medium">
                  Skopiowano link!
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE ONLY: Product Title & Category & Rating directly above Gallery (E-commerce standard) */}
      <div className="lg:hidden max-w-7xl mx-auto px-4 sm:px-6 mb-4">
        {renderProductHeader()}
      </div>

      {/* Main Product Showcase: Left Gallery + Right Buy Box */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: Interactive Photo & Texture Gallery (6 Cols on desktop) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative w-full aspect-[4/3] sm:aspect-square bg-white rounded-3xl border border-[#D9821E]/25 shadow-md overflow-hidden group">
              
              {/* Badges on main photo */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 items-start">
                {product.badge && (
                  <span className="px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#D9821E] text-white shadow-sm">
                    {product.badge}
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 text-[#1B4332] border border-[#1B4332]/20 backdrop-blur-xs shadow-2xs">
                  100% Surowy i Nieprażony
                </span>
              </div>

              {/* Main Image with smooth transition */}
              <img
                src={activeImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = product.imageUrl;
                }}
              />

              {/* Photo Caption / Angle Indicator */}
              <div className="absolute bottom-4 right-4 z-10 bg-black/60 backdrop-blur-xs text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm">
                Zdjęcie {activeImageIndex + 1} z {images.length}
              </div>
            </div>

            {/* Thumbnail selector strip */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all cursor-pointer bg-white shadow-xs ${
                      activeImageIndex === idx 
                        ? 'border-[#D9821E] ring-2 ring-[#D9821E]/30 scale-[1.02]' 
                        : 'border-[#D9821E]/20 hover:border-[#D9821E]/60 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} perspektywa ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = product.imageUrl;
                      }}
                    />
                    <div className="absolute bottom-1 right-1 text-[9px] font-bold bg-black/65 text-white px-1.5 py-0.5 rounded">
                      {idx === 0 ? 'Słoik' : idx === 1 ? 'Patoka' : idx === 2 ? 'Pasieka' : 'Struktura'}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* DESKTOP ONLY: Safe Shipping & Sensory Card under gallery */}
            <div className="hidden lg:block space-y-4">
              {renderSensoryAndShipping()}
            </div>
          </div>

          {/* RIGHT COLUMN: Product Header, Purchase Controls & Key Specs (6 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* DESKTOP ONLY: Header info */}
            <div className="hidden lg:block">
              {renderProductHeader()}
            </div>

            {/* Tagline */}
            <div className="p-4 bg-[#FAF3E5] rounded-2xl border-l-4 border-[#D9821E] text-sm font-medium text-[#594D42] leading-relaxed shadow-2xs">
              „{product.tagline}”
            </div>

            {/* DESKTOP ONLY: Quick Tasting Notes Tags directly under header */}
            <div className="hidden lg:block">
              {renderFlavorNotes()}
            </div>

            {/* Purchase Card: Gramature Selector, Price, Add to Cart */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#D9821E]/30 shadow-md space-y-5">
              
              {/* Kompaktowa Metryka Partii & Żywych Enzymów (Nowoczesna, przejrzysta karta z rozwijaniem detali) */}
              <div className="bg-[#FAF8F5] rounded-2xl p-3.5 border border-[#E7DDCE] space-y-2.5">
                <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#594D42] uppercase text-[10px] tracking-wider flex items-center gap-1">
                      <Droplet className="w-3.5 h-3.5 text-[#D9821E]" />
                      Partia:
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${product.consistencyInfo.badgeClass}`}>
                      {product.consistencyInfo.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[#FAF3E5] text-[#8C4609] border border-[#D9821E]/20" title="Chroń żywe enzymy ula">
                      🌡️ Reżim ula: max 40°C
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#7A6A5A] pt-1.5 border-t border-[#EFE7DA]">
                  <span className="truncate pr-2">
                    {product.consistencyInfo.shortExplanation}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowConsistencyExplainer(!showConsistencyExplainer)}
                    className="text-[#D9821E] hover:text-[#8C4609] font-bold shrink-0 cursor-pointer text-[11px] underline"
                  >
                    {showConsistencyExplainer ? 'Zwiń wyjaśnienie ▲' : 'Więcej o krysztale i enzymach ▼'}
                  </button>
                </div>

                {/* Rozwijane szczegóły partii i enzymów (dla dociekliwych, nie zapycha głównego widoku) */}
                {showConsistencyExplainer && (
                  <div className="pt-2.5 border-t border-[#EFE7DA] space-y-2 text-xs text-[#524637] animate-in fade-in duration-200">
                    {product.consistencyInfo.hasGlucoseBloom && (
                      <div className="p-3 bg-white rounded-xl border border-[#D9821E]/25 text-[11px] space-y-1 shadow-2xs">
                        <strong className="text-[#8C4609] block font-bold">Biały nalot na ściankach słoika („kwiat miodu”):</strong>
                        <p className="leading-relaxed">{product.consistencyInfo.glucoseBloomInfo}</p>
                      </div>
                    )}
                    <div className="p-3 bg-[#FAF3E5] rounded-xl border border-[#D9821E]/25 text-[11px] space-y-1 shadow-2xs">
                      <strong className="text-[#1B4332] block font-bold">Żelazna zasada 40°C (Ochrona enzymów ula):</strong>
                      <p className="leading-relaxed">
                        Miód zachowuje pełną moc biologiczną (diastazę, lizozym i inhibinę) wyłącznie do temperatury 40°C. 
                        Dodawaj go do lekko przestudzonej herbaty lub letniej wody.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Gramature selection */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#594D42]">
                    Wybierz gramaturę słoika:
                  </label>
                  <span className="text-xs text-[#7A6A5A]">
                    Cena jednostkowa: <strong className="text-[#1B4332]">{pricePerKg} zł / kg</strong>
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-1">
                  {product.sizesList.map((size, idx) => {
                    const isSelected = selectedSizeIdx === idx;
                    const isLargest = idx === product.sizesList.length - 1 && product.sizesList.length > 1;

                    return (
                      <button
                        key={size.gram + idx}
                        type="button"
                        onClick={() => setSelectedSizeIdx(idx)}
                        className={`relative flex flex-col items-center justify-between p-3 pt-3.5 pb-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#1B4332] text-white border-[#1B4332] shadow-sm ring-2 ring-[#1B4332]/25 scale-[1.01]'
                            : 'bg-[#FAF6EE] text-[#594D42] border-[#D9821E]/25 hover:border-[#D9821E] hover:bg-white'
                        }`}
                      >
                        {isLargest && (
                          <span className={`absolute -top-2.5 left-1/2 -translate-x-1/2 z-10 text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-xs ${
                            isSelected ? 'bg-[#E5983A] text-[#14100C] ring-1 ring-white/40' : 'bg-[#1B4332] text-white'
                          }`}>
                            Najtaniej / kg
                          </span>
                        )}
                        <div className="font-serif text-base font-bold tracking-tight leading-tight">
                          {size.gram}
                        </div>
                        <div className={`text-xs font-bold mt-1 ${isSelected ? 'text-[#F3C06B]' : 'text-[#8C5815]'}`}>
                          {purchaseMode === 'subscription' ? Math.round(size.price * 0.9) : size.price} zł
                        </div>
                        <div className={`text-[10px] font-mono mt-0.5 ${isSelected ? 'text-white/65' : 'text-[#8C7A6B]'}`}>
                          {Math.round(((purchaseMode === 'subscription' ? Math.round(size.price * 0.9) : size.price) / size.weightGrams) * 1000)} zł/kg
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Model zakupu: Jednorazowy vs Autouzupełnianie spiżarni */}
              <div className="pt-2 border-t border-[#D9821E]/15 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#594D42]">
                    Wybierz model zakupu:
                  </label>
                  {purchaseMode === 'subscription' && (
                    <span className="text-[10px] font-bold text-[#1B4332] bg-[#1B4332]/10 px-2 py-0.5 rounded-full">
                      ✓ Aktywny stały rabat -10%
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPurchaseMode('one-time')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      purchaseMode === 'one-time'
                        ? 'bg-[#1B4332]/5 border-[#1B4332] text-[#1B4332] ring-1 ring-[#1B4332]'
                        : 'bg-[#FAF8F5] border-[#DFCBB5] text-[#594D42] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>Zakup jednorazowy</span>
                      <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        purchaseMode === 'one-time' ? 'border-[#1B4332] bg-[#1B4332]' : 'border-[#A69784]'
                      }`}>
                        {purchaseMode === 'one-time' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#7A6A5A] block mt-1">
                      Cena standardowa ({basePrice} zł)
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPurchaseMode('subscription')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                      purchaseMode === 'subscription'
                        ? 'bg-[#E5983A]/10 border-[#D9821E] text-[#8C4609] ring-1 ring-[#D9821E]'
                        : 'bg-[#FAF8F5] border-[#DFCBB5] text-[#594D42] hover:bg-white'
                    }`}
                  >
                    <span className="absolute top-0 right-0 bg-[#D9821E] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-bl-lg">
                      -10% Rabat
                    </span>
                    <div className="flex items-center justify-between font-bold">
                      <span>Autouzupełnianie</span>
                      <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        purchaseMode === 'subscription' ? 'border-[#D9821E] bg-[#D9821E]' : 'border-[#A69784]'
                      }`}>
                        {purchaseMode === 'subscription' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#7A6A5A] block mt-1">
                      Dostawa co 60 dni • <strong>{effectivePrice} zł</strong> • Bez umowy
                    </span>
                  </button>
                </div>
              </div>

              {/* Price & Quantity & CTA */}
              <div className="pt-2 border-t border-[#D9821E]/15">
                <div className="bg-[#FAF6EE]/80 rounded-2xl p-4 border border-[#D9821E]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 shadow-2xs">
                  <div>
                    <span className="text-[11px] text-[#7A6A5A] uppercase tracking-wider block font-bold">
                      Razem do zapłaty:
                    </span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="font-serif text-3xl sm:text-4xl font-black text-[#1B4332] tracking-tight">
                        {(effectivePrice * quantity).toFixed(2)}
                      </span>
                      <span className="text-base font-bold text-[#8C7A6B]">zł</span>
                      {quantity > 1 && (
                        <span className="text-xs text-[#7A6A5A] font-medium ml-1">
                          ({quantity} × {effectivePrice} zł)
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#1B4332] font-semibold block mt-0.5">
                      ✓ Świeży rozlew z pasieki w szklanym słoiku
                    </span>
                  </div>

                  {/* Refined Quantity Counter */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 pt-1 sm:pt-0">
                    <span className="text-[10px] uppercase font-bold text-[#8C7A6B] tracking-wider">
                      Liczba słoików:
                    </span>
                    <div className="flex items-center border border-[#D9821E]/30 rounded-xl bg-white overflow-hidden shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center font-bold text-[#594D42] hover:bg-[#FAF6EE] hover:text-[#1B4332] transition-colors cursor-pointer text-base"
                        title="Zmniejsz ilość"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold text-sm text-[#241D17]">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center font-bold text-[#594D42] hover:bg-[#FAF6EE] hover:text-[#1B4332] transition-colors cursor-pointer text-base"
                        title="Zwiększ ilość"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="space-y-2.5">
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-3.5 sm:py-4 px-6 rounded-2xl font-bold text-base text-white bg-[#1B4332] hover:bg-[#143326] transition-all shadow-md flex items-center justify-center gap-2.5 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                    id="btn-dodaj-koszyk-glowny"
                  >
                    {addedAnimation ? (
                      <>
                        <Check className="w-5 h-5 text-[#E6C065]" />
                        <span>Dodano do koszyka!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5" />
                        <span>Dodaj do koszyka • {((currentSize?.price || 0) * quantity).toFixed(2)} zł</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs text-[#594D42] pt-2 px-1">
                    <span className="flex items-center gap-1.5 font-semibold text-[#1B4332]">
                      <CheckCircle2 className="w-4 h-4 text-[#1B4332]" />
                      Świeża partia z pasieki (Dostępny)
                    </span>
                    <span className="text-[#7A6A5A]">
                      Darmowa dostawa od 199 zł
                    </span>
                  </div>
                </div>
              </div>

              {/* Trust & Safe Delivery Strip */}
              <div className="pt-3 border-t border-[#D9821E]/15 grid grid-cols-3 gap-2 text-center text-[11px] text-[#594D42]">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 p-2 bg-[#FAF8F5] rounded-xl border border-[#E7DDCE]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1B4332] shrink-0" />
                  <span className="font-semibold">Wysyłka w 24h</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 p-2 bg-[#FAF8F5] rounded-xl border border-[#E7DDCE]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1B4332] shrink-0" />
                  <span className="font-semibold">Zero stłuczek</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 p-2 bg-[#FAF8F5] rounded-xl border border-[#E7DDCE]">
                  <Truck className="w-3.5 h-3.5 text-[#D9821E] shrink-0" />
                  <span className="font-semibold">Paczkomat & DPD</span>
                </div>
              </div>
            </div>

            {/* MOBILE ONLY: Tasting Notes, Sensory Card & Safe Shipping after Buy Box */}
            <div className="lg:hidden space-y-4 pt-2">
              {renderFlavorNotes()}
              {renderSensoryAndShipping()}
            </div>
          </div>
        </div>
      </div>

      {/* DETAILED TABS SECTION: Opis, Zdrowie, Kulinaria, Badania, Opinie */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12" id="tabs-section">
        <div className="bg-white rounded-3xl border border-[#D9821E]/25 shadow-sm overflow-hidden">
          
          {/* Tabs Navigation Header */}
          <div className="border-b border-[#D9821E]/20 bg-[#FAF6EE]/60">
            {/* Mobile indicator informing that tabs can be swiped horizontally */}
            <div className="flex items-center justify-between px-4 pt-3 pb-1.5 border-b border-[#D9821E]/15 sm:hidden">
              <span className="text-[11px] font-bold text-[#8C7A6B] uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#D9821E]" />
                Karty wiedzy o miodzie:
              </span>
              <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#D9821E] bg-[#D9821E]/10 px-2.5 py-0.5 rounded-full animate-pulse">
                <span>Przesuń opcje</span>
                <ChevronRight className="w-3 h-3" />
              </span>
            </div>

            <div className="relative">
              <div className="flex items-center overflow-x-auto scrollbar-none px-3 sm:px-6 scroll-smooth pr-10 sm:pr-6">
                {[
                  { id: 'opis', label: 'Opis i Pochodzenie', icon: FileText },
                  { id: 'zdrowie', label: 'Właściwości Zdrowotne', icon: Heart },
                  { id: 'kulinaria', label: 'Jak Stosować & Pairing', icon: Leaf },
                  { id: 'badania', label: 'Badania Laboratoryjne', icon: Beaker },
                  { id: 'opinie', label: `Opinie (${product.reviewsCount})`, icon: MessageSquare },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 py-3.5 sm:py-4 px-3.5 sm:px-6 font-bold text-xs sm:text-sm whitespace-nowrap transition-all border-b-2 cursor-pointer shrink-0 ${
                        isActive
                          ? 'border-[#1B4332] text-[#1B4332] bg-white shadow-2xs'
                          : 'border-transparent text-[#7A6A5A] hover:text-[#241D17]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#D9821E]' : 'text-[#7A6A5A]'}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Gradient mask on right edge on mobile showing there is more content to scroll */}
              <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-[#FAF6EE] via-[#FAF6EE]/80 to-transparent flex items-center justify-end pr-1 sm:hidden">
                <ChevronRight className="w-4 h-4 text-[#D9821E] animate-pulse" />
              </div>
            </div>
          </div>

          {/* Tab Content Panels */}
          <div className="p-6 sm:p-10">
            
            {/* TAB 1: OPIS I POCHODZENIE */}
            {activeTab === 'opis' && (
              <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
                <div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#241D17] mb-3">
                    Historia zbioru i specyfika odmiany
                  </h3>
                  <p className="text-[#594D42] text-sm sm:text-base leading-relaxed mb-4">
                    {product.description}
                  </p>
                  <p className="text-[#594D42] text-sm sm:text-base leading-relaxed">
                    Nasz miód nie jest poddawany szkodliwym procesom pasteryzacji, dekrystalizacji termicznej ani filtracji ciśnieniowej. 
                    Trafia do słoika dokładnie w takiej postaci, w jakiej stworzyły go pszczoły w czystym ekosystemie Warmii i Mazur. 
                    Zachowuje naturalne pyłki kwiatowe, drobiny wosku i propolisu oraz pełną bioaktywność enzymatyczną.
                  </p>
                </div>

                {/* Apiary facts grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#D9821E]/15">
                  <div className="bg-[#FAF6EE] p-5 rounded-2xl border border-[#D9821E]/15">
                    <p className="text-xs text-[#7A6A5A] uppercase font-bold mb-1">Położenie Pasieki</p>
                    <p className="font-serif font-bold text-[#241D17] text-base">{product.region}</p>
                    <p className="text-xs text-[#594D42] mt-1.5">Dziewicze tereny leśne i łąkowe wolne od intensywnego przemysłu.</p>
                  </div>
                  <div className="bg-[#FAF6EE] p-5 rounded-2xl border border-[#D9821E]/15">
                    <p className="text-xs text-[#7A6A5A] uppercase font-bold mb-1">Metoda Pozyskiwania</p>
                    <p className="font-serif font-bold text-[#241D17] text-base">Wirowanie na zimno</p>
                    <p className="text-xs text-[#594D42] mt-1.5">Tradycyjna miodarka radialna, temperatura w pracowni poniżej 25°C.</p>
                  </div>
                  <div className="bg-[#FAF6EE] p-5 rounded-2xl border border-[#D9821E]/15">
                    <p className="text-xs text-[#7A6A5A] uppercase font-bold mb-1">Rok i Sezon</p>
                    <p className="font-serif font-bold text-[#241D17] text-base">Zbiór {product.harvestYear}</p>
                    <p className="text-xs text-[#594D42] mt-1.5">Miód z bieżącego sezonu pszczelarskiego ({product.harvestMonth}).</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: WŁAŚCIWOŚCI ZDROWOTNE & APITERAPIA */}
            {activeTab === 'zdrowie' && (
              <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
                <div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#241D17] mb-2">
                    Właściwości prozdrowotne i apiterapia
                  </h3>
                  <p className="text-sm text-[#594D42]">
                    Prawdziwy surowy miód to bioaktywny dar natury o udokumentowanym działaniu wspierającym organizm.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.healthBenefits.map((benefit, idx) => (
                    <div 
                      key={idx}
                      className="p-4 sm:p-5 bg-[#FAF6EE] rounded-2xl border border-[#1B4332]/15 flex items-start gap-3.5"
                    >
                      <div className="w-7 h-7 rounded-full bg-[#1B4332]/10 text-[#1B4332] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#241D17]">{benefit}</p>
                        <p className="text-xs text-[#7A6A5A] mt-1 leading-relaxed">
                          Naturalne enzymy pszczele i flawonoidy wspierają odporność i procesy regeneracyjne.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Important Beekeeper Warning & Safety */}
                <div className="space-y-3">
                  <div className="p-4 sm:p-5 bg-amber-50/90 rounded-2xl border border-amber-200 flex items-start gap-3.5 text-xs text-amber-900 leading-relaxed shadow-2xs">
                    <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-bold text-sm mb-1">Ochrona enzymów pszczelich (Zasada 40°C):</strong>
                      Nigdy nie rozpuszczaj miodu w płynach o temperaturze powyżej 40°C! W wyższych temperaturach cenne białka enzymatyczne (inhibina pszczela, lizozym, amylaza) ulegają bezpowrotnej denaturacji termicznej.
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 bg-[#FAF6EE] rounded-2xl border border-[#D9821E]/20 flex items-start gap-3.5 text-xs text-[#594D42] leading-relaxed shadow-2xs">
                    <ShieldAlert className="w-5 h-5 text-[#8C4609] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-bold text-sm text-[#241D17] mb-1">Zalecenie dotyczące wieku dzieci (Standard GIS / WHO):</strong>
                      Naturalny, surowy miód pszczeli podajemy dzieciom dopiero po ukończeniu 12. miesiąca życia. Jest to powszechny standard medyczny chroniący niemowlęta z niedojrzałym jeszcze układem pokarmowym przed naturalnymi przetrwalnikami flory środowiskowej.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: JAK STOSOWAĆ & PAIRING */}
            {activeTab === 'kulinaria' && (
              <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
                <div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#241D17] mb-2">
                    Inspiracje kulinarne i zalecenia spożywania
                  </h3>
                  <p className="text-sm text-[#594D42]">
                    Jak w pełni wykorzystać potencjał smakowy i odżywczy tego miodu w codziennej diecie.
                  </p>
                </div>

                {/* Recommended pairing */}
                <div className="bg-[#FAF6EE] p-5 sm:p-6 rounded-2xl border border-[#D9821E]/20">
                  <h4 className="text-xs font-bold text-[#1B4332] mb-1.5 uppercase tracking-wider">
                    Rekomendowany food-pairing:
                  </h4>
                  <p className="text-base sm:text-lg text-[#241D17] font-serif leading-relaxed">
                    „{product.pairing}”
                  </p>
                </div>

                {/* Usage points */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-[#241D17] mb-2">Zalecana kuracja codzienna:</h4>
                    <p className="text-xs sm:text-sm text-[#594D42] bg-white p-4 rounded-xl border border-[#D9821E]/15">
                      {product.detailedUsage.recommendedDose}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-[#241D17] mb-2">Pomysły kulinarne pszczelarza:</h4>
                    <ul className="space-y-2">
                      {product.detailedUsage.culinaryIdeas.map((idea, i) => (
                        <li key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-[#594D42] bg-white p-3.5 rounded-xl border border-[#D9821E]/10">
                          <span className="w-2 h-2 rounded-full bg-[#D9821E] shrink-0" />
                          <span>{idea}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: BADANIA LABORATORYJNE (CERTYFIKAT) */}
            {activeTab === 'badania' && (
              <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#241D17]">
                      Parametry laboratoryjne partii
                    </h3>
                    <p className="text-xs sm:text-sm text-[#7A6A5A] mt-0.5">
                      Każda partia miodu z naszej pasieki przechodzi rygorystyczne badania fizykochemiczne.
                    </p>
                  </div>
                  <div className="px-3.5 py-1.5 rounded-xl bg-[#1B4332]/10 border border-[#1B4332]/20 text-xs font-bold text-[#1B4332] self-start">
                    Certyfikat Weterynaryjny PIW
                  </div>
                </div>

                {/* Lab Table */}
                <div className="overflow-x-auto border border-[#D9821E]/20 rounded-2xl">
                  <table className="w-full text-left text-xs sm:text-sm border-collapse bg-white">
                    <thead>
                      <tr className="border-b border-[#D9821E]/20 text-[#7A6A5A] uppercase text-[11px] tracking-wider bg-[#FAF6EE]/70">
                        <th className="py-3 px-4">Badany parametr</th>
                        <th className="py-3 px-4">Wynik partii</th>
                        <th className="py-3 px-4">Norma Polska (PN)</th>
                        <th className="py-3 px-4 text-right">Ocena</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#D9821E]/10">
                      <tr>
                        <td className="py-3.5 px-4 font-semibold text-[#241D17]">Numer partii rozlewu</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-[#D9821E]">{product.labAnalysis.lotNumber}</td>
                        <td className="py-3.5 px-4 text-[#7A6A5A]">Identyfikowalność</td>
                        <td className="py-3.5 px-4 text-right text-[#1B4332] font-bold">✓ Zgodny</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 font-semibold text-[#241D17]">Zawartość wody (wilgotność)</td>
                        <td className="py-3.5 px-4 font-bold text-[#1B4332]">{product.labAnalysis.waterContent}</td>
                        <td className="py-3.5 px-4 text-[#7A6A5A]">Maksymalnie 20.0%</td>
                        <td className="py-3.5 px-4 text-right text-[#1B4332] font-bold">✓ Doskonała gęstość</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 font-semibold text-[#241D17]">Liczba diastazowa (aktywność enzymów)</td>
                        <td className="py-3.5 px-4 font-bold text-[#1B4332]">{product.labAnalysis.diastaseNumber}</td>
                        <td className="py-3.5 px-4 text-[#7A6A5A]">Minimum 8.0 wg Schade</td>
                        <td className="py-3.5 px-4 text-right text-[#1B4332] font-bold">✓ Bardzo wysoka</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 font-semibold text-[#241D17]">Zawartość HMF (hydroksymetylfurfural)</td>
                        <td className="py-3.5 px-4 font-bold text-[#1B4332]">{product.labAnalysis.hmf}</td>
                        <td className="py-3.5 px-4 text-[#7A6A5A]">Maksymalnie 40.0 mg/kg</td>
                        <td className="py-3.5 px-4 text-right text-[#1B4332] font-bold">✓ Świeży, niepodgrzewany</td>
                      </tr>
                      {product.labAnalysis.conductivity && (
                        <tr>
                          <td className="py-3.5 px-4 font-semibold text-[#241D17]">Przewodność właściwa</td>
                          <td className="py-3.5 px-4 font-bold text-[#1B4332]">{product.labAnalysis.conductivity}</td>
                          <td className="py-3.5 px-4 text-[#7A6A5A]">Potwierdzenie czystości</td>
                          <td className="py-3.5 px-4 text-right text-[#1B4332] font-bold">✓ Certyfikowany</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 sm:p-5 bg-white rounded-2xl border border-[#D9821E]/15 text-xs text-[#594D42] flex items-center gap-3.5 shadow-2xs">
                  <ShieldCheck className="w-5 h-5 text-[#1B4332] shrink-0" />
                  <span>
                    Pasieka znajduje się pod stałym nadzorem Powiatowego Lekarza Weterynarii. 
                    Rejestr RHD: <strong>WNI 28143502</strong>. Miód 100% naturalny, niefiltrowany.
                  </span>
                </div>
              </div>
            )}

            {/* TAB 6: OPINIE SMASZOSZY */}
            {activeTab === 'opinie' && (
              <ProductReviews productName={product.name} />
            )}

          </div>
        </div>
      </section>

      {/* RELATED PRODUCTS SECTION: Odkryj inne typy miodów */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="border-t border-[#D9821E]/20 pt-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#D9821E]">
                Poznaj bogactwo warmińskiej pasieki
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#241D17]">
                Zobacz także inne odmiany miodów
              </h3>
            </div>
            <Link
              to="/"
              className="text-xs font-bold text-[#1B4332] hover:text-[#D9821E] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Wszystkie 15 miodów w ofercie</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((relProd) => {
              const relImage = relProd.images?.[0] || relProd.imageUrl;
              const firstSize = relProd.sizesList[0];

              return (
                <div
                  key={relProd.id}
                  onClick={() => {
                    navigate(`/produkt/${relProd.id}`);
                  }}
                  className="bg-white rounded-3xl border border-[#D9821E]/20 overflow-hidden shadow-xs hover:shadow-md transition-all group cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#FAF6EE]">
                      <img
                        src={relImage}
                        alt={relProd.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = relProd.imageUrl;
                        }}
                      />
                      {relProd.badge && (
                        <span className="absolute top-3 left-3 bg-[#D9821E] text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-full shadow-xs">
                          {relProd.badge}
                        </span>
                      )}
                      <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-medium px-2 py-0.5 rounded backdrop-blur-xs">
                        {relProd.harvestYear}
                      </span>
                    </div>

                    <div className="p-5">
                      <p className="text-[11px] font-semibold text-[#D9821E] uppercase tracking-wider mb-1">
                        {relProd.region}
                      </p>
                      <h4 className="text-base font-bold text-[#241D17] group-hover:text-[#D9821E] transition-colors line-clamp-1 mb-1.5 font-serif">
                        {relProd.name}
                      </h4>
                      <p className="text-xs text-[#7A6A5A] line-clamp-2 mb-3 leading-relaxed">
                        {relProd.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-[#D9821E]/10 flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-[10px] text-[#7A6A5A] block">od ({firstSize?.gram || '450g'}):</span>
                      <span className="text-base font-extrabold text-[#1B4332]">{firstSize?.price || 38} zł</span>
                    </div>

                    <button
                      type="button"
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#1B4332] bg-[#FAF6EE] group-hover:bg-[#1B4332] group-hover:text-white border border-[#1B4332]/20 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>Szczegóły</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* MOBILE STICKY BOTTOM BUY BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#D9821E]/25 p-3.5 shadow-lg lg:hidden flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold text-[#241D17] truncate">{product.name}</p>
          <p className="text-xs text-[#1B4332] font-extrabold">
            {((currentSize?.price || 0) * quantity).toFixed(2)} zł <span className="text-[10px] font-normal text-[#7A6A5A]">({currentSize?.gram})</span>
          </p>
        </div>

        <button
          onClick={handleAddToCart}
          className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-[#1B4332] hover:bg-[#143326] transition-colors shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          {addedAnimation ? (
            <>
              <Check className="w-4 h-4 text-[#E6C065]" />
              <span>Dodano!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>Do koszyka</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};
