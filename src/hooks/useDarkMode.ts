import { useState, useEffect } from 'react';

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('mr_mango_theme');
    if (saved) return saved === 'dark';
    return document.documentElement.classList.contains('dark') ||
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('mr_mango_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('mr_mango_theme', 'light');
    }
  }, [isDark]);

  const toggle = () => {
    setIsDark(prev => {
      const next = !prev;
      const root = document.documentElement;
      if (next) {
        root.classList.add('dark');
        localStorage.setItem('mr_mango_theme', 'dark');
      } else {
        root.classList.remove('dark');
        localStorage.setItem('mr_mango_theme', 'light');
      }
      return next;
    });
  };

  return { isDark, toggle };
}
