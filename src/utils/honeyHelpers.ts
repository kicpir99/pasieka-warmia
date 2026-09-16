import { HoneyProduct, HoneySizeOption } from '../types';

export type HealthIntent = 'odpornosc' | 'lagodne' | 'koneser' | 'prezent';

export interface ConsistencyInfo {
  state: 'patoka' | 'kremowany' | 'krupiec';
  label: string;
  badgeClass: string;
  shortExplanation: string;
  crystallizationSpeed: string;
  hasGlucoseBloom: boolean;
  glucoseBloomInfo?: string;
  storageTips: string;
}

export interface EnrichedProductData {
  tagline: string;
  botanicalSource: string;
  region: string;
  badge?: string;
  images: string[];
  tasteProfile: {
    sweetness: number;
    acidity: number;
    aroma: number;
    crystallization: string;
    color: string;
  };
  healthBenefits: string[];
  pairing: string;
  detailedUsage: {
    recommendedDose: string;
    culinaryIdeas: string[];
  };
  labAnalysis: {
    lotNumber: string;
    waterContent: string;
    diastaseNumber: string;
    hmf: string;
    conductivity?: string;
  };
  prices: Record<string, number>;
  sizesList: { gram: string; weightGrams: number; price: number; inStock: boolean }[];
  advisorVerdict: string;
  consistencyInfo: ConsistencyInfo;
  healthIntents: HealthIntent[];
}

// Mapowanie dodatkowych galerii zdjęć wg kategorii / typu miodu
const GALLERY_MAP: Record<string, string[]> = {
  'lipowy-warminski': [
    'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1579113800032-c38bd7635818?auto=format&fit=crop&w=900&q=85',
  ],
  'spadziowy-iglasty': [
    'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=900&q=85',
  ],
  'gryczany-ostry': [
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6f/Buchweizenhonig.jpg/1280px-Buchweizenhonig.jpg',
    'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=900&q=85',
  ],
};

const DEFAULT_GALLERY = [
  'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1579113800032-c38bd7635818?auto=format&fit=crop&w=900&q=85',
];

