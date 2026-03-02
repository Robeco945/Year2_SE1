import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import ConversationList from './components/ConversationList'
import MessageView from './components/MessageView'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import { messageAPI, authAPI } from './services/api'
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

  const loadConversations = async () => {
    try {
      const res = await messageAPI.getConversations()
      setConversations(res.data || [])
    } catch {
      // ignore polling errors silently
    } finally {
      setLoadingConvs(false)
    }
  }

  const loadCurrentUser = async () => {
    try {
      const res = await authAPI.getCurrentUser()
      setCurrentUser(res.data)
    } catch {
      // token invalid — force logout
      localStorage.removeItem('authToken')
      navigate('/login')
    }
  }

  useEffect(() => {
    loadCurrentUser()
    loadConversations()
    const interval = setInterval(loadConversations, 8000)
    return () => clearInterval(interval)
  }, [])

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
          <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>
            Logged in as: <strong>{currentUser.username || currentUser.user_id}</strong>
          </p>
        )}
      </div>

      <button onClick={handleLogout} style={styles.logoutBtn}>
        Log out
      </button>
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
      <MessageView conversationId={activeId} currentUser={currentUser} />
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
    padding: '0.75rem',
    borderRadius: '6px',
    cursor: 'pointer',
    width: '100%',            // Makes button fill the sidebar width
    fontWeight: '600',
    transition: 'background 0.2s',
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

