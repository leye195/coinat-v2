import { create } from 'zustand';

// zustand

export type Theme = 'light' | 'dark';

type State = {
  theme: Theme;
};

type Action = {
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  hydrate: () => void;
};

const applyTheme = (theme: Theme) => {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.style.colorScheme = theme;

  try {
    localStorage.setItem('theme', theme);
  } catch {
    // ignore storage errors (e.g. private mode)
  }
};

export const useThemeStore = create<State & Action>((set, get) => ({
  // default matches the pre-paint inline script's fallback (light);
  // real value is synced from the DOM via hydrate() on mount.
  theme: 'light',
  setTheme: (theme: Theme) => {
    applyTheme(theme);
    set({ theme });
  },
  toggleTheme: () => {
    const next: Theme = get().theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    set({ theme: next });
  },
  hydrate: () => {
    if (typeof document === 'undefined') return;
    const theme: Theme = document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light';
    set({ theme });
  },
}));
