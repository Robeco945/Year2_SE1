import React from 'react'

export default function ConversationList({
  conversations,
  activeConversationId,
  onSelectConversation,
  onCreateConversation,
}) {
  return (
    <div className="conversation-list">
      <div className="conversation-header">
        <h2>Messages</h2>
        <button className="new-chat-btn" onClick={onCreateConversation} title="Start new conversation">
          +
        </button>
      </div>

      <div className="conversations">
        {conversations.length === 0 ? (
          <div className="empty-conversations">
            <p>No conversations yet</p>
            <button className="btn-new" onClick={onCreateConversation}>
              Start a conversation
            </button>
          </div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              className={`conversation-item ${
                conv.id === activeConversationId ? 'active' : ''
              }`}
              onClick={() => onSelectConversation(conv.id)}
            >
              <div className="conversation-info">
                <h3 className="conversation-title">
                  {conv.name || conv.participants.map((p) => p.name).join(', ')}
                </h3>
                <p className="conversation-preview">
                  {conv.lastMessage?.content || 'No messages yet'}
                </p>
              </div>
              <div className="conversation-meta">
                <span className="conversation-time">
                  {conv.lastMessage
                    ? new Date(conv.lastMessage.createdAt).toLocaleDateString()
                    : ''}
                </span>
                {conv.unreadCount > 0 && (
                  <span className="unread-badge">{conv.unreadCount}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
