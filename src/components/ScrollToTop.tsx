import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useLenis } from 'lenis/react';

// Disable browser's automatic scroll restoration immediately
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

/**
 * ScrollToTop component that resets the scroll position to the top
 * ONLY on route pathname changes (e.g., navigating between pages),
 * unless navigating to a hash anchor (e.g., #katalog).
 * Query parameter changes (search) on the same page will NEVER reset the scroll.
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
    prevPathnameRef.current = pathname;
    prevHashRef.current = hash;

    // Release body overflow in case an unmounted modal left it locked
    document.body.style.overflow = '';

    // If neither pathname nor hash changed after initial mount, do nothing
    if (!isInitialMount && !isPathnameChange && !isHashChange) {
      return;
    }

    // CASE 1: Navigating to a hash anchor (e.g., #katalog)
    if (hash) {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }

      // When arriving from a subpage, on initial mount, or with a filter note,
      // open immediately and instantly at the section without smooth scroll animation.
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

