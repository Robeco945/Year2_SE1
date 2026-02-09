import React, { useState, useEffect } from 'react'
import ConversationList from './components/ConversationList'
import { messageAPI } from './services/api'
import './index.css'

export default function App() {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadConversations = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await messageAPI.getConversations()
      setConversations(res.data || [])
    } catch (err) {
      console.error(err)
      setError('Failed to load conversations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadConversations()
    const interval = setInterval(loadConversations, 8000)
    return () => clearInterval(interval)
  }, [])

  const handleCreateConversation = async () => {
    try {
      await messageAPI.createConversation(['user-2'])
      await loadConversations()
    } catch (err) {
      console.error(err)
      setError('Failed to create conversation')
    }
  }

  const handleSelectConversation = (id) => {
    // For now, front page only; selection could navigate later
    console.log('selected conversation', id)
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <ConversationList
        conversations={conversations}
        activeConversationId={null}
        onSelectConversation={handleSelectConversation}
        onCreateConversation={handleCreateConversation}
      />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {loading ? (
          <p>Loading conversations...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <p style={{ color: '#666' }}>Select a conversation on the left to continue.</p>
        )}
      </div>
    </div>
  )
}