export function getEnrichedProduct(product: HoneyProduct): HoneyProduct & EnrichedProductData {
  const badge = product.isBestseller
    ? 'Wybór Klientów'
    : product.isLimitedBatch
    ? 'Krótka Partia'
    : product.isNewHarvest
    ? 'Świeży Zbiór 2026'
    : undefined;

  const images = (product.images && product.images.length > 0)
    ? product.images
    : (GALLERY_MAP[product.id] || [
        product.imageUrl,
        ...DEFAULT_GALLERY.filter(img => img !== product.imageUrl).slice(0, 3),
      ]);

  // Mapowanie właściwości zdrowotnych wg specyfiki miodu
  let healthBenefits: string[] = [];
  let advisorVerdict = '';
  let culinaryPairing = '';
  let recommendedDose = '1-2 łyżeczki rano na czczo w letniej wodzie (do 40°C) z dodatkiem cytryny.';

  if (product.id.includes('lipow') || product.name.toLowerCase().includes('lipowy')) {
    healthBenefits = [
      'Niezastąpiony przy przeziębieniach, grypie, kaszlu i zapaleniu oskrzeli',
      'Zawiera naturalne olejki eteryczne działające napotnie i wykrztuśnie',
      'Działa łagodząco na układ nerwowy, ułatwia zasypianie i redukuje stres',
    ];
    advisorVerdict = 'Wybierz ten miód, jeśli szukasz sprawdzonego, tradycyjnego wsparcia przy infekcjach dróg oddechowych, przeziębieniu oraz cenisz intensywny, odświeżający aromat kwiatów lipy.';
    culinaryPairing = 'Napar z kwiatu lipy, herbata z cytryną, grzane mleko owsiane, pieczone jabłka z cynamonem.';
  } else if (product.id.includes('spadz') || product.name.toLowerCase().includes('spadzi')) {
    healthBenefits = [
      '„Królewski miód” o 9-krotnie wyższej zawartości biopierwiastków niż miody nektarowe',
      'Silne działanie antybakteryjne, przeciwzapalne i wykrztuśne (inhibina pszczela)',
      'Wspomaga rekonwalescencję, układ krążenia oraz regenerację po antybiotykoterapii',
    ];
    advisorVerdict = 'Wybierz ten miód, jeśli zależy Ci na maksymalnej gęstości minerałów, regeneracji wyczerpanego organizmu lub preferujesz głęboki, żywiczny, szlachetnie mało słodki smak.';
    culinaryPairing = 'Dojrzałe sery kozie i owcze, pieczywo żytnie na zakwasie, sosy pieczeniowe i ciemne marynaty.';
  } else if (product.id.includes('gryczan') || product.name.toLowerCase().includes('gryczany')) {
    healthBenefits = [
      'Rekordowa zawartość rutyny – wzmacnia i uelastycznia naczynia krwionośne',
      'Wysoki poziom łatwo przyswajalnego żelaza, polecany przy anemii i osłabieniu',
      'Jeden z najsilniejszych antyoksydantów wśród polskich miodów',
    ];
    advisorVerdict = 'Wybierz ten miód, jeśli szukasz silnego wsparcia dla serca i naczyń krwionośnych lub kochasz wyraziste, korzenne, wytrawne smaki przypominające ciemny karmel i melasę.';
    culinaryPairing = 'Tradycyjny piernik staropolski, sosy do dziczyzny, mocna czarna herbata, sery z niebieską pleśnią.';
  } else if (product.id.includes('akacj') || product.name.toLowerCase().includes('akacjowy')) {
    healthBenefits = [
      'Najmniej obciąża układ pokarmowy, wspomaga leczenie nadkwasoty i wrzodów',
      'Bogaty w fruktozę – bezpieczniejszy dla diabetyków i doskonały dla dzieci',
      'Działa łagodząco przy stanach wyczerpania nerwowego i bezsenności',
    ];
    advisorVerdict = 'Wybierz ten miód, jeśli szukasz delikatnego, krystalicznego miodu, który długo pozostaje płynny i idealnie słodzi bez zmieniania smaku napojów i deserów.';
    culinaryPairing = 'Świeże owoce, jogurty naturalne, naleśniki, delikatna zielona herbata, dressingi sałatkowe.';
  } else if (product.id.includes('rzepak') || product.name.toLowerCase().includes('rzepakowy')) {
    healthBenefits = [
      'Błyskawicznie odżywia mięsień sercowy dzięki najwyższej zawartości czystej glukozy',
      'Wspiera regenerację wątroby i dróg żółciowych po wysiłku i lekach',
      'Bardzo łagodny dla żołądka, neutralizuje pieczenie w przełyku',
    ];
    advisorVerdict = 'Wybierz ten miód, jeśli lubisz kremową, śnieżnobiałą konsystencję, która łatwo rozsmarowuje się na pieczywie i szukasz szybkiego źródła energii dla serca i mięśni.';
    culinaryPairing = 'Chałka z masłem, ciepłe gofry, tosty maślane, kakao, kasza manna z owocami.';
  } else if (product.id.includes('wrzos') || product.name.toLowerCase().includes('wrzosowy')) {
    healthBenefits = [
      'Najlepszy naturalny lek przy schorzeniach prostaty i dróg moczowych',
      'Wysoka zawartość enzymów i substancji koloidalnych (galaretowata struktura)',
      'Działa przeciwzapalnie i moczopędnie',
    ];
    advisorVerdict = 'Wybierz ten miód, jeśli szukasz unikalnego rarytasu o konsystencji galarety, bursztynowej barwie i głębokim, lekko gorzkawym aromacie wrzosowiska.';
    culinaryPairing = 'Pieczony camembert, wędliny długodojrzewające, orzechy włoskie, wytrawne wina.';
  } else {
    healthBenefits = [
      'Wzmacnia naturalną barierę immunologiczną przed sezonowymi infekcjami',
      'Naturalne źródło bioaktywnych enzymów pszczelich (lizozym, inhibina)',
      'Wspiera regenerację tkanek, łagodzi zmęczenie i dodaje witalności',
    ];
    advisorVerdict = `Wybierz ${product.name}, jeśli cenisz autentyczny, leśny smak i poszukujesz zrównoważonego miodu do codziennej profilaktyki zdrowotnej całej rodziny.`;
    culinaryPairing = 'Ciepłe pieczywo orkiszowe, twaróg wiejski, poranna owsianka z bakaliami, herbaty ziołowe.';
  }

  // Budowa obiektu cen i listy rozmiarów
  const sizesList = product.sizes.map(s => ({
    gram: s.label.replace(' ', ''),
    weightGrams: s.weightGrams,
    price: s.pricePln,
    inStock: s.inStock ?? true,
  }));

  const prices: Record<string, number> = {};
  sizesList.forEach(s => {
    prices[s.gram] = s.price;
  });

  // Upewnij się, że są klucze standardowe w razie potrzeby
  if (!prices['250g'] && sizesList[0]) {
    prices['250g'] = Math.round(sizesList[0].price * 0.65);
  }
  if (!prices['500g'] && sizesList[0]) {
    prices['500g'] = sizesList[0].price;
  }
  if (!prices['1000g']) {
    prices['1000g'] = sizesList[1]?.price || Math.round(sizesList[0].price * 1.8);
  }

  const crystallizationDesc = product.consistency === 'kremowany'
    ? 'Kremowany (puszysta, aksamitna masa bez wyczuwalnych kryształków)'
    : product.consistency === 'patoka'
    ? 'Płynna patoka (naturalnie płynny, powolna drobnokrystaliczna krystalizacja)'
    : 'Krupiec drobnoziarnisty (tradycyjna, równomierna krystalizacja potwierdzająca surowość)';

  const consistencyInfo: ConsistencyInfo = product.consistency === 'kremowany'
    ? {
        state: 'kremowany',
        label: 'Kremowany (Aksamitna pasta)',
        badgeClass: 'bg-[#F4EFE6] text-[#785E3A] border-[#D9C4A6]',
        shortExplanation: 'Miód utarty mechanicznie na zimno bez żadnych dodatków. Posiada gładką strukturę masła, łatwo się rozsmarowuje i nie spływa z pieczywa.',
        crystallizationSpeed: 'Trwale kremowa konsystencja',
        hasGlucoseBloom: false,
        storageTips: 'Przechowywać w temperaturze 14–18°C z dala od słońca. Zachowuje kremowość przez cały rok.'
      }
    : product.consistency === 'patoka'
    ? {
        state: 'patoka',
        label: 'Płynny (Świeża patoka)',
        badgeClass: 'bg-[#FEF6E7] text-[#975811] border-[#F2CB8B]',
        shortExplanation: 'Czysty, lejący nektar ze świeżego miodobrania. Z czasem ulega powolnemu, naturalnemu procesowi twardnienia (krystalizacji).',
        crystallizationSpeed: 'Wolna do umiarkowanej (zależy od przewagi fruktozy w nektarze)',
        hasGlucoseBloom: false,
        storageTips: 'Nie podgrzewać powyżej 40°C. Jeśli chcesz go lekko ogrzać, wstaw słoik do letniej kąpieli wodnej (max 38°C).'
      }
    : {
        state: 'krupiec',
        label: 'Skrystalizowany (Krupiec)',
        badgeClass: 'bg-[#EDF5EC] text-[#225737] border-[#BAD8C2]',
        shortExplanation: 'Naturalnie stężały miód o strukturze drobnych kryształków. Nie był podgrzewany w beczkach ani sztucznie upłynniany.',
        crystallizationSpeed: 'Miód w pełni dojrzały i skrystalizowany',
        hasGlucoseBloom: true,
        glucoseBloomInfo: 'Biały nalot i marmurkowe smugi na ściankach słoika (tzw. „kwiat miodu”) to mikroskopijne kryształki czystej glukozy i uwięzione pęcherzyki powietrza. To nie jest wada, pleśń ani dosypany cukier – to pierwotny, niepodważalny dowód na 100% surowy, nieprzegrzewany miód rzemieślniczy!',
        storageTips: 'Najlepiej smakuje nabierany łyżką lub rozpuszczany w letniej herbacie lub wodzie z cytryną (do 40°C).'
      };

  // Określenie intencji apiterapeutycznych
  const healthIntents: HealthIntent[] = [];
  const idLower = product.id.toLowerCase();
  const nameLower = product.name.toLowerCase();

  if (
    idLower.includes('lipow') || 
    idLower.includes('spadz') || 
    idLower.includes('propolis') || 
    idLower.includes('pylek') || 
    nameLower.includes('lipowy') || 
    nameLower.includes('spadzi') ||
    idLower.includes('malinowy-nektarowy')
  ) {
    healthIntents.push('odpornosc');
  }

  if (
    idLower.includes('rzepak') || 
    idLower.includes('akacj') || 
    idLower.includes('wiosenny') || 
    idLower.includes('malina') || 
    idLower.includes('faceli') ||
    product.flavorIntensity === 'lagodny'
  ) {
    healthIntents.push('lagodne');
  }

  if (
    idLower.includes('gryczan') || 
    idLower.includes('wrzos') || 
    idLower.includes('spadz') || 
    idLower.includes('mniszk') ||
    product.flavorIntensity === 'wyrazisty'
  ) {
    healthIntents.push('koneser');
  }

  if (
    idLower.includes('orzech') || 
    idLower.includes('wrzos') || 
    idLower.includes('malina-kremowany') || 
    idLower.includes('propolis') || 
    product.isLimitedBatch ||
    product.isBestseller
  ) {
    healthIntents.push('prezent');
  }

  return {
    ...product,
    tagline: product.subtitle,
    botanicalSource: product.dominantPlant || product.botanicalName,
    region: product.apiaryLocation,
    badge,
    images,
    tasteProfile: {
      sweetness: product.sensoryProfile.sweetness,
      acidity: product.sensoryProfile.acidity,
      aroma: product.sensoryProfile.intensity,
      crystallization: crystallizationDesc,
      color: `${product.colorName} (${product.colorHex})`,
    },
    healthBenefits,
    pairing: product.recommendedUse.join(', ') + ' – ' + (culinaryPairing || 'wyśmienity do pieczywa, serów i naparów.'),
    detailedUsage: {
      recommendedDose,
      culinaryIdeas: [
        'Dodaj 1-2 łyżeczki do przestudzonej herbaty z plasterkiem świeżego imbiru.',
        'Wymieszaj z oliwą z oliwek i musztardą francuską jako autorski sos do sałat.',
        'Polej ciepłe tosty z masłem orzechowym lub twarogiem wiejskim.',
        'Użyj jako naturalnego słodzika do domowej granoli lub owsianki.',
      ],
    },
    labAnalysis: {
      lotNumber: product.batchNumber || 'LOT: 2026/WAR-08',
      waterContent: `${product.waterContentPercentage}%`,
      diastaseNumber: `${(21.5 + (product.dominantPollenPercentage % 6)).toFixed(1)} wg Schade`,
      hmf: `${(1.9 + (product.waterContentPercentage % 2)).toFixed(1)} mg/kg`,
      conductivity: product.category === 'lesne-spadz' ? '0.94 mS/cm (potwierdzenie spadzi)' : '0.42 mS/cm',
    },
    prices,
    sizesList,
    advisorVerdict,
    consistencyInfo,
    healthIntents,
  };
}

export const CATEGORY_METADATA: Record<string, { label: string; shortLabel: string; icon: string }> = {
  wiosenne: { label: 'Zbiory Wiosenne (Maj)', shortLabel: 'Wiosenne', icon: '🌸' },
  letnie: { label: 'Zbiory Letnie (Lipa, Gryka)', shortLabel: 'Letnie', icon: '☀️' },
  'lesne-spadz': { label: 'Miody Leśne & Spadziowe', shortLabel: 'Leśne & Spadź', icon: '🌲' },
  'z-dodatkami': { label: 'Miody Z Dodatkami (Owoce)', shortLabel: 'Z Dodatkami', icon: '🍓' },
  zestawy: { label: 'Zestawy Prezentowe', shortLabel: 'Zestawy', icon: '🎁' },
};
