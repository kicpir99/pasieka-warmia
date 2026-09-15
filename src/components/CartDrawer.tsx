import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CartItem, HoneyProduct } from '../types';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck, Check, Sparkles, Plus, Snowflake, Scale, Package } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, weightGrams: number, delta: number) => void;
  onRemoveItem: (productId: string, weightGrams: number) => void;
  onClearCart: () => void;
  onAddToCart?: (product: HoneyProduct, weightGrams: number, pricePln: number) => void;
  onNavigateToCatalog?: () => void;
}

const CART_UPSELL_ITEMS: {
  product: HoneyProduct;
  weightGrams: number;
  pricePln: number;
  subtitle: string;
  icon: string;
}[] = [
  {
    product: {
      id: 'akcesorium-nabierak-drewniany',
      name: 'Rzemieślniczy Nabierak Bukowy (10 cm)',
      botanicalName: 'Fagus sylvatica',
      subtitle: 'Drewniany nabierak do porcjowania patoki bez kapania.',
      category: 'zestawy',
      description: 'Tradycyjny nabierak miodu toczony z litego drewna bukowego. Ułatwia nabieranie płynnego miodu i rozprowadzanie go na pieczywie lub w herbacie.',
      harvestYear: 2026,
      harvestMonth: 'Całoroczny',
      batchNumber: 'ACC-01',
      apiaryLocation: 'Warmia (Manufaktura Drewna)',
      dominantPollenPercentage: 0,
      dominantPlant: 'Drewno bukowe',
      waterContentPercentage: 0,
      consistency: 'patoka',
      flavorIntensity: 'lagodny',
      flavorNotes: ['Bukowe drewno'],
      recommendedUse: ['Porcjowanie miodu'],
      sensoryProfile: { sweetness: 0, acidity: 0, intensity: 0, crystallization: 0 },
      colorHex: '#D4A373',
      colorName: 'Naturalne drewno',
      sizes: [{ weightGrams: 20, label: '10 cm', pricePln: 8, inStock: true }],
      imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400&q=80',
      rating: 5.0,
      reviewsCount: 84,
    },
    weightGrams: 20,
    pricePln: 8,
    subtitle: 'Wygodne porcjowanie patoki',
    icon: '🪵',
  },
  {
    product: {
      id: 'akcesorium-swieca-woskowa',
      name: 'Świeca z Wosku Pszczelego (Stożkowa)',
      botanicalName: 'Cera flava 100%',
      subtitle: 'Pachnąca miodem i propolisem, naturalnie jonizuje powietrze.',
      category: 'zestawy',
      description: 'Ręcznie odlewana świeca z czystego wosku pszczelego bez parafiny. Pali się czystym płomieniem, oczyszczając powietrze z kurzu i alergenów.',
      harvestYear: 2026,
      harvestMonth: 'Całoroczny',
      batchNumber: 'WOSK-24',
      apiaryLocation: 'Pracownia Pasieki Warmia',
      dominantPollenPercentage: 0,
      dominantPlant: 'Wosk pszczeli 100%',
      waterContentPercentage: 0,
      consistency: 'krupiec',
      flavorIntensity: 'wyrazisty',
      flavorNotes: ['Czysty wosk', 'Propolis'],
      recommendedUse: ['Aromaterapia i relaks'],
      sensoryProfile: { sweetness: 0, acidity: 0, intensity: 5, crystallization: 5 },
      colorHex: '#E5983A',
      colorName: 'Miodowożółty',
      sizes: [{ weightGrams: 80, label: '1 szt.', pricePln: 19, inStock: true }],
      imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=400&q=80',
      rating: 4.9,
      reviewsCount: 62,
    },
    weightGrams: 80,
    pricePln: 19,
    subtitle: '100% naturalny wosk pszczeli',
    icon: '🕯️',
  },
  {
    product: {
      id: 'akcesorium-propolis-krople',
      name: 'Krople Propolisowe 20% (Ekstrakt 20 ml)',
      botanicalName: 'Propolis cera',
      subtitle: 'Silny ulowy antybiotyk na gardło i układ immunologiczny.',
      category: 'z-dodatkami',
      description: 'Stężony ekstrakt z kitu pszczelego z certyfikowanych pasiek warmińskich. Niezastąpiony w sezonie jesienno-zimowym przy stanach zapalnych gardła i dziąseł.',
      harvestYear: 2026,
      harvestMonth: 'Sierpień',
      batchNumber: 'PROP-24',
      apiaryLocation: 'Warmia (Czyste Lasy)',
      dominantPollenPercentage: 0,
      dominantPlant: 'Kit pszczeli (propolis)',
      waterContentPercentage: 0,
      consistency: 'patoka',
      flavorIntensity: 'wyrazisty',
      flavorNotes: ['Żywica', 'Balsamiczny propolis'],
      recommendedUse: ['Infekcje gardła', 'Odporność'],
      sensoryProfile: { sweetness: 1, acidity: 2, intensity: 5, crystallization: 1 },
      colorHex: '#5C2C16',
      colorName: 'Ciemnobrązowy',
      sizes: [{ weightGrams: 50, label: '20 ml', pricePln: 29, inStock: true }],
      imageUrl: 'https://images.unsplash.com/photo-1613959325988-12c8230bcf76?auto=format&fit=crop&w=400&q=80',
      rating: 5.0,
      reviewsCount: 119,
    },
    weightGrams: 50,
    pricePln: 29,
    subtitle: 'Naturalny antybiotyk ulowy',
    icon: '💧',
  }
];

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onAddToCart,
  onNavigateToCatalog,
}) => {
  const navigate = useNavigate();
  const [deliveryMethod, setDeliveryMethod] = useState<'paczkomat' | 'kurier' | 'odbior'>('paczkomat');
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  const location = useLocation();

  const handleGoToCatalog = () => {
    onClose();
    if (onNavigateToCatalog) {
      onNavigateToCatalog();
      return;
    }

    if (location.pathname === '/' || location.pathname === '') {
      const catalogEl = document.getElementById('katalog');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/#katalog');
    }
  };

  if (!isOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 180;
  const subtotal = items.reduce((sum, item) => sum + item.pricePln * item.quantity, 0);

  const deliveryCost =
    deliveryMethod === 'odbior'
      ? 0
      : subtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : deliveryMethod === 'paczkomat'
      ? 14
      : 17;

  const total = subtotal + deliveryCost;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  // Kalkulacja wagi brutto (miód netto + bezpieczne szkło słoika + amortyzacja komorowa)
  const totalGrossWeightGrams = items.reduce((sum, item) => {
    const netGrams = item.weightGrams || 450;
    // Waga szkła: ~420g dla słoików 900g-1200g, ~270g dla 400g-500g, ~140g dla mniejszych słoików/akcesoriów
    const glassWeightGrams = netGrams >= 900 ? 420 : netGrams >= 400 ? 270 : 140;
    return sum + (netGrams + glassWeightGrams) * item.quantity;
  }, 0);
  const totalWeightKg = (totalGrossWeightGrams / 1000).toFixed(1);
  const totalJarsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Szacowany gabaryt InPost Paczkomat:
  // Gabaryt A: do ok. 3.2 kg (1-2 duże lub 3-4 małe słoiki w tubach)
  // Gabaryt B: 3.2 - 8.5 kg (do 6-8 słoików w pancernych kartonach)
  // Gabaryt C: powyżej 8.5 kg
  const parcelLockerSize =
    totalGrossWeightGrams <= 3200 ? 'Gabaryt A' : totalGrossWeightGrams <= 8500 ? 'Gabaryt B' : 'Gabaryt C';

  const handleCheckout = () => {
    setOrderSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div 
          data-lenis-prevent 
          onWheel={(e) => e.stopPropagation()} 
          className="w-screen max-w-md bg-[#FAF8F5] border-l border-[#E3D6C4] shadow-2xl flex flex-col justify-between"
        >
          
          {/* Top Bar */}
          <div className="p-5 border-b border-[#E7DDCE] bg-[#FAF8F5] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#945209]" />
              <h3 className="font-serif text-lg font-bold text-[#23201C]">
                Twój Koszyk Pasieczny
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#EFE3CF] text-[#7E4207]">
                {items.reduce((sum, i) => sum + i.quantity, 0)} szt.
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#6E6150] hover:bg-[#EFE5D6] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free shipping progress bar */}
          <div className="px-5 py-3 bg-[#F2E8D8] border-b border-[#E3D4BE] text-xs">
            {remainingForFreeShipping > 0 ? (
              <div className="space-y-1.5">
                <div className="flex justify-between text-[#685947]">
                  <span>Darmowa dostawa od 180 zł:</span>
                  <span className="font-bold text-[#8C4609]">Brakuje jeszcze {remainingForFreeShipping} zł</span>
                </div>
                <div className="w-full bg-[#E0D2BD] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#945209] h-full rounded-full transition-all duration-300"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-[#385C31] font-semibold">
                <Truck className="w-4 h-4" />
                <span>Kwalifikujesz się na bezpłatną dostawę!</span>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {orderSubmitted ? (
              <div className="text-center py-12 space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#E2EFDC] text-[#2F6825] flex items-center justify-center">
                  <Check className="w-7 h-7" />
                </div>
                <h4 className="font-serif text-2xl font-bold text-[#23201C]">
                  Dziękujemy za zamówienie!
                </h4>
                <p className="text-xs text-[#635747] leading-relaxed max-w-xs mx-auto">
                  To zamówienie testowe prototypu. W pełnej wersji nastąpiłoby bezpieczne przekierowanie do płatności BLIK / Przelewy24 oraz wygenerowanie etykiety nadawczej.
                </p>
                <button
                  onClick={() => {
                    setOrderSubmitted(false);
                    onClearCart();
                    onClose();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#2D2821] text-[#FAF6F0] text-xs font-semibold hover:bg-[#433B31]"
                >
                  Wróć do sklepu
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#EFE4D2] text-[#945209] flex items-center justify-center mx-auto text-xl">
                  🍯
                </div>
                <p className="text-sm font-semibold text-[#2D2821]">Twój koszyk jest jeszcze pusty</p>
                <p className="text-xs text-[#7B6E5C] max-w-xs mx-auto">
                  Wybierz ulubiony zbiór z naszych pasiek i ciesz się smakiem prawdziwego surowego miodu.
                </p>
                <button
                  type="button"
                  onClick={handleGoToCatalog}
                  id="btn-pusty-koszyk-katalog"
                  className="mt-2 px-6 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#143326] text-white text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-2 shadow-xs hover:shadow-sm active:scale-95"
                >
                  <span>Przejdź do katalogu miodów</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#E6C065]" />
                </button>
              </div>
            ) : (
              items.map((item) => {
                const itemWeight = item.weightGrams || item.selectedWeightGrams || item.product.sizes[0]?.weightGrams || 450;

                return (
                  <div
                    key={`${item.product.id}-${itemWeight}`}
                    className="flex gap-3 p-3 rounded-xl bg-[#FAF8F5] border border-[#E7DDCE]"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-lg object-cover bg-[#E7DAC8] shrink-0"
                    />

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-serif text-xs font-bold text-[#23201C] truncate">
                          {item.product.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.product.id, itemWeight)}
                          className="text-[#9E907E] hover:text-[#B91C1C] p-1 rounded-md transition-colors cursor-pointer"
                          title={`Usuń ${item.product.name} (${itemWeight}g) z koszyka`}
                          aria-label={`Usuń ${item.product.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-[#716556]">
                        <span className="bg-[#EFE3CF] px-2 py-0.5 rounded font-bold text-[#7C4007]">
                          {itemWeight} g
                        </span>
                        <span>{item.pricePln} zł / szt.</span>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        {/* Quantity stepper */}
                        <div className="flex items-center border border-[#D9CDBD] rounded-lg bg-white overflow-hidden text-xs shadow-2xs">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.product.id, itemWeight, -1)}
                            className="w-7 h-6 flex items-center justify-center text-[#5D5243] hover:bg-[#ECE0CE] hover:text-[#1B4332] font-bold cursor-pointer transition-colors"
                            title="Zmniejsz ilość"
                            aria-label="Zmniejsz ilość"
                          >
                            -
                          </button>
                          <span className="w-7 text-center font-bold text-[#2D2821] text-xs select-none">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.product.id, itemWeight, 1)}
                            className="w-7 h-6 flex items-center justify-center text-[#5D5243] hover:bg-[#ECE0CE] hover:text-[#1B4332] font-bold cursor-pointer transition-colors"
                            title="Zwiększ ilość"
                            aria-label="Zwiększ ilość"
                          >
                            +
                          </button>
                        </div>

                        <span className="font-bold text-xs text-[#1B4332]">
                          {item.pricePln * item.quantity} zł
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {/* Apiterapeutyczny In-Cart Cross-Selling (Dodatki Ulowe) */}
            {!orderSubmitted && items.length > 0 && onAddToCart && (
              <div className="pt-4 border-t border-[#E7DDCE] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#3B3226] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#D9821E]" />
                    Polecane dodatki z pasieki:
                  </span>
                  <span className="text-[10px] text-[#8C7A6B]">Dobierz do koszyka</span>
                </div>

                <div className="space-y-2">
                  {CART_UPSELL_ITEMS.map((upsell) => {
                    const isAlreadyInCart = items.some(
                      (item) => item.product.id === upsell.product.id
                    );

                    return (
                      <div
                        key={upsell.product.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E7DDCE] shadow-2xs hover:border-[#D9821E]/50 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <span className="text-xl shrink-0">{upsell.icon}</span>
                          <div className="min-w-0">
                            <h5 className="font-serif text-xs font-bold text-[#23201C] truncate">
                              {upsell.product.name}
                            </h5>
                            <p className="text-[10px] text-[#7A6A5A] truncate">
                              {upsell.subtitle}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-bold text-xs text-[#1B4332] whitespace-nowrap">
                            +{upsell.pricePln} zł
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              onAddToCart(upsell.product, upsell.weightGrams, upsell.pricePln)
                            }
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                              isAlreadyInCart
                                ? 'bg-[#EDF5EC] text-[#225737] border border-[#BAD8C2]'
                                : 'bg-[#1B4332] text-white hover:bg-[#143326] shadow-xs active:scale-95'
                            }`}
                            title={`Dodaj ${upsell.product.name}`}
                          >
                            {isAlreadyInCart ? (
                              <>
                                <Check className="w-3 h-3 text-[#225737]" />
                                <span>W koszyku</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3 h-3" />
                                <span>Dodaj</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Opcje dostawy, waga, gwarancje i zestawienie kosztów wewnątrz przewijanego kontenera (aby nie zabierały 80% ekranu na telefonie) */}
            {!orderSubmitted && items.length > 0 && (
              <div className="pt-2 border-t border-[#E7DDCE] space-y-4">
                {/* Delivery selector */}
                <div className="space-y-1.5 text-xs">
                  <span className="text-[11px] font-semibold text-[#736655] uppercase tracking-wider block">
                    Metoda wysyłki słoików:
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => setDeliveryMethod('paczkomat')}
                      className={`p-2 rounded-lg text-left border transition-all text-[11px] ${
                        deliveryMethod === 'paczkomat'
                          ? 'border-[#945209] bg-[#F2E5D3] font-semibold text-[#2D2821]'
                          : 'border-[#DFCBB5] bg-[#FAF8F5] text-[#695D4E]'
                      }`}
                    >
                      <span className="block font-bold">Paczkomat</span>
                      <span className="text-[10px] text-[#847461]">
                        {subtotal >= FREE_SHIPPING_THRESHOLD ? 'Gratis' : '14 zł'}
                      </span>
                    </button>

                    <button
                      onClick={() => setDeliveryMethod('kurier')}
                      className={`p-2 rounded-lg text-left border transition-all text-[11px] ${
                        deliveryMethod === 'kurier'
                          ? 'border-[#945209] bg-[#F2E5D3] font-semibold text-[#2D2821]'
                          : 'border-[#DFCBB5] bg-[#FAF8F5] text-[#695D4E]'
                      }`}
                    >
                      <span className="block font-bold">Kurier DPD</span>
                      <span className="text-[10px] text-[#847461]">
                        {subtotal >= FREE_SHIPPING_THRESHOLD ? 'Gratis' : '17 zł'}
                      </span>
                    </button>

                    <button
                      onClick={() => setDeliveryMethod('odbior')}
                      className={`p-2 rounded-lg text-left border transition-all text-[11px] ${
                        deliveryMethod === 'odbior'
                          ? 'border-[#945209] bg-[#F2E5D3] font-semibold text-[#2D2821]'
                          : 'border-[#DFCBB5] bg-[#FAF8F5] text-[#695D4E]'
                      }`}
                    >
                      <span className="block font-bold">W pasiece</span>
                      <span className="text-[10px] text-[#847461]">0 zł</span>
                    </button>
                  </div>
                </div>

                {/* Wskaźnik wagi przesyłki & format paczki */}
                <div className="p-2.5 rounded-xl bg-[#F5EFE6] border border-[#DFCBB5] text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5 text-[#945209]" />
                      <span className="font-semibold text-[#2D2821]">Waga brutto paczki:</span>
                      <span className="font-bold text-[#945209]">~{totalWeightKg} kg</span>
                    </div>
                    {deliveryMethod === 'paczkomat' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FAF5ED] border border-[#D8C4AD] text-[10px] font-bold text-[#8C4609]">
                        <Package className="w-3 h-3 text-[#B45309]" />
                        Paczkomat: {parcelLockerSize}
                      </span>
                    )}
                    {deliveryMethod === 'kurier' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FAF5ED] border border-[#D8C4AD] text-[10px] font-bold text-[#2A6546]">
                        <Truck className="w-3 h-3 text-[#2A6546]" />
                        Kurier: Ubezpieczona
                      </span>
                    )}
                    {deliveryMethod === 'odbior' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FAF5ED] border border-[#D8C4AD] text-[10px] font-bold text-[#695D4E]">
                        Odbiór na pasiece
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-[#7A6C5B] leading-tight">
                    Zawiera {totalJarsCount} {totalJarsCount === 1 ? 'produkt' : totalJarsCount < 5 ? 'produkty' : 'produktów'} (miód netto + grube szkło apteczne + tuby ochronne).
                  </p>
                </div>

                {/* Zero Stłuczek & Reżim Letni - Podwójne Bezpieczeństwo Dostawy */}
                <div className="space-y-2">
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#EFE7D8] border border-[#DFCDB7] text-[11px] text-[#554736] leading-relaxed shadow-2xs">
                    <ShieldCheck className="w-5 h-5 text-[#1B4332] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[#1B4332] font-bold text-xs mb-0.5">
                        Gwarancja Zero Stłuczek (100% Bezpieczeństwa):
                      </strong>
                      Słoiki wysyłamy w amortyzujących ekotubach z tektury plaster miodu. W razie jakiegokolwiek uszkodzenia w transporcie wysyłamy nowy słoik w 24h na nasz koszt – bez czekania na protokoły kuriera.
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#F4EFE6] border border-[#DFCDB7] text-[11px] text-[#554736] leading-relaxed shadow-2xs">
                    <Snowflake className="w-4 h-4 text-[#2B6E4E] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[#1B4332] font-bold text-xs mb-0.5">
                        Reżim Letni & Termoizolacja ula:
                      </strong>
                      W ciepłe dni paczki zabezpieczamy termicznie, aby chronić żywe enzymy ula (diastazę) przed przegrzaniem powyżej 36°C w podróży.
                    </div>
                  </div>
                </div>

                {/* Subtotal & Details */}
                <div className="space-y-1 pt-2 border-t border-[#EAE0D1] text-xs">
                  <div className="flex justify-between text-[#6D604E]">
                    <span>Wartość miodów:</span>
                    <span className="font-semibold">{subtotal} zł</span>
                  </div>
                  <div className="flex justify-between text-[#6D604E]">
                    <span>Waga całkowita (brutto):</span>
                    <span className="font-semibold">~{totalWeightKg} kg</span>
                  </div>
                  <div className="flex justify-between text-[#6D604E]">
                    <span>Dostawa:</span>
                    <span className="font-semibold">
                      {deliveryCost === 0 ? 'Bezpłatnie' : `${deliveryCost} zł`}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Drawer Compact Sticky Footer (Summary & Checkout) */}
          {!orderSubmitted && items.length > 0 && (
            <div className="p-3.5 sm:p-4 border-t border-[#E7DDCE] bg-[#FAF8F5] flex items-center justify-between gap-3 shrink-0 shadow-lg">
              <div>
                <span className="text-[10px] text-[#736655] uppercase tracking-wider block font-medium">Do zapłaty:</span>
                <div className="flex items-baseline gap-1">
                  <span className="font-serif text-xl sm:text-2xl font-bold text-[#8C4609] leading-none">{total} zł</span>
                  <span className="text-[10px] text-[#847461]">
                    {deliveryCost === 0 ? '(dostawa gratis)' : `(+${deliveryCost} zł dostawa)`}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="flex-1 py-3 px-4 rounded-xl bg-[#2D2821] hover:bg-[#433B31] text-[#FAF5ED] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                id="cart-checkout-btn"
              >
                <span>Przejdź do kasy</span>
                <ArrowRight className="w-4 h-4 text-[#E5983A]" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
