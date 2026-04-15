import { TRANSLATIONS } from '../frontend/src/i18n/locales.js'

function flatten(obj, prefix = '', out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      flatten(v, key, out)
    } else {
      out[key] = String(v)
    }
  }
  return out
}

const locales = ['en', 'ar', 'ja']
const flatByLocale = Object.fromEntries(locales.map((l) => [l, flatten(TRANSLATIONS[l])]))
const keys = Object.keys(flatByLocale.en).sort()
const esc = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "''")

let out = '-- I18N KEYS AND TRANSLATIONS (en/ar/ja)\n'
out += 'INSERT INTO i18n_keys (key_name) VALUES\n'
out += keys.map((k) => `(\'${esc(k)}\')`).join(',\n') + '\nON DUPLICATE KEY UPDATE key_name = VALUES(key_name);\n\n'
out += 'INSERT INTO i18n_translations (i18n_key_id, locale, translation_text)\n'
out += locales.map((locale) => {
  const body = keys
    .map((k) => `  SELECT \'${esc(k)}\' AS key_name, \'${esc(flatByLocale[locale][k])}\' AS translation_text`)
    .join('\n  UNION ALL\n')

  return `SELECT k.i18n_key_id, \'${locale}\', v.translation_text\nFROM i18n_keys k\nJOIN (\n${body}\n) v ON v.key_name = k.key_name`
}).join('\nUNION ALL\n')
out += '\nON DUPLICATE KEY UPDATE translation_text = VALUES(translation_text);\n'

console.log(out)
