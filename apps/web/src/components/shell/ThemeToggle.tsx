'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useThemeStore } from '@/store/theme';

const SunIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const ThemeToggle = () => {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const hydrate = useThemeStore((state) => state.hydrate);
  const [mounted, setMounted] = useState(false);

  // Sync the store with the theme the pre-paint inline script already applied.
  useEffect(() => {
    hydrate();
    setMounted(true);
  }, [hydrate]);

  // Until mounted, the store still holds its default ('light'); render a
  // same-size placeholder to avoid an icon flip / layout shift on hydration.
  if (!mounted) {
    return <div className={cn('w-8 h-8', 'max-md:w-7 max-md:h-7')} />;
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
      title={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
      className={cn(
        'flex items-center justify-center',
        'w-8 h-8 rounded-md text-white',
        'hover:bg-white/10 transition-colors',
        'max-md:w-7 max-md:h-7',
      )}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
};

export default ThemeToggle;
