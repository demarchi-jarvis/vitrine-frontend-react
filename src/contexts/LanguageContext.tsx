'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations, type Lang } from '@/i18n';

const STORAGE_KEY = 'vitrine_lang';
const DEFAULT_LANG: Lang = 'pt';
const VALID_LANGS: Lang[] = ['pt', 'en', 'es'];

// Use a structural type that covers all three language objects
type TranslationShape = typeof translations[Lang];

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: TranslationShape;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang') as Lang | null;
    const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
    const resolved =
      urlLang && VALID_LANGS.includes(urlLang)
        ? urlLang
        : stored && VALID_LANGS.includes(stored)
        ? stored
        : DEFAULT_LANG;
    setLangState(resolved);
    if (urlLang) localStorage.setItem(STORAGE_KEY, resolved);
  }, []);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem(STORAGE_KEY, newLang);
    const url = new URL(window.location.href);
    url.searchParams.set('lang', newLang);
    window.history.replaceState({}, '', url.toString());
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useTranslation must be used inside LanguageProvider');
  return ctx;
}
