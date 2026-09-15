import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles, ShieldCheck, Mail, Phone } from 'lucide-react';

interface FAQItem {
  question: string;
  category: string;
  answer: string;
  highlight?: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    category: 'Biologia i jakość',
    question: 'Czy krystalizacja i rozwarstwienie miodu oznaczają, że miód się zepsuł?',
    answer: 'Absolutnie nie! Krystalizacja to w 100% naturalny proces fizyczny, świadczący o tym, że miód nie był pasteryzowany ani zafałszowany sztucznym syropem. Czas przejścia w postać krupca zależy od naturalnego stosunku glukozy do fruktozy w nektarze. Czasami na dnie słoika pojawia się gęstsza warstwa kryształków glukozy, a na górze lżejsza fruktoza – to zjawisko naturalnej sedymentacji (częste np. w miodach gryczanych). Wystarczy słoik przemieszać.',
    highlight: 'Naturalny proces dowodzący braku obróbki termicznej.',
  },
  {
    category: 'Jakość i surowość',
    question: 'Czym jest biały nalot na ściankach i powierzchni słoika („kwiat miodu”)?',
    answer: 'Biały, marmurkowy nalot lub wykwity na ściankach słoika w miodzie skrystalizowanym to tzw. „wykwity glukozowe” lub tradycyjny „kwiat miodu”. Powstaje w wyniku uwięzienia mikroskopijnych pęcherzyków powietrza między kryształami glukozy podczas powolnego dojrzewania w chłodzie. To najważniejsza dla koneserów wizualna gwarancja, że miód jest surowy (RAW), niefiltrowany ciśnieniowo i nieprzegrzewany.',
    highlight: 'Dla konesera to bezsporny dowód 100% surowego miodu.',
  },
  {
    category: 'Stosowanie i zdrowie',
    question: 'W jakiej temperaturze miód traci właściwości lecznicze i jak go chronić?',
    answer: 'Graniczną temperaturą jest 40°C. Powyżej tego progu cenne białka enzymatyczne pszczół (m.in. inhibina, diastaza, inwertaza i lizozym) ulegają bezpowrotnej denaturacji termicznej, a miód traci swoje unikalne działanie bio-bójcze. Dlatego miodu nigdy nie dodajemy do wrzątku – zawsze odczekaj kilka minut, aż kubek herbaty lub naparu będzie przyjemnie ciepły w dłoniach.',
    highlight: 'Żelazna zasada 40°C: chroń żywe enzymy ula.',
  },
  {
    category: 'Bezpieczeństwo i dzieci',
    question: 'Dlaczego miodu nie wolno podawać niemowlętom poniżej 12. miesiąca życia?',
    answer: 'Jest to oficjalny, rygorystyczny standard medyczny rekomendowany przez WHO oraz Główny Inspektorat Sanitarny (GIS). W surowym miodzie mogą występować naturalne przetrwalniki bakterii Clostridium botulinum z pyłku roślinnego. Dla dojrzałego układu pokarmowego dorosłych i starszych dzieci są one całkowicie nieszkodliwe, jednak u niemowląt do 1. roku życia, z braku rozwiniętej mikroflory jelitowej, mogą wywołać botulizm dziecięcy. Po ukończeniu 12 miesięcy miód jest wysoce zalecany.',
    highlight: 'Oficjalny standard medyczny chroniący najmłodszych.',
  },
  {
    category: 'Przechowywanie',
    question: 'Jak poprawnie rozpuścić skrystalizowany miód w domu bez utraty enzymów?',
    answer: 'Jeśli wolisz płynną patokę, wstaw odkręcony słoik do garnka z ciepłą wodą o temperaturze nieprzekraczającej 36–38°C (tzw. kąpiel wodna) i co jakiś czas zamieszaj drewnianą lub szklaną łyżeczką. Proces potrwa dłużej, ale zachowasz 100% witamin i enzymów. Nigdy nie używaj mikrofalówki!',
    highlight: 'Łagodna kąpiel wodna do 38°C.',
  },
  {
    category: 'Przechowywanie',
    question: 'Jak najlepiej przechowywać słoik miodu w domowych warunkach?',
    answer: 'Miód rzemieślniczy najlepiej czuje się w suchym, ciemnym i chłodnym miejscu (optymalna temperatura to 10–18°C, np. spiżarnia lub zamknięta szafka z dala od kuchenki i słońca). Zawsze pamiętaj o szczelnym dokręcaniu wieczka – miód silnie chłonie wilgoć oraz zapachy z otoczenia.',
    highlight: 'Ciemne, suche miejsce w temperaturze 10–18°C.',
  }
];

