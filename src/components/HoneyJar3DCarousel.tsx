import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Repeat } from 'lucide-react';
import { VarietyItem } from './Hero';
import { FramelessJar360Viewer } from './FramelessJar360Viewer';

import { HoneyLiquidRibbon } from './HoneyLiquidRibbon';

interface HoneyJar3DCarouselProps {
  varieties: VarietyItem[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  onAddToCart?: () => void;
  onOpenDetails?: () => void;
  onAngleChange?: (degrees: number) => void;
  targetAnglePreset?: number | null;
}

/**
 * Standard Linear Interpolation (lerp)
 */
const lerp = (start: number, end: number, factor: number): number => {
  return start + (end - start) * factor;
};

/**
 * Calculates shortest angular distance on a modular circle of length `total`
 */
const getShortestAngularDiff = (current: number, target: number, total: number): number => {
  const currentMod = ((current % total) + total) % total;
  let diff = target - currentMod;
  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;
  return diff;
};

export const HoneyJar3DCarousel: React.FC<HoneyJar3DCarouselProps> = ({
  varieties,
  selectedIndex,
  onSelectIndex,
  onAddToCart,
  onOpenDetails,
  onAngleChange,
  targetAnglePreset,
}) => {
  const total = varieties.length;

  // DOM Refs
  const stageRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const jarItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const popupsPortalTargetRef = useRef<HTMLDivElement>(null);
  const backRibbonRef = useRef<HTMLDivElement>(null);
  const frontRibbonRef = useRef<HTMLDivElement>(null);

  // 3D Carousel Physics & Lerp State Refs (Decoupled from React render cycle)
  const currentProgressRef = useRef<number>(selectedIndex);
  const targetProgressRef = useRef<number>(selectedIndex);
  const rafIdRef = useRef<number | null>(null);

  // Hover states for background orbiting jars
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const hoveredIndexRef = useRef<number | null>(null);
  hoveredIndexRef.current = hoveredIndex;

  // Active center index state for conditional interactive viewer mounting
  const [renderedActiveIndex, setRenderedActiveIndex] = useState<number>(selectedIndex);

  // Update target progress when selectedIndex changes externally (e.g. from bottom bar or quiz)
  useEffect(() => {
    const diff = getShortestAngularDiff(currentProgressRef.current, selectedIndex, total);
    targetProgressRef.current = currentProgressRef.current + diff;
    setRenderedActiveIndex(selectedIndex);
  }, [selectedIndex, total]);

  // Handle direct navigation to target index
  const navigateToIndex = useCallback((index: number) => {
    const nextIdx = ((index % total) + total) % total;
    const diff = getShortestAngularDiff(currentProgressRef.current, nextIdx, total);
    targetProgressRef.current = currentProgressRef.current + diff;
    onSelectIndex(nextIdx);
  }, [total, onSelectIndex]);

  const handlePrev = useCallback(() => {
    navigateToIndex(selectedIndex - 1);
  }, [navigateToIndex, selectedIndex]);

  const handleNext = useCallback(() => {
    navigateToIndex(selectedIndex + 1);
  }, [navigateToIndex, selectedIndex]);

  // Main 60 FPS requestAnimationFrame loop with Linear/Exponential Lerp
  useEffect(() => {
    let lastTime = performance.now();
    let isVisible = !document.hidden;
    let hasSettled = false;
    let lastHovered: number | null = null;

    const handleVisibility = () => {
      isVisible = !document.hidden;
      if (isVisible) {
        lastTime = performance.now();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined' && stageRef.current) {
      observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          isVisible = entry.isIntersecting && !document.hidden;
          if (isVisible) {
            lastTime = performance.now();
          }
        }
      }, { threshold: 0.05 });
      observer.observe(stageRef.current);
    }

    const tick = (now: number) => {
      rafIdRef.current = requestAnimationFrame(tick);

      if (!isVisible) {
        lastTime = now;
        return;
      }

      // Safe delta time clamped between 1ms and 50ms
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      // Precise Frame-Rate Independent Exponential Lerp towards target
      const diff = targetProgressRef.current - currentProgressRef.current;
      const currentHovered = hoveredIndexRef.current;
      const isMoving = Math.abs(diff) > 0.0001;
      const hoverChanged = currentHovered !== lastHovered;

      if (!isMoving && !hoverChanged && hasSettled) {
        return;
      }

      if (isMoving) {
        const lerpSpeed = 11.0; // Responsive, smooth spring transition
        const lerpFactor = 1 - Math.exp(-lerpSpeed * dt);
        currentProgressRef.current = lerp(currentProgressRef.current, targetProgressRef.current, lerpFactor);
        hasSettled = false;
      } else {
        currentProgressRef.current = targetProgressRef.current;
        if (!hoverChanged) {
          hasSettled = true;
        }
      }
      lastHovered = currentHovered;

      const progress = currentProgressRef.current;
      const stageWidth = stageRef.current ? stageRef.current.clientWidth : 800;
      
      // Responsive 3D orbital parameters based on viewport width
      const isMobile = stageWidth < 640;
      const isTablet = stageWidth < 1024;
      const orbitRadiusX = isMobile ? stageWidth * 0.30 : isTablet ? 298 : 338;
      const maxRotateY = isMobile ? 10 : 18;

      // 2. Compute 3D Cylindrical / Orbital Spatial Transformations for every jar slot via Lerp
      varieties.forEach((item, index) => {
        const el = jarItemRefs.current[index];
        if (!el) return;

        // Normalized relative offset delta: delta = 0 for active center, -1 for left orbit, +1 for right orbit
        let delta = index - progress;
        // Wrap delta to shortest circular distance [-total/2, total/2]
        delta = ((delta % total) + total) % total;
        if (delta > total / 2) delta -= total;

        const absDelta = Math.abs(delta);

        // Discard or hide items beyond immediate orbital field (|delta| > 1.45)
        if (absDelta > 1.45) {
          el.style.visibility = 'hidden';
          el.style.opacity = '0';
          el.style.pointerEvents = 'none';
          el.style.transform = 'translate3d(-50%, -50%, 0) scale(0.001)';
          return;
        }

        el.style.visibility = 'visible';

        // 3D Orbital Trajectory Math
        // X Position: smooth sinusoidal orbital spread
        const posX = Math.sin(delta * (Math.PI / 2.2)) * orbitRadiusX;
        
        // 3D Orbital Y-Axis Rotation: rotates subtly towards the center focal point
        const rotateY = -delta * maxRotateY;

        // Scale: Center active jar is ~0.78 on mobile / 1.04 on desktop; background jars scale down smoothly
        let scale = absDelta < 0.25 
          ? (isMobile ? 0.78 : 1.04) - absDelta * (isMobile ? 0.20 : 0.35)
          : (isMobile ? 0.50 : 0.70);

        // Opacity & Layering:
        // Wszystkie słoiki (zarówno boczny lewy, boczny prawy jak i główny) stoją PRZED tylną wstęgą (z-index: 5).
        // Słoiki boczne mają zIndex 15 (lub 18 na hoverze), a główny słoik ma zIndex 25.
        // Przednia wstęga (front) leży na samym wierzchu (zIndex: 30) przed dolną podstawą głównego słoika.
        const isHovered = hoveredIndexRef.current === index;
        let posY = 0;
        // Pełna, nasycona nieprzezroczystość (opacity 1.0) dla bocznych słoików, aby tylna wstęga NIE prześwitywała przez szkło ani etykiety!
        let opacity = 1.0;
        let blurAmount = 0;
        let zIndex = absDelta < 0.3 ? 25 : 15;

        // Subtelne uniesienie głównego słoika dla pełnej ekspozycji etykiety oraz levitation dla hoverowanych słoików
        if (absDelta < 0.25) {
          posY = isMobile ? -2 : -8;
        } else if (isHovered) {
          posY = isMobile ? -10 : -24; // Smooth levitation lift in 3D
          scale = isMobile ? 0.60 : 0.82; // Expands symmetrically on hover
          zIndex = 20; // Słoiki boczne są ZAWSZE w warstwie pomiędzy tyłem (z-index: 5) a przodem (z-index: 30) miodowej wstęgi (kokardy)
        }

        // Hardware-Accelerated 3D Transform write directly to DOM node (keeping posZ = 0 for rock-solid click & hover hit testing)
        el.style.transform = `translate3d(calc(-50% + ${posX.toFixed(2)}px), calc(-50% + ${posY.toFixed(2)}px), 0px) rotateY(${rotateY.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
        el.style.opacity = opacity.toFixed(3);
        el.style.filter = blurAmount > 0.1 ? `blur(${blurAmount.toFixed(1)}px)` : 'none';
        el.style.zIndex = String(zIndex);
        el.style.pointerEvents = absDelta < 0.25 ? 'none' : 'auto';
      });

      // 2b. Synchronize Popups Portal Overlay and Liquid Ribbons with Active Center Jar
      if (popupsPortalTargetRef.current) {
        let activeDelta = selectedIndex - progress;
        activeDelta = ((activeDelta % total) + total) % total;
        if (activeDelta > total / 2) activeDelta -= total;
        popupsPortalTargetRef.current.style.opacity = Math.abs(activeDelta) > 0.35 ? '0' : '1';
        
        // Płynne zanikanie (fade-out) wstęg miodowych podczas obrotu karuzeli,
        // co rozwiązuje problem przenikania bocznych słoików (clipping) przez warstwy front/back.
        if (backRibbonRef.current && frontRibbonRef.current) {
          const ribbonOpacity = Math.max(0, 1 - Math.abs(activeDelta) * 4).toFixed(2);
          backRibbonRef.current.style.opacity = ribbonOpacity;
          frontRibbonRef.current.style.opacity = ribbonOpacity;
        }
      }

      // 3. Update Ambient Backdrop Glow color and intensity
      if (glowRef.current) {
        const currentActiveItem = varieties[selectedIndex];
        if (currentActiveItem) {
          glowRef.current.style.background = `radial-gradient(circle at 50% 50%, ${currentActiveItem.ambientToneHex}55 0%, transparent 68%)`;
        }
      }
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      if (observer) observer.disconnect();
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [varieties, selectedIndex, total, onSelectIndex]);

  const currentItem = varieties[selectedIndex];
  const prevIndex = (selectedIndex - 1 + total) % total;
  const nextIndex = (selectedIndex + 1) % total;

  return (
    <div className="relative w-full flex items-center justify-center py-1 sm:py-2 px-1 select-none overflow-hidden sm:overflow-visible">
      {/* 3D ORBITAL STAGE CONTAINER WITH HARDWARE-ACCELERATED PERSPECTIVE */}
      <div 
        ref={stageRef}
        className="relative w-full max-w-[940px] h-[300px] sm:h-[570px] md:h-[620px] flex items-center justify-center overflow-visible"
        style={{ 
          perspective: '1200px',
          perspectiveOrigin: '50% 50%',
        }}
      >
        {/* ATMOSPHERIC RADIAL AMBIENT GLOW BEHIND 3D CAROUSEL */}
        <div 
          ref={glowRef}
          className="absolute inset-0 pointer-events-none transition-all duration-700 blur-3xl opacity-45 -z-10"
        />

        {/* LIQUID HONEY RIBBON - TYLNA GŁÓWNA STRUGI MIODU ŁĄCZĄCA SŁOIKI W KARUZELI */}
        <div ref={backRibbonRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
          <HoneyLiquidRibbon
            varietyId={currentItem.id}
            ambientColorHex={currentItem.ambientToneHex}
            isFrontLayer={false}
          />
        </div>

        {/* 3D ORBITAL JARS (Rendered in continuous 3D Space via RAF Lerp Engine) */}
        {varieties.map((variety, idx) => {
          const isActive = idx === selectedIndex;
          const isLeft = idx === prevIndex;
          const isRight = idx === nextIndex;

          return (
            <div
              key={variety.id}
              ref={(el) => (jarItemRefs.current[idx] = el)}
              onMouseEnter={() => {
                if (!isActive) setHoveredIndex(idx);
              }}
              onMouseLeave={() => {
                if (!isActive) setHoveredIndex(null);
              }}
              onClick={(e) => {
                if (!isActive) {
                  e.stopPropagation();
                  navigateToIndex(idx);
                }
              }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '100%',
                willChange: 'transform, opacity, filter',
                cursor: isActive ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: isActive ? 'none' : 'auto',
                touchAction: 'none',
              }}
              className="origin-center overflow-visible max-w-[220px] sm:max-w-[460px]"
            >
              <div 
                className={`relative w-full flex items-center justify-center no-drag overflow-visible ${isActive ? 'pointer-events-none' : 'pointer-events-auto cursor-pointer'}`}
                data-frameless-360-stage="true"
                onClick={isActive ? undefined : (e) => {
                  e.stopPropagation();
                  navigateToIndex(idx);
                }}
              >
                {/* Glow & Info overlay for inactive (side) jars on hover */}
                {!isActive && (
                  <div
                    className={`absolute inset-0 pointer-events-none transition-all duration-700 ease-out z-0 ${
                      hoveredIndex === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    }`}
                  >
                    {/* Atmospheric Glow */}
                    <div 
                      className="absolute inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] blur-[64px] opacity-70 rounded-full"
                      style={{ background: variety.ambientToneHex }}
                    />
                  </div>
                )}
                
                <div className="relative z-10 w-full pointer-events-none">
                  <FramelessJar360Viewer
                    varietyId={variety.id}
                    varietyName={variety.product.name}
                    ambientToneHex={variety.ambientToneHex}
                    defaultVideoUrl={variety.defaultVideoUrl}
                    editorialTiltEnabled={isActive}
                    targetAnglePreset={isActive ? targetAnglePreset : null}
                    onAngleChange={isActive ? onAngleChange : undefined}
                    onAddToCart={isActive ? onAddToCart : undefined}
                    onOpenDetails={isActive ? onOpenDetails : undefined}
                    isActive={isActive}
                  />
                </div>
              </div>
            </div>
          );
        })}

        {/* LIQUID HONEY RIBBON - PRZEDNIA DOLNA WARSTWA OPLATAJĄCA SŁOIK OD FRONTU */}
        <div ref={frontRibbonRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 30 }}>
          <HoneyLiquidRibbon
            varietyId={currentItem.id}
            ambientColorHex={currentItem.ambientToneHex}
            isFrontLayer={true}
          />
        </div>

        {/* DEDICATED POPUP OVERLAY STAGE (Z-INDEX: 60) */}
        {/* Wyrenderowane bezpośrednio nad przednią wstęgą - gwarantuje, że wyskakujące pop-upy (karty) są w 100% na pierwszym planie */}
        <div
          ref={popupsPortalTargetRef}
          id="jar-popups-portal-target"
          className="pointer-events-none absolute inset-0 w-full h-full"
          style={{ zIndex: 60 }}
        />

        {/* WIDE-STANCE FLOATING NAVIGATION CHEVRONS */}
        <button
          onClick={handlePrev}
          aria-label="Poprzedni miód w karuzeli 3D (obrót w lewo)"
          title={`Przejdź do: ${varieties[prevIndex].product.name}`}
          className="absolute left-1 sm:-left-6 md:-left-10 lg:-left-12 xl:-left-16 z-50 w-9 h-9 sm:w-14 sm:h-14 rounded-full bg-[#160F0A]/90 hover:bg-[#2A1E14] text-[#D8C7B5] hover:text-[#FAF5ED] border-2 border-[#523F2D]/90 hover:border-[#E5983A] backdrop-blur-md shadow-[0_16px_36px_rgba(0,0,0,0.85)] flex items-center justify-center transition-all duration-200 active:scale-90 hover:scale-110 group cursor-pointer no-drag pointer-events-auto"
        >
          <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7 group-hover:-translate-x-1 transition-transform text-[#FAF5ED]" />
        </button>

        <button
          onClick={handleNext}
          aria-label="Następny miód w karuzeli 3D (obrót w prawo)"
          title={`Przejdź do: ${varieties[nextIndex].product.name}`}
          className="absolute right-1 sm:-right-6 md:-right-10 lg:-right-12 xl:-right-16 z-50 w-9 h-9 sm:w-14 sm:h-14 rounded-full bg-[#160F0A]/90 hover:bg-[#2A1E14] text-[#D8C7B5] hover:text-[#FAF5ED] border-2 border-[#523F2D]/90 hover:border-[#E5983A] backdrop-blur-md shadow-[0_16px_36px_rgba(0,0,0,0.85)] flex items-center justify-center transition-all duration-200 active:scale-90 hover:scale-110 group cursor-pointer no-drag pointer-events-auto"
        >
          <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7 group-hover:translate-x-1 transition-transform text-[#FAF5ED]" />
        </button>
      </div>

      {/* PRZYCISK / PODPOWIEDŹ OBROTU 360° - Widoczny na tabletach i komputerach, ukryty na mobile */}
      <div 
        className="absolute sm:-bottom-8 md:-bottom-10 left-1/2 -translate-x-1/2 z-[70] hidden sm:flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-[#18120D]/95 backdrop-blur-md border border-[#524131]/90 text-[10px] sm:text-xs text-[#FAF5ED] pointer-events-none shadow-[0_8px_24px_rgba(0,0,0,0.8),0_0_16px_rgba(229,152,58,0.25)] whitespace-nowrap select-none transition-all duration-300"
      >
        <Repeat className="w-3.5 h-3.5 text-[#E5983A]" />
        <span className="tracking-wide">Przeciągnij słoik, aby obrócić go 360°</span>
      </div>
    </div>
  );
};
