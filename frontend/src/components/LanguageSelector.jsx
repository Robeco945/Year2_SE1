import React from 'react'
import { useLocalization } from '../i18n/LocalizationContext'

export default function LanguageSelector({ compact = false }) {
  const { language, setLanguage, supportedLanguages, t } = useLocalization()

  return (
    <div style={{ display: 'flex', flexDirection: compact ? 'row' : 'column', gap: '6px' }}>
      <label htmlFor="language-selector" style={{ fontSize: '0.8rem', opacity: 0.9, fontWeight: 600 }}>
        {t('language.selectorLabel')}
      </label>
      <select
        id="language-selector"
        aria-label={t('language.selectorLabel')}
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        style={{
          padding: '0.45rem 0.55rem',
          borderRadius: '6px',
          border: '1px solid rgba(255,255,255,0.4)',
          background: compact ? '#fff' : 'rgba(255,255,255,0.12)',
          color: compact ? '#333' : '#fff',
          fontSize: '0.85rem',
          width: compact ? '180px' : '100%',
        }}
      >
        {supportedLanguages.map((item) => (
          <option key={item.code} value={item.code} style={{ color: '#222' }}>
            {item.nativeName} ({t(item.nameKey)})
          </option>
        ))}
      </select>
    </div>
  )
}
