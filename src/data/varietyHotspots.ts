export interface VarietyHotspot {
  angle: number; // 0, 120, 240
  position: 'left' | 'right';
  verticalPos: 'top' | 'middle' | 'bottom';
  badge: string;
  category: string;
  title: string;
  description: string;
  iconName: 'droplets' | 'coffee' | 'shield' | 'heart' | 'flame' | 'trees' | 'sparkles' | 'feather' | 'zap' | 'sun' | 'leaf';
}

export const VARIETY_HOTSPOTS_MAP: Record<string, VarietyHotspot[]> = {
  lipowy: [
    {
      angle: 0,
      position: 'left',
      verticalPos: 'top',
      badge: 'Pasieka',
      category: 'Święta Lipka',
      title: 'Stare Mazurskie Aleje Lipowe',
      description: 'Pozyskiwany ze starych lip drobnolistnych wokół Świętej Lipki. Pieczęć rodzinnej pasieki i 100% czysty skład.',
      iconName: 'shield',
    },
    {
      angle: 120,
      position: 'right',
      verticalPos: 'top',
      badge: 'Na Zimno',
      category: 'RAW • Max 36°C',
      title: 'Nigdy Niepodgrzewany (RAW)',
      description: 'Wirowany wyłącznie na zimno. Zachowuje pełnię aktywnych enzymów, biopierwiastków i kojący aromat kwiatów.',
      iconName: 'droplets',
    },
    {
      angle: 240,
      position: 'left',
      verticalPos: 'bottom',
      badge: 'Rytuał',
      category: 'Czysty Nektar & Napary',
      title: 'Kojący Bukiet do Herbaty',
      description: 'Aksamitna słodycz i delikatny, żywiczny finisz. Idealny do przestudzonej herbaty ziołowej przy przeziębieniu.',
      iconName: 'sparkles',
    },
  ],

  'lipowy-warminski': [
    {
      angle: 0,
      position: 'left',
      verticalPos: 'top',
      badge: 'Pasieka',
      category: 'Święta Lipka',
      title: 'Stare Mazurskie Aleje Lipowe',
      description: 'Pozyskiwany ze starych lip drobnolistnych wokół Świętej Lipki. Pieczęć rodzinnej pasieki i 100% czysty skład.',
      iconName: 'shield',
    },
    {
      angle: 120,
      position: 'right',
      verticalPos: 'top',
      badge: 'Na Zimno',
      category: 'RAW • Max 36°C',
      title: 'Nigdy Niepodgrzewany (RAW)',
      description: 'Wirowany wyłącznie na zimno. Zachowuje pełnię aktywnych enzymów, biopierwiastków i kojący aromat kwiatów.',
      iconName: 'droplets',
    },
    {
      angle: 240,
      position: 'left',
      verticalPos: 'bottom',
      badge: 'Rytuał',
      category: 'Czysty Nektar & Napary',
      title: 'Kojący Bukiet do Herbaty',
      description: 'Aksamitna słodycz i delikatny, żywiczny finisz. Idealny do przestudzonej herbaty ziołowej przy przeziębieniu.',
      iconName: 'sparkles',
    },
  ],

  gryczany: [
    {
      angle: 0,
      position: 'left',
      verticalPos: 'top',
      badge: 'Pasieka',
      category: 'Północne Mazury',
      title: 'Mazurskie Pola Gryki',
      description: 'Ciemny, wyrazisty miód o zapachu palonego karmelu i melasy. Zbiór z tradycyjnych mazurskich pól uprawnych.',
      iconName: 'shield',
    },
    {
      angle: 120,
      position: 'right',
      verticalPos: 'top',
      badge: 'Moc',
      category: 'Rutyna i Żelazo',
      title: 'Wsparcie Serca i Krążenia',
      description: 'Gryka nasyca miód rutyną i łatwo przyswajalnym żelazem, które naturalnie wzmacniają naczynia krwionośne.',
      iconName: 'heart',
    },
    {
      angle: 240,
      position: 'left',
      verticalPos: 'bottom',
      badge: 'Kulinaria',
      category: 'Pieczywo & Piernik',
      title: 'Do Pajdy Chleba i Piernika',
      description: 'Niezastąpiony do staropolskich wypieków, ciemnych sosów oraz na grubą pajdę chrupiącego wiejskiego chleba.',
      iconName: 'flame',
    },
  ],

  'gryczany-mazurski': [
    {
      angle: 0,
      position: 'left',
      verticalPos: 'top',
      badge: 'Pasieka',
      category: 'Północne Mazury',
      title: 'Mazurskie Pola Gryki',
      description: 'Ciemny, wyrazisty miód o zapachu palonego karmelu i melasy. Zbiór z tradycyjnych mazurskich pól uprawnych.',
      iconName: 'shield',
    },
    {
      angle: 120,
      position: 'right',
      verticalPos: 'top',
      badge: 'Moc',
      category: 'Rutyna i Żelazo',
      title: 'Wsparcie Serca i Krążenia',
      description: 'Gryka nasyca miód rutyną i łatwo przyswajalnym żelazem, które naturalnie wzmacniają naczynia krwionośne.',
      iconName: 'heart',
    },
    {
      angle: 240,
      position: 'left',
      verticalPos: 'bottom',
      badge: 'Kulinaria',
      category: 'Pieczywo & Piernik',
      title: 'Do Pajdy Chleba i Piernika',
      description: 'Niezastąpiony do staropolskich wypieków, ciemnych sosów oraz na grubą pajdę chrupiącego wiejskiego chleba.',
      iconName: 'flame',
    },
  ],

  spadziowy: [
    {
      angle: 0,
      position: 'left',
      verticalPos: 'top',
      badge: 'Bory',
      category: 'Puszcza Piska',
      title: 'Skarb Puszczy Piskiej',
      description: 'Pozyskiwany w ostępach puszczańskich z igieł wiekowych świerków i jodeł. Szlachetny, rzadki i ciemny nektar lasu.',
      iconName: 'trees',
    },
    {
      angle: 120,
      position: 'right',
      verticalPos: 'top',
      badge: 'Minerały',
      category: '9x Więcej Biopierwiastków',
      title: 'Królewska Tarcza Odporności',
      description: 'Spadź iglasta zawiera 9-krotnie więcej potasu, magnezu i mikroelementów niż tradycyjne miody kwiatowe.',
      iconName: 'sparkles',
    },
    {
      angle: 240,
      position: 'left',
      verticalPos: 'bottom',
      badge: 'Bukiet',
      category: 'Leśne Igliwie',
      title: 'Żywiczny Aromat Iglasty',
      description: 'Głęboka ciemnobrunatna barwa i szlachetna, stonowana słodycz. Najlepiej smakuje powoli z drewnianej łyżeczki.',
      iconName: 'shield',
    },
  ],

  'spadz-iglastej': [
    {
      angle: 0,
      position: 'left',
      verticalPos: 'top',
      badge: 'Bory',
      category: 'Puszcza Piska',
      title: 'Skarb Puszczy Piskiej',
      description: 'Pozyskiwany w ostępach puszczańskich z igieł wiekowych świerków i jodeł. Szlachetny, rzadki i ciemny nektar lasu.',
      iconName: 'trees',
    },
    {
      angle: 120,
      position: 'right',
      verticalPos: 'top',
      badge: 'Minerały',
      category: '9x Więcej Biopierwiastków',
      title: 'Królewska Tarcza Odporności',
      description: 'Spadź iglasta zawiera 9-krotnie więcej potasu, magnezu i mikroelementów niż tradycyjne miody kwiatowe.',
      iconName: 'sparkles',
    },
    {
      angle: 240,
      position: 'left',
      verticalPos: 'bottom',
      badge: 'Bukiet',
      category: 'Leśne Igliwie',
      title: 'Żywiczny Aromat Iglasty',
      description: 'Głęboka ciemnobrunatna barwa i szlachetna, stonowana słodycz. Najlepiej smakuje powoli z drewnianej łyżeczki.',
      iconName: 'shield',
    },
  ],

  malina: [
    {
      angle: 0,
      position: 'left',
      verticalPos: 'top',
      badge: 'Sady',
      category: 'Gietrzwałd',
      title: 'Miód & Polska Malina',
      description: 'Nasz surowy miód wielokwiatowy połączony z prawdziwą liofilizowaną polską maliną. Zero aromatów i barwników.',
      iconName: 'sparkles',
    },
    {
      angle: 120,
      position: 'right',
      verticalPos: 'top',
      badge: 'Krem',
      category: 'Kremowany na Zimno',
      title: 'Puszysta, Maślana Struktura',
      description: 'Powolne napowietrzanie na zimno sprawia, że smaruje się gładko jak masło i nie spływa ze świeżego pieczywa.',
      iconName: 'droplets',
    },
    {
      angle: 240,
      position: 'left',
      verticalPos: 'bottom',
      badge: 'Rytuał',
      category: 'Śniadania & Dzieci',
      title: 'Ulubieniec do Mleka i Owsianki',
      description: 'Rozmieszaj łyżkę w letnim mleku lub owsiance — powstaje orzeźwiający, witaminowy deser o smaku letnich malin.',
      iconName: 'heart',
    },
  ],

  akacja: [
    {
      angle: 0,
      position: 'left',
      verticalPos: 'top',
      badge: 'Pożytek',
      category: 'Dolina Łyny',
      title: 'Nektar z Białej Robinii',
      description: 'Kryształowo czysty, złocisto-jasny miód z kwitnących w czerwcu mazurskich robinii akacjowych w dolinie Łyny.',
      iconName: 'feather',
    },
    {
      angle: 120,
      position: 'right',
      verticalPos: 'top',
      badge: 'Łagodność',
      category: 'Niska Kwasowość',
      title: 'Najdelikatniejszy dla Żołądka',
      description: 'Aksamitna łagodność i niska kwasowość. Wyjątkowo przyjazny dla przewodu pokarmowego oraz dla najmłodszych.',
      iconName: 'feather',
    },
    {
      angle: 240,
      position: 'left',
      verticalPos: 'bottom',
      badge: 'Patoka',
      category: 'Zioła & Napoje',
      title: 'Długo Płynny Waniliowy Bukiet',
      description: 'Wysoka zawartość fruktozy sprawia, że krystalizuje najwolniej. Słodzi napary bez zmiany naturalnego smaku ziół.',
      iconName: 'coffee',
    },
  ],

  rzepakowy: [
    {
      angle: 0,
      position: 'left',
      verticalPos: 'top',
      badge: 'Wiosna',
      category: 'Warmia Zachodnia',
      title: 'Pierwszy Zbiór Wiosenny',
      description: 'Świeże majowe miodobranie z czystych warmińskich pożytków. Łagodny, ciepły zapach budzącej się przyrody.',
      iconName: 'sun',
    },
    {
      angle: 120,
      position: 'right',
      verticalPos: 'top',
      badge: 'Energia',
      category: 'Glukoza dla Serca',
      title: 'Szybki Zastrzyk Sił',
      description: 'Ponad 50% łatwo przyswajalnej glukozy błyskawicznie odżywia mięsień sercowy i wspomaga powrót do formy.',
      iconName: 'zap',
    },
    {
      angle: 240,
      position: 'left',
      verticalPos: 'bottom',
      badge: 'Krem',
      category: 'Perłowy Krem',
      title: 'Śnieżnobiały Aksamitny Krem',
      description: 'Kremowany tuż po odwirowaniu. Ma puszystą strukturę, która natychmiast delikatnie rozpływa się w ustach.',
      iconName: 'droplets',
    },
  ],
};

export function getVarietyHotspots(varietyId: string): VarietyHotspot[] {
  const normId = varietyId.toLowerCase();
  return (
    VARIETY_HOTSPOTS_MAP[normId] ||
    VARIETY_HOTSPOTS_MAP[varietyId] ||
    VARIETY_HOTSPOTS_MAP['lipowy']
  );
}
