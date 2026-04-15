import { render, screen, waitFor } from '@testing-library/react'
import { LocalizationProvider, useLocalization } from './LocalizationContext'

jest.mock('../services/api', () => ({
  i18nAPI: {
    getTranslations: jest.fn(),
  },
}))

import { i18nAPI } from '../services/api'

function Probe() {
  const { t } = useLocalization()
  return <p>{t('app.brand')}</p>
}

describe('LocalizationProvider database i18n integration', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  it('uses translation text returned from backend when available', async () => {
    i18nAPI.getTranslations.mockResolvedValue({
      data: {
        locale: 'en',
        fallback_locale: 'en',
        translations: {
          'app.brand': 'DB ChatApp',
        },
      },
    })

    render(
      <LocalizationProvider>
        <Probe />
      </LocalizationProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('DB ChatApp')).toBeInTheDocument()
    })
  })

  it('falls back to static dictionary when backend call fails', async () => {
    i18nAPI.getTranslations.mockRejectedValue(new Error('network failure'))

    render(
      <LocalizationProvider>
        <Probe />
      </LocalizationProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('ChatApp')).toBeInTheDocument()
    })
  })
})