interface HoneyFAQSectionProps {
  containerClass?: string;
}

export const HoneyFAQSection: React.FC<HoneyFAQSectionProps> = ({ containerClass }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggleItem = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq-pasieczne" className="py-16 md:py-20 bg-[#FAF7F2] border-t border-[#E8DED1]">
      <div className={`adaptive-container ${containerClass || ''} px-4 sm:px-6 lg:px-8 2xl:px-10 max-w-5xl mx-auto space-y-10`}>
        
        {/* Nagłówek sekcji */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E5983A]/10 border border-[#E5983A]/25 text-xs font-bold text-[#8C4609] uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-[#D9821E]" />
            <span>Baza Wiedzy & Edukacja Biologiczna</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#23201C] tracking-tight">
            Częste pytania o prawdziwy miód
          </h2>
          <p className="text-sm sm:text-[15px] text-[#695D4E] leading-relaxed">
            Prawdziwy, żywy miód z pasieki zachowuje się inaczej niż wyroby z marketu. 
            Wyjaśniamy prawa natury, krystalizację oraz zasady ochrony cennych enzymów.
          </p>
        </div>

        {/* Akordeon FAQ */}
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-white border-[#D9821E]/40 shadow-sm'
                    : 'bg-[#FFFDF9] border-[#E8DED1] hover:border-[#D9821E]/30'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer select-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start gap-3">
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold transition-colors mt-0.5 ${
                      isOpen
                        ? 'bg-[#1B4332] text-white shadow-xs'
                        : 'bg-[#F2E5D0] text-[#7A4B13]'
                    }`}>
                      {idx + 1}
                    </span>
                    <div>
                      <span className="text-[11px] font-bold text-[#D9821E] uppercase tracking-wider block mb-0.5">
                        {item.category}
                      </span>
                      <h3 className="font-serif text-base sm:text-lg font-bold text-[#23201C] leading-snug">
                        {item.question}
                      </h3>
                    </div>
                  </div>

                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[#5A4B3A] transition-transform duration-200 ${
                    isOpen ? 'rotate-180 bg-[#1B4332]/10 text-[#1B4332]' : 'bg-[#EFE4D2]'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 sm:px-6 sm:pb-6 text-xs sm:text-sm text-[#5C4F40] leading-relaxed border-t border-[#E8DED1]/60 space-y-3 animate-in fade-in duration-150">
                    <p>{item.answer}</p>
                    {item.highlight && (
                      <div className="p-3 bg-[#FAF3E5] rounded-xl border border-[#D9821E]/20 text-xs text-[#7A4B13] flex items-center gap-2 font-semibold">
                        <Sparkles className="w-4 h-4 text-[#D9821E] shrink-0" />
                        <span>{item.highlight}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Dolna belka wsparcia z pszczelarzem */}
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#1B4332] to-[#143326] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center text-xl shrink-0">
              🐝
            </div>
            <div>
              <p className="font-serif font-bold text-base text-[#FAF5ED]">
                Masz inne pytanie o nasze miody lub pasiekę?
              </p>
              <p className="text-xs text-[#D8E6DE] mt-0.5">
                Mistrz Pszczelarski Jan chętnie doradzi odpowiedni zbiór dla Twojej rodziny.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:+48604123456"
              className="px-4 py-2.5 rounded-xl bg-[#E5983A] hover:bg-[#D9821E] text-[#24211D] font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Zadzwoń do pasieki</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
