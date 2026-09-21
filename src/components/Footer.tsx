import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, Phone, MapPin, Heart } from 'lucide-react';

interface FooterProps {
  containerClass?: string;
}

export const Footer: React.FC<FooterProps> = ({ containerClass }) => {
  return (
    <footer className="bg-[#24201A] text-[#EDE4D5] border-t border-[#3B342B]">
      <div className={`adaptive-container ${containerClass || ''} px-4 sm:px-6 lg:px-8 2xl:px-10 py-16`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand & Mission */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3.5 group cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-[#FAF5EE] flex items-center justify-center p-1.5 shadow-sm border border-[#E7DCCE] group-hover:border-[#E5983A] transition-colors shrink-0">
                <img 
                  src="/assets/footer-pasieka-usza.png" 
                  alt="Pasieka Usza - Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-serif text-xl font-bold tracking-tight text-[#FAF5ED] group-hover:text-[#E5983A] transition-colors block">
                  Pasieka Usza
                </span>
                <span className="block text-[11px] text-[#B5A896]">
                  Pasieka Wędrowna • Ciechów
                </span>
              </div>
            </Link>
            <p className="text-xs text-[#B5A896] leading-relaxed">
              Rodzinna pasieka wędrowna Magdaleny i Piotra Szymkowicz. Pozyskujemy surowe miody nektarowe i spadziowe oraz skarby ula z najczystszych pożytków Dolnego Śląska.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#E5983A] pt-1">
              <ShieldCheck className="w-4 h-4 text-[#52B788]" />
              <span>Nadzór Powiatowego Lekarza Weterynarii</span>
            </div>
          </div>

          {/* Direct Beekeeper Contact */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#FAF5ED]">
              Kontakt z Pasieką
            </h4>
            <div className="space-y-2.5 text-xs text-[#B5A896]">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E5983A] shrink-0 mt-0.5" />
                <span>ul. Łąkowa 3, 55-300 Ciechów (Dolny Śląsk)</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#E5983A] shrink-0" />
                <a href="tel:697512103" className="hover:text-white transition-colors font-semibold">
                  +48 697 512 103 (Magdalena i Piotr)
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#E5983A] shrink-0" />
                <a href="mailto:kontakt@pasiekausza.pl" className="hover:text-white transition-colors">
                  kontakt@pasiekausza.pl
                </a>
              </p>
              <p className="text-[11px] text-[#8C7F6D] pt-1">
                Możliwy bezpośredni odbiór miodu w pasiece po wcześniejszym kontakcie telefonicznym.
              </p>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#FAF5ED]">
              Nawigacja
            </h4>
            <ul className="space-y-2 text-xs text-[#B5A896]">
              <li>
                <Link to="/" className="hover:text-[#FAF5ED] transition-colors">Strona Główna</Link>
              </li>
              <li>
                <Link to="/o-nas" className="hover:text-[#FAF5ED] transition-colors">O nas (Historia i Filozofia)</Link>
              </li>
              <li>
                <Link to="/sklep" className="hover:text-[#FAF5ED] transition-colors">Sklep z Miodami</Link>
              </li>
              <li>
                <Link to="/oferta" className="hover:text-[#FAF5ED] transition-colors">Skarby Ula: Pierzga & Propolis</Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-[#FAF5ED] transition-colors">Blog Pszczelarski</Link>
              </li>
              <li>
                <Link to="/kontakt" className="hover:text-[#FAF5ED] transition-colors">Kontakt i Dojazd</Link>
              </li>
            </ul>
          </div>

          {/* Packing & Guarantee */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#FAF5ED]">
              Filozofia i Bezpieczeństwo
            </h4>
            <p className="text-xs text-[#B5A896] leading-relaxed">
              Nie standaryzujemy miodu – każdy słoiczek jest unikatowy. Wysyłamy miód w pancernych tekturowych tubach, gwarantując 100% bezpieczeństwa dostawy.
            </p>
            <div className="pt-2 text-[11px] text-[#A69784] border-t border-[#3B342B] space-y-1">
              <p>🌱 100% naturalny, surowy miód bez podgrzewania</p>
              <p>🚚 Bezpieczne pakowanie z tektury falistej</p>
              <p>🐝 Pasieka pod stałym nadzorem weterynaryjnym</p>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-[#383127] flex flex-col sm:flex-row items-center justify-between text-xs text-[#877967] gap-3">
          <p>© {new Date().getFullYear()} Pasieka wędrowna „Usza” (Magdalena i Piotr Szymkowicz). Wszelkie prawa zastrzeżone.</p>
          <p className="flex items-center gap-1.5 text-[11px] text-[#A69784]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#52B788]" />
            <span>Ekologiczne Gospodarstwo Pasieczne • Ciechów, Dolny Śląsk</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
