import { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react';

const Context = createContext(null);
export const TEMALAR = ['manzara', 'sistem', 'gece'];
const isimler = { manzara: 'Manzara', sistem: 'Sistem', gece: 'Gece' };
const useBeforePaint = typeof window === 'undefined' ? useEffect : useLayoutEffect;

function read(key, values, fallback) {
  try { const value = localStorage.getItem(key); return values.includes(value) ? value : fallback; } catch { return fallback; }
}
function write(key, value) {
  try { if (value === null) localStorage.removeItem(key); else localStorage.setItem(key, value); } catch { /* Tercih bu oturumda kullanılabilir. */ }
}
function usePreference(query) {
  const [value, setValue] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const changed = () => setValue(media.matches);
    changed(); media.addEventListener('change', changed);
    return () => media.removeEventListener('change', changed);
  }, [query]);
  return value;
}

export function TemaProvider({ children }) {
  const [secim, setSecim] = useState(() => read('lifeos-tema', TEMALAR, null));
  const [hareket, setHareketState] = useState(() => read('lifeos-hareket', ['sistem', 'azalt', 'tam'], 'sistem'));
  const [yazi, setYaziState] = useState(() => read('lifeos-yazi', ['normal', 'buyuk'], 'normal'));
  const koyu = usePreference('(prefers-color-scheme: dark)');
  const sistemAzalt = usePreference('(prefers-reduced-motion: reduce)');
  const tema = secim ?? (koyu ? 'gece' : 'manzara');
  const azalt = hareket === 'azalt' || (hareket === 'sistem' && sistemAzalt);
  useBeforePaint(() => {
    const root = document.documentElement;
    root.dataset.tema = tema; root.dataset.hareket = azalt ? 'azalt' : 'tam'; root.dataset.yazi = yazi;
    root.style.colorScheme = tema === 'gece' ? 'dark' : 'light';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', { manzara: '#f6f4ee', sistem: '#faf9fd', gece: '#09090d' }[tema]);
    document.querySelector('#site-favicon')?.setAttribute('href', `${import.meta.env.BASE_URL}img/marka/lifeos-symbol${tema === 'gece' ? '' : '-ink'}.svg`);
  }, [tema, azalt, yazi]);
  useEffect(() => {
    function sync(event) {
      if (event.key === null || event.key?.startsWith('lifeos-')) {
        setSecim(read('lifeos-tema', TEMALAR, null)); setHareketState(read('lifeos-hareket', ['sistem', 'azalt', 'tam'], 'sistem')); setYaziState(read('lifeos-yazi', ['normal', 'buyuk'], 'normal'));
      }
    }
    window.addEventListener('storage', sync); return () => window.removeEventListener('storage', sync);
  }, []);
  function setTema(value) { if (value !== null && !TEMALAR.includes(value)) return; write('lifeos-tema', value); setSecim(value); }
  function setHareket(value) { if (!['sistem', 'azalt', 'tam'].includes(value)) return; write('lifeos-hareket', value); setHareketState(value); }
  function setYazi(value) { if (!['normal', 'buyuk'].includes(value)) return; write('lifeos-yazi', value); setYaziState(value); }
  return <Context.Provider value={{ tema, temaAdi: isimler[tema], setTema, otomatik: secim === null, hareket, setHareket, azalt, yazi, setYazi }}>{children}</Context.Provider>;
}

export function useTema() { return useContext(Context); }
