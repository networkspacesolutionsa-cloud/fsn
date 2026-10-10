import { useEffect } from 'react';

// Prevents the page behind an open drawer/modal from scrolling (important on touch devices).
export const useLockBodyScroll = (locked: boolean) => {
  useEffect(() => {
    if (!locked) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [locked]);
};
