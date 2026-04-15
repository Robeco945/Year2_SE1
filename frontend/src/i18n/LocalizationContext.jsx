import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { SUPPORTED_LANGUAGES, TRANSLATIONS } from './locales'
import { i18nAPI } from '../services/api'

const LANGUAGE_STORAGE_KEY = 'uiLanguage'
const FALLBACK_LANGUAGE = 'en'

function getTranslationByPath(dictionary, keyPath) {
  if (dictionary && Object.prototype.hasOwnProperty.call(dictionary, keyPath)) {
    return dictionary[keyPath]
  }

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

function buildTranslator(languageCode, dbTranslationsByLanguage) {
  return (keyPath, variables = {}) => {
    const activeDbDictionary = dbTranslationsByLanguage[languageCode] || {}
    const fallbackDbDictionary = dbTranslationsByLanguage[FALLBACK_LANGUAGE] || {}
    const activeDictionary = TRANSLATIONS[languageCode] || TRANSLATIONS[FALLBACK_LANGUAGE]
    const fallbackDictionary = TRANSLATIONS[FALLBACK_LANGUAGE]

    const dbValue = getTranslationByPath(activeDbDictionary, keyPath)
    const dbFallbackValue = getTranslationByPath(fallbackDbDictionary, keyPath)
    const value = getTranslationByPath(activeDictionary, keyPath)
    const fallbackValue = getTranslationByPath(fallbackDictionary, keyPath)
    const resolved = dbValue ?? dbFallbackValue ?? value ?? fallbackValue ?? keyPath

    return interpolate(resolved, variables)
  }
}

function resolveDirection(languageCode) {
  const matched = SUPPORTED_LANGUAGES.find((item) => item.code === languageCode)
  return matched?.dir || 'ltr'
}

const defaultLanguage = FALLBACK_LANGUAGE
const defaultTranslator = buildTranslator(defaultLanguage, {})

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
  const [dbTranslationsByLanguage, setDbTranslationsByLanguage] = useState({})

  useEffect(() => {
    let isMounted = true

    const fetchTranslations = async (locale) => {
      if (!i18nAPI || typeof i18nAPI.getTranslations !== 'function') {
        return
      }

      try {
        const response = await i18nAPI.getTranslations(locale)
        if (!isMounted) return

        setDbTranslationsByLanguage((previous) => ({
          ...previous,
          [response.data.locale]: response.data.translations || {},
        }))
      } catch (error) {
        // Keep static fallback translations when the API is unavailable.
      }
    }

    fetchTranslations(language)
    if (language !== FALLBACK_LANGUAGE) {
      fetchTranslations(FALLBACK_LANGUAGE)
    }

    return () => {
      isMounted = false
    }
  }, [language])

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
    const direction = resolveDirection(language)
    document.documentElement.lang = language
    document.documentElement.dir = direction
    document.body.setAttribute('dir', direction)
  }, [language])

  const value = useMemo(() => {
    const direction = resolveDirection(language)
    const t = buildTranslator(language, dbTranslationsByLanguage)

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
  }, [language, dbTranslationsByLanguage])

  return <LocalizationContext.Provider value={value}>{children}</LocalizationContext.Provider>
}

export function useLocalization() {
  return useContext(LocalizationContext)
}
