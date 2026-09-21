import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Sparkles, Menu, X, ChevronDown, ArrowRight } from 'lucide-react';

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
      pathname: '/sklep',
      search: searchStr,
    });
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/' || location.pathname === '';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EBE4D8] transition-all">
      {/* Main navigation */}
      <div className={`adaptive-container ${containerClass || ''} px-4 sm:px-6 lg:px-8 2xl:px-10 relative`}>
        <div className="flex items-center justify-between h-20 sm:h-24">
          
          {/* Logo brand */}
          <Link 
            to="/" 
            onClick={handleLogoClick}
            className="flex items-center group cursor-pointer py-1"
            title="Pasieka wędrowna Usza - Strona Główna"
          >
            <img 
              src="/assets/logo-usza.png" 
              alt="Pasieka Wędrowna Usza" 
              className="h-14 sm:h-18 md:h-20 lg:h-[82px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            <Link
              to="/"
              className={`text-sm font-semibold transition-colors py-1 ${
                isActive('/') ? 'text-[#8B5337] font-bold' : 'text-[#484138] hover:text-[#8B5337]'
              }`}
            >
              Strona Główna
            </Link>

            <Link
              to="/o-nas"
              className={`text-sm font-semibold transition-colors py-1 ${
                isActive('/o-nas') ? 'text-[#8B5337] font-bold' : 'text-[#484138] hover:text-[#8B5337]'
              }`}
            >
              O nas
            </Link>

            {/* Sklep z Mega Menu */}
            <div 
              className="relative py-6"
              onMouseEnter={() => setMegaMenuOpen(true)}
              onMouseLeave={() => setMegaMenuOpen(false)}
            >
              <Link
                to="/sklep"
                className={`text-sm font-semibold transition-colors flex items-center gap-1 cursor-pointer py-1 ${
                  isActive('/sklep') ? 'text-[#8B5337] font-bold' : 'text-[#484138] hover:text-[#8B5337]'
                }`}
                title="Przejdź do pełnego sklepu"
              >
                <span>Sklep</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${megaMenuOpen ? 'rotate-180 text-[#8B5337]' : 'text-[#8C7A6B]'}`} />
              </Link>

              {/* Mega Menu Dropdown */}
              {megaMenuOpen && (
                <div className="absolute top-full -left-20 w-[780px] bg-[#FAF7F2] rounded-2xl border border-[#E4D9CA] shadow-2xl p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="grid grid-cols-4 gap-5 pb-5 border-b border-[#EADFCF]">
                    
                    {/* Kolumna 1: Miody Odmianowe */}
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
                          <Link to="/produkt/miod-lipowy" onClick={() => setMegaMenuOpen(false)} className="text-[#3D3428] hover:text-[#8B5337] font-medium block">
                            Miód Lipowy
                          </Link>
                        </li>
                        <li>
                          <Link to="/produkt/miod-wrzosowy" onClick={() => setMegaMenuOpen(false)} className="text-[#3D3428] hover:text-[#8B5337] font-medium block">
                            Miód Wrzosowy
                          </Link>
                        </li>
                        <li>
                          <Link to="/produkt/miod-ze-spadzi-iglastej" onClick={() => setMegaMenuOpen(false)} className="text-[#3D3428] hover:text-[#8B5337] font-medium block">
                            Miód ze Spadzi Iglastej
                          </Link>
                        </li>
                        <li>
                          <Link to="/produkt/miod-gryczany" onClick={() => setMegaMenuOpen(false)} className="text-[#3D3428] hover:text-[#8B5337] font-medium block">
                            Miód Gryczany
                          </Link>
                        </li>
                      </ul>
                      <button
                        type="button"
                        onClick={() => navigateToCatalog('wszystkie')}
                        className="text-[11px] font-bold text-[#1B4332] hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Wszystkie 12 odmian</span>
                        <span>→</span>
                      </button>
                    </div>

                    {/* Kolumna 2: Kwiatowe & Leśne */}
                    <div className="space-y-2.5">
                      <button
                        type="button"
                        onClick={() => navigateToCatalog('letnie')}
                        className="text-[11px] uppercase font-bold text-[#8C7A6B] hover:text-[#1B4332] tracking-wider block text-left transition-colors cursor-pointer"
                      >
                        🌸 Kwiatowe & Leśne
                      </button>
                      <ul className="space-y-1.5 text-xs">
                        <li>
                          <Link to="/produkt/miod-akacjowy" onClick={() => setMegaMenuOpen(false)} className="text-[#3D3428] hover:text-[#8B5337] font-medium block">
                            Miód Akacjowy
                          </Link>
                        </li>
                        <li>
                          <Link to="/produkt/miod-wielokwiatowy" onClick={() => setMegaMenuOpen(false)} className="text-[#3D3428] hover:text-[#8B5337] font-medium block">
                            Miód Wielokwiatowy
                          </Link>
                        </li>
                        <li>
                          <Link to="/produkt/miod-lesny" onClick={() => setMegaMenuOpen(false)} className="text-[#3D3428] hover:text-[#8B5337] font-medium block">
                            Miód Leśny
                          </Link>
                        </li>
                        <li>
                          <Link to="/produkt/miod-malinowy" onClick={() => setMegaMenuOpen(false)} className="text-[#3D3428] hover:text-[#8B5337] font-medium block">
                            Miód Malinowy
                          </Link>
                        </li>
                      </ul>
                      <button
                        type="button"
                        onClick={() => navigateToCatalog('wiosenne')}
                        className="text-[11px] font-bold text-[#1B4332] hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Zbiory wiosenne & letnie</span>
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
                        🛡️ Skarby Ula (Apiterapia)
                      </button>
                      <ul className="space-y-1.5 text-xs">
                        <li>
                          <Link to="/produkt/pierzga-pszczela" onClick={() => setMegaMenuOpen(false)} className="text-[#3D3428] hover:text-[#8B5337] font-medium block">
                            Pierzga Pszczela
                          </Link>
                        </li>
                        <li>
                          <Link to="/produkt/propolis-kit" onClick={() => setMegaMenuOpen(false)} className="text-[#3D3428] hover:text-[#8B5337] font-medium block">
                            Propolis (Kit pszczeli)
                          </Link>
                        </li>
                        <li>
                          <Link to="/produkt/pylek-pszczeli" onClick={() => setMegaMenuOpen(false)} className="text-[#3D3428] hover:text-[#8B5337] font-medium block">
                            Pyłek kwiatowy pszczeli
                          </Link>
                        </li>
                      </ul>
                      <Link
                        to="/oferta"
                        onClick={() => setMegaMenuOpen(false)}
                        className="text-[11px] font-bold text-[#1B4332] hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Przewodnik po apiterapii</span>
                        <span>→</span>
                      </Link>
                    </div>

                    {/* Kolumna 4: Manufaktura & Edukacja */}
                    <div className="space-y-2.5">
                      <Link
                        to="/oferta"
                        onClick={() => setMegaMenuOpen(false)}
                        className="text-[11px] uppercase font-bold text-[#8C7A6B] hover:text-[#1B4332] tracking-wider block text-left transition-colors cursor-pointer"
                      >
                        🐝 Manufaktura & Oferta
                      </Link>
                      <ul className="space-y-1.5 text-xs">
                        <li>
                          <Link
                            to="/produkt/swieca-wosk-pszczeli"
                            onClick={() => setMegaMenuOpen(false)}
                            className="text-[#3D3428] hover:text-[#8B5337] font-medium block text-left cursor-pointer"
                          >
                            Świece z Wosku Pszczelego
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/produkt/odklad-szkolenie-pszczele"
                            onClick={() => setMegaMenuOpen(false)}
                            className="text-[#3D3428] hover:text-[#8B5337] font-medium block text-left cursor-pointer"
                          >
                            Odkłady Pszczele i Szkolenia
                          </Link>
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
                      className="text-xs font-bold text-[#1B4332] hover:text-[#8B5337] transition-colors flex items-center gap-1 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-[#DFCBB5] shadow-2xs hover:shadow-xs"
                    >
                      <span>Uruchom Quiz Doboru Miodu</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/oferta"
              className={`text-sm font-semibold transition-colors py-1 ${
                isActive('/oferta') ? 'text-[#8B5337] font-bold' : 'text-[#484138] hover:text-[#8B5337]'
              }`}
            >
              Oferta & Apiterapia
            </Link>

            <Link
              to="/blog"
              className={`text-sm font-semibold transition-colors py-1 ${
                isActive('/blog') ? 'text-[#8B5337] font-bold' : 'text-[#484138] hover:text-[#8B5337]'
              }`}
            >
              Blog
            </Link>

            <Link
              to="/kontakt"
              className={`text-sm font-semibold transition-colors py-1 ${
                isActive('/kontakt') ? 'text-[#8B5337] font-bold' : 'text-[#484138] hover:text-[#8B5337]'
              }`}
            >
              Kontakt
            </Link>
          </nav>

          {/* Actions: Quiz + Cart */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenQuiz}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-full bg-[#F3ECE0] text-[#7A4007] border border-[#E4D8C5] hover:bg-[#EBDDC8] transition-all cursor-pointer"
              id="header-quiz-btn"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C47514]" />
              <span>Dobierz miód</span>
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
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/') ? 'bg-[#F4EDE0] text-[#8B5337] font-bold' : 'text-[#24211D] hover:bg-[#EDE5D8]'
              }`}
            >
              Strona Główna
            </Link>

            <Link
              to="/o-nas"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/o-nas') ? 'bg-[#F4EDE0] text-[#8B5337] font-bold' : 'text-[#24211D] hover:bg-[#EDE5D8]'
              }`}
            >
              O nas (Historia Pasieki Usza)
            </Link>

            <Link
              to="/sklep"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/sklep') ? 'bg-[#F4EDE0] text-[#8B5337] font-bold' : 'text-[#24211D] hover:bg-[#EDE5D8]'
              }`}
            >
              Sklep z Miodami
            </Link>

            <Link
              to="/oferta"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/oferta') ? 'bg-[#F4EDE0] text-[#8B5337] font-bold' : 'text-[#24211D] hover:bg-[#EDE5D8]'
              }`}
            >
              Oferta & Skarby Ula (Pierzga, Propolis)
            </Link>

            <Link
              to="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/blog') ? 'bg-[#F4EDE0] text-[#8B5337] font-bold' : 'text-[#24211D] hover:bg-[#EDE5D8]'
              }`}
            >
              Blog & Wiedza
            </Link>

            <Link
              to="/kontakt"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/kontakt') ? 'bg-[#F4EDE0] text-[#8B5337] font-bold' : 'text-[#24211D] hover:bg-[#EDE5D8]'
              }`}
            >
              Kontakt (Ciechów)
            </Link>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuiz();
              }}
              className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold rounded-xl bg-[#1B4332] text-white hover:bg-[#143326] transition-colors cursor-pointer shadow-sm"
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
