import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Sparkles, Menu, X, ShieldCheck, MapPin, ChevronDown, ArrowRight } from 'lucide-react';

interface HeaderProps {
  cartItemCount: number;
  cartSubtotal: number;
  onOpenCart: () => void;
  onOpenQuiz: () => void;
  containerClass?: string;
}

export const Header: React.FC<HeaderProps> = ({
  cartItemCount,
  cartSubtotal,
  onOpenCart,
  onOpenQuiz,
  containerClass,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoClick = (e: React.MouseEvent) => {
    if (location.pathname === '/' || location.pathname === '') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateToCatalog = (category?: string, intent?: string) => {
    setMegaMenuOpen(false);
    setMobileMenuOpen(false);

    const searchParams = new URLSearchParams();
    if (category && category !== 'wszystkie') {
      searchParams.set('kategoria', category);
    }
    if (intent && intent !== 'wszystkie') {
      searchParams.set('intencja', intent);
    }

    const searchStr = searchParams.toString() ? `?${searchParams.toString()}` : '';

    navigate({
      pathname: '/',
      search: searchStr,
    });

    setTimeout(() => {
      const el = document.getElementById('katalog');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const scrollToSection = (sectionId: string) => {
    setMegaMenuOpen(false);
    setMobileMenuOpen(false);

    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EBE4D8] transition-all">

      {/* Main navigation */}
      <div className={`adaptive-container ${containerClass || ''} px-4 sm:px-6 lg:px-8 2xl:px-10 relative`}>
        <div className="flex items-center justify-between h-20">
          {/* Logo brand - kliknięcie przewija na sam początek strony głównej */}
          <Link 
            to="/" 
            onClick={handleLogoClick}
            className="flex items-center gap-3.5 group cursor-pointer"
            title="Przejdź na początek strony głównej"
          >
            <div className="w-11 h-11 rounded-xl bg-[#2D2821] flex items-center justify-center text-[#E5983A] shadow-sm border border-[#484036] group-hover:scale-105 transition-transform">
              <span className="text-xl">🐝</span>
            </div>
            <div>
              <span className="block font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#24211D] group-hover:text-[#945209] transition-colors">
                Pasieka Warmia
              </span>
              <span className="block text-[11px] uppercase tracking-widest text-[#7C7164] font-medium">
                Gospodarstwo Pasieczne • Od 1984
              </span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-8">
            {/* Mega Menu Wrapper for Nasze Miody */}
            <div 
              className="relative py-6"
              onMouseEnter={() => setMegaMenuOpen(true)}
              onMouseLeave={() => setMegaMenuOpen(false)}
            >
              <button
                type="button"
                onClick={() => navigateToCatalog()}
                className="text-sm font-semibold text-[#484138] hover:text-[#945209] transition-colors flex items-center gap-1 cursor-pointer py-1"
                title="Przejdź do katalogu naszych miodów"
              >
                <span>Nasze Miody</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${megaMenuOpen ? 'rotate-180 text-[#945209]' : 'text-[#8C7A6B]'}`} />
              </button>

              {/* Mega Menu Dropdown */}
              {megaMenuOpen && (
                <div className="absolute top-[68px] -left-20 w-[780px] bg-[#FAF7F2] rounded-2xl border border-[#E4D9CA] shadow-2xl p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="grid grid-cols-4 gap-5 pb-5 border-b border-[#EADFCF]">
                    
                    {/* Kolumna 1: Miody Tradycyjne */}
                    <div className="space-y-2.5">
                      <button
                        type="button"
                        onClick={() => navigateToCatalog('wszystkie')}
                        className="text-[11px] uppercase font-bold text-[#8C7A6B] hover:text-[#1B4332] tracking-wider block text-left transition-colors cursor-pointer"
                      >
                        🍯 Odmianowe
                      </button>
                      <ul className="space-y-1.5 text-xs">
                        <li>
                          <Link to="/produkt/lipowy-warminski" onClick={() => setMegaMenuOpen(false)} className="text-[#3D3428] hover:text-[#D9821E] font-medium block">
                            Miód Lipowy (Św. Lipka)
                          </Link>
                        </li>
                        <li>
                          <Link to="/produkt/akacjowy-klarowny" onClick={() => setMegaMenuOpen(false)} className="text-[#3D3428] hover:text-[#D9821E] font-medium block">
                            Miód Akacjowy (Bory)
                          </Link>
                        </li>
                        <li>
                          <Link to="/produkt/rzepakowy-kremowany" onClick={() => setMegaMenuOpen(false)} className="text-[#3D3428] hover:text-[#D9821E] font-medium block">
                            Rzepakowy Kremowany
                          </Link>
                        </li>
                        <li>
                          <Link to="/produkt/gryczany-ostry" onClick={() => setMegaMenuOpen(false)} className="text-[#3D3428] hover:text-[#D9821E] font-medium block">
                            Gryczany z Suwalszczyzny
                          </Link>
                        </li>
                        <li>
                          <Link to="/produkt/spadziowy-iglasty" onClick={() => setMegaMenuOpen(false)} className="text-[#3D3428] hover:text-[#D9821E] font-medium block">
                            Spadź Iglasta (Puszcza)
                          </Link>
                        </li>
                      </ul>
                      <button
                        type="button"
                        onClick={() => navigateToCatalog('wszystkie')}
                        className="text-[11px] font-bold text-[#1B4332] hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Wszystkie odmiany</span>
                        <span>→</span>
                      </button>
                    </div>

                    {/* Kolumna 2: Superfoods & Dodatki */}
                    <div className="space-y-2.5">
                      <button
                        type="button"
                        onClick={() => navigateToCatalog('z-dodatkami')}
                        className="text-[11px] uppercase font-bold text-[#8C7A6B] hover:text-[#1B4332] tracking-wider block text-left transition-colors cursor-pointer"
                      >
                        🍓 Z Dodatkami
                      </button>
                      <ul className="space-y-1.5 text-xs">
                        <li>
                          <Link to="/produkt/malina-kremowany" onClick={() => setMegaMenuOpen(false)} className="text-[#3D3428] hover:text-[#D9821E] font-medium block">
                            Z Maliną Liofilizowaną
                          </Link>
                        </li>
                        <li>
                          <Link to="/produkt/orzech-w-miodzie" onClick={() => setMegaMenuOpen(false)} className="text-[#3D3428] hover:text-[#D9821E] font-medium block">
                            Orzechy Włoskie w Akacji
                          </Link>
                        </li>
                        <li>
                          <button
                            type="button"
                            onClick={() => navigateToCatalog('z-dodatkami')}
                            className="text-[#3D3428] hover:text-[#D9821E] font-medium block text-left cursor-pointer"
                          >
                            Z Pyłkiem i Propolisem
                          </button>
                        </li>
                      </ul>
                      <button
                        type="button"
                        onClick={() => navigateToCatalog('z-dodatkami')}
                        className="text-[11px] font-bold text-[#1B4332] hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Kolekcja owocowa</span>
                        <span>→</span>
                      </button>
                    </div>

                    {/* Kolumna 3: Skarby Ula (Apiterapia) */}
                    <div className="space-y-2.5">
                      <button
                        type="button"
                        onClick={() => navigateToCatalog(undefined, 'odpornosc')}
                        className="text-[11px] uppercase font-bold text-[#8C7A6B] hover:text-[#1B4332] tracking-wider block text-left transition-colors cursor-pointer"
                      >
                        🛡️ Zdrowie i Odporność
                      </button>
                      <ul className="space-y-1.5 text-xs">
                        <li>
                          <button
                            type="button"
                            onClick={() => navigateToCatalog(undefined, 'odpornosc')}
                            className="text-[#3D3428] hover:text-[#D9821E] font-medium block text-left cursor-pointer"
                          >
                            Kuracja Odpornościowa
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            onClick={() => navigateToCatalog(undefined, 'lagodne')}
                            className="text-[#3D3428] hover:text-[#D9821E] font-medium block text-left cursor-pointer"
                          >
                            Miody Łagodne dla Dzieci
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            onClick={() => navigateToCatalog(undefined, 'koneser')}
                            className="text-[#3D3428] hover:text-[#D9821E] font-medium block text-left cursor-pointer"
                          >
                            Dla Konesera (Wytrawne)
                          </button>
                        </li>
                      </ul>
                      <button
                        type="button"
                        onClick={() => navigateToCatalog(undefined, 'odpornosc')}
                        className="text-[11px] font-bold text-[#1B4332] hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Wskazania zdrowotne</span>
                        <span>→</span>
                      </button>
                    </div>

                    {/* Kolumna 4: Zestawy & Upominki */}
                    <div className="space-y-2.5">
                      <button
                        type="button"
                        onClick={() => navigateToCatalog(undefined, 'prezent')}
                        className="text-[11px] uppercase font-bold text-[#8C7A6B] hover:text-[#1B4332] tracking-wider block text-left transition-colors cursor-pointer"
                      >
                        🎁 Na Prezent
                      </button>
                      <ul className="space-y-1.5 text-xs">
                        <li>
                          <button
                            type="button"
                            onClick={() => navigateToCatalog(undefined, 'prezent')}
                            className="text-[#3D3428] hover:text-[#D9821E] font-medium block text-left cursor-pointer"
                          >
                            Skrzynki Degustacyjne
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            onClick={() => navigateToCatalog(undefined, 'prezent')}
                            className="text-[#3D3428] hover:text-[#D9821E] font-medium block text-left cursor-pointer"
                          >
                            Zestawy z Nabierakiem
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            onClick={() => navigateToCatalog(undefined, 'prezent')}
                            className="text-[#3D3428] hover:text-[#D9821E] font-medium block text-left cursor-pointer"
                          >
                            Świece z Wosku Pszczelego
                          </button>
                        </li>
                      </ul>
                      <button
                        type="button"
                        onClick={() => navigateToCatalog(undefined, 'prezent')}
                        className="text-[11px] font-bold text-[#1B4332] hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Oferta upominkowa</span>
                        <span>→</span>
                      </button>
                    </div>

                  </div>

                  {/* Mega Menu Footer Banner */}
                  <div className="pt-3 flex items-center justify-between text-xs">
                    <span className="text-[#695D4E] flex items-center gap-1.5 font-medium">
                      <Sparkles className="w-3.5 h-3.5 text-[#D9821E]" />
                      Nie masz pewności, który miód odpowiada Twoim potrzebom?
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setMegaMenuOpen(false);
                        onOpenQuiz();
                      }}
                      className="text-xs font-bold text-[#1B4332] hover:text-[#D9821E] transition-colors flex items-center gap-1 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-[#DFCBB5] shadow-2xs hover:shadow-xs"
                    >
                      <span>Uruchom Quiz Doboru Miodu</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => scrollToSection('miodobranie')}
              className="text-sm font-semibold text-[#484138] hover:text-[#945209] transition-colors cursor-pointer"
            >
              Droga Miodu
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('o-pasiece')}
              className="text-sm font-semibold text-[#484138] hover:text-[#945209] transition-colors cursor-pointer"
            >
              O Pasiece
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('jak-rozpoznac')}
              className="text-sm font-semibold text-[#484138] hover:text-[#945209] transition-colors cursor-pointer"
            >
              Jak Rozpoznać Prawdziwy Miód
            </button>
          </nav>

          {/* Actions: Quiz + Cart */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenQuiz}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-full bg-[#F3ECE0] text-[#7A4007] border border-[#E4D8C5] hover:bg-[#EBDDC8] transition-all cursor-pointer"
              id="header-quiz-btn"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C47514]" />
              <span>Dobierz miód dla siebie</span>
            </button>

            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#2D2821] text-[#FAF5ED] hover:bg-[#3F382E] transition-all shadow-sm cursor-pointer"
              id="header-cart-btn"
              aria-label="Otwórz koszyk"
            >
              <ShoppingBag className="w-4 h-4 text-[#E5983A]" />
              <div className="text-left leading-none hidden xs:block">
                <span className="block text-[10px] text-[#A69989] uppercase tracking-wider font-medium">Koszyk</span>
                <span className="font-semibold text-xs text-[#FFF9F0]">{cartSubtotal > 0 ? `${cartSubtotal} zł` : '0 zł'}</span>
              </div>
              {cartItemCount > 0 && (
                <span className="ml-0.5 inline-flex items-center justify-center w-5 h-5 text-[11px] font-bold rounded-full bg-[#E5983A] text-[#24211D]">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#484138] hover:bg-[#EDE5D8] cursor-pointer"
              id="mobile-menu-toggle"
              aria-label="Menu mobilne"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-[#EBE4D8] space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Główna pozycja: Nasze Miody (Katalog) */}
            <button
              type="button"
              onClick={() => navigateToCatalog()}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#F4EDE0] border border-[#DFCBB5] text-left group cursor-pointer hover:bg-[#EFE4D2] transition-all shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2D2821] text-[#E5983A] flex items-center justify-center text-lg shadow-2xs">
                  🍯
                </div>
                <div>
                  <span className="font-serif text-base font-bold text-[#24211D] block leading-tight">
                    Nasze Miody (Katalog)
                  </span>
                  <span className="text-[10px] text-[#7A6A5A] uppercase tracking-wider font-semibold">
                    Przejdź do sekcji miodów z Warmii
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#945209] group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Kolekcje Miodów w siatce */}
            <div className="p-3 bg-[#FAF3E5] rounded-2xl border border-[#DFCBB5] space-y-2">
              <span className="text-[10px] uppercase font-bold text-[#8C7A6B] tracking-wider block">
                Szybki wybór kolekcji:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button 
                  type="button"
                  onClick={() => navigateToCatalog('wszystkie')}
                  className="p-2.5 bg-white rounded-xl border border-[#DFCBB5] text-[#3D3428] font-bold text-left hover:border-[#D9821E] hover:bg-[#FAF6EE] transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <span>🍯</span>
                  <span>Odmianowe</span>
                </button>
                <button 
                  type="button"
                  onClick={() => navigateToCatalog('z-dodatkami')}
                  className="p-2.5 bg-white rounded-xl border border-[#DFCBB5] text-[#3D3428] font-bold text-left hover:border-[#D9821E] hover:bg-[#FAF6EE] transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <span>🍓</span>
                  <span>Z Dodatkami</span>
                </button>
                <button 
                  type="button"
                  onClick={() => navigateToCatalog(undefined, 'odpornosc')}
                  className="p-2.5 bg-white rounded-xl border border-[#DFCBB5] text-[#3D3428] font-bold text-left hover:border-[#D9821E] hover:bg-[#FAF6EE] transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <span>🛡️</span>
                  <span>Zdrowie i Odporność</span>
                </button>
                <button 
                  type="button"
                  onClick={() => navigateToCatalog(undefined, 'prezent')}
                  className="p-2.5 bg-white rounded-xl border border-[#DFCBB5] text-[#3D3428] font-bold text-left hover:border-[#D9821E] hover:bg-[#FAF6EE] transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <span>🎁</span>
                  <span>Na Prezent</span>
                </button>
              </div>
            </div>

            <div className="space-y-1 pt-1">
              <button
                type="button"
                onClick={() => scrollToSection('miodobranie')}
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#24211D] hover:bg-[#EDE5D8] transition-colors cursor-pointer"
              >
                Droga Miodu (Miodobranie)
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('o-pasiece')}
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#24211D] hover:bg-[#EDE5D8] transition-colors cursor-pointer"
              >
                O Pasiece & Tradycja
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('jak-rozpoznac')}
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#24211D] hover:bg-[#EDE5D8] transition-colors cursor-pointer"
              >
                Jak Rozpoznać Prawdziwy Miód
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuiz();
              }}
              className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold rounded-xl bg-[#1B4332] text-white hover:bg-[#143326] transition-colors cursor-pointer shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-[#E6C065]" />
              <span>Dobierz miód dla siebie (Quiz)</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
