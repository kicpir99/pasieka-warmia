import React from 'react';
import { getAssetUrl } from '../utils/assets';

interface HoneyRibbonProps {
  varietyId?: string;
  ambientColorHex: string;
  className?: string;
  isFrontLayer?: boolean;
}

interface VarietyRibbonTheme {
  filter: string;
  glowColor: string;
  glowOpacity: number;
}

const VARIETY_THEMES: Record<string, VarietyRibbonTheme> = {
  // 1. Miód Lipowy Warmiński: klasyczny mazurski złocisty bursztyn z ciepłym, miodowym blaskiem
  lipowy: {
    filter: 'drop-shadow(0 14px 28px rgba(229,152,58,0.30)) brightness(1.0)',
    glowColor: '#E5983A',
    glowOpacity: 0.30,
  },
  'lipowy-warminski': {
    filter: 'drop-shadow(0 14px 28px rgba(229,152,58,0.30)) brightness(1.0)',
    glowColor: '#E5983A',
    glowOpacity: 0.30,
  },

  // 2. Miód Gryczany Mazurski: głęboka melasa, palony karmel i ciemny mahoń
  gryczany: {
    filter: 'drop-shadow(0 14px 28px rgba(75,35,15,0.40)) brightness(0.55) contrast(1.15) saturate(1.1) hue-rotate(-10deg)',
    glowColor: '#5C2C16',
    glowOpacity: 0.35,
  },
  'gryczany-mazurski': {
    filter: 'drop-shadow(0 14px 28px rgba(75,35,15,0.40)) brightness(0.55) contrast(1.15) saturate(1.1) hue-rotate(-10deg)',
    glowColor: '#5C2C16',
    glowOpacity: 0.35,
  },

  // 3. Miód ze Spadzi Iglastej: autentyczna leśna barwa ciemnej żywicy (ciemnobrunatno-oliwkowy)
  spadziowy: {
    filter: 'drop-shadow(0 14px 28px rgba(45,40,25,0.40)) brightness(0.45) contrast(1.2) saturate(0.7) hue-rotate(15deg) sepia(0.1)',
    glowColor: '#423D2D',
    glowOpacity: 0.35,
  },
  'spadz-iglastej': {
    filter: 'drop-shadow(0 14px 28px rgba(45,40,25,0.40)) brightness(0.45) contrast(1.2) saturate(0.7) hue-rotate(15deg) sepia(0.1)',
    glowColor: '#423D2D',
    glowOpacity: 0.35,
  },

  // 4. Miód Kremowany z Maliną Liofilizowaną: zgaszona malinowa czerwień (nie neonowa)
  malina: {
    filter: 'drop-shadow(0 14px 28px rgba(185,55,75,0.30)) brightness(0.85) contrast(1.05) saturate(1.0) hue-rotate(-25deg)',
    glowColor: '#B83A4E',
    glowOpacity: 0.30,
  },
  'wielokwiat-kremowany-malina': {
    filter: 'drop-shadow(0 14px 28px rgba(185,55,75,0.30)) brightness(0.85) contrast(1.05) saturate(1.0) hue-rotate(-25deg)',
    glowColor: '#B83A4E',
    glowOpacity: 0.30,
  },

  // 5. Miód Akacjowy Niefiltrowany: krystalicznie jasny, słoneczny nektar, przejrzyste słomkowe złoto
  akacja: {
    filter: 'drop-shadow(0 14px 28px rgba(240,215,130,0.25)) brightness(1.2) contrast(0.95) saturate(0.7)',
    glowColor: '#F3E196',
    glowOpacity: 0.25,
  },
  'akacjowy-warminski': {
    filter: 'drop-shadow(0 14px 28px rgba(240,215,130,0.25)) brightness(1.2) contrast(0.95) saturate(0.7)',
    glowColor: '#F3E196',
    glowOpacity: 0.25,
  },

  // 6. Miód Rzepakowy Kremowany: śnieżnobiały, puszysty perłowy krem miodowy, aksamitne jasne masło
  rzepakowy: {
    filter: 'drop-shadow(0 14px 28px rgba(240,230,200,0.25)) brightness(1.45) contrast(0.8) saturate(0.2)',
    glowColor: '#F5EFE0',
    glowOpacity: 0.25,
  },
  'rzepakowy-kremowany': {
    filter: 'drop-shadow(0 14px 28px rgba(240,230,200,0.25)) brightness(1.45) contrast(0.8) saturate(0.2)',
    glowColor: '#F5EFE0',
    glowOpacity: 0.25,
  },
};

