import React from 'react';
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
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#3A332A] flex items-center justify-center text-[#E5983A] text-xl border border-[#4E4437]">
                🐝
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-[#FAF5ED]">
                Pasieka Warmia
              </span>
            </div>
            <p className="text-xs text-[#B5A896] leading-relaxed">
              Rodzinne gospodarstwo pasieczne założone w 1984 roku. Pozyskujemy surowe miody nektarowe i spadziowe z najczystszych zakątków Warmii i Mazur.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#E5983A] pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>WNI: 28143501 (Nadzór Weterynaryjny)</span>
            </div>
          </div>

          {/* Direct Beekeeper Contact */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#FAF5ED]">
              Kontakt z Pszczelarzem
            </h4>
            <div className="space-y-2.5 text-xs text-[#B5A896]">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E5983A] shrink-0 mt-0.5" />
                <span>ul. Leśna Polana 14, 11-100 Lidzbark Warmiński</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#E5983A] shrink-0" />
                <span>+48 604 123 456 (Mistrz Pszczelarski Jan)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#E5983A] shrink-0" />
                <span>pasieka@warmia-miody.pl</span>
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
                <a href="/#katalog" className="hover:text-[#FAF5ED] transition-colors">Katalog Miodów Odmianowych</a>
              </li>
              <li>
                <a href="/#miodobranie" className="hover:text-[#FAF5ED] transition-colors">Droga Miodu & Miodobranie</a>
              </li>
              <li>
                <a href="/#o-pasiece" className="hover:text-[#FAF5ED] transition-colors">Pasieka & Etyka Pszczelarska</a>
              </li>
              <li>
                <a href="/#jak-rozpoznac" className="hover:text-[#FAF5ED] transition-colors">Jak Rozpoznać Prawdziwy Miód</a>
              </li>
            </ul>
          </div>

          {/* Packing & Guarantee */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#FAF5ED]">
              Gwarancja Bezpieczeństwa
            </h4>
            <p className="text-xs text-[#B5A896] leading-relaxed">
              Wysyłamy słoiki w specjalnie zaprojektowanych tubach komorowych z tektury falistej. 100% dostaw bez stłuczek lub natychmiastowa wymiana na nasz koszt w 24h.
            </p>
            <div className="pt-2 text-[11px] text-[#A69784] border-t border-[#3B342B] space-y-1">
              <p>🌱 Pakowanie bez grama plastiku i folii bąbelkowej</p>
              <p>🚚 Wysyłka w 24h od poniedziałku do czwartku</p>
              <p>❄️ Reżim letni: termoizolacja i wkłady chłodzące w upały</p>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-[#383127] flex flex-col sm:flex-row items-center justify-between text-xs text-[#877967] gap-3">
          <p>© {new Date().getFullYear()} Pasieka Warmia. Wszelkie prawa zastrzeżone.</p>
          <p className="flex items-center gap-1.5 text-[11px] text-[#A69784]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#52B788]" />
            <span>Gospodarstwo Pasieczne pod stałym nadzorem Powiatowego Lekarza Weterynarii • WNI: 28143501</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
