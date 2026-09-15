import React, { useState, useMemo } from 'react';
import { Star, CheckCircle2, MessageSquare, Send, X, ShieldCheck, UserCheck, HelpCircle } from 'lucide-react';

export type ReviewCategory = 'wszystkie' | 'smak' | 'konsystencja' | 'dostawa';

export interface DetailedRatings {
  smak: number;        // 1-5
  konsystencja: number; // 1-5
  dostawa: number;     // 1-5
}

interface Review {
  id: number;
  author: string;
  rating: number; // Średnia lub główna ocena 1-5
  date: string;
  content: string;
  verified: boolean;
  orderNumber?: string;
  category: 'smak' | 'konsystencja' | 'dostawa';
  categoryLabel: string;
  detailedRatings: DetailedRatings;
}

const INITIAL_MOCK_REVIEWS: Review[] = [
  {
    id: 1,
    author: 'Anna K.',
    rating: 5,
    date: '2 tygodnie temu',
    content: 'Fantastyczny miód! Konsystencja jest idealna – drobnoziarnisty aksamitny krupiec, a smak bardzo głęboki. Widać i czuć, że to prawdziwy, niefiltrowany produkt z pasieki. Zamawiam już kolejny słoik.',
    verified: true,
    orderNumber: 'PW-2026/812',
    category: 'konsystencja',
    categoryLabel: 'Konsystencja i krupiec',
    detailedRatings: { smak: 5, konsystencja: 5, dostawa: 5 },
  },
  {
    id: 2,
    author: 'Piotr M.',
    rating: 5,
    date: 'Miesiąc temu',
    content: 'Paczka zabezpieczona pancernie w komorową tubę z tektury falistej. Zero obaw o stłuczkę w Paczkomacie, słoiki dotarły nienaruszone w 24h. Rzetelne podejście do szkła!',
    verified: true,
    orderNumber: 'PW-2026/745',
    category: 'dostawa',
    categoryLabel: 'Bezpieczeństwo szkła',
    detailedRatings: { smak: 5, konsystencja: 5, dostawa: 5 },
  },
  {
    id: 3,
    author: 'Magdalena W.',
    rating: 5,
    date: '2 miesiące temu',
    content: 'Miód wyśmienity, dodaję do ostudzonego naparu (pamiętając o ochronie enzymów poniżej 40°C!). Cudowny, naturalny kwiatowo-ziołowy bukiet, nieporównywalny z marketem.',
    verified: true,
    orderNumber: 'PW-2026/621',
    category: 'smak',
    categoryLabel: 'Smak i bukiet',
    detailedRatings: { smak: 5, konsystencja: 5, dostawa: 4 },
  },
  {
    id: 4,
    author: 'Krzysztof L.',
    rating: 5,
    date: '3 miesiące temu',
    content: 'Prawdziwy smak natury bez sztucznego dosładzania syropem cukrowym. Wyraźny finisz i wspaniały zapach po odkręceniu wieczka. Jakość rzemieślnicza w każdym calu.',
    verified: true,
    orderNumber: 'PW-2026/509',
    category: 'smak',
    categoryLabel: 'Smak i bukiet',
    detailedRatings: { smak: 5, konsystencja: 4, dostawa: 5 },
  },
  {
    id: 5,
    author: 'Ewa S.',
    rating: 5,
    date: '3 miesiące temu',
    content: 'Zamówiłam 3 duże słoiki 900g na prezent dla rodziców. Dostawa kurierska wzorowa, gruba tektura plaster miodu i plomba pasieczna. Piękna wizytówka polskiego pszczelarstwa.',
    verified: true,
    orderNumber: 'PW-2026/488',
    category: 'dostawa',
    categoryLabel: 'Bezpieczeństwo szkła',
    detailedRatings: { smak: 5, konsystencja: 5, dostawa: 5 },
  },
  {
    id: 6,
    author: 'Tomasz B.',
    rating: 5,
    date: '4 miesiące temu',
    content: 'Na ściankach słoika widoczny piękny biały nalot glukozowy („kwiat miodu”). Dla laika to zagadka, dla konesera – niepodważalny dowód na surowy, nieprzegrzewany miód. Brawo za brak pasteryzacji!',
    verified: false,
    category: 'konsystencja',
    categoryLabel: 'Konsystencja i krupiec',
    detailedRatings: { smak: 5, konsystencja: 5, dostawa: 4 },
  },
];

