import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { HoneyProduct } from '../types';
import { HONEY_PRODUCTS } from '../data/honeyProducts';
import { getEnrichedProduct } from '../utils/honeyHelpers';
import { 
  X, 
  Scale, 
  ArrowLeftRight, 
  Check, 
  ShoppingBag, 
  Sparkles, 
  Star, 
  Award, 
  Beaker, 
  Heart, 
  ExternalLink, 
  ShieldCheck,
  CheckCircle2,
  Utensils,
  Plus
} from 'lucide-react';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  products?: HoneyProduct[];
  onRemove?: (product: HoneyProduct) => void;
  productA?: HoneyProduct | null;
  productB?: HoneyProduct | null;
  onAddToCart?: (product: HoneyProduct, weightGrams: number, pricePln: number) => void;
  onOpenProductDetail?: (product: HoneyProduct) => void;
}

type CompareTab = 'sensory' | 'pricing' | 'health_lab' | 'culinary_verdict' | 'all';

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  onClose,
  products = [],
  productA: initialProductA,
  productB: initialProductB,
  onRemove,
  onAddToCart,
  onOpenProductDetail,
}) => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Wybierz domyślne produkty A i B
  const defaultA = initialProductA || products[0] || HONEY_PRODUCTS[0];
  const defaultB = initialProductB || products[1] || (
    HONEY_PRODUCTS.find(p => p.id !== defaultA.id && p.category === 'lesne-spadz') || 
    HONEY_PRODUCTS.find(p => p.id !== defaultA.id) ||
    HONEY_PRODUCTS[1]
  );
  const defaultC = products[2] || null;

  const [currentAId, setCurrentAId] = useState<string>(defaultA.id);
  const [currentBId, setCurrentBId] = useState<string>(defaultB.id);
  const [currentCId, setCurrentCId] = useState<string | null>(defaultC?.id || null);
  const [activeTab, setActiveTab] = useState<CompareTab>('sensory');

  // Synchronizacja przy otwarciu lub zmianie parametrów
  useEffect(() => {
    if (products.length >= 3) {
      setCurrentAId(products[0].id);
      setCurrentBId(products[1].id);
      setCurrentCId(products[2].id);
    } else if (products.length === 2) {
      setCurrentAId(products[0].id);
      setCurrentBId(products[1].id);
      setCurrentCId(null);
    } else if (products.length === 1) {
      setCurrentAId(products[0].id);
      const other = HONEY_PRODUCTS.find(p => p.id !== products[0].id) || HONEY_PRODUCTS[1];
      setCurrentBId(other.id);
      setCurrentCId(null);
    } else if (initialProductA) {
      setCurrentAId(initialProductA.id);
      if (initialProductB) {
        setCurrentBId(initialProductB.id);
      }
      setCurrentCId(null);
    }
  }, [isOpen, products, initialProductA, initialProductB]);

  // Reset scroll on tab change or when switching to 'all' (pełne zestawienie)
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  const rawA = HONEY_PRODUCTS.find(p => p.id === currentAId) || defaultA;
  const rawB = HONEY_PRODUCTS.find(p => p.id === currentBId) || defaultB;
  const rawC = currentCId ? (HONEY_PRODUCTS.find(p => p.id === currentCId) || null) : null;

  const currentA = getEnrichedProduct(rawA);
  const currentB = getEnrichedProduct(rawB);
  const currentC = rawC ? getEnrichedProduct(rawC) : null;

  const hasThreeProducts = Boolean(currentC && rawC);

  // Wybrane gramatury do szybkiego zakupu
  const [selectedSizeAIdx, setSelectedSizeAIdx] = useState(0);
  const [selectedSizeBIdx, setSelectedSizeBIdx] = useState(0);
  const [selectedSizeCIdx, setSelectedSizeCIdx] = useState(0);

  // Animacje dodania do koszyka
  const [addedA, setAddedA] = useState(false);
  const [addedB, setAddedB] = useState(false);
  const [addedC, setAddedC] = useState(false);

  if (!isOpen) return null;

  const handleSwap = () => {
    if (currentCId) {
      const temp = currentAId;
      setCurrentAId(currentBId);
      setCurrentBId(currentCId);
      setCurrentCId(temp);
    } else {
      const temp = currentAId;
      setCurrentAId(currentBId);
      setCurrentBId(temp);
    }
  };

  const handleAddThird = (suggestedId?: string) => {
    if (suggestedId) {
      setCurrentCId(suggestedId);
      return;
    }
    const nextAvailable = HONEY_PRODUCTS.find(p => p.id !== currentAId && p.id !== currentBId);
    if (nextAvailable) {
      setCurrentCId(nextAvailable.id);
    }
  };

  const handleRemoveThird = () => {
    if (rawC && onRemove) {
      onRemove(rawC);
    }
    setCurrentCId(null);
  };

  const handleOpenDetail = (prod: HoneyProduct) => {
    document.body.style.overflow = '';
    onClose();
    if (onOpenProductDetail) {
      onOpenProductDetail(prod);
    } else {
      navigate(`/produkt/${prod.id}`);
    }
  };

  const handleAddCartA = () => {
    const size = currentA.sizesList[selectedSizeAIdx] || currentA.sizesList[0];
    if (size && onAddToCart) {
      onAddToCart(rawA, size.weightGrams, size.price);
    }
    setAddedA(true);
    setTimeout(() => setAddedA(false), 1600);
  };

  const handleAddCartB = () => {
    const size = currentB.sizesList[selectedSizeBIdx] || currentB.sizesList[0];
    if (size && onAddToCart) {
      onAddToCart(rawB, size.weightGrams, size.price);
    }
    setAddedB(true);
    setTimeout(() => setAddedB(false), 1600);
  };

  const handleAddCartC = () => {
    if (!currentC || !rawC) return;
    const size = currentC.sizesList[selectedSizeCIdx] || currentC.sizesList[0];
    if (size && onAddToCart) {
      onAddToCart(rawC, size.weightGrams, size.price);
    }
    setAddedC(true);
    setTimeout(() => setAddedC(false), 1600);
  };

  const sizeA = currentA.sizesList[selectedSizeAIdx] || currentA.sizesList[0];
  const sizeB = currentB.sizesList[selectedSizeBIdx] || currentB.sizesList[0];
  const sizeC = currentC ? (currentC.sizesList[selectedSizeCIdx] || currentC.sizesList[0]) : null;

  const TABS: { id: CompareTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'sensory', label: '1. Profil Sensoryczny', icon: Sparkles },
    { id: 'pricing', label: '2. Ceny & Gramatury', icon: ShoppingBag },
    { id: 'health_lab', label: '3. Badania & Zdrowie', icon: Beaker },
    { id: 'culinary_verdict', label: '4. Kulinaria, Pairing & Werdykt', icon: Award },
    { id: 'all', label: 'Pełne zestawienie', icon: CheckCircle2 },
  ];

  const colSpanVal = hasThreeProducts ? 4 : 3;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-1.5 sm:p-4 md:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        data-lenis-prevent
        className="bg-white w-full max-w-7xl h-[90dvh] sm:h-[94vh] max-h-[90dvh] sm:max-h-[94vh] rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col border border-[#D9821E]/30 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
        id="modal-porownywarka-miodow"
      >
        {/* Modal Top Header Bar */}
        <div className="px-3 sm:px-5 py-2.5 sm:py-3.5 border-b border-[#D9821E]/20 bg-[#FAF6EE] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#1B4332] text-white flex items-center justify-center shadow-xs shrink-0">
              <Scale className="w-4 h-4 sm:w-5 sm:h-5 text-[#E6C065]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-lg font-serif font-bold text-[#241D17] leading-tight truncate">
                  Porównywarka Odmian Miodów
                </h2>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#1B4332]/10 text-[#1B4332] shrink-0">
                  {hasThreeProducts ? 'Zestawienie 3 odmian' : 'Zestawienie 2 odmian'}
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-[#7A6A5A] truncate">
                Zestaw nuty sensoryczne, parametry laboratoryjne, ceny oraz werdykt pszczelarza
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={handleSwap}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold text-[#594D42] hover:text-[#1B4332] bg-white border border-[#D9821E]/20 hover:border-[#D9821E] transition-colors cursor-pointer shadow-2xs"
              title={hasThreeProducts ? "Rotuj kolejność miodów (A → B → C)" : "Zamień kolejność miodów (A ↔ B)"}
              id="btn-zamien-miody"
            >
              <ArrowLeftRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D9821E]" />
              <span className="hidden sm:inline">{hasThreeProducts ? 'Rotuj pozycje' : 'Zamień miejscami'}</span>
            </button>

            <button 
              type="button"
              onClick={onClose}
              className="p-1.5 sm:p-2 text-[#7A6A5A] hover:text-[#241D17] hover:bg-white rounded-full transition-colors cursor-pointer"
              title="Zamknij porównywarkę"
              id="btn-zamknij-porownywarke"
              aria-label="Zamknij porównywarkę"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Persistent Honey Pickers Header */}
        <div className="bg-[#FAF8F5] border-b border-[#D9821E]/20 p-2 sm:p-4 shrink-0">
          <div className={`grid ${hasThreeProducts ? 'grid-cols-3 gap-1.5' : 'grid-cols-2 lg:grid-cols-3 gap-2'} sm:gap-4`}>
            
            {/* COLUMN A HEADER */}
            <div className="bg-white p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-[#1B4332]/30 shadow-2xs space-y-1.5 sm:space-y-2 relative">
              <div className="flex items-center justify-between">
                <label className="text-[10px] sm:text-[11px] font-bold text-[#1B4332] uppercase tracking-wider flex items-center gap-1 sm:gap-1.5">
                  <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#1B4332] text-white flex items-center justify-center text-[9px] sm:text-[10px] font-mono">A</span>
                  <span className="hidden xs:inline">Miód A:</span>
                </label>
                <button
                  onClick={() => handleOpenDetail(rawA)}
                  className="text-[10px] sm:text-[11px] font-bold text-[#D9821E] hover:underline flex items-center gap-0.5 sm:gap-1 cursor-pointer"
                >
                  <span className="hidden xs:inline">Karta</span>
                  <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </button>
              </div>

              <select
                value={currentAId}
                onChange={(e) => setCurrentAId(e.target.value)}
                className="w-full bg-[#FAF6EE] text-[11px] sm:text-xs font-bold text-[#241D17] py-1 sm:py-2 px-1.5 sm:px-2.5 rounded-lg sm:rounded-xl border border-[#D9821E]/30 focus:outline-[#1B4332] cursor-pointer truncate"
                id="select-porownaj-a"
              >
                {HONEY_PRODUCTS.map((p) => (
                  <option key={p.id} value={p.id} disabled={p.id === currentBId || p.id === currentCId}>
                    {p.name} ({p.sizes[0]?.pricePln} zł)
                  </option>
                ))}
              </select>

              <div className="flex gap-1.5 sm:gap-3 items-center pt-0.5 sm:pt-1">
                <img 
                  src={currentA.images?.[0] || currentA.imageUrl} 
                  alt={currentA.name}
                  className="w-7 h-7 sm:w-11 sm:h-11 object-cover rounded-lg sm:rounded-xl border border-[#D9821E]/20 shrink-0 bg-white"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = currentA.imageUrl;
                  }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <h3 className="text-[11px] sm:text-sm font-bold text-[#241D17] leading-snug truncate font-serif">
                      {currentA.name}
                    </h3>
                    {currentA.badge && (
                      <span className="hidden md:inline-block px-1.5 py-0.2 rounded-full text-[9px] font-extrabold uppercase bg-[#D9821E] text-white shrink-0">
                        {currentA.badge}
                      </span>
                    )}
                  </div>
                  <p className="hidden sm:block text-[10px] text-[#7A6A5A] italic truncate">
                    {currentA.botanicalSource}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] sm:text-xs text-amber-500 mt-0.5">
                    <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-400 text-amber-400 shrink-0" />
                    <span className="font-bold text-[#241D17] text-[9px] sm:text-[10px]">{currentA.rating.toFixed(1)}</span>
                    <span className="hidden sm:inline text-[9px] text-[#7A6A5A]">({currentA.reviewsCount})</span>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN B HEADER */}
            <div className="bg-white p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-[#D9821E]/40 shadow-2xs space-y-1.5 sm:space-y-2 relative">
              <div className="flex items-center justify-between">
                <label className="text-[10px] sm:text-[11px] font-bold text-[#D9821E] uppercase tracking-wider flex items-center gap-1 sm:gap-1.5">
                  <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#D9821E] text-white flex items-center justify-center text-[9px] sm:text-[10px] font-mono">B</span>
                  <span className="hidden xs:inline">Miód B:</span>
                </label>
                <button
                  onClick={() => handleOpenDetail(rawB)}
                  className="text-[10px] sm:text-[11px] font-bold text-[#D9821E] hover:underline flex items-center gap-0.5 sm:gap-1 cursor-pointer"
                >
                  <span className="hidden xs:inline">Karta</span>
                  <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </button>
              </div>

              <select
                value={currentBId}
                onChange={(e) => setCurrentBId(e.target.value)}
                className="w-full bg-[#FAF6EE] text-[11px] sm:text-xs font-bold text-[#241D17] py-1 sm:py-2 px-1.5 sm:px-2.5 rounded-lg sm:rounded-xl border border-[#D9821E]/30 focus:outline-[#1B4332] cursor-pointer truncate"
                id="select-porownaj-b"
              >
                {HONEY_PRODUCTS.map((p) => (
                  <option key={p.id} value={p.id} disabled={p.id === currentAId || p.id === currentCId}>
                    {p.name} ({p.sizes[0]?.pricePln} zł)
                  </option>
                ))}
              </select>

              <div className="flex gap-1.5 sm:gap-3 items-center pt-0.5 sm:pt-1">
                <img 
                  src={currentB.images?.[0] || currentB.imageUrl} 
                  alt={currentB.name}
                  className="w-7 h-7 sm:w-11 sm:h-11 object-cover rounded-lg sm:rounded-xl border border-[#D9821E]/20 shrink-0 bg-white"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = currentB.imageUrl;
                  }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <h3 className="text-[11px] sm:text-sm font-bold text-[#241D17] leading-snug truncate font-serif">
                      {currentB.name}
                    </h3>
                    {currentB.badge && (
                      <span className="hidden md:inline-block px-1.5 py-0.2 rounded-full text-[9px] font-extrabold uppercase bg-[#D9821E] text-white shrink-0">
                        {currentB.badge}
                      </span>
                    )}
                  </div>
                  <p className="hidden sm:block text-[10px] text-[#7A6A5A] italic truncate">
                    {currentB.botanicalSource}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] sm:text-xs text-amber-500 mt-0.5">
                    <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-400 text-amber-400 shrink-0" />
                    <span className="font-bold text-[#241D17] text-[9px] sm:text-[10px]">{currentB.rating.toFixed(1)}</span>
                    <span className="hidden sm:inline text-[9px] text-[#7A6A5A]">({currentB.reviewsCount})</span>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN C HEADER (IF PRESENT) OR ADD THIRD BUTTON */}
            {hasThreeProducts && currentC && rawC ? (
              <div className="bg-white p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-[#2D6A4F]/40 shadow-2xs space-y-1.5 sm:space-y-2 relative">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] sm:text-[11px] font-bold text-[#2D6A4F] uppercase tracking-wider flex items-center gap-1 sm:gap-1.5">
                    <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#2D6A4F] text-white flex items-center justify-center text-[9px] sm:text-[10px] font-mono">C</span>
                    <span className="hidden xs:inline">Miód C:</span>
                  </label>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <button
                      onClick={() => handleOpenDetail(rawC)}
                      className="text-[10px] sm:text-[11px] font-bold text-[#D9821E] hover:underline flex items-center gap-0.5 sm:gap-1 cursor-pointer"
                    >
                      <span className="hidden xs:inline">Karta</span>
                      <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveThird}
                      className="text-[10px] sm:text-[11px] font-bold text-[#8C7A6B] hover:text-red-600 cursor-pointer p-0.5"
                      title="Usuń 3. miód z porównania"
                    >
                      <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>
                  </div>
                </div>

                <select
                  value={currentCId || ''}
                  onChange={(e) => setCurrentCId(e.target.value)}
                  className="w-full bg-[#FAF6EE] text-[11px] sm:text-xs font-bold text-[#241D17] py-1 sm:py-2 px-1.5 sm:px-2.5 rounded-lg sm:rounded-xl border border-[#D9821E]/30 focus:outline-[#1B4332] cursor-pointer truncate"
                  id="select-porownaj-c"
                >
                  {HONEY_PRODUCTS.map((p) => (
                    <option key={p.id} value={p.id} disabled={p.id === currentAId || p.id === currentBId}>
                      {p.name} ({p.sizes[0]?.pricePln} zł)
                    </option>
                  ))}
                </select>

                <div className="flex gap-1.5 sm:gap-3 items-center pt-0.5 sm:pt-1">
                  <img 
                    src={currentC.images?.[0] || currentC.imageUrl} 
                    alt={currentC.name}
                    className="w-7 h-7 sm:w-11 sm:h-11 object-cover rounded-lg sm:rounded-xl border border-[#D9821E]/20 shrink-0 bg-white"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = currentC.imageUrl;
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <h3 className="text-[11px] sm:text-sm font-bold text-[#241D17] leading-snug truncate font-serif">
                        {currentC.name}
                      </h3>
                      {currentC.badge && (
                        <span className="hidden md:inline-block px-1.5 py-0.2 rounded-full text-[9px] font-extrabold uppercase bg-[#2D6A4F] text-white shrink-0">
                          {currentC.badge}
                        </span>
                      )}
                    </div>
                    <p className="hidden sm:block text-[10px] text-[#7A6A5A] italic truncate">
                      {currentC.botanicalSource}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] sm:text-xs text-amber-500 mt-0.5">
                      <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-400 text-amber-400 shrink-0" />
                      <span className="font-bold text-[#241D17] text-[9px] sm:text-[10px]">{currentC.rating.toFixed(1)}</span>
                      <span className="hidden sm:inline text-[9px] text-[#7A6A5A]">({currentC.reviewsCount})</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden lg:flex flex-col items-center justify-center p-3 rounded-2xl border-2 border-dashed border-[#D9821E]/30 bg-white/70 hover:bg-white transition-colors text-center">
                <p className="text-xs font-bold text-[#241D17] mb-1">Chcesz porównać 3 odmiany?</p>
                <p className="text-[11px] text-[#7A6A5A] mb-2">Dodaj trzeci miód do pełnego zestawienia</p>
                <button
                  type="button"
                  onClick={() => handleAddThird()}
                  className="px-3 py-1.5 rounded-xl bg-[#1B4332] text-white text-xs font-bold hover:bg-[#143326] transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                  id="btn-dodaj-trzeci-miod"
                >
                  <Plus className="w-3.5 h-3.5 text-[#E6C065]" />
                  <span>Dodaj 3. miód</span>
                </button>
              </div>
            )}

          </div>

          {/* TAB BAR NAVIGATION */}
          <div className="flex items-center justify-between gap-2 pt-2 sm:pt-3">
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none pb-0.5">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 sm:gap-2 py-1.5 sm:py-2 px-2.5 sm:px-3.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-[#1B4332] text-white shadow-xs ring-2 ring-[#1B4332]/20'
                        : 'bg-white text-[#594D42] border border-[#D9821E]/25 hover:border-[#D9821E] hover:bg-[#FAF6EE]'
                    }`}
                    id={`tab-porownaj-${tab.id}`}
                  >
                    <Icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isActive ? 'text-[#E6C065]' : 'text-[#D9821E]'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {!hasThreeProducts && (
              <button
                type="button"
                onClick={() => handleAddThird()}
                className="lg:hidden shrink-0 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg sm:rounded-xl bg-[#FAF6EE] text-[#1B4332] border border-[#1B4332]/30 text-[11px] sm:text-xs font-bold flex items-center gap-1 hover:bg-[#1B4332] hover:text-white transition-colors cursor-pointer"
                title="Dodaj 3. miód do porównania"
              >
                <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>+ 3. miód</span>
              </button>
            )}
          </div>

          {/* Mobile Swipe Hint */}
          <div className="sm:hidden flex items-center justify-between text-[10px] text-[#8C7A6B] bg-[#F5EDE0]/80 px-2.5 py-1 rounded-lg mt-2 border border-[#DFCBB5]/50">
            <span className="flex items-center gap-1 font-medium">
              <span>⇄</span>
              <span>Przesuwaj w bok, aby porównać parametry</span>
            </span>
            <span className="font-semibold text-[#945209]">Kolumna cech przypięta</span>
          </div>
        </div>

        {/* Modal Scrollable Table Body with min-h-0 and data-lenis-prevent */}
        <div 
          ref={scrollContainerRef}
          data-lenis-prevent
          onWheel={(e) => e.stopPropagation()}
          className="flex-1 min-h-0 overflow-y-auto overflow-x-auto overscroll-contain custom-modal-scroll p-2.5 sm:p-4 md:p-6 space-y-4 sm:space-y-6"
        >
          
          {/* COMPARISON TABLE */}
          <div className={`${hasThreeProducts ? 'min-w-[560px] sm:min-w-[840px]' : 'min-w-[420px] sm:min-w-[660px]'} border border-[#D9821E]/20 rounded-xl sm:rounded-2xl overflow-hidden shadow-xs bg-white`}>
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-[#FAF6EE] border-b border-[#D9821E]/20 text-xs font-bold text-[#7A6A5A] uppercase tracking-wider">
                  <th className={`${hasThreeProducts ? 'w-[22%]' : 'w-1/4'} p-3.5 px-4`}>Porównywany parametr</th>
                  <th className={`${hasThreeProducts ? 'w-[26%]' : 'w-3/8'} p-3.5 px-4 border-l border-[#D9821E]/20 text-[#1B4332] font-serif text-sm`}>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded-full bg-[#1B4332] text-white flex items-center justify-center text-[9px] font-sans font-bold">A</span>
                      <span>{currentA.name}</span>
                    </div>
                  </th>
                  <th className={`${hasThreeProducts ? 'w-[26%]' : 'w-3/8'} p-3.5 px-4 border-l border-[#D9821E]/20 text-[#D9821E] font-serif text-sm`}>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded-full bg-[#D9821E] text-white flex items-center justify-center text-[9px] font-sans font-bold">B</span>
                      <span>{currentB.name}</span>
                    </div>
                  </th>
                  {hasThreeProducts && currentC && (
                    <th className="w-[26%] p-3.5 px-4 border-l border-[#D9821E]/20 text-[#2D6A4F] font-serif text-sm">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 rounded-full bg-[#2D6A4F] text-white flex items-center justify-center text-[9px] font-sans font-bold">C</span>
                        <span>{currentC.name}</span>
                      </div>
                    </th>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#D9821E]/10 text-xs text-[#594D42]">
                
                {/* 1. SECTION: PROFIL SENSORYCZNY */}
                {(activeTab === 'sensory' || activeTab === 'all') && (
                  <>
                    <tr className="bg-[#FAF3E5]/80">
                      <td colSpan={colSpanVal} className="p-2 sm:p-2.5 px-3 sm:px-4 font-bold text-[#1B4332] uppercase tracking-wider text-[10px] sm:text-[11px] sticky left-0 z-10 bg-[#FAF3E5] flex items-center gap-1.5 sm:gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-[#D9821E]" />
                        <span>1. Profil Smakowy i Sensoryczny</span>
                      </td>
                    </tr>

                    {/* Słodycz */}
                    <tr>
                      <td className="p-2.5 sm:p-3.5 px-2 sm:px-4 font-semibold text-[#241D17] sticky left-0 bg-[#FAF8F5] z-10 border-r border-[#D9821E]/20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] text-[11px] sm:text-xs">
                        Poziom Słodyczy (1–5)
                      </td>
                      <td className="p-2.5 sm:p-3.5 px-2.5 sm:px-4 border-l border-[#D9821E]/15 text-[11px] sm:text-xs">
                        <div className="flex items-center gap-1.5 mb-1">
                          {[1, 2, 3, 4, 5].map((lvl) => (
                            <div 
                              key={lvl} 
                              className={`h-2.5 flex-1 rounded-full ${
                                lvl <= currentA.tasteProfile.sweetness 
                                  ? 'bg-[#1B4332]' 
                                  : 'bg-[#FAF6EE] border border-[#D9821E]/20'
                              }`} 
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-[#241D17] font-semibold">
                          {currentA.tasteProfile.sweetness}/5 ({currentA.tasteProfile.sweetness >= 4 ? 'Bardzo słodki' : currentA.tasteProfile.sweetness === 3 ? 'Umiarkowanie słodki' : 'Delikatny / wytrawny'})
                        </span>
                      </td>
                      <td className="p-2.5 sm:p-3.5 px-2.5 sm:px-4 border-l border-[#D9821E]/15 text-[11px] sm:text-xs">
                        <div className="flex items-center gap-1.5 mb-1">
                          {[1, 2, 3, 4, 5].map((lvl) => (
                            <div 
                              key={lvl} 
                              className={`h-2.5 flex-1 rounded-full ${
                                lvl <= currentB.tasteProfile.sweetness 
                                  ? 'bg-[#D9821E]' 
                                  : 'bg-[#FAF6EE] border border-[#D9821E]/20'
                              }`} 
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-[#241D17] font-semibold">
                          {currentB.tasteProfile.sweetness}/5 ({currentB.tasteProfile.sweetness >= 4 ? 'Bardzo słodki' : currentB.tasteProfile.sweetness === 3 ? 'Umiarkowanie słodki' : 'Delikatny / wytrawny'})
                        </span>
                      </td>
                      {hasThreeProducts && currentC && (
                        <td className="p-2.5 sm:p-3.5 px-2.5 sm:px-4 border-l border-[#D9821E]/15 text-[11px] sm:text-xs">
                          <div className="flex items-center gap-1.5 mb-1">
                            {[1, 2, 3, 4, 5].map((lvl) => (
                              <div 
                                key={lvl} 
                                className={`h-2.5 flex-1 rounded-full ${
                                  lvl <= currentC.tasteProfile.sweetness 
                                    ? 'bg-[#2D6A4F]' 
                                    : 'bg-[#FAF6EE] border border-[#D9821E]/20'
                                }`} 
                              />
                            ))}
                          </div>
                          <span className="text-[11px] text-[#241D17] font-semibold">
                            {currentC.tasteProfile.sweetness}/5 ({currentC.tasteProfile.sweetness >= 4 ? 'Bardzo słodki' : currentC.tasteProfile.sweetness === 3 ? 'Umiarkowanie słodki' : 'Delikatny / wytrawny'})
                          </span>
                        </td>
                      )}
                    </tr>

                    {/* Kwasowość */}
                    <tr>
                      <td className="p-2.5 sm:p-3.5 px-2 sm:px-4 font-semibold text-[#241D17] sticky left-0 bg-[#FAF8F5] z-10 border-r border-[#D9821E]/20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] text-[11px] sm:text-xs">
                        Kwasowość & Przełamanie
                      </td>
                      <td className="p-2.5 sm:p-3.5 px-2.5 sm:px-4 border-l border-[#D9821E]/15 text-[11px] sm:text-xs">
                        <div className="flex items-center gap-1.5 mb-1">
                          {[1, 2, 3, 4, 5].map((lvl) => (
                            <div 
                              key={lvl} 
                              className={`h-2.5 flex-1 rounded-full ${
                                lvl <= currentA.tasteProfile.acidity 
                                  ? 'bg-[#1B4332]' 
                                  : 'bg-[#FAF6EE] border border-[#D9821E]/20'
                              }`} 
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-[#241D17] font-semibold">
                          {currentA.tasteProfile.acidity}/5 ({currentA.tasteProfile.acidity >= 3 ? 'Wyrazista / odświeżająca' : 'Gładka / aksamitna'})
                        </span>
                      </td>
                      <td className="p-2.5 sm:p-3.5 px-2.5 sm:px-4 border-l border-[#D9821E]/15 text-[11px] sm:text-xs">
                        <div className="flex items-center gap-1.5 mb-1">
                          {[1, 2, 3, 4, 5].map((lvl) => (
                            <div 
                              key={lvl} 
                              className={`h-2.5 flex-1 rounded-full ${
                                lvl <= currentB.tasteProfile.acidity 
                                  ? 'bg-[#D9821E]' 
                                  : 'bg-[#FAF6EE] border border-[#D9821E]/20'
                              }`} 
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-[#241D17] font-semibold">
                          {currentB.tasteProfile.acidity}/5 ({currentB.tasteProfile.acidity >= 3 ? 'Wyrazista / odświeżająca' : 'Gładka / aksamitna'})
                        </span>
                      </td>
                      {hasThreeProducts && currentC && (
                        <td className="p-2.5 sm:p-3.5 px-2.5 sm:px-4 border-l border-[#D9821E]/15 text-[11px] sm:text-xs">
                          <div className="flex items-center gap-1.5 mb-1">
                            {[1, 2, 3, 4, 5].map((lvl) => (
                              <div 
                                key={lvl} 
                                className={`h-2.5 flex-1 rounded-full ${
                                  lvl <= currentC.tasteProfile.acidity 
                                    ? 'bg-[#2D6A4F]' 
                                    : 'bg-[#FAF6EE] border border-[#D9821E]/20'
                                }`} 
                              />
                            ))}
                          </div>
                          <span className="text-[11px] text-[#241D17] font-semibold">
                            {currentC.tasteProfile.acidity}/5 ({currentC.tasteProfile.acidity >= 3 ? 'Wyrazista / odświeżająca' : 'Gładka / aksamitna'})
                          </span>
                        </td>
                      )}
                    </tr>

                    {/* Intensywność Aromatu */}
                    <tr>
                      <td className="p-2.5 sm:p-3.5 px-2 sm:px-4 font-semibold text-[#241D17] sticky left-0 bg-[#FAF8F5] z-10 border-r border-[#D9821E]/20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] text-[11px] sm:text-xs">
                        Intensywność Bukietu & Aromatu
                      </td>
                      <td className="p-2.5 sm:p-3.5 px-2.5 sm:px-4 border-l border-[#D9821E]/15 text-[11px] sm:text-xs">
                        <div className="flex items-center gap-1.5 mb-1">
                          {[1, 2, 3, 4, 5].map((lvl) => (
                            <div 
                              key={lvl} 
                              className={`h-2.5 flex-1 rounded-full ${
                                lvl <= currentA.tasteProfile.aroma 
                                  ? 'bg-[#1B4332]' 
                                  : 'bg-[#FAF6EE] border border-[#D9821E]/20'
                              }`} 
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-[#241D17] font-semibold">
                          {currentA.tasteProfile.aroma}/5 ({currentA.tasteProfile.aroma >= 4 ? 'Mocny, głęboki, żywiczny' : 'Subtelny, kwiatowy'})
                        </span>
                      </td>
                      <td className="p-2.5 sm:p-3.5 px-2.5 sm:px-4 border-l border-[#D9821E]/15 text-[11px] sm:text-xs">
                        <div className="flex items-center gap-1.5 mb-1">
                          {[1, 2, 3, 4, 5].map((lvl) => (
                            <div 
                              key={lvl} 
                              className={`h-2.5 flex-1 rounded-full ${
                                lvl <= currentB.tasteProfile.aroma 
                                  ? 'bg-[#D9821E]' 
                                  : 'bg-[#FAF6EE] border border-[#D9821E]/20'
                              }`} 
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-[#241D17] font-semibold">
                          {currentB.tasteProfile.aroma}/5 ({currentB.tasteProfile.aroma >= 4 ? 'Mocny, głęboki, żywiczny' : 'Subtelny, kwiatowy'})
                        </span>
                      </td>
                      {hasThreeProducts && currentC && (
                        <td className="p-2.5 sm:p-3.5 px-2.5 sm:px-4 border-l border-[#D9821E]/15 text-[11px] sm:text-xs">
                          <div className="flex items-center gap-1.5 mb-1">
                            {[1, 2, 3, 4, 5].map((lvl) => (
                              <div 
                                key={lvl} 
                                className={`h-2.5 flex-1 rounded-full ${
                                  lvl <= currentC.tasteProfile.aroma 
                                    ? 'bg-[#2D6A4F]' 
                                    : 'bg-[#FAF6EE] border border-[#D9821E]/20'
                                }`} 
                              />
                            ))}
                          </div>
                          <span className="text-[11px] text-[#241D17] font-semibold">
                            {currentC.tasteProfile.aroma}/5 ({currentC.tasteProfile.aroma >= 4 ? 'Mocny, głęboki, żywiczny' : 'Subtelny, kwiatowy'})
                          </span>
                        </td>
                      )}
                    </tr>

                    {/* Dominujące Nuty Smakowe */}
                    <tr>
                      <td className="p-2.5 sm:p-3.5 px-2 sm:px-4 font-semibold text-[#241D17] sticky left-0 bg-[#FAF8F5] z-10 border-r border-[#D9821E]/20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] text-[11px] sm:text-xs">
                        <div>
                          <span>Dominujące Nuty Smakowe</span>
                          <span className="block text-[10px] font-normal text-[#7A6A5A]">Kliknij nutę, aby filtrować</span>
                        </div>
                      </td>
                      <td className="p-2.5 sm:p-3.5 px-2.5 sm:px-4 border-l border-[#D9821E]/15 text-[11px] sm:text-xs">
                        <div className="flex flex-wrap gap-1.5">
                          {(currentA.flavorNotes || currentA.tastingNotes || []).map((n, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => {
                                onClose();
                                navigate(`/?nuta=${encodeURIComponent(n)}#katalog`);
                              }}
                              className="px-2 py-0.5 rounded-full bg-[#FAF6EE] hover:bg-[#1B4332] text-[10px] font-bold text-[#1B4332] hover:text-white border border-[#D9821E]/20 transition-all cursor-pointer shadow-2xs flex items-center gap-1 group"
                              title={`Filtruj katalog po nucie: ${n}`}
                            >
                              <span>{n}</span>
                              <span className="text-[9px] opacity-70 group-hover:opacity-100">🔍</span>
                            </button>
                          ))}
                        </div>
                      </td>
                      <td className="p-2.5 sm:p-3.5 px-2.5 sm:px-4 border-l border-[#D9821E]/15 text-[11px] sm:text-xs">
                        <div className="flex flex-wrap gap-1.5">
                          {(currentB.flavorNotes || currentB.tastingNotes || []).map((n, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => {
                                onClose();
                                navigate(`/?nuta=${encodeURIComponent(n)}#katalog`);
                              }}
                              className="px-2 py-0.5 rounded-full bg-[#FAF6EE] hover:bg-[#D9821E] text-[10px] font-bold text-[#8E5116] hover:text-white border border-[#D9821E]/20 transition-all cursor-pointer shadow-2xs flex items-center gap-1 group"
                              title={`Filtruj katalog po nucie: ${n}`}
                            >
                              <span>{n}</span>
                              <span className="text-[9px] opacity-70 group-hover:opacity-100">🔍</span>
                            </button>
                          ))}
                        </div>
                      </td>
                      {hasThreeProducts && currentC && (
                        <td className="p-2.5 sm:p-3.5 px-2.5 sm:px-4 border-l border-[#D9821E]/15 text-[11px] sm:text-xs">
                          <div className="flex flex-wrap gap-1.5">
                            {(currentC.flavorNotes || currentC.tastingNotes || []).map((n, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => {
                                  onClose();
                                  navigate(`/?nuta=${encodeURIComponent(n)}#katalog`);
                                }}
                                className="px-2 py-0.5 rounded-full bg-[#FAF6EE] hover:bg-[#2D6A4F] text-[10px] font-bold text-[#2D6A4F] hover:text-white border border-[#D9821E]/20 transition-all cursor-pointer shadow-2xs flex items-center gap-1 group"
                                title={`Filtruj katalog po nucie: ${n}`}
                              >
                                <span>{n}</span>
                                <span className="text-[9px] opacity-70 group-hover:opacity-100">🔍</span>
                              </button>
                            ))}
                          </div>
                        </td>
                      )}
                    </tr>

                    {/* Krystalizacja i Barwa */}
                    <tr>
                      <td className="p-2.5 sm:p-3.5 px-2 sm:px-4 font-semibold text-[#241D17] sticky left-0 bg-[#FAF8F5] z-10 border-r border-[#D9821E]/20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] text-[11px] sm:text-xs">
                        Struktura & Barwa
                      </td>
                      <td className="p-2.5 sm:p-3.5 px-2.5 sm:px-4 border-l border-[#D9821E]/15 space-y-1 text-[11px] sm:text-xs">
                        <p><strong className="text-[#241D17]">Krystalizacja:</strong> {currentA.tasteProfile.crystallization}</p>
                        <p><strong className="text-[#241D17]">Barwa:</strong> {currentA.tasteProfile.color}</p>
                      </td>
                      <td className="p-2.5 sm:p-3.5 px-2.5 sm:px-4 border-l border-[#D9821E]/15 space-y-1 text-[11px] sm:text-xs">
                        <p><strong className="text-[#241D17]">Krystalizacja:</strong> {currentB.tasteProfile.crystallization}</p>
                        <p><strong className="text-[#241D17]">Barwa:</strong> {currentB.tasteProfile.color}</p>
                      </td>
                      {hasThreeProducts && currentC && (
                        <td className="p-2.5 sm:p-3.5 px-2.5 sm:px-4 border-l border-[#D9821E]/15 space-y-1 text-[11px] sm:text-xs">
                          <p><strong className="text-[#241D17]">Krystalizacja:</strong> {currentC.tasteProfile.crystallization}</p>
                          <p><strong className="text-[#241D17]">Barwa:</strong> {currentC.tasteProfile.color}</p>
                        </td>
                      )}
                    </tr>
                  </>
                )}

                {/* 2. SECTION: CENY & GRAMATURY */}
                {(activeTab === 'pricing' || activeTab === 'all') && (
                  <>
                    <tr className="bg-[#FAF3E5]/80">
                      <td colSpan={colSpanVal} className="p-2 sm:p-2.5 px-3 sm:px-4 font-bold text-[#1B4332] uppercase tracking-wider text-[10px] sm:text-[11px] sticky left-0 z-10 bg-[#FAF3E5] flex items-center gap-1.5 sm:gap-2">
                        <ShoppingBag className="w-3.5 h-3.5 text-[#D9821E]" />
                        <span>2. Ceny i Gramatury Słoików</span>
                      </td>
                    </tr>

                    {/* Sizes breakdown */}
                    <tr>
                      <td className="p-2.5 sm:p-3.5 px-2 sm:px-4 font-semibold text-[#241D17] sticky left-0 bg-[#FAF8F5] z-10 border-r border-[#D9821E]/20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] text-[11px] sm:text-xs">
                        Dostępne Warianty & Cena / kg
                      </td>
                      <td className="p-2.5 sm:p-3.5 px-2.5 sm:px-4 border-l border-[#D9821E]/15 text-[11px] sm:text-xs">
                        <div className="space-y-1.5">
                          {currentA.sizesList.map((s, idx) => (
                            <div key={idx} className="flex items-baseline justify-between bg-[#FAF6EE] px-2.5 py-1.5 rounded-lg border border-[#D9821E]/10">
                              <span className="font-bold text-[#241D17]">{s.gram}: <strong className="text-[#1B4332]">{s.price} zł</strong></span>
                              <span className="text-[10px] text-[#7A6A5A] font-mono">({Math.round((s.price / s.weightGrams) * 1000)} zł/kg)</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-2.5 sm:p-3.5 px-2.5 sm:px-4 border-l border-[#D9821E]/15 text-[11px] sm:text-xs">
                        <div className="space-y-1.5">
                          {currentB.sizesList.map((s, idx) => (
                            <div key={idx} className="flex items-baseline justify-between bg-[#FAF6EE] px-2.5 py-1.5 rounded-lg border border-[#D9821E]/10">
                              <span className="font-bold text-[#241D17]">{s.gram}: <strong className="text-[#D9821E]">{s.price} zł</strong></span>
                              <span className="text-[10px] text-[#7A6A5A] font-mono">({Math.round((s.price / s.weightGrams) * 1000)} zł/kg)</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      {hasThreeProducts && currentC && (
                        <td className="p-2.5 sm:p-3.5 px-2.5 sm:px-4 border-l border-[#D9821E]/15 text-[11px] sm:text-xs">
                          <div className="space-y-1.5">
                            {currentC.sizesList.map((s, idx) => (
                              <div key={idx} className="flex items-baseline justify-between bg-[#FAF6EE] px-2.5 py-1.5 rounded-lg border border-[#D9821E]/10">
                                <span className="font-bold text-[#241D17]">{s.gram}: <strong className="text-[#2D6A4F]">{s.price} zł</strong></span>
                                <span className="text-[10px] text-[#7A6A5A] font-mono">({Math.round((s.price / s.weightGrams) * 1000)} zł/kg)</span>
                              </div>
                            ))}
                          </div>
                        </td>
                      )}
                    </tr>

                    {/* Szybki Zakup */}
                    <tr className="bg-white">
                      <td className="p-2.5 sm:p-3.5 px-2 sm:px-4 font-semibold text-[#241D17] sticky left-0 bg-[#FAF8F5] z-10 border-r border-[#D9821E]/20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] text-[11px] sm:text-xs">
                        Szybki Zakup z Porównywarki
                      </td>
                      <td className="p-2.5 sm:p-3.5 px-2.5 sm:px-4 border-l border-[#D9821E]/15 text-[11px] sm:text-xs">
                        <div className="space-y-2">
                          <div className="flex gap-1.5">
                            {currentA.sizesList.map((g, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => setSelectedSizeAIdx(i)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                                  selectedSizeAIdx === i 
                                    ? 'bg-[#1B4332] text-white shadow-xs ring-1 ring-[#1B4332]' 
                                    : 'bg-[#FAF6EE] text-[#594D42] border border-[#D9821E]/20 hover:border-[#D9821E]'
                                }`}
                              >
                                {g.gram}
                              </button>
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={handleAddCartA}
                            className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-[#1B4332] hover:bg-[#143326] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            {addedA ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-[#E6C065]" />
                                <span>Dodano do koszyka!</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>Kup {sizeA?.price} zł ({sizeA?.gram})</span>
                              </>
                            )}
                          </button>
                        </div>
                      </td>

                      <td className="p-2.5 sm:p-3.5 px-2.5 sm:px-4 border-l border-[#D9821E]/15 text-[11px] sm:text-xs">
                        <div className="space-y-2">
                          <div className="flex gap-1.5">
                            {currentB.sizesList.map((g, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => setSelectedSizeBIdx(i)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                                  selectedSizeBIdx === i 
                                    ? 'bg-[#D9821E] text-white shadow-xs ring-1 ring-[#D9821E]' 
                                    : 'bg-[#FAF6EE] text-[#594D42] border border-[#D9821E]/20 hover:border-[#D9821E]'
                                }`}
                              >
                                {g.gram}
                              </button>
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={handleAddCartB}
                            className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-[#D9821E] hover:bg-[#B36814] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            {addedB ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-white" />
                                <span>Dodano do koszyka!</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>Kup {sizeB?.price} zł ({sizeB?.gram})</span>
                              </>
                            )}
                          </button>
                        </div>
                      </td>

                      {hasThreeProducts && currentC && (
                        <td className="p-2.5 sm:p-3.5 px-2.5 sm:px-4 border-l border-[#D9821E]/15 text-[11px] sm:text-xs">
                          <div className="space-y-2">
                            <div className="flex gap-1.5">
                              {currentC.sizesList.map((g, i) => (
                                <button
                                  key={i}
                                  type="button"
                                  onClick={() => setSelectedSizeCIdx(i)}
                                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                                    selectedSizeCIdx === i 
                                      ? 'bg-[#2D6A4F] text-white shadow-xs ring-1 ring-[#2D6A4F]' 
                                      : 'bg-[#FAF6EE] text-[#594D42] border border-[#D9821E]/20 hover:border-[#D9821E]'
                                  }`}
                                >
                                  {g.gram}
                                </button>
                              ))}
                            </div>
                            <button
                              type="button"
                              onClick={handleAddCartC}
                              className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-[#2D6A4F] hover:bg-[#1E4D38] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              {addedC ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-[#E6C065]" />
                                  <span>Dodano do koszyka!</span>
                                </>
                              ) : (
                                <>
                                  <ShoppingBag className="w-3.5 h-3.5" />
                                  <span>Kup {sizeC?.price} zł ({sizeC?.gram})</span>
                                </>
                              )}
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  </>
                )}

                {/* 3. SECTION: ZDROWIE & BADANIA LABORATORYJNE */}
                {(activeTab === 'health_lab' || activeTab === 'all') && (
                  <>
                    <tr className="bg-[#FAF3E5]/80">
                      <td colSpan={colSpanVal} className="p-2 sm:p-2.5 px-3 sm:px-4 font-bold text-[#1B4332] uppercase tracking-wider text-[10px] sm:text-[11px] sticky left-0 z-10 bg-[#FAF3E5] flex items-center gap-1.5 sm:gap-2">
                        <Heart className="w-3.5 h-3.5 text-[#D9821E]" />
                        <span>3. Właściwości Zdrowotne & Badania PIW</span>
                      </td>
                    </tr>

                    {/* Zdrowie */}
                    <tr>
                      <td className="p-2.5 sm:p-3.5 px-2 sm:px-4 font-semibold text-[#241D17] sticky left-0 bg-[#FAF8F5] z-10 border-r border-[#D9821E]/20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] text-[11px] sm:text-xs">
                        Działanie Prozdrowotne
                      </td>
                      <td className="p-2.5 sm:p-3.5 px-2.5 sm:px-4 border-l border-[#D9821E]/15 text-[11px] sm:text-xs">
                        <ul className="space-y-1.5">
                          {currentA.healthBenefits.map((benefit, i) => (
                            <li key={i} className="flex items-start gap-1.5 leading-tight">
                              <Check className="w-3.5 h-3.5 text-[#1B4332] shrink-0 mt-0.5" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="p-2.5 sm:p-3.5 px-2.5 sm:px-4 border-l border-[#D9821E]/15 text-[11px] sm:text-xs">
                        <ul className="space-y-1.5">
                          {currentB.healthBenefits.map((benefit, i) => (
                            <li key={i} className="flex items-start gap-1.5 leading-tight">
                              <Check className="w-3.5 h-3.5 text-[#D9821E] shrink-0 mt-0.5" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                      {hasThreeProducts && currentC && (
                        <td className="p-2.5 sm:p-3.5 px-2.5 sm:px-4 border-l border-[#D9821E]/15 text-[11px] sm:text-xs">
                          <ul className="space-y-1.5">
                            {currentC.healthBenefits.map((benefit, i) => (
                              <li key={i} className="flex items-start gap-1.5 leading-tight">
                                <Check className="w-3.5 h-3.5 text-[#2D6A4F] shrink-0 mt-0.5" />
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </td>
                      )}
                    </tr>

                    {/* Wilgotność */}
                    <tr>
                      <td className="p-2.5 sm:p-3.5 px-2 sm:px-4 font-semibold text-[#241D17] sticky left-0 bg-[#FAF8F5] z-10 border-r border-[#D9821E]/20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] text-[11px] sm:text-xs">
                        Zawartość Wody (Wilgotność)
                      </td>
                      <td className="p-2.5 sm:p-3.5 px-2.5 sm:px-4 border-l border-[#D9821E]/15 text-[11px] sm:text-xs">
                        <span className="font-bold text-[#1B4332] text-sm">{currentA.labAnalysis.waterContent}</span>
                        <span className="text-[10px] text-[#7A6A5A] block">(Norma PN: max 20% – bezpieczny, dojrzały)</span>
                      </td>
                      <td className="p-2.5 sm:p-3.5 px-2.5 sm:px-4 border-l border-[#D9821E]/15 text-[11px] sm:text-xs">
                        <span className="font-bold text-[#D9821E] text-sm">{currentB.labAnalysis.waterContent}</span>
                        <span className="text-[10px] text-[#7A6A5A] block">(Norma PN: max 20% – bezpieczny, dojrzały)</span>
                      </td>
                      {hasThreeProducts && currentC && (
                        <td className="p-2.5 sm:p-3.5 px-2.5 sm:px-4 border-l border-[#D9821E]/15 text-[11px] sm:text-xs">
                          <span className="font-bold text-[#2D6A4F] text-sm">{currentC.labAnalysis.waterContent}</span>
                          <span className="text-[10px] text-[#7A6A5A] block">(Norma PN: max 20% – bezpieczny, dojrzały)</span>
                        </td>
                      )}
                    </tr>

                    {/* Liczba Diastazowa */}
                    <tr>
                      <td className="p-2.5 sm:p-3.5 px-2 sm:px-4 font-semibold text-[#241D17] sticky left-0 bg-[#FAF8F5] z-10 border-r border-[#D9821E]/20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] text-[11px] sm:text-xs">
                        Liczba Diastazowa (Enzymy)
                      </td>
                      <td className="p-2.5 sm:p-3.5 px-2.5 sm:px-4 border-l border-[#D9821E]/15 text-[11px] sm:text-xs">
                        <span className="font-bold text-[#1B4332] text-sm">{currentA.labAnalysis.diastaseNumber}</span>
                        <span className="text-[10px] text-[#7A6A5A] block">(Norma PN: min 8.0 – enzymy zachowane)</span>
                      </td>
                      <td className="p-2.5 sm:p-3.5 px-2.5 sm:px-4 border-l border-[#D9821E]/15 text-[11px] sm:text-xs">
                        <span className="font-bold text-[#D9821E] text-sm">{currentB.labAnalysis.diastaseNumber}</span>
                        <span className="text-[10px] text-[#7A6A5A] block">(Norma PN: min 8.0 – enzymy zachowane)</span>
                      </td>
                      {hasThreeProducts && currentC && (
                        <td className="p-2.5 sm:p-3.5 px-2.5 sm:px-4 border-l border-[#D9821E]/15 text-[11px] sm:text-xs">
                          <span className="font-bold text-[#2D6A4F] text-sm">{currentC.labAnalysis.diastaseNumber}</span>
                          <span className="text-[10px] text-[#7A6A5A] block">(Norma PN: min 8.0 – enzymy zachowane)</span>
                        </td>
                      )}
                    </tr>

                    {/* HMF */}
                    <tr>
                      <td className="p-2.5 sm:p-3.5 px-2 sm:px-4 font-semibold text-[#241D17] sticky left-0 bg-[#FAF8F5] z-10 border-r border-[#D9821E]/20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] text-[11px] sm:text-xs">
                        Wskaźnik HMF (Świeżość)
                      </td>
                      <td className="p-2.5 sm:p-3.5 px-2.5 sm:px-4 border-l border-[#D9821E]/15 text-[11px] sm:text-xs">
                        <span className="font-bold text-[#1B4332] text-sm">{currentA.labAnalysis.hmf}</span>
                        <span className="text-[10px] text-[#7A6A5A] block">(Norma PN: max 40 mg/kg – niepodgrzewany)</span>
                      </td>
                      <td className="p-2.5 sm:p-3.5 px-2.5 sm:px-4 border-l border-[#D9821E]/15 text-[11px] sm:text-xs">
                        <span className="font-bold text-[#D9821E] text-sm">{currentB.labAnalysis.hmf}</span>
                        <span className="text-[10px] text-[#7A6A5A] block">(Norma PN: max 40 mg/kg – niepodgrzewany)</span>
                      </td>
                      {hasThreeProducts && currentC && (
                        <td className="p-2.5 sm:p-3.5 px-2.5 sm:px-4 border-l border-[#D9821E]/15 text-[11px] sm:text-xs">
                          <span className="font-bold text-[#2D6A4F] text-sm">{currentC.labAnalysis.hmf}</span>
                          <span className="text-[10px] text-[#7A6A5A] block">(Norma PN: max 40 mg/kg – niepodgrzewany)</span>
                        </td>
                      )}
                    </tr>

                    {/* Region */}
                    <tr>
                      <td className="p-2.5 sm:p-3.5 px-2 sm:px-4 font-semibold text-[#241D17] sticky left-0 bg-[#FAF8F5] z-10 border-r border-[#D9821E]/20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] text-[11px] sm:text-xs">
                        Pochodzenie & Zbiory
                      </td>
                      <td className="p-2.5 sm:p-3.5 px-2.5 sm:px-4 border-l border-[#D9821E]/15 text-[11px] sm:text-xs">
                        <p className="font-bold text-[#241D17]">{currentA.region}</p>
                        <p className="text-[10px] text-[#7A6A5A]">Zbiór {currentA.harvestYear} • 100% Pasieka Usza</p>
                      </td>
                      <td className="p-2.5 sm:p-3.5 px-2.5 sm:px-4 border-l border-[#D9821E]/15 text-[11px] sm:text-xs">
                        <p className="font-bold text-[#241D17]">{currentB.region}</p>
                        <p className="text-[10px] text-[#7A6A5A]">Zbiór {currentB.harvestYear} • 100% Pasieka Usza</p>
                      </td>
                      {hasThreeProducts && currentC && (
                        <td className="p-2.5 sm:p-3.5 px-2.5 sm:px-4 border-l border-[#D9821E]/15 text-[11px] sm:text-xs">
                          <p className="font-bold text-[#241D17]">{currentC.region}</p>
                          <p className="text-[10px] text-[#7A6A5A]">Zbiór {currentC.harvestYear} • 100% Pasieka Usza</p>
                        </td>
                      )}
                    </tr>
                  </>
                )}

                {/* 4. SECTION: KULINARIA, PAIRING & WERDYKT DORADCY */}
                {(activeTab === 'culinary_verdict' || activeTab === 'all') && (
                  <>
                    <tr className="bg-[#FAF3E5]/90">
                      <td colSpan={colSpanVal} className="p-2 sm:p-2.5 px-3 sm:px-4 font-bold text-[#1B4332] uppercase tracking-wider text-[10px] sm:text-[11px] sticky left-0 z-10 bg-[#FAF3E5] flex items-center gap-1.5 sm:gap-2">
                        <Award className="w-4 h-4 text-[#D9821E]" />
                        <span>4. Zastosowania Kulinarne, Pairing & Werdykt Doradcy</span>
                      </td>
                    </tr>

                    {/* Food Pairing */}
                    <tr>
                      <td className="p-2.5 sm:p-4 px-2 sm:px-4 font-semibold text-[#241D17] sticky left-0 bg-[#FAF8F5] z-10 border-r border-[#D9821E]/20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] align-top text-[11px] sm:text-xs">
                        <div className="flex items-center gap-1.5 mb-1 text-[#1B4332]">
                          <Utensils className="w-3.5 h-3.5 text-[#D9821E]" />
                          <span className="font-bold text-xs">Rekomendowany Food-Pairing</span>
                        </div>
                        <span className="text-[11px] text-[#7A6A5A]">Do czego najlepiej pasuje?</span>
                      </td>
                      <td className="p-2.5 sm:p-4 px-2.5 sm:px-4 border-l border-[#D9821E]/15 bg-white align-top text-[11px] sm:text-xs">
                        <div className="bg-[#FAF6EE]/80 p-3 rounded-xl border border-[#D9821E]/15 text-[#241D17] font-serif italic text-xs leading-relaxed">
                          „{currentA.pairing}”
                        </div>
                        <div className="mt-2 text-[11px] text-[#594D42]">
                          <strong className="text-[#241D17]">Wskazówka mistrza:</strong> Idealnie komponuje się z białymi serami, chrupiącym żytnim pieczywem oraz naparami ziołowymi.
                        </div>
                      </td>
                      <td className="p-2.5 sm:p-4 px-2.5 sm:px-4 border-l border-[#D9821E]/15 bg-white align-top text-[11px] sm:text-xs">
                        <div className="bg-[#FAF6EE]/80 p-3 rounded-xl border border-[#D9821E]/15 text-[#241D17] font-serif italic text-xs leading-relaxed">
                          „{currentB.pairing}”
                        </div>
                        <div className="mt-2 text-[11px] text-[#594D42]">
                          <strong className="text-[#241D17]">Wskazówka mistrza:</strong> Znakomity do dojrzewających serów, deserów orzechowych oraz wieczornej herbaty (do 40°C).
                        </div>
                      </td>
                      {hasThreeProducts && currentC && (
                        <td className="p-2.5 sm:p-4 px-2.5 sm:px-4 border-l border-[#D9821E]/15 bg-white align-top text-[11px] sm:text-xs">
                          <div className="bg-[#FAF6EE]/80 p-3 rounded-xl border border-[#D9821E]/15 text-[#241D17] font-serif italic text-xs leading-relaxed">
                            „{currentC.pairing}”
                          </div>
                          <div className="mt-2 text-[11px] text-[#594D42]">
                            <strong className="text-[#241D17]">Wskazówka mistrza:</strong> Świetny do owoców, sałatek oraz jako naturalny słodzik do koktajli i dressingu.
                          </div>
                        </td>
                      )}
                    </tr>

                    {/* WERDYKT DORADCY */}
                    <tr className="bg-[#FAF6EE]/70">
                      <td className="p-2.5 sm:p-4 px-2 sm:px-4 font-bold text-[#1B4332] sticky left-0 bg-[#FAF6EE] z-10 border-r border-[#D9821E]/20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] align-top text-[11px] sm:text-xs">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Award className="w-4 h-4 text-[#D9821E]" />
                          <span className="uppercase tracking-wider text-xs font-bold">Werdykt Doradcy</span>
                        </div>
                        <p className="text-xs text-[#7A6A5A] font-normal leading-relaxed">
                          Dla kogo i kiedy wybrać daną odmianę miodu? Podsumowanie pszczelarza:
                        </p>
                      </td>

                      {/* Werdykt Miód A */}
                      <td className="p-2.5 sm:p-4 px-2.5 sm:px-4 border-l border-[#D9821E]/20 bg-white align-top space-y-2.5 sm:space-y-3">
                        <div className="bg-[#FAF6EE] p-3.5 rounded-2xl border border-[#D9821E]/25 shadow-2xs">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1B4332]">
                              Kiedy wybrać {currentA.name}:
                            </span>
                            <span className="w-2 h-2 rounded-full bg-[#1B4332]" />
                          </div>
                          <p className="text-xs text-[#3A332A] leading-relaxed font-medium">
                            {currentA.advisorVerdict}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenDetail(rawA)}
                          className="w-full py-3 px-4 rounded-xl bg-[#1B4332] hover:bg-[#143326] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm group"
                          id={`btn-pelny-opis-${currentA.id}`}
                        >
                          <span>Zobacz pełny opis odmiany</span>
                          <ExternalLink className="w-3.5 h-3.5 text-[#E6C065] group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </td>

                      {/* Werdykt Miód B */}
                      <td className="p-2.5 sm:p-4 px-2.5 sm:px-4 border-l border-[#D9821E]/20 bg-white align-top space-y-2.5 sm:space-y-3">
                        <div className="bg-[#FAF6EE] p-3.5 rounded-2xl border border-[#D9821E]/25 shadow-2xs">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#D9821E]">
                              Kiedy wybrać {currentB.name}:
                            </span>
                            <span className="w-2 h-2 rounded-full bg-[#D9821E]" />
                          </div>
                          <p className="text-xs text-[#3A332A] leading-relaxed font-medium">
                            {currentB.advisorVerdict}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenDetail(rawB)}
                          className="w-full py-3 px-4 rounded-xl bg-[#D9821E] hover:bg-[#B36814] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm group"
                          id={`btn-pelny-opis-${currentB.id}`}
                        >
                          <span>Zobacz pełny opis odmiany</span>
                          <ExternalLink className="w-3.5 h-3.5 text-white group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </td>

                      {/* Werdykt Miód C (if present) */}
                      {hasThreeProducts && currentC && rawC && (
                        <td className="p-2.5 sm:p-4 px-2.5 sm:px-4 border-l border-[#D9821E]/20 bg-white align-top space-y-2.5 sm:space-y-3">
                          <div className="bg-[#FAF6EE] p-3.5 rounded-2xl border border-[#2D6A4F]/30 shadow-2xs">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2D6A4F]">
                                Kiedy wybrać {currentC.name}:
                              </span>
                              <span className="w-2 h-2 rounded-full bg-[#2D6A4F]" />
                            </div>
                            <p className="text-xs text-[#3A332A] leading-relaxed font-medium">
                              {currentC.advisorVerdict}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleOpenDetail(rawC)}
                            className="w-full py-3 px-4 rounded-xl bg-[#2D6A4F] hover:bg-[#1E4D38] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm group"
                            id={`btn-pelny-opis-${currentC.id}`}
                          >
                            <span>Zobacz pełny opis odmiany</span>
                            <ExternalLink className="w-3.5 h-3.5 text-[#E6C065] group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </td>
                      )}
                    </tr>
                  </>
                )}

              </tbody>
            </table>
          </div>

          {/* Bottom Quality Note */}
          <div className="p-3 sm:p-4 bg-[#FAF6EE] rounded-xl sm:rounded-2xl border border-[#D9821E]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] sm:text-xs text-[#594D42]">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#1B4332] shrink-0" />
              <span>
                {hasThreeProducts 
                  ? 'Wszystkie 3 porównywane miody pochodzą z certyfikowanej pasieki pod stałym nadzorem Powiatowego Lekarza Weterynarii (WNI 28143502). Surowe, niepodgrzewane, w 100% naturalne.'
                  : 'Oba miody pochodzą z certyfikowanej pasieki pod stałym nadzorem Powiatowego Lekarza Weterynarii (WNI 28143502). Surowe, niepodgrzewane, w 100% naturalne.'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-white border border-[#D9821E]/30 rounded-xl text-xs font-bold text-[#241D17] hover:border-[#D9821E] cursor-pointer shrink-0 shadow-2xs"
            >
              Zamknij
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
