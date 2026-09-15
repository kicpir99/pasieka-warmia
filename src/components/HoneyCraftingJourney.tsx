import React, { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Prevent mobile address bar show/hide from causing ScrollTrigger recalculations and page jumps
ScrollTrigger.config({
  ignoreMobileResize: true,
});

const TOTAL_FRAMES = 254;

export const HoneyCraftingJourney: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loadedImagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [isInitialReady, setIsInitialReady] = useState<boolean>(false);
  const currentFrameRef = useRef<number>(0);

  // References for text sequences
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const step4Ref = useRef<HTMLDivElement>(null);

  // Helper to get image path for frame (1-based, padded to 3 digits)
  const getFramePath = (index: number) => {
    const frameNum = (index + 1).toString().padStart(3, '0');
    return `/frames/wyrob/${frameNum}.webp`;
  };

  // Draw a frame onto canvas: full cover on desktop, crisp uncropped 1080p presentation on mobile
  const drawImageToCanvas = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgWidth = img.naturalWidth || img.width;
    const imgHeight = img.naturalHeight || img.height;

    if (!imgWidth || !imgHeight) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    // Fill full canvas with clean theme background (#141B14)
    ctx.fillStyle = '#141B14';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Check if viewport is in mobile / portrait orientation
    const isMobilePortrait = canvasWidth / canvasHeight < 1.2 || window.innerWidth < 640;

    if (!isMobilePortrait) {
      // DESKTOP LANDSCAPE: Fullscreen Cover with crisp centering
      const scale = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
      const drawWidth = imgWidth * scale;
      const drawHeight = imgHeight * scale;
      const offsetX = (canvasWidth - drawWidth) / 2;
      const offsetY = (canvasHeight - drawHeight) / 2;

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    } else {
      // MOBILE PORTRAIT: 100% UNCROPPED 16:9 FRAME
      // Width fits exactly 100% of the mobile screen - absolutely ZERO side cropping!
      // Height scales proportionally in native 16:9, leaving natural dark letterbox bands at top and bottom
      const drawWidth = canvasWidth;
      const drawHeight = (imgHeight / imgWidth) * canvasWidth;
      const offsetX = 0;
      const offsetY = (canvasHeight - drawHeight) / 2;

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }
  }, []);

  // Find the nearest loaded frame
  const getNearestLoadedFrame = useCallback((targetIndex: number): HTMLImageElement | null => {
    const images = loadedImagesRef.current;
    if (images[targetIndex]) return images[targetIndex];

    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      if (targetIndex - offset >= 0 && images[targetIndex - offset]) {
        return images[targetIndex - offset];
      }
      if (targetIndex + offset < TOTAL_FRAMES && images[targetIndex + offset]) {
        return images[targetIndex + offset];
      }
    }
    return null;
  }, []);

  const renderFrame = useCallback((targetIndex: number) => {
    currentFrameRef.current = targetIndex;
    const img = getNearestLoadedFrame(targetIndex);
    if (img && img.complete) {
      drawImageToCanvas(img);
    }
  }, [getNearestLoadedFrame, drawImageToCanvas]);

  // Load image helper
  const loadImage = (index: number): Promise<HTMLImageElement> => {
    return new Promise((resolve) => {
      if (loadedImagesRef.current[index]) {
        resolve(loadedImagesRef.current[index]!);
        return;
      }
      const img = new Image();
      img.src = getFramePath(index);
      img.onload = () => {
        loadedImagesRef.current[index] = img;
        resolve(img);
      };
      img.onerror = () => {
        resolve(img); // Continue gracefully on error
      };
    });
  };

  // Preload frames in priority passes
  useEffect(() => {
    let isCancelled = false;

    const startPreload = async () => {
      // 1. Load initial frame immediately
      const firstFrame = await loadImage(0);
      if (isCancelled) return;
      setIsInitialReady(true);
      drawImageToCanvas(firstFrame);

      // 2. Priority pass: load every 6th frame to guarantee full-length coverage instantly
      const priorityIndices: number[] = [];
      for (let i = 0; i < TOTAL_FRAMES; i += 6) {
        priorityIndices.push(i);
      }

      let loadedCount = 1;
      for (const idx of priorityIndices) {
        if (isCancelled) return;
        await loadImage(idx);
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / (priorityIndices.length + 30)) * 100));
        // Redraw if this is the current frame being viewed
        if (Math.abs(currentFrameRef.current - idx) < 4) {
          renderFrame(currentFrameRef.current);
        }
      }

      // 3. Background pass: load all remaining frames in batches of 8
      const remainingIndices: number[] = [];
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        if (!loadedImagesRef.current[i]) {
          remainingIndices.push(i);
        }
      }

      const BATCH_SIZE = 8;
      for (let i = 0; i < remainingIndices.length; i += BATCH_SIZE) {
        if (isCancelled) return;
        const batch = remainingIndices.slice(i, i + BATCH_SIZE);
        await Promise.all(batch.map(loadImage));
        loadedCount += batch.length;
        setLoadProgress(Math.min(100, Math.round((loadedCount / TOTAL_FRAMES) * 100)));
      }
    };

    startPreload();

    return () => {
      isCancelled = true;
    };
  }, [drawImageToCanvas, renderFrame]);

  // Handle Resize: ignore address bar vertical jitter on mobile phones
  useEffect(() => {
    let lastWidth = 0; // Initialize with 0 so first call ALWAYS sizes canvas properly!
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      // If width hasn't changed on mobile, ignore the address bar height change to avoid canvas recreation & jump
      if (lastWidth !== 0 && window.innerWidth < 640 && Math.abs(window.innerWidth - lastWidth) < 2) {
        return;
      }
      lastWidth = window.innerWidth;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      renderFrame(currentFrameRef.current);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [renderFrame]);

  // GSAP ScrollTrigger Setup with Smooth Interpolated Frame Scrubbing
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const frameState = { frame: 0 };

      // Main scrubbing timeline with smooth GSAP scrub
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.0, // 1.0s smooth inertia dampening (Apple style smooth scrub)
        }
      });

      // Frame scrubbing animation smoothly interpolating frameState.frame
      tl.to(frameState, {
        frame: TOTAL_FRAMES - 1,
        ease: 'none',
        duration: 1,
        onUpdate: () => {
          const targetIndex = Math.min(
            TOTAL_FRAMES - 1,
            Math.max(0, Math.round(frameState.frame))
          );
          if (targetIndex !== currentFrameRef.current) {
            renderFrame(targetIndex);
          }
        }
      }, 0);

      const isMobile = window.innerWidth < 640;
      const moveX = isMobile ? 20 : 140;
      const moveY = isMobile ? 0 : 80; // Na mobile brak pionowego przesunięcia, aby tekst nie wylatywał za górną krawędź
      const exitX = isMobile ? 16 : 90;
      const exitY = isMobile ? 0 : 40; // Na mobile brak ucieczki w górę ekranu

      // --- KROK 1: 0% - 24% (Lewa góra - wjeżdża z boku w górne pole) ---
      tl.fromTo(step1Ref.current, 
        { autoAlpha: 0, x: -moveX, y: -moveY, scale: 0.94, filter: 'blur(8px)' }, 
        { autoAlpha: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.08, ease: 'power3.out' }, 
        0.02
      )
      .to(step1Ref.current, 
        { autoAlpha: 0, x: -exitX, y: -exitY, scale: 0.96, filter: 'blur(8px)', duration: 0.06, ease: 'power2.in' }, 
        0.18
      );

      // --- KROK 2: 25% - 49% (Prawy dół - wjeżdża w dolne pole) ---
      tl.fromTo(step2Ref.current, 
        { autoAlpha: 0, x: moveX, y: moveY, scale: 0.94, filter: 'blur(8px)' }, 
        { autoAlpha: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.08, ease: 'power3.out' }, 
        0.26
      )
      .to(step2Ref.current, 
        { autoAlpha: 0, x: exitX, y: exitY, scale: 0.96, filter: 'blur(8px)', duration: 0.06, ease: 'power2.in' }, 
        0.43
      );

      // --- KROK 3: 50% - 74% (Prawa góra - wjeżdża w górne pole) ---
      tl.fromTo(step3Ref.current, 
        { autoAlpha: 0, x: moveX, y: -moveY, scale: 0.94, filter: 'blur(8px)' }, 
        { autoAlpha: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.08, ease: 'power3.out' }, 
        0.51
      )
      .to(step3Ref.current, 
        { autoAlpha: 0, x: exitX, y: -exitY, scale: 0.96, filter: 'blur(8px)', duration: 0.06, ease: 'power2.in' }, 
        0.68
      );

      // --- KROK 4: 75% - 100% (Lewy dół - wjeżdża w dolne pole) ---
      tl.fromTo(step4Ref.current, 
        { autoAlpha: 0, x: -moveX, y: moveY, scale: 0.94, filter: 'blur(8px)' }, 
        { autoAlpha: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.08, ease: 'power3.out' }, 
        0.75
      )
      .to(step4Ref.current, 
        { autoAlpha: 0, x: -exitX, y: exitY, scale: 0.96, filter: 'blur(8px)', duration: 0.06, ease: 'power2.in' }, 
        0.94
      );

    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [renderFrame]);

  return (
    <section 
      id="miodobranie"
      ref={containerRef}
      className="relative w-full h-[450vh] bg-[#141B14] text-[#FAF7F2] select-none"
    >
      {/* Sticky Fullscreen Viewport */}
      <div className="sticky top-0 w-full h-screen h-[100dvh] overflow-hidden flex items-center justify-center">
        
        {/* Canvas for ultra-smooth 60fps frame sequence rendering (block without object-cover for 1:1 pixel rendering) */}
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full block z-0 filter contrast-[1.03] saturate-[1.06]"
        />

        {/* Cinematic Vignette & Atmospheric Contrast Gradients (Subtle on mobile, deep on desktop) */}
        <div className="hidden sm:block absolute inset-0 bg-gradient-to-b from-[#111711]/90 via-transparent to-[#111711]/95 z-10 pointer-events-none" />
        <div className="hidden sm:block absolute inset-0 bg-radial-vignette from-transparent via-[#141B14]/25 to-[#0D120D]/90 z-10 pointer-events-none" />
        
        {/* Soft atmospheric glow accents in the four corners to complement cards */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#141B14]/70 blur-3xl pointer-events-none z-10" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#141B14]/70 blur-3xl pointer-events-none z-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#141B14]/70 blur-3xl pointer-events-none z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#141B14]/70 blur-3xl pointer-events-none z-10" />

        {/* Loading Pill indicator (subtle) */}
        {!isInitialReady && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30 px-5 py-2.5 rounded-full bg-[#161D16]/90 backdrop-blur-md border border-[#E0A94F]/30 text-xs text-[#FAF7F2] flex items-center gap-2.5 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-[#E0A94F] animate-ping" />
            <span className="font-medium font-serif">Przygotowywanie widoku 3D...</span>
          </div>
        )}

        {/* --- DYNAMIC STORY OVERLAYS: BLENDED INTO VIDEO (NO BOXES) --- */}
        <div className="absolute inset-0 z-30 pointer-events-none p-3 sm:p-10 md:p-14 lg:p-20">

          {/* KROK 1 (0% - 24%): LEWA GÓRA (Na mobile z komfortowym odstępem nad nagraniem) */}
          <div 
            ref={step1Ref}
            className="absolute bottom-[calc(50%+35vw)] sm:bottom-auto sm:top-32 md:top-36 lg:top-40 left-4 sm:left-12 md:left-16 lg:left-24 w-[calc(100%-2rem)] sm:w-auto sm:max-w-md md:max-w-lg lg:max-w-xl opacity-0 z-30"
          >
            <div className="relative">
              {/* Seamless Cinematic Heading */}
              <h2 className="text-xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-black text-[#FAF7F2] mb-1.5 sm:mb-3 tracking-tight leading-[1.15] [text-shadow:0_4px_24px_rgba(0,0,0,0.95),0_2px_8px_rgba(0,0,0,0.8)]">
                Prosto z <br className="hidden sm:inline" />
                <span className="text-[#E0A94F] [text-shadow:0_4px_28px_rgba(224,169,79,0.5),0_2px_12px_rgba(0,0,0,0.9)]">
                  {' '}Naszej Pasieki
                </span>
              </h2>

              {/* Seamless Body Text */}
              <p className="text-xs sm:text-base md:text-lg text-[#E8E0D2] font-normal leading-relaxed max-w-lg [text-shadow:0_2px_16px_rgba(0,0,0,0.95),0_1px_4px_rgba(0,0,0,0.9)]">
                Prawdziwy, tradycyjny miód z dzikich łąk. Niezmienny od stuleci, zrodzony w harmonii z przyrodą Warmii i Mazur.
              </p>
            </div>
          </div>

          {/* KROK 2 (25% - 49%): PRAWY DÓŁ (Na mobile z komfortowym odstępem pod nagraniem) */}
          <div 
            ref={step2Ref}
            className="absolute top-[calc(50%+35vw)] sm:top-auto sm:bottom-28 md:bottom-32 right-4 sm:right-12 md:right-16 lg:right-24 w-[calc(100%-2rem)] sm:w-auto sm:max-w-md md:max-w-lg lg:max-w-xl text-right opacity-0 z-30"
          >
            <div className="relative flex flex-col items-end">
              {/* Seamless Cinematic Heading */}
              <h2 className="text-xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-black text-[#FAF7F2] mb-1.5 sm:mb-3 tracking-tight leading-[1.15] [text-shadow:0_4px_24px_rgba(0,0,0,0.95),0_2px_8px_rgba(0,0,0,0.8)]">
                100% Surowy &amp; <br className="hidden sm:inline" />
                <span className="text-[#E0A94F] [text-shadow:0_4px_28px_rgba(224,169,79,0.5),0_2px_12px_rgba(0,0,0,0.9)]">
                  {' '}Niefiltrowany
                </span>
              </h2>

              {/* Seamless Body Text */}
              <p className="text-xs sm:text-base md:text-lg text-[#E8E0D2] font-normal leading-relaxed max-w-lg [text-shadow:0_2px_16px_rgba(0,0,0,0.95),0_1px_4px_rgba(0,0,0,0.9)]">
                Nigdy nie podgrzewamy ani nie pasteryzujemy miodu. Zachowujemy pełnię aktywnych enzymów pszczelich, mikroskładników i bioflawonoidów.
              </p>
            </div>
          </div>

          {/* KROK 3 (50% - 74%): PRAWA GÓRA (Na mobile z komfortowym odstępem nad nagraniem) */}
          <div 
            ref={step3Ref}
            className="absolute bottom-[calc(50%+35vw)] sm:bottom-auto sm:top-32 md:top-36 lg:top-40 right-4 sm:right-12 md:right-16 lg:right-24 w-[calc(100%-2rem)] sm:w-auto sm:max-w-md md:max-w-lg lg:max-w-xl text-right opacity-0 z-30"
          >
            <div className="relative flex flex-col items-end">
              {/* Seamless Cinematic Heading */}
              <h2 className="text-xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-black text-[#FAF7F2] mb-1.5 sm:mb-3 tracking-tight leading-[1.15] [text-shadow:0_4px_24px_rgba(0,0,0,0.95),0_2px_8px_rgba(0,0,0,0.8)]">
                Zbiór z <br className="hidden sm:inline" />
                <span className="text-[#E0A94F] [text-shadow:0_4px_28px_rgba(224,169,79,0.5),0_2px_12px_rgba(0,0,0,0.9)]">
                  {' '}Dzikich Łąk
                </span>
              </h2>

              {/* Seamless Body Text */}
              <p className="text-xs sm:text-base md:text-lg text-[#E8E0D2] font-normal leading-relaxed max-w-lg [text-shadow:0_2px_16px_rgba(0,0,0,0.95),0_1px_4px_rgba(0,0,0,0.9)]">
                Nasze ule stoją pośród rezerwatów i czystych lasów Świętej Lipki, z dala od autostrad, smogu i zanieczyszczeń przemysłowych.
              </p>
            </div>
          </div>

          {/* KROK 4 (75% - 100%): LEWY DÓŁ (Na mobile z komfortowym odstępem pod nagraniem) */}
          <div 
            ref={step4Ref}
            className="absolute top-[calc(50%+35vw)] sm:top-auto sm:bottom-28 md:bottom-32 left-4 sm:left-12 md:left-16 lg:left-24 w-[calc(100%-2rem)] sm:w-auto sm:max-w-md md:max-w-lg lg:max-w-xl opacity-0 z-30"
          >
            <div className="relative">
              {/* Seamless Cinematic Heading */}
              <h2 className="text-xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-black text-[#FAF7F2] mb-1.5 sm:mb-3 tracking-tight leading-[1.15] [text-shadow:0_4px_24px_rgba(0,0,0,0.95),0_2px_8px_rgba(0,0,0,0.8)]">
                Smak, Który <br className="hidden sm:inline" />
                <span className="text-[#E0A94F] [text-shadow:0_4px_28px_rgba(224,169,79,0.5),0_2px_12px_rgba(0,0,0,0.9)]">
                  {' '}Pamiętasz
                </span>
              </h2>

              {/* Seamless Body Text */}
              <p className="text-xs sm:text-base md:text-lg text-[#E8E0D2] font-normal leading-relaxed max-w-lg mb-2.5 sm:mb-5 [text-shadow:0_2px_16px_rgba(0,0,0,0.95),0_1px_4px_rgba(0,0,0,0.9)]">
                Zamknęliśmy dzikie łąki w szklanym słoju. Poczuj aromat prawdziwej pasieki na swoim stole.
              </p>

              {/* Action Link Button */}
              <div className="flex items-center gap-4">
                <a 
                  href="#katalog" 
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById('katalog');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="pointer-events-auto px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#E0A94F] text-[#161D16] font-semibold text-xs uppercase tracking-wider hover:bg-[#F2BC66] transition-all shadow-[0_4px_20px_rgba(224,169,79,0.35)] hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <span>Wybierz Miód</span>
                  <span>↓</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Floating Minimalist Chapter Indicator (Right Edge) */}
        <div className="hidden lg:flex flex-col items-center gap-3 absolute right-6 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
          <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-[#E0A94F]/40 to-transparent" />
          <span className="text-[10px] tracking-widest uppercase text-[#A8B3A8] [writing-mode:vertical-rl] rotate-180 font-medium">
            Rzemiosło Pasieczne
          </span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-[#E0A94F]/40 to-transparent" />
        </div>

        {/* Scroll Progress Bar at the bottom */}
        <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-full bg-[#121812]/90 backdrop-blur-xl border border-[#FAF7F2]/15 text-[10.5px] sm:text-xs text-[#FAF7F2] shadow-xl whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-[#E0A94F] animate-pulse" />
          <span className="font-serif tracking-wide">Przewijaj, by kontynuować podróż</span>
        </div>

      </div>
    </section>
  );
};
