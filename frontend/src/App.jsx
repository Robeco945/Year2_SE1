import React, { useState, useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import ConversationList from './components/ConversationList'
import MessageView from './components/MessageView'
import ProfileSettings from './components/ProfileSettings'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import { messageAPI, authAPI, WS_BASE_URL } from './services/api'
import { playNotificationSound } from './services/notification'
import './index.css'

// Protect routes that require login
function RequireAuth({ children }) {
  const token = localStorage.getItem('authToken')
  if (!token) return <Navigate to="/login" replace />
  return children
}

function ChatApp() {
  const navigate = useNavigate()
  const [conversations, setConversations] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [loadingConvs, setLoadingConvs] = useState(true)
  const [showNewConv, setShowNewConv] = useState(false)
  const [newParticipant, setNewParticipant] = useState('')
  const [convError, setConvError] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [lastWsMessage, setLastWsMessage] = useState(null)

  const wsRef = useRef(null)
  const reconnectTimeoutRef = useRef(null)
  const intentionalClose = useRef(false)

  const loadConversations = async () => {
    try {
      const res = await messageAPI.getConversations()
      setConversations(res.data || [])
    } catch {
      // ignore errors silently
    } finally {
      setLoadingConvs(false)
    }
  }

  const loadCurrentUser = async () => {
    try {
      const res = await authAPI.getCurrentUser()
      setCurrentUser(res.data)
    } catch {
      localStorage.removeItem('authToken')
      navigate('/login')
    }
  }

  // Initial data load (once on mount)
  useEffect(() => {
    loadCurrentUser()
    loadConversations()
  }, [])

  // Open WebSocket once we know the current user's ID
  useEffect(() => {
    if (!currentUser?.user_id) return

    const token = localStorage.getItem('authToken')
    if (!token) return

    const userId = currentUser.user_id
    intentionalClose.current = false

    const connect = () => {
      const ws = new WebSocket(`${WS_BASE_URL}/ws/${userId}?token=${token}`)
      wsRef.current = ws

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data)
          setLastWsMessage(msg)
        } catch {
          // ignore malformed frames
        }
      }

      ws.onclose = () => {
        if (!intentionalClose.current) {
          // Reconnect after 3 s if the drop was not intentional (e.g. logout)
          reconnectTimeoutRef.current = setTimeout(connect, 3000)
        }
      }

      ws.onerror = () => ws.close()
    }

    connect()

    return () => {
      intentionalClose.current = true
      clearTimeout(reconnectTimeoutRef.current)
      wsRef.current?.close()
    }
  }, [currentUser?.user_id])

  // Play a notification when a message arrives for a background conversation
  useEffect(() => {
    if (!lastWsMessage || !currentUser) return
    if (
      lastWsMessage.sender_id !== currentUser.user_id &&
      lastWsMessage.conversation_id !== activeId
    ) {
      playNotificationSound()
    }
  }, [lastWsMessage])

  const handleCreateConversation = async () => {
    const participantId = parseInt(newParticipant, 10)
    if (!participantId || isNaN(participantId)) {
      setConvError('Enter a valid user ID')
      return
    }
    setConvError(null)
    try {
      const meId = currentUser?.user_id
      const ids = meId ? [meId, participantId] : [participantId]
      const res = await messageAPI.createConversation(ids)
      await loadConversations()
      setActiveId(res.data.conversation_id)
      setShowNewConv(false)
      setNewParticipant('')
    } catch (err) {
      setConvError(err.response?.data?.detail || 'Failed to create conversation')
    }
  }

  const handleLogout = async () => {
    intentionalClose.current = true
    clearTimeout(reconnectTimeoutRef.current)
    wsRef.current?.close()
    await authAPI.logout()
    navigate('/login')
  }

  return (
  <div style={styles.appWrapper}>
    {/* LEFT COLUMN: Sidebar */}
    <aside style={styles.sideBar}>
      <div>
        <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem' }}>ChatApp</h2>
        {currentUser && (
          <div
            style={styles.profileCard}
            onClick={() => setShowSettings(true)}
            title="Open settings"
          >
            <div style={styles.sidebarAvatar}>
              {currentUser.profile_picture_url ? (
                <img src={currentUser.profile_picture_url} alt="" style={styles.sidebarAvatarImg} />
              ) : (
                <span style={styles.sidebarAvatarInitial}>
                  {(currentUser.username || '?')[0].toUpperCase()}
                </span>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>
                {currentUser.username || currentUser.user_id}
              </p>
              {currentUser.bio && (
                <p style={{ fontSize: '0.75rem', margin: '2px 0 0', opacity: 0.8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUser.bio}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div style={styles.sidebarActions}>
        <button onClick={() => setShowSettings(true)} style={styles.settingsBtn}>
          ⚙ Settings
        </button>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Log out
        </button>
      </div>
    </aside>

    {/* RIGHT COLUMN: Conversation List + Messages */}
    <main style={styles.contentArea}>
      {loadingConvs ? (
        <div style={styles.loading}>Loading conversations…</div>
      ) : (
        <ConversationList
          conversations={conversations}
          activeConversationId={activeId}
          onSelectConversation={setActiveId}
          onCreateConversation={() => setShowNewConv(true)}
        />
      )}
      <MessageView conversationId={activeId} currentUser={currentUser} wsMessage={lastWsMessage} />
    </main>

    {/* New conversation modal */}
    {showNewConv && (
      <div style={styles.overlay}>
        <div style={styles.modal}>
          <h3>New Message</h3>
          <p>Enter User ID:</p>
          <input
            type="number"
            value={newParticipant}
            onChange={(e) => setNewParticipant(e.target.value)}
            style={styles.modalInput}
            autoFocus
          />
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button onClick={() => setShowNewConv(false)} style={styles.cancelBtn}>Cancel</button>
            <button onClick={handleCreateConversation} style={styles.confirmBtn}>Start</button>
          </div>
        </div>
      </div>
    )}

    {/* Profile settings modal */}
    {showSettings && (
      <ProfileSettings
        currentUser={currentUser}
        onClose={() => setShowSettings(false)}
        onProfileUpdated={loadCurrentUser}
      />
    )}
  </div>
)
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <ChatApp />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

const styles = {
  // This is now your main wrapper for the whole app
  appWrapper: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
    fontFamily: 'sans-serif',
  },
  // This is your wide left column
  sideBar: {
    display: 'flex',
    flexDirection: 'column',
    width: '260px',           // Set your desired width here
    minWidth: '260px',        // Prevents it from shrinking
    background: '#9b2fff',
    color: '#fff',
    padding: '1.5rem',
    boxSizing: 'border-box',
    justifyContent: 'space-between', // Pushes the logout button to the bottom
  },
  logoutBtn: {
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    color: '#fff',
    padding: '0.65rem',
    borderRadius: '6px',
    cursor: 'pointer',
    width: '100%',
    fontWeight: '600',
    transition: 'background 0.2s',
  },
  settingsBtn: {
    background: 'rgba(255,255,255,0.12)',
    border: 'none',
    color: '#fff',
    padding: '0.65rem',
    borderRadius: '6px',
    cursor: 'pointer',
    width: '100%',
    fontWeight: '500',
    transition: 'background 0.2s',
    marginBottom: '0.5rem',
    fontSize: '0.9rem',
  },
  sidebarActions: {
    display: 'flex',
    flexDirection: 'column',
  },
  profileCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.6rem',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background 0.2s',
    marginTop: '0.5rem',
  },
  sidebarAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
  },
  sidebarAvatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  sidebarAvatarInitial: {
    color: '#fff',
    fontSize: '1.1rem',
    fontWeight: 600,
  },
  // Container for the rest of the chat UI
  contentArea: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  overlay: {
    position: 'fixed', // Changed from 'flex' to 'fixed' to cover the whole screen
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    background: '#fff',
    borderRadius: '8px',
    padding: '1.5rem',
    width: '90%',
    maxWidth: '400px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
  },
  // ... keep your existing modalInput, cancelBtn, etc.
}

