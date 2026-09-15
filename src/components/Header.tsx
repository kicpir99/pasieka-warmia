import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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

  const handleLogoClick = (e: React.MouseEvent) => {
    if (location.pathname === '/' || location.pathname === '') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
              <a
                href="/#katalog"
                className="text-sm font-semibold text-[#484138] hover:text-[#945209] transition-colors flex items-center gap-1 cursor-pointer py-1"
              >
                <span>Nasze Miody</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${megaMenuOpen ? 'rotate-180 text-[#945209]' : 'text-[#8C7A6B]'}`} />
              </a>

              {/* Mega Menu Dropdown */}
              {megaMenuOpen && (
                <div className="absolute top-[68px] -left-20 w-[780px] bg-[#FAF7F2] rounded-2xl border border-[#E4D9CA] shadow-2xl p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="grid grid-cols-4 gap-5 pb-5 border-b border-[#EADFCF]">
                    
                    {/* Kolumna 1: Miody Tradycyjne */}
                    <div className="space-y-2.5">
                      <span className="text-[11px] uppercase font-bold text-[#8C7A6B] tracking-wider block">
                        🍯 Odmianowe
                      </span>
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
                      <a href="/?kategoria=wszystkie#katalog" onClick={() => setMegaMenuOpen(false)} className="text-[11px] font-bold text-[#1B4332] hover:underline inline-flex items-center gap-1">
                        <span>Wszystkie odmiany</span>
                        <span>→</span>
                      </a>
                    </div>

                    {/* Kolumna 2: Superfoods & Dodatki */}
                    <div className="space-y-2.5">
                      <span className="text-[11px] uppercase font-bold text-[#8C7A6B] tracking-wider block">
                        🍓 Z Dodatkami
                      </span>
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
                          <a href="/?kategoria=z-dodatkami#katalog" onClick={() => setMegaMenuOpen(false)} className="text-[#3D3428] hover:text-[#D9821E] font-medium block">
                            Z Pyłkiem i Propolisem
                          </a>
                        </li>
                      </ul>
                      <a href="/?kategoria=z-dodatkami#katalog" onClick={() => setMegaMenuOpen(false)} className="text-[11px] font-bold text-[#1B4332] hover:underline inline-flex items-center gap-1">
                        <span>Kolekcja owocowa</span>
                        <span>→</span>
                      </a>
                    </div>

                    {/* Kolumna 3: Skarby Ula (Apiterapia) */}
                    <div className="space-y-2.5">
                      <span className="text-[11px] uppercase font-bold text-[#8C7A6B] tracking-wider block">
                        🛡️ Apiterapia
                      </span>
                      <ul className="space-y-1.5 text-xs">
                        <li>
                          <a href="/?intencja=odpornosc#katalog" onClick={() => setMegaMenuOpen(false)} className="text-[#3D3428] hover:text-[#D9821E] font-medium block">
                            Kuracja Odpornościowa
                          </a>
                        </li>
                        <li>
                          <a href="/?intencja=lagodne#katalog" onClick={() => setMegaMenuOpen(false)} className="text-[#3D3428] hover:text-[#D9821E] font-medium block">
                            Miody Łagodne dla Dzieci
                          </a>
                        </li>
                        <li>
                          <a href="/?intencja=koneser#katalog" onClick={() => setMegaMenuOpen(false)} className="text-[#3D3428] hover:text-[#D9821E] font-medium block">
                            Dla Konesera (Wytrawne)
                          </a>
                        </li>
                      </ul>
                      <a href="/?intencja=odpornosc#katalog" onClick={() => setMegaMenuOpen(false)} className="text-[11px] font-bold text-[#1B4332] hover:underline inline-flex items-center gap-1">
                        <span>Wskazania zdrowotne</span>
                        <span>→</span>
                      </a>
                    </div>

                    {/* Kolumna 4: Zestawy & Upominki */}
                    <div className="space-y-2.5">
                      <span className="text-[11px] uppercase font-bold text-[#8C7A6B] tracking-wider block">
                        🎁 Na Prezent
                      </span>
                      <ul className="space-y-1.5 text-xs">
                        <li>
                          <a href="/?intencja=prezent#katalog" onClick={() => setMegaMenuOpen(false)} className="text-[#3D3428] hover:text-[#D9821E] font-medium block">
                            Skrzynki Degustacyjne
                          </a>
                        </li>
                        <li>
                          <a href="/?intencja=prezent#katalog" onClick={() => setMegaMenuOpen(false)} className="text-[#3D3428] hover:text-[#D9821E] font-medium block">
                            Zestawy z Nabierakiem
                          </a>
                        </li>
                        <li>
                          <a href="/?intencja=prezent#katalog" onClick={() => setMegaMenuOpen(false)} className="text-[#3D3428] hover:text-[#D9821E] font-medium block">
                            Świece z Wosku Pszczelego
                          </a>
                        </li>
                      </ul>
                      <a href="/?intencja=prezent#katalog" onClick={() => setMegaMenuOpen(false)} className="text-[11px] font-bold text-[#1B4332] hover:underline inline-flex items-center gap-1">
                        <span>Oferta upominkowa</span>
                        <span>→</span>
                      </a>
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

            <a
              href="/#miodobranie"
              className="text-sm font-semibold text-[#484138] hover:text-[#945209] transition-colors"
            >
              Droga Miodu
            </a>
            <a
              href="/#o-pasiece"
              className="text-sm font-semibold text-[#484138] hover:text-[#945209] transition-colors"
            >
              O Pasiece
            </a>
            <a
              href="/#jak-rozpoznac"
              className="text-sm font-semibold text-[#484138] hover:text-[#945209] transition-colors"
            >
              Jak Rozpoznać Prawdziwy Miód
            </a>
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
          <div className="lg:hidden py-4 border-t border-[#EBE4D8] space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-3 bg-[#FAF3E5] rounded-xl border border-[#DFCBB5] space-y-1.5 mb-2">
              <span className="text-[11px] uppercase font-bold text-[#8C7A6B] block">Kolekcje Miodów:</span>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <a 
                  href="/#katalog" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 bg-white rounded-lg border border-[#DFCBB5] text-[#3D3428] font-medium"
                >
                  🍯 Wszystkie Odmianowe
                </a>
                <a 
                  href="/?kategoria=z-dodatkami#katalog" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 bg-white rounded-lg border border-[#DFCBB5] text-[#3D3428] font-medium"
                >
                  🍓 Z Dodatkami
                </a>
                <a 
                  href="/?intencja=odpornosc#katalog" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 bg-white rounded-lg border border-[#DFCBB5] text-[#3D3428] font-medium"
                >
                  🛡️ Na Odporność
                </a>
                <a 
                  href="/?intencja=prezent#katalog" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 bg-white rounded-lg border border-[#DFCBB5] text-[#3D3428] font-medium"
                >
                  🎁 Na Prezent
                </a>
              </div>
            </div>

            <a
              href="/#miodobranie"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#24211D] hover:bg-[#EDE5D8]"
            >
              Droga Miodu (Miodobranie)
            </a>
            <a
              href="/#o-pasiece"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#24211D] hover:bg-[#EDE5D8]"
            >
              O Pasiece & Tradycja
            </a>
            <a
              href="/#jak-rozpoznac"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#24211D] hover:bg-[#EDE5D8]"
            >
              Jak Rozpoznać Prawdziwy Miód
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuiz();
              }}
              className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold rounded-xl bg-[#1B4332] text-white hover:bg-[#143326] transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#E6C065]" />
              Dobierz miód dla siebie (Quiz)
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
