import React from 'react';
import { 
  ShieldCheck, 
  Droplets, 
  Coffee, 
  Award, 
  CheckCircle2, 
  Heart, 
  Sparkles, 
  Layers,
  ThermometerSnowflake,
  PackageCheck,
  Leaf
} from 'lucide-react';

interface HoneyQualitySectionProps {
  containerClass?: string;
}

export const HoneyQualitySection: React.FC<HoneyQualitySectionProps> = ({ containerClass }) => {
  return (
    <section id="jakosc-i-herbata" className="py-16 bg-[#F4EFE6] border-b border-[#E3D7C5] text-[#241E17]">
      <div className={`adaptive-container ${containerClass || ''} px-4 sm:px-6 lg:px-8 2xl:px-10 space-y-12`}>
        
        {/* Header Sekcji */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8DCB8]/60 border border-[#D1B87F] text-xs font-bold text-[#8C5819] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#C97B1A]" />
            <span>Rodzinna Pasieka • Od 1984 r.</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#241E17] tracking-tight">
            Prosto od pszczelarza
          </h2>
          <p className="text-[15px] text-[#665543] leading-relaxed">
            Nie poprawiamy natury. Poniżej zebraliśmy nasze najważniejsze zasady, małą podpowiedź jak słodzić herbatę by nie zabić witamin, oraz krótki przewodnik po wielkościach słoików.
          </p>
        </div>

        {/* 3 Bloki: Gwarancja / Herbata / Wybór słoika */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* KARTA 1: Gwarancja Prawdziwego Miodu (zamiast badań laboratoryjnych) */}
          <div className="p-6 rounded-3xl bg-[#FAF7F2] border border-[#E3D7C5] shadow-sm flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#596e47]/15 border border-[#596e47]/30 flex items-center justify-center text-[#3B4D2F]">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#241E17]">Gwarancja Jakości</h3>
                  <p className="text-xs text-[#7A6B5B]">Nasze żelazne zasady w pasiece</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-[#524434] leading-relaxed">
                <div className="py-2 border-b border-[#E8DFC8]">
                  <span className="block font-bold text-[#3B4D2F] mb-0.5">Tylko dojrzały nektar</span>
                  <span className="text-[#665543]">Miód odbieramy z ula dopiero, gdy pszczoły poszyją plastry woskiem. Dzięki temu nie fermentuje i nie psuje się latami.</span>
                </div>
                <div className="py-2 border-b border-[#E8DFC8]">
                  <span className="block font-bold text-[#3B4D2F] mb-0.5">Rozlewany na zimno (100% RAW)</span>
                  <span className="text-[#665543]">Nigdy nie przegrzewamy miodu. Trafia do słoików z zachowaniem wszystkich żywych enzymów z ula.</span>
                </div>
                <div className="py-2 border-b border-[#E8DFC8]">
                  <span className="block font-bold text-[#3B4D2F] mb-0.5">Naturalna krystalizacja</span>
                  <span className="text-[#665543]">Nasz miód z czasem twardnieje (krystalizuje). To najprostszy i najlepszy dowód na to, że jest w 100% prawdziwy.</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#F0EAE1] border border-[#DDD3C2] text-xs text-[#635341] flex items-start gap-2.5 leading-snug">
              <CheckCircle2 className="w-4 h-4 text-[#3B4D2F] shrink-0 mt-0.5" />
              <span>Gwarantujemy zero syropów i polepszaczy. Dostajesz to, co przyniosły pszczoły.</span>
            </div>
          </div>

          {/* KARTA 2: Sekret Gorącej Herbaty */}
          <div className="p-6 rounded-3xl bg-[#FAF7F2] border border-[#E3D7C5] shadow-sm flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#C97B1A]/15 border border-[#C97B1A]/30 flex items-center justify-center text-[#9E5A12]">
                  <Coffee className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#241E17]">Rada do Gorącej Herbaty</h3>
                  <p className="text-xs text-[#7A6B5B]">Jak słodzić i nie stracić witamin</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-[#524434] leading-relaxed">
                <div className="p-3.5 rounded-2xl bg-[#EBE3D3] border border-[#DDD0BC] space-y-1.5">
                  <span className="font-bold text-[#8C5819] flex items-center gap-1.5 text-xs">
                    <Sparkles className="w-3.5 h-3.5" /> Złota zasada 40°C
                  </span>
                  <p className="text-[#594B3C]">
                    Nigdy nie wrzucaj miodu do świeżo zaparzonego wrzątku. Odczekaj 2–3 minuty, aż kubek będzie przyjemnie ciepły w dłoniach.
                  </p>
                </div>

                <ul className="space-y-2 text-xs">
                  <li className="flex items-start gap-2">
                    <span className="text-[#C97B1A] font-bold">•</span>
                    <span><strong>Z cytryną i imbirem:</strong> Miód lipowy wspaniale łagodzi ostrość imbiru i rozgrzewa w jesienne wieczory.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C97B1A] font-bold">•</span>
                    <span><strong>Zioła i lipa:</strong> Aksamitny smak miodu nie dominuje aromatu suszonych ziół, a tworzy przytulną całość.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#F0EAE1] border border-[#DDD3C2] text-xs text-[#635341] flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#C97B1A] shrink-0" />
              <span>Ciepły kubek herbaty z prawdziwym miodem to najlepszy domowy relaks.</span>
            </div>
          </div>

          {/* KARTA 3: Wybór Pojemności Słoika */}
          <div className="p-6 rounded-3xl bg-[#FAF7F2] border border-[#E3D7C5] shadow-sm flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E5983A]/15 border border-[#E5983A]/30 flex items-center justify-center text-[#9E5A12]">
                  <PackageCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#241E17]">Który słoik wybrać?</h3>
                  <p className="text-xs text-[#7A6B5B]">Dwie tradycyjne pojemności</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-[#524434]">
                <div className="p-3 rounded-2xl bg-white border border-[#E3D7C5] space-y-1">
                  <div className="flex items-center justify-between font-bold text-[#241E17]">
                    <span>Słoik 450g</span>
                    <span className="text-[#8C5819]">od 39 zł</span>
                  </div>
                  <p className="text-[#6E5D4C] text-[11px] leading-relaxed">
                    Poręczny, idealny na stół śniadaniowy, do przetestowania nowego smaku lub jako ciepły podarunek dla kogoś bliskiego.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-[#E3D7C5] space-y-1">
                  <div className="flex items-center justify-between font-bold text-[#241E17]">
                    <span>Słoik 900g (Polecany)</span>
                    <span className="text-[#8C5819]">od 68 zł</span>
                  </div>
                  <p className="text-[#6E5D4C] text-[11px] leading-relaxed">
                    Tradycyjny, duży słoik do domowej spiżarni. Najbardziej ekonomiczny wybór dla miłośników codziennej herbaty.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#F0EAE1] border border-[#DDD3C2] text-xs text-[#635341] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#8C5819] shrink-0" />
              <span>Grube, tradycyjne szkło chroni miód przed światłem i utratą aromatu.</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
