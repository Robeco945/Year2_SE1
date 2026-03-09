import React, { useState, useEffect, useRef } from 'react'
import { messageAPI } from '../services/api'

export default function MessageView({ conversationId, currentUser, wsMessage }) {
  const [messages, setMessages] = useState([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)

  const loadMessages = async () => {
    try {
      const res = await messageAPI.getMessages(conversationId)
      setMessages(res.data || [])
      setError(null)
    } catch {
      setError('Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  // Load full history when switching conversations (no polling)
  useEffect(() => {
    if (!conversationId) return
    setLoading(true)
    setMessages([])
    loadMessages()
  }, [conversationId])

  // Append incoming WebSocket message if it belongs to the active conversation
  useEffect(() => {
    if (!wsMessage) return
    if (wsMessage.conversation_id !== conversationId) return
    setMessages((prev) => {
      // Deduplicate by message_id in case of race with initial HTTP load
      if (prev.some((m) => m.message_id === wsMessage.message_id)) return prev
      return [...prev, wsMessage]
    })
  }, [wsMessage])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!content.trim()) return
    setSending(true)
    try {
      const res = await messageAPI.sendMessage(conversationId, content.trim())
      // Append the sent message immediately — no need for a full reload
      setMessages((prev) => [...prev, res.data])
      setContent('')
    } catch {
      setError('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  if (!conversationId) {
    return (
      <div style={styles.placeholder}>
        <p>Select a conversation to start chatting</p>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.messageList}>
        {loading && <p style={styles.info}>Loading…</p>}
        {error && <p style={styles.errorText}>{error}</p>}
        {!loading && messages.length === 0 && (
          <p style={styles.info}>No messages yet. Say hello!</p>
        )}
        {messages.map((msg) => {
          const isOwn = currentUser && msg.sender_id === currentUser.user_id
          return (
            <div
              key={msg.message_id}
              style={{ ...styles.bubble, ...(isOwn ? styles.bubbleOwn : styles.bubbleOther) }}
            >
              {!isOwn && (
                <span style={styles.senderLabel}>User {msg.sender_id}</span>
              )}
              <span>{msg.content}</span>
              <span style={styles.time}>
                {new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} style={styles.inputRow}>
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={styles.input}
          placeholder="Type a message…"
          disabled={sending}
        />
        <button type="submit" style={styles.sendBtn} disabled={sending || !content.trim()}>
          Send
        </button>
      </form>
    </div>
  )
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', flex: 1, height: '100vh' },
  placeholder: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#888',
  },
  messageList: {
    flex: 1,
    overflowY: 'auto',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  bubble: {
    maxWidth: '65%',
    padding: '0.5rem 0.8rem',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    fontSize: '0.95rem',
    wordBreak: 'break-word',
  },
  bubbleOwn: {
    alignSelf: 'flex-end',
    background: '#9b2fff',
    color: '#fff',
  },
  bubbleOther: {
    alignSelf: 'flex-start',
    background: '#e8eaed',
    color: '#000',
  },
  senderLabel: { fontSize: '0.7rem', fontWeight: 600, opacity: 0.7 },
  time: { fontSize: '0.7rem', opacity: 0.65, alignSelf: 'flex-end' },
  info: { color: '#888', textAlign: 'center', marginTop: '2rem' },
  errorText: { color: '#c0392b', textAlign: 'center' },
  inputRow: {
    display: 'flex',
    padding: '0.75rem 1rem',
    borderTop: '1px solid #ddd',
    gap: '0.5rem',
    background: '#fff',
  },
  input: {
    flex: 1,
    padding: '0.55rem 0.8rem',
    border: '1px solid #ccc',
    borderRadius: '20px',
    fontSize: '1rem',
    outline: 'none',
  },
  sendBtn: {
    padding: '0.55rem 1.2rem',
    background: '#9b2fff',
    color: '#fff',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: 600,
  },
}
