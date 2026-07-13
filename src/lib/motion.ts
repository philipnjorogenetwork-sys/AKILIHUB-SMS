import { useEffect, useRef } from 'react';

type Options = {
  speed?: number; // multiplier for movement
  enabled?: boolean;
};

export function useParallax<T extends HTMLElement>({ speed = 0.3, enabled = true }: Options = {}) {
  const ref = useRef<T | null>(null);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || !ref.current) return;
    const el = ref.current;
    let boundingTop = 0;

    const onFrame = () => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerOffset = rect.top + rect.height / 2 - window.innerHeight / 2;
      const translateY = Math.max(Math.min(centerOffset * speed, 200), -200);
      el.style.transform = `translateY(${translateY}px)`;
      frame.current = requestAnimationFrame(onFrame);
    };

    const onScroll = () => {
      if (frame.current == null) frame.current = requestAnimationFrame(onFrame);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // run once
    onFrame();

    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
      window.removeEventListener('scroll', onScroll);
      if (el) el.style.transform = '';
    };
  }, [speed, enabled]);

  return ref;
}
