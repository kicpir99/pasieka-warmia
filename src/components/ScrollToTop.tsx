import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useLenis } from 'lenis/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Disable browser's automatic scroll restoration immediately
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

/**
 * ScrollToTop component:
 * - When navigating to /produkt/:id: resets scroll to top (0).
 * - When returning from /produkt/:id back to /: remembers and restores the exact
 *   scroll position of the visited honey product card in Section 3, taking into account
 *   Section 2's interactive 450vh scrubbing layout, with multi-frame layout sync and
 *   GSAP ScrollTrigger updates.
 * - When clicking a hash anchor (#katalog, #miodobranie): scrolls to the anchor.
 */
export const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();
  const lenis = useLenis();
  const prevPathnameRef = useRef<string | null>(null);
  const prevHashRef = useRef<string | null>(null);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useLayoutEffect(() => {
    const isInitialMount = prevPathnameRef.current === null;
    const isPathnameChange = prevPathnameRef.current !== pathname;
    const isHashChange = prevHashRef.current !== hash;
    const previousPathname = prevPathnameRef.current;
    prevPathnameRef.current = pathname;
    prevHashRef.current = hash;

    // Release body overflow in case an unmounted modal left it locked
    document.body.style.overflow = '';

    // If neither pathname nor hash changed after initial mount, do nothing
    if (!isInitialMount && !isPathnameChange && !isHashChange) {
      return;
    }

    // SPECIAL CASE: Returning to home page from a product subpage (/produkt/:id -> /)
    const isReturningToHomeFromProduct = Boolean(
      previousPathname?.startsWith('/produkt/') && (pathname === '/' || pathname === '')
    );

    if (isReturningToHomeFromProduct) {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }

      const fromHero = sessionStorage.getItem('pasieka_from_hero') === 'true';
      if (fromHero) {
        sessionStorage.removeItem('pasieka_from_hero');
        const resetScroll = () => {
          if (lenis) {
            lenis.scrollTo(0, { immediate: true, force: true });
            lenis.resize();
          }
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        };
        resetScroll();
        return;
      }

      const lastProductId = sessionStorage.getItem('pasieka_last_product_id') || 
        previousPathname?.replace('/produkt/', '').split('?')[0].split('#')[0];

      const restoreScrollPosition = () => {
        let targetY: number | null = null;
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop || (lenis ? lenis.scroll : 0);

        const cardEl = lastProductId ? document.getElementById(`produkt-karta-${lastProductId}`) : null;
        if (cardEl) {
          const rect = cardEl.getBoundingClientRect();
          // Leave 110px top offset for sticky header clearance and comfortable breathing room
          targetY = Math.max(0, rect.top + currentScroll - 110);
        } else {
          const catalogEl = document.getElementById('katalog');
          if (catalogEl) {
            targetY = Math.max(0, catalogEl.getBoundingClientRect().top + currentScroll - 80);
          } else {
            const savedY = sessionStorage.getItem('pasieka_home_scroll_y');
            if (savedY) targetY = parseFloat(savedY);
          }
        }

        if (targetY !== null && !isNaN(targetY)) {
          window.scrollTo({ top: targetY, left: 0, behavior: 'instant' });
          document.documentElement.scrollTop = targetY;
          document.body.scrollTop = targetY;
          if (lenis) {
            lenis.resize();
            lenis.scrollTo(targetY, { immediate: true, force: true });
          }
          ScrollTrigger.update();
        }
      };

      const highlightProductCard = () => {
        if (!lastProductId) return;
        const cardEl = document.getElementById(`produkt-karta-${lastProductId}`);
        if (cardEl) {
          cardEl.classList.add('ring-2', 'ring-[#E0A94F]', 'ring-offset-2', 'shadow-xl');
          setTimeout(() => {
            cardEl.classList.remove('ring-2', 'ring-[#E0A94F]', 'ring-offset-2', 'shadow-xl');
          }, 2200);
        }
      };

      // 1. Immediate sync execution before paint
      restoreScrollPosition();

      // 2. Progressive multi-pass alignment to account for Section 2 (HoneyCraftingJourney) layout settling
      const raf1 = requestAnimationFrame(restoreScrollPosition);
      const raf2 = requestAnimationFrame(() => requestAnimationFrame(restoreScrollPosition));
      const t1 = setTimeout(restoreScrollPosition, 40);
      const t2 = setTimeout(restoreScrollPosition, 120);
      const t3 = setTimeout(() => {
        restoreScrollPosition();
        highlightProductCard();
      }, 250);
      const t4 = setTimeout(restoreScrollPosition, 450);
      const t5 = setTimeout(() => {
        restoreScrollPosition();
        ScrollTrigger.refresh();
      }, 700);

      return () => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
        clearTimeout(t5);
      };
    }

    // CASE 1: Navigating to a hash anchor (e.g., #katalog, #miodobranie)
    if (hash) {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }

      const isInstant = isInitialMount || isPathnameChange || search.includes('nuta=');

      const jumpToTarget = () => {
        const el = document.querySelector(hash);
        if (el instanceof HTMLElement) {
          const currentScroll = window.pageYOffset || document.documentElement.scrollTop || (lenis ? lenis.scroll : 0);
          const topOffset = Math.max(0, el.getBoundingClientRect().top + currentScroll - 80);

          if (isInstant) {
            window.scrollTo({ top: topOffset, left: 0, behavior: 'instant' });
            document.documentElement.scrollTop = topOffset;
            document.body.scrollTop = topOffset;
            if (lenis) {
              lenis.resize();
              lenis.scrollTo(topOffset, { immediate: true, force: true });
            }
          } else {
            if (lenis) {
              lenis.resize();
              lenis.scrollTo(el, { offset: -80, immediate: false, duration: 0.8 });
            } else {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }
      };

      if (lenis) {
        lenis.resize();
      }

      // Execute immediately before browser paint
      jumpToTarget();

      const raf1 = requestAnimationFrame(jumpToTarget);
      const raf2 = requestAnimationFrame(() => requestAnimationFrame(jumpToTarget));
      const t1 = setTimeout(jumpToTarget, 30);
      const t2 = setTimeout(jumpToTarget, 100);
      const t3 = setTimeout(jumpToTarget, 250);

      return () => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }

    // CASE 2: Route pathname changed without a hash anchor (e.g., opening a product page)
    if (isPathnameChange) {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }

      const resetScroll = () => {
        if (lenis) {
          lenis.scrollTo(0, { immediate: true, force: true });
          lenis.resize();
        }
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      };

      // Immediate synchronous reset before paint
      resetScroll();

      const raf1 = requestAnimationFrame(resetScroll);
      const raf2 = requestAnimationFrame(() => {
        requestAnimationFrame(resetScroll);
      });
      const t1 = setTimeout(resetScroll, 30);
      const t2 = setTimeout(resetScroll, 100);
      const t3 = setTimeout(resetScroll, 250);

      return () => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [pathname, hash, lenis]);

  return null;
};


