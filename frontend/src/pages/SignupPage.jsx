import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import LanguageSelector from '../components/LanguageSelector'
import { useLocalization } from '../i18n/LocalizationContext'

export default function SignupPage() {
  const { t, direction } = useLocalization()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await authAPI.register(name, email, password)
      localStorage.setItem('authToken', res.data.access_token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail || t('auth.signupFailed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container} dir={direction}>
      <div style={styles.card}>
        <div style={styles.languageArea}>
          <LanguageSelector compact />
        </div>
        <h1 style={styles.title}>{t('auth.createAccount')}</h1>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>{t('auth.username')}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
            required
            autoFocus
          />
          <label style={styles.label}>{t('auth.email')}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <label style={styles.label}>{t('auth.password')}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
            minLength={6}
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? t('auth.creatingAccount') : t('auth.createAccount')}
          </button>
        </form>
        <p style={styles.footer}>
          {`${t('auth.alreadyHaveAccount')} `}
          <Link to="/login" style={styles.link}>
            {t('auth.signIn')}
          </Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: '#f0f2f5',
  },
  card: {
    background: '#fff',
    padding: '2.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
    width: '100%',
    maxWidth: '380px',
  },
  title: { margin: '0 0 1.5rem', fontSize: '1.5rem' },
  languageArea: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '0.8rem',
  },
  form: { display: 'flex', flexDirection: 'column' },
  label: { fontSize: '0.875rem', fontWeight: 600, marginBottom: '4px' },
  input: {
    padding: '0.55rem 0.8rem',
    marginBottom: '1rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  button: {
    padding: '0.65rem',
    background: '#9b2fff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '0.25rem',
  },
  error: { color: '#c0392b', marginBottom: '1rem', fontSize: '0.9rem' },
  footer: { marginTop: '1.25rem', textAlign: 'center', fontSize: '0.875rem' },
  link: { color: '#9b2fff' },
}
