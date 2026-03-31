import React from 'react'
import { useLocalization } from '../i18n/LocalizationContext'

export default function ConversationList({
  conversations,
  activeConversationId,
  onSelectConversation,
  onCreateConversation,
}) {
  const { t, formatDate, formatNumber } = useLocalization()

  const activeConversationValue = activeConversationId
    ? formatNumber(activeConversationId)
    : t('conversation.table.none')

  return (
    <div className="conversation-list">
      <div className="conversation-header">
        <h2>{t('conversation.header')}</h2>
        <button className="new-chat-btn" onClick={onCreateConversation} title={t('conversation.startNewConversationTitle')} style={{backgroundColor: '#9b2fff', color: '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', fontSize: '1.2rem', lineHeight: '20px', cursor: 'pointer'}}>
          +
        </button>
      </div>

      <div className="locale-preview-wrapper">
        <table className="locale-preview-table" aria-label="locale-preview-table">
          <thead>
            <tr>
              <th>{t('conversation.table.metric')}</th>
              <th>{t('conversation.table.value')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{t('conversation.table.totalConversations')}</td>
              <td>{formatNumber(conversations.length)}</td>
            </tr>
            <tr>
              <td>{t('conversation.table.activeConversation')}</td>
              <td>{activeConversationValue}</td>
            </tr>
            <tr>
              <td>{t('conversation.table.today')}</td>
              <td>{formatDate(new Date(), { dateStyle: 'medium' })}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="conversations">
        {conversations.length === 0 ? (
          <div className="empty-conversations">
            <p>{t('conversation.empty')}</p>
            <button className="btn-new" onClick={onCreateConversation}>
              {t('conversation.startConversation')}
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
                  {t('conversation.titleWithId', { id: formatNumber(conv.conversation_id) })}
                </h3>
                <p className="conversation-preview" style={{ fontSize: '0.8rem', color: '#888888' }}>
                  {t(`conversation.type.${conv.type}`)} &bull; {formatDate(conv.created_at, { dateStyle: 'medium' })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

