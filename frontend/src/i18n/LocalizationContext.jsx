import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { SUPPORTED_LANGUAGES, TRANSLATIONS } from './locales'

const LANGUAGE_STORAGE_KEY = 'uiLanguage'
const FALLBACK_LANGUAGE = 'en'

function getTranslationByPath(dictionary, keyPath) {
  return keyPath
    .split('.')
    .reduce((node, segment) => (node && node[segment] !== undefined ? node[segment] : null), dictionary)
}

function interpolate(template, variables = {}) {
  if (typeof template !== 'string') return template
  return template.replace(/{{\s*(\w+)\s*}}/g, (_, token) => {
    const value = variables[token]
    return value === undefined || value === null ? '' : String(value)
  })
}

function buildTranslator(languageCode) {
  return (keyPath, variables = {}) => {
    const activeDictionary = TRANSLATIONS[languageCode] || TRANSLATIONS[FALLBACK_LANGUAGE]
    const fallbackDictionary = TRANSLATIONS[FALLBACK_LANGUAGE]

    const value = getTranslationByPath(activeDictionary, keyPath)
    const fallbackValue = getTranslationByPath(fallbackDictionary, keyPath)
    const resolved = value ?? fallbackValue ?? keyPath

    return interpolate(resolved, variables)
  }
}

function resolveDirection(languageCode) {
  const matched = SUPPORTED_LANGUAGES.find((item) => item.code === languageCode)
  return matched?.dir || 'ltr'
}

const defaultLanguage = FALLBACK_LANGUAGE
const defaultTranslator = buildTranslator(defaultLanguage)

const LocalizationContext = createContext({
  language: defaultLanguage,
  direction: resolveDirection(defaultLanguage),
  supportedLanguages: SUPPORTED_LANGUAGES,
  setLanguage: () => {},
  t: defaultTranslator,
  formatNumber: (value, options) => new Intl.NumberFormat(defaultLanguage, options).format(value),
  formatDate: (value, options) => new Intl.DateTimeFormat(defaultLanguage, options).format(new Date(value)),
  formatTime: (value, options) => new Intl.DateTimeFormat(defaultLanguage, {
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  }).format(new Date(value)),
})

export function LocalizationProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY)
    return SUPPORTED_LANGUAGES.some((item) => item.code === saved) ? saved : FALLBACK_LANGUAGE
  })

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
    const direction = resolveDirection(language)
    document.documentElement.lang = language
    document.documentElement.dir = direction
    document.body.setAttribute('dir', direction)
  }, [language])

  const value = useMemo(() => {
    const direction = resolveDirection(language)
    const t = buildTranslator(language)

    return {
      language,
      direction,
      supportedLanguages: SUPPORTED_LANGUAGES,
      setLanguage,
      t,
      formatNumber: (number, options) => new Intl.NumberFormat(language, options).format(number),
      formatDate: (dateValue, options) => new Intl.DateTimeFormat(language, options).format(new Date(dateValue)),
      formatTime: (dateValue, options) => new Intl.DateTimeFormat(language, {
        hour: '2-digit',
        minute: '2-digit',
        ...options,
      }).format(new Date(dateValue)),
    }
  }, [language])

  return <LocalizationContext.Provider value={value}>{children}</LocalizationContext.Provider>
}

export function useLocalization() {
  return useContext(LocalizationContext)
}