/**
 * HoneyLiquidRibbon
 * Luksusowa płynna wstęga miodowa renderowana w fizycznych warstwach 3D:
 * - isFrontLayer = false: ładuje /assets/honey-ribbon-back.png (z-index: 5, za głównym słoikiem)
 * - isFrontLayer = true: ładuje /assets/honey-ribbon-front.png (z-index: 30, przed dolną krawędzią słoika)
 * - dynamicznie dostosowuje odcień, refleksy świetlne i kaustykę do wybranego gatunku miodu
 */
export const HoneyLiquidRibbon: React.FC<HoneyRibbonProps> = ({
  varietyId,
  ambientColorHex,
  className = '',
  isFrontLayer = false,
}) => {
  const imageSrc = isFrontLayer 
    ? getAssetUrl('assets/honey-ribbon-front.png') 
    : getAssetUrl('assets/honey-ribbon-back.png');

  const theme = (varietyId && VARIETY_THEMES[varietyId]) || {
    filter: `drop-shadow(0 14px 28px ${ambientColorHex}45) brightness(1.03)`,
    glowColor: ambientColorHex,
    glowOpacity: 0.40,
  };

  return (
    <div
      className={`pointer-events-none absolute left-1/2 top-[calc(50%+18px)] sm:top-[calc(50%+30px)] md:top-[calc(50%+42px)] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center select-none overflow-visible ${className}`}
      style={{
        zIndex: isFrontLayer ? 30 : 5,
      }}
    >
      <div className="relative flex items-center justify-center animate-honey-breathe overflow-visible">
        {/* Subtelna kaustyka świetlna pod wstęgą (skupiona wokół głównego słoika, nie rzuca żółtej plamy pod boczny prawy słoik) */}
        {!isFrontLayer && (
          <div 
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[250px] sm:w-[390px] md:w-[560px] h-20 sm:h-28 rounded-full blur-2xl transition-all duration-700 pointer-events-none"
            style={{
              opacity: theme.glowOpacity * 0.65,
              background: `radial-gradient(ellipse at 50% 50%, ${theme.glowColor}65 0%, ${theme.glowColor}15 55%, transparent 75%)`,
            }}
          />
        )}

        {/* Delikatny refleks na frontowej warstwie oplatającej słoik */}
        {isFrontLayer && (
          <div 
            className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 w-[200px] sm:w-[290px] md:w-[420px] h-14 sm:h-18 rounded-full blur-xl transition-all duration-700 pointer-events-none"
            style={{
              opacity: theme.glowOpacity * 0.65,
              background: `radial-gradient(ellipse at 50% 50%, ${theme.glowColor}50 0%, transparent 70%)`,
            }}
          />
        )}

        {/* Warstwa wstęgi miodowej (Front lub Back) z płynną animacją zmiany barwy w czasie rzeczywistym - idealnie wycentrowana */}
        <img
          src={imageSrc}
          alt={isFrontLayer ? "Miodowa wstęga - przód" : "Miodowa wstęga - tło"}
          loading="eager"
          decoding="async"
          className="w-[440px] sm:w-[670px] md:w-[1080px] lg:w-[1140px] max-w-none h-auto object-contain pointer-events-none select-none translate-y-1"
          style={{
            filter: theme.filter,
            transition: 'filter 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            willChange: 'filter, transform'
          }}
        />
      </div>
    </div>
  );
};
