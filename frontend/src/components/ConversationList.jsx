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
        <button className="new-chat-btn" onClick={onCreateConversation} title="Start new conversation" style={{backgroundColor: '#9b2fff', color: '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', fontSize: '1.2rem', lineHeight: '20px', cursor: 'pointer'}}>
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
              key={conv.conversation_id}
              className={`conversation-item ${
                conv.conversation_id === activeConversationId ? 'active' : ''
              }`}
              onClick={() => onSelectConversation(conv.conversation_id)}
            >
              <div className="conversation-info">
                <h3 className="conversation-title">
                  Conversation #{conv.conversation_id}
                </h3>
                <p className="conversation-preview" style={{ fontSize: '0.8rem', color: '#888888' }}>
                  {conv.type} &bull; {new Date(conv.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

