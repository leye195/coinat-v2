import { create } from 'zustand';

// zustand

export type Theme = 'light' | 'dark';

type State = {
  theme: Theme;
};

type Action = {
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
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

// Read the theme the pre-paint inline script (in layout.tsx) already applied to
// <html>. On the client the store initializes from the real DOM state, so theme
// sync does not depend on any component (e.g. ThemeToggle) being mounted. On the
// server there is no DOM, so it falls back to 'light' (matched by the mounted
// guard in consumers to avoid a hydration mismatch).
const getInitialTheme = (): Theme =>
  typeof document !== 'undefined' &&
  document.documentElement.classList.contains('dark')
    ? 'dark'
    : 'light';

export const useThemeStore = create<State & Action>((set, get) => ({
  theme: getInitialTheme(),
  setTheme: (theme: Theme) => {
    applyTheme(theme);
    set({ theme });
  },
  toggleTheme: () => {
    const next: Theme = get().theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    set({ theme: next });
  },
}));
