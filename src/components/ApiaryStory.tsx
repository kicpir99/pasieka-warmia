import React from 'react';
import { ShieldCheck, Heart, Sparkles, CheckCircle2, Trees, SunMedium, Flame, Info } from 'lucide-react';

interface ApiaryStoryProps {
  containerClass?: string;
}

export const ApiaryStory: React.FC<ApiaryStoryProps> = ({ containerClass }) => {
  return (
    <section id="o-pasiece" className="py-20 bg-[#FAF7F2] border-b border-[#E8DECFA0]">
      <div className={`adaptive-container ${containerClass || ''} px-4 sm:px-6 lg:px-8 2xl:px-10`}>
        
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFE4D2] text-[#713F0C] text-xs font-semibold">
            <Trees className="w-3.5 h-3.5 text-[#A05C12]" />
            Pasieka Wędrowna Usza • Ciechów
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#23201C] tracking-tight">
            Nie produkujemy miodu. Zbieramy to, co stworzyły pszczoły.
          </h2>
          <p className="text-sm sm:text-base text-[#615648] leading-relaxed">
            W dobie przemysłowych blendów z całego świata, nasza pasieka stawia na bezkompromisowy szacunek do owada i pożytku botanicznego. Każdy słoik ma swoją tożsamość.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E7DCCE] space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#EFE3CF] text-[#945209] flex items-center justify-center font-bold">
              01
            </div>
            <h3 className="font-serif text-lg font-bold text-[#23201C]">
              Czekamy na zasklepienie
            </h3>
            <p className="text-xs text-[#635747] leading-relaxed">
              Miód odbieramy tylko wtedy, gdy pszczoły odparują nektar do wilgotności poniżej 17% i zamkną komórki woskowym wieczkiem. Miód niedojrzały kwaśnieje – nasz przetrwa lata.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E7DCCE] space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#EFE3CF] text-[#945209] flex items-center justify-center font-bold">
              02
            </div>
            <h3 className="font-serif text-lg font-bold text-[#23201C]">
              100% RAW – Zero podgrzewania
            </h3>
            <p className="text-xs text-[#635747] leading-relaxed">
              Większość miodów sklepowych jest pasteryzowana w 60–70°C, co bezpowrotnie zabija enzymy. Nasz miód nigdy nie widzi temperatury wyższej niż w gnieździe pszczelim (36°C).
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E7DCCE] space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#EFE3CF] text-[#945209] flex items-center justify-center font-bold">
              03
            </div>
            <h3 className="font-serif text-lg font-bold text-[#23201C]">
              Niewymuszona krystalizacja
            </h3>
            <p className="text-xs text-[#635747] leading-relaxed">
              Prawdziwy miód musi skrystalizować. To naturalny proces fizyczny, będący najprostszym domowym testem autentyczności. Tylko fałszywki z syropem glukozowym stoją wiecznie płynne.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E7DCCE] space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#EFE3CF] text-[#945209] flex items-center justify-center font-bold">
              04
            </div>
            <h3 className="font-serif text-lg font-bold text-[#23201C]">
              Etyka i dobrostan roju
            </h3>
            <p className="text-xs text-[#635747] leading-relaxed">
              Pszczoły to nasi partnerzy, nie fabryka. Na zimowlę zawsze zostawiamy im obfity zapas ich własnego miodu i pierzgi, dbając o silną odporność kolejnych pokoleń.
            </p>
          </div>
        </div>

        {/* Educational banner: How to spot real honey */}
        <div id="jak-rozpoznac" className="bg-[#2D2821] text-[#FAF5ED] rounded-3xl p-8 sm:p-12 overflow-hidden relative">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#E5983A]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3F372C] text-[#E5983A] text-xs font-semibold">
              <Info className="w-3.5 h-3.5" />
              Edukacja Konsumencka
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#FAF5ED]">
              Jak odróżnić prawdziwy miód z pasieki od fałszywki z marketu?
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#393228] border border-[#4F4638] space-y-1.5">
                <span className="font-bold text-[#E5983A] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Prawdziwy miód surowy:
                </span>
                <ul className="text-[#CFC2B0] space-y-1 pt-1 list-disc list-inside">
                  <li>Z czasem twardnieje (krystalizuje) w słoiku.</li>
                  <li>Lany z łyżeczki tworzy wyraźny stożek na powierzchni.</li>
                  <li>Ma niejednorodną barwę i naturalny osad pyłkowy pod nakrętką.</li>
                  <li>W gardle pozostawia delikatne drapanie od olejków eterycznych.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-[#393228] border border-[#4F4638] space-y-1.5">
                <span className="font-bold text-[#E57373] flex items-center gap-1.5">
                  <Flame className="w-4 h-4" />
                  Miód przemysłowy / przegrzany:
                </span>
                <ul className="text-[#CFC2B0] space-y-1 pt-1 list-disc list-inside">
                  <li>Miesiącami stoi płynny na sklepowej półce bez zmiany stanu.</li>
                  <li>Etykieta zawiera lakoniczne „Mieszanka miodów z UE i spoza UE”.</li>
                  <li>Pachnie jedynie płaskim, mdłym cukrem bez aromatu ula.</li>
                  <li>Został przefiltrowany pod ciśnieniem z usunięciem pyłków.</li>
                </ul>
              </div>
            </div>

            <p className="text-xs text-[#A89C8C] italic">
              W Pasiece Usza udostępniamy wyniki badań laboratoryjnych każdej partii miodu (liczbę diastazową, HMF oraz analizę melisopalynologiczną).
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