interface ProductReviewsProps {
  productName: string;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({ productName }) => {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_MOCK_REVIEWS);
  const [selectedCategory, setSelectedCategory] = useState<ReviewCategory>('wszystkie');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Form State
  const [newAuthor, setNewAuthor] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<'smak' | 'konsystencja' | 'dostawa'>('smak');
  const [isVerifiedPurchase, setIsVerifiedPurchase] = useState(true);
  const [orderNumberInput, setOrderNumberInput] = useState('');

  // Oceny w trzech kryteriach
  const [smakRating, setSmakRating] = useState(5);
  const [konsystencjaRating, setKonsystencjaRating] = useState(5);
  const [dostawaRating, setDostawaRating] = useState(5);

  // Kalkulacja statystyk ogólnych i kryteriów
  const stats = useMemo(() => {
    const total = reviews.length;
    const average = total > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1) : '0.0';
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    
    let sumSmak = 0;
    let sumKonsystencja = 0;
    let sumDostawa = 0;

    reviews.forEach(r => {
      if (r.rating >= 1 && r.rating <= 5) {
        counts[r.rating as keyof typeof counts]++;
      }
      sumSmak += r.detailedRatings?.smak || r.rating;
      sumKonsystencja += r.detailedRatings?.konsystencja || r.rating;
      sumDostawa += r.detailedRatings?.dostawa || r.rating;
    });

    const avgSmak = total > 0 ? (sumSmak / total).toFixed(1) : '5.0';
    const avgKonsystencja = total > 0 ? (sumKonsystencja / total).toFixed(1) : '5.0';
    const avgDostawa = total > 0 ? (sumDostawa / total).toFixed(1) : '5.0';
    const verifiedTotal = reviews.filter(r => r.verified).length;

    return { total, average, counts, avgSmak, avgKonsystencja, avgDostawa, verifiedTotal };
  }, [reviews]);

  // Segmentowany dowód społeczny - zliczanie opinii w kategoriach
  const categoryCounts = useMemo(() => {
    return {
      wszystkie: reviews.length,
      smak: reviews.filter(r => r.category === 'smak').length,
      konsystencja: reviews.filter(r => r.category === 'konsystencja').length,
      dostawa: reviews.filter(r => r.category === 'dostawa').length,
    };
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    return reviews.filter(r => {
      if (onlyVerified && !r.verified) return false;
      if (selectedCategory !== 'wszystkie' && r.category !== selectedCategory) return false;
      return true;
    });
  }, [reviews, selectedCategory, onlyVerified]);

  const visibleReviews = filteredReviews.slice(0, visibleCount);
  const hasMore = visibleCount < filteredReviews.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 3);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newContent.trim()) return;

    const overallRating = Math.round((smakRating + konsystencjaRating + dostawaRating) / 3);

    const categoryLabels: Record<'smak' | 'konsystencja' | 'dostawa', string> = {
      smak: 'Smak i bukiet',
      konsystencja: 'Konsystencja i krupiec',
      dostawa: 'Bezpieczeństwo szkła',
    };

    const newReview: Review = {
      id: Date.now(),
      author: newAuthor.trim(),
      rating: overallRating,
      date: 'Przed chwilą',
      content: newContent.trim(),
      verified: isVerifiedPurchase,
      orderNumber: isVerifiedPurchase && orderNumberInput.trim() ? orderNumberInput.trim() : undefined,
      category: newCategory,
      categoryLabel: categoryLabels[newCategory],
      detailedRatings: {
        smak: smakRating,
        konsystencja: konsystencjaRating,
        dostawa: dostawaRating,
      },
    };

    setReviews(prev => [newReview, ...prev]);
    setIsFormOpen(false);
    setNewAuthor('');
    setNewContent('');
    setOrderNumberInput('');
    setSmakRating(5);
    setKonsystencjaRating(5);
    setDostawaRating(5);
  };

  const renderStarPicker = (current: number, onChange: (val: number) => void) => {
    return (
      <div className="flex items-center gap-1 cursor-pointer">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="p-0.5 hover:scale-110 transition-transform"
            title={`${star} z 5`}
          >
            <Star
              className={`w-5 h-5 ${
                star <= current ? 'fill-[#E5983A] text-[#E5983A]' : 'fill-[#EFE7DA] text-[#EFE7DA]'
              }`}
            />
          </button>
        ))}
        <span className="text-xs font-bold text-[#8C5815] ml-1.5">{current}/5</span>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Nagłówek i Przycisk dodawania */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h4 className="font-bold text-[#23201C] text-xl font-serif">Opinie klientów ({stats.total})</h4>
          <p className="text-xs text-[#7A6A5A] mt-0.5">
            Oceny wielowymiarowe: smak, konsystencja oraz bezpieczeństwo szklanych słoików w transporcie.
          </p>
        </div>
        {!isFormOpen && (
          <button 
            onClick={() => setIsFormOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-[#23201C] text-[#FAF5ED] font-bold text-sm hover:bg-[#433B31] transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <MessageSquare className="w-4 h-4" />
            Napisz opinię
          </button>
        )}
      </div>

      {/* Formularz nowej opinii z wielowymiarową oceną i statusem zakupu */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-white border border-[#D9821E]/30 shadow-md space-y-5 animate-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center border-b border-[#F4ECE1] pb-3">
            <div>
              <h5 className="font-bold text-[#23201C] font-serif text-lg">Twoja recenzja miodu: {productName}</h5>
              <p className="text-xs text-[#786C5B]">Oceń poszczególne cechy, aby pomóc innym smakoszom i koneserom.</p>
            </div>
            <button type="button" onClick={() => setIsFormOpen(false)} className="p-1.5 hover:bg-[#F4ECE1] rounded-full text-[#786C5B] cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-5">
            {/* Oceny cząstkowe w 3 kluczowych wymiarach */}
            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E7DDCE] space-y-3">
              <span className="block text-xs font-bold text-[#594D42] uppercase tracking-wider">
                Oceń cechy miodu (1-5 gwiazdek):
              </span>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                {/* Smak i bukiet */}
                <div className="bg-white p-3 rounded-xl border border-[#E7DDCE] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#2D2821] flex items-center gap-1">
                      <span>🍯</span> Smak & Bukiet
                    </span>
                  </div>
                  {renderStarPicker(smakRating, setSmakRating)}
                </div>

                {/* Konsystencja */}
                <div className="bg-white p-3 rounded-xl border border-[#E7DDCE] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#2D2821] flex items-center gap-1">
                      <span>💎</span> Konsystencja & Krupiec
                    </span>
                  </div>
                  {renderStarPicker(konsystencjaRating, setKonsystencjaRating)}
                </div>

                {/* Dostawa szkła */}
                <div className="bg-white p-3 rounded-xl border border-[#E7DDCE] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#2D2821] flex items-center gap-1">
                      <span>📦</span> Bezpieczeństwo szkła
                    </span>
                  </div>
                  {renderStarPicker(dostawaRating, setDostawaRating)}
                </div>
              </div>
            </div>

            {/* Wybór kategorii głównej opinii */}
            <div>
              <label className="block text-xs font-bold text-[#594D42] uppercase tracking-wider mb-2">
                Główny temat Twojej opinii:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'smak', label: '🍯 Smak i bukiet' },
                  { id: 'konsystencja', label: '💎 Konsystencja i krupiec' },
                  { id: 'dostawa', label: '📦 Dostawa i ochrona szkła' },
                ].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setNewCategory(cat.id as any)}
                    className={`p-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center ${
                      newCategory === cat.id
                        ? 'bg-[#1B4332] text-white border-[#1B4332] shadow-xs'
                        : 'bg-[#FAF8F5] text-[#594D42] border-[#E7DDCE] hover:bg-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Imię i status weryfikacji zakupu */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#786C5B] uppercase tracking-wider mb-1.5">Twoje imię lub podpis</label>
                <input 
                  type="text" 
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="Np. Joanna K."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E7DDCE] focus:outline-none focus:border-[#8E5116] text-[#23201C] text-sm"
                  required
                />
              </div>

              {/* Status zakupu */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#786C5B] uppercase tracking-wider">Weryfikacja zakupu</label>
                <div className="flex items-center gap-2 pt-1.5">
                  <label className="flex items-center gap-2 text-xs font-medium text-[#2D2821] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isVerifiedPurchase}
                      onChange={(e) => setIsVerifiedPurchase(e.target.checked)}
                      className="w-4 h-4 rounded text-[#1B4332] border-[#C4B3A0] focus:ring-[#1B4332]"
                    />
                    <span>Potwierdzam zakup w Pasiece Warmia</span>
                  </label>
                </div>
                {isVerifiedPurchase && (
                  <input
                    type="text"
                    value={orderNumberInput}
                    onChange={(e) => setOrderNumberInput(e.target.value)}
                    placeholder="Opcjonalny nr zamówienia (np. PW-2026/...)"
                    className="w-full px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#E7DDCE] text-xs text-[#594D42] mt-1"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#786C5B] uppercase tracking-wider mb-1.5">Treść opinii</label>
              <textarea 
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Napisz o aromacie, strukturze krupca lub sposobie zabezpieczenia paczki..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#E7DDCE] focus:outline-none focus:border-[#8E5116] text-[#23201C] text-sm resize-none"
                required
              />
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-[#7A6A5A]">
                Średnia ocena z Twoich kryteriów: <strong>{Math.round((smakRating + konsystencjaRating + dostawaRating) / 3)}/5 ⭐</strong>
              </span>
              <button 
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#143326] text-white font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                Opublikuj opinię
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Podsumowanie Ocen i Średnie Cząstkowe */}
      <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#E7DDCE] space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Główny bloczek oceny */}
          <div className="flex items-center gap-4 text-left">
            <span className="text-5xl font-serif font-black text-[#23201C]">{stats.average}</span>
            <div>
              <div className="flex items-center gap-1 text-amber-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`w-4 h-4 ${star <= Math.round(Number(stats.average)) ? 'fill-[#F3C06B] text-[#F3C06B]' : 'fill-[#E7DDCE] text-[#E7DDCE]'}`} 
                  />
                ))}
              </div>
              <span className="text-xs text-[#786C5B] font-medium block mt-1">
                Na podstawie {stats.total} recenzji ({stats.verifiedTotal} potwierdzonych zakupem)
              </span>
            </div>
          </div>

          {/* Cząstkowe średnie dla cech miodu (Nowość) */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full md:w-auto">
            <div className="p-3 bg-white rounded-2xl border border-[#E7DDCE] text-center min-w-[100px] shadow-2xs">
              <span className="text-base block">🍯</span>
              <span className="text-[10px] text-[#786C5B] uppercase font-bold block mt-0.5">Smak</span>
              <span className="text-sm font-bold text-[#1B4332]">{stats.avgSmak} / 5</span>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-[#E7DDCE] text-center min-w-[100px] shadow-2xs">
              <span className="text-base block">💎</span>
              <span className="text-[10px] text-[#786C5B] uppercase font-bold block mt-0.5">Krupiec</span>
              <span className="text-sm font-bold text-[#1B4332]">{stats.avgKonsystencja} / 5</span>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-[#E7DDCE] text-center min-w-[100px] shadow-2xs">
              <span className="text-base block">📦</span>
              <span className="text-[10px] text-[#786C5B] uppercase font-bold block mt-0.5">Szkło</span>
              <span className="text-sm font-bold text-[#1B4332]">{stats.avgDostawa} / 5</span>
            </div>
          </div>
        </div>
      </div>

      {/* Segmentowany dowód społeczny: Pigułki filtracji cech fizycznych oraz filtr weryfikacji */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8DED1] space-y-3 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-bold text-[#594D42] uppercase tracking-wider flex items-center gap-1.5">
            <span>Filtruj opinie wg cech produktu:</span>
          </span>
          
          {/* Przełącznik: Tylko zweryfikowane zakupy */}
          <label className="flex items-center gap-2 text-xs font-semibold text-[#1B4332] cursor-pointer bg-[#FAF8F5] px-3 py-1 rounded-xl border border-[#E7DDCE] hover:bg-[#F3EFE9] transition-colors">
            <input
              type="checkbox"
              checked={onlyVerified}
              onChange={(e) => setOnlyVerified(e.target.checked)}
              className="w-3.5 h-3.5 rounded text-[#1B4332] focus:ring-[#1B4332]"
            />
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[#1B4332]" />
              Tylko zweryfikowane zakupy ({stats.verifiedTotal})
            </span>
          </label>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-none flex-wrap">
          {[
            { id: 'wszystkie', label: 'Wszystkie opinie', count: categoryCounts.wszystkie },
            { id: 'smak', label: '🍯 Smak & Bukiet', count: categoryCounts.smak },
            { id: 'konsystencja', label: '💎 Konsystencja & Krupiec', count: categoryCounts.konsystencja },
            { id: 'dostawa', label: '📦 Bezpieczeństwo szkła', count: categoryCounts.dostawa },
          ].map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id as ReviewCategory);
                  setVisibleCount(4);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-[#1B4332] text-white border-[#1B4332] shadow-xs'
                    : 'bg-[#FAF8F5] text-[#524637] border-[#DFD3C2] hover:bg-white hover:border-[#D9821E]'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-[#EAE0D2] text-[#6A5A4A]'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lista Opinii */}
      <div className="space-y-3.5">
        {visibleReviews.length === 0 ? (
          <div className="p-8 text-center bg-[#FAF8F5] rounded-2xl border border-[#E7DDCE] text-xs text-[#7A6A5A]">
            Brak opinii spełniających wybrane kryteria filtrowania.
          </div>
        ) : (
          visibleReviews.map((review) => (
            <div key={review.id} className="p-5 rounded-2xl bg-white border border-[#E7DDCE]/70 space-y-3 shadow-xs hover:shadow-sm transition-all">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-bold text-[#23201C] text-sm font-serif">{review.author}</span>
                    
                    {/* Status weryfikacji */}
                    {review.verified ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-[#1B4332] bg-[#1B4332]/10 px-2 py-0.5 rounded-md border border-[#1B4332]/20">
                        <CheckCircle2 className="w-3 h-3 text-[#1B4332]" />
                        Zweryfikowany zakup {review.orderNumber && `(${review.orderNumber})`}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-medium text-[#786C5B] bg-[#F4ECE1] px-2 py-0.5 rounded-md">
                        <UserCheck className="w-3 h-3 text-[#8C7A6B]" />
                        Opinia degustacyjna
                      </span>
                    )}

                    {/* Etykieta kategorii */}
                    <span className="text-[10px] font-semibold text-[#8C4609] bg-[#FAF3E5] px-2 py-0.5 rounded-md border border-[#D9821E]/20">
                      {review.categoryLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-[#F3C06B] text-[#F3C06B]' : 'fill-[#EFE7DA] text-[#EFE7DA]'}`} 
                      />
                    ))}
                    <span className="text-xs font-bold text-[#594D42] ml-1.5">{review.rating}.0</span>
                  </div>
                </div>
                <span className="text-xs text-[#A69784] font-medium shrink-0">{review.date}</span>
              </div>

              {/* Oceny cząstkowe dla recenzji */}
              {review.detailedRatings && (
                <div className="flex items-center gap-3 text-[11px] text-[#7A6A5A] bg-[#FAF8F5] px-3 py-1.5 rounded-xl border border-[#EFE7DA] flex-wrap">
                  <span className="flex items-center gap-1">
                    <span>🍯 Smak:</span>
                    <strong className="text-[#2D2821]">{review.detailedRatings.smak}/5</strong>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <span>💎 Krupiec:</span>
                    <strong className="text-[#2D2821]">{review.detailedRatings.konsystencja}/5</strong>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <span>📦 Dostawa:</span>
                    <strong className="text-[#2D2821]">{review.detailedRatings.dostawa}/5</strong>
                  </span>
                </div>
              )}

              <p className="text-xs sm:text-sm text-[#5C4F40] leading-relaxed">
                {review.content}
              </p>
            </div>
          ))
        )}
      </div>
      
      {/* Przycisk Załaduj Więcej */}
      {hasMore && (
        <div className="text-center pt-2">
          <button 
            onClick={handleLoadMore}
            className="px-6 py-2.5 rounded-xl border border-[#C2B7A7] text-[#4A4033] font-bold text-sm hover:bg-[#F4EFE6] transition-colors cursor-pointer"
          >
            Załaduj więcej opinii ({filteredReviews.length - visibleCount})
          </button>
        </div>
      )}
    </div>
  );
};
