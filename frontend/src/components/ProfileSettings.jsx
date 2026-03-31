import React, { useState, useEffect } from 'react'
import { authAPI } from '../services/api'
import { useLocalization } from '../i18n/LocalizationContext'

export default function ProfileSettings({ currentUser, onClose, onProfileUpdated }) {
  const { t } = useLocalization()
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [profilePictureUrl, setProfilePictureUrl] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('profile')

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username || '')
      setBio(currentUser.bio || '')
      setProfilePictureUrl(currentUser.profile_picture_url || '')
    }
  }, [currentUser])

  const handleProfileSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setMessage(null)
    try {
      await authAPI.updateProfile({
        username: username || undefined,
        bio: bio,
        profile_picture_url: profilePictureUrl || null,
      })
      setMessage(t('profile.profileUpdatedSuccess'))
      if (onProfileUpdated) onProfileUpdated()
    } catch (err) {
      setError(err.response?.data?.detail || t('profile.failedUpdateProfile'))
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setError(t('profile.passwordMismatch'))
      return
    }
    if (newPassword.length < 6) {
      setError(t('profile.passwordMinLength'))
      return
    }
    setSaving(true)
    setError(null)
    setMessage(null)
    try {
      await authAPI.changePassword(currentPassword, newPassword)
      setMessage(t('profile.passwordChangedSuccess'))
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(err.response?.data?.detail || t('profile.failedChangePassword'))
    } finally {
      setSaving(false)
    }
  }

  const avatarUrl = profilePictureUrl || null

  return (
    <div style={styles.overlay}>
      <div style={styles.panel}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.headerTitle}>{t('profile.settings')}</h2>
          <button onClick={onClose} style={styles.closeBtn}>&times;</button>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'profile' ? styles.tabActive : {}),
            }}
            onClick={() => { setActiveTab('profile'); setError(null); setMessage(null) }}
          >
            {t('profile.tabProfile')}
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'password' ? styles.tabActive : {}),
            }}
            onClick={() => { setActiveTab('password'); setError(null); setMessage(null) }}
          >
            {t('profile.tabPassword')}
          </button>
        </div>

        {/* Feedback */}
        {message && <div style={styles.success}>{message}</div>}
        {error && <div style={styles.error}>{error}</div>}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSave} style={styles.form}>
            {/* Avatar preview */}
            <div style={styles.avatarSection}>
              <div style={styles.avatarCircle}>
                {avatarUrl ? (
                  <img src={avatarUrl} alt={t('profile.avatarAlt')} style={styles.avatarImg} />
                ) : (
                  <span style={styles.avatarInitial}>
                    {(username || '?')[0].toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            <label style={styles.label}>{t('profile.displayName')}</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              placeholder={t('profile.displayNamePlaceholder')}
            />

            <label style={styles.label}>{t('profile.bio')}</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              style={styles.textarea}
              placeholder={t('profile.bioPlaceholder')}
              maxLength={200}
              rows={3}
            />
            <span style={styles.charCount}>{bio.length}/200</span>

            <label style={styles.label}>{t('profile.profilePictureUrl')}</label>
            <input
              type="url"
              value={profilePictureUrl}
              onChange={(e) => setProfilePictureUrl(e.target.value)}
              style={styles.input}
              placeholder={t('profile.profilePicturePlaceholder')}
            />

            <button type="submit" style={styles.saveBtn} disabled={saving}>
              {saving ? t('profile.saving') : t('profile.saveChanges')}
            </button>
          </form>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <form onSubmit={handlePasswordChange} style={styles.form}>
            <label style={styles.label}>{t('profile.currentPassword')}</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              style={styles.input}
              required
            />

            <label style={styles.label}>{t('profile.newPassword')}</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={styles.input}
              required
              minLength={6}
            />

            <label style={styles.label}>{t('profile.confirmNewPassword')}</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
              required
              minLength={6}
            />

            <button type="submit" style={styles.saveBtn} disabled={saving}>
              {saving ? t('profile.changingPassword') : t('profile.changePassword')}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  panel: {
    background: '#fff',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '440px',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid #eee',
  },
  headerTitle: {
    margin: 0,
    fontSize: '1.2rem',
    fontWeight: 600,
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#666',
    lineHeight: 1,
    padding: '4px',
  },
  tabs: {
    display: 'flex',
    borderBottom: '1px solid #eee',
  },
  tab: {
    flex: 1,
    padding: '0.75rem',
    background: 'none',
    border: 'none',
    borderBottomWidth: '2px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'transparent',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 500,
    color: '#666',
    transition: 'all 0.2s',
  },
  tabActive: {
    color: '#9b2fff',
    borderBottomColor: '#9b2fff',
  },
  form: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
  },
  avatarSection: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1.25rem',
  },
  avatarCircle: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: '#9b2fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  avatarInitial: {
    color: '#fff',
    fontSize: '2rem',
    fontWeight: 600,
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: 600,
    marginBottom: '4px',
    color: '#444',
  },
  input: {
    padding: '0.55rem 0.75rem',
    marginBottom: '1rem',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  textarea: {
    padding: '0.55rem 0.75rem',
    marginBottom: '0.25rem',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '0.95rem',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  charCount: {
    fontSize: '0.75rem',
    color: '#999',
    textAlign: 'right',
    marginBottom: '1rem',
  },
  saveBtn: {
    padding: '0.65rem',
    background: '#9b2fff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '0.5rem',
    transition: 'background 0.2s',
  },
  success: {
    padding: '0.6rem 1rem',
    margin: '0.75rem 1.5rem 0',
    background: '#d4edda',
    color: '#155724',
    borderRadius: '6px',
    fontSize: '0.85rem',
  },
  error: {
    padding: '0.6rem 1rem',
    margin: '0.75rem 1.5rem 0',
    background: '#f8d7da',
    color: '#721c24',
    borderRadius: '6px',
    fontSize: '0.85rem',
  },
}
