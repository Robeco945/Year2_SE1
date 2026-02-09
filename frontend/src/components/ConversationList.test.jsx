import { render, screen, fireEvent } from '@testing-library/react'
import ConversationList from './ConversationList'

describe('ConversationList Component', () => {
  const mockConversations = [
    {
      id: 1,
      name: 'Chat 1',
      participants: [{ id: 1, name: 'Alice' }],
      lastMessage: { content: 'Hello there', createdAt: '2026-02-10T10:00:00Z' },
      unreadCount: 2,
    },
    {
      id: 2,
      name: null,
      participants: [{ id: 2, name: 'Bob' }, { id: 3, name: 'Charlie' }],
      lastMessage: { content: 'How are you?', createdAt: '2026-02-10T09:00:00Z' },
      unreadCount: 0,
    },
  ]

  const mockProps = {
    conversations: mockConversations,
    activeConversationId: null,
    onSelectConversation: jest.fn(),
    onCreateConversation: jest.fn(),
  }

  it('renders the Messages header', () => {
    render(<ConversationList {...mockProps} />)
    expect(screen.getByText('Messages')).toBeInTheDocument()
  })

  it('renders new chat button', () => {
    render(<ConversationList {...mockProps} />)
    const newChatBtn = screen.getByTitle('Start new conversation')
    expect(newChatBtn).toBeInTheDocument()
  })

  it('displays empty state when no conversations', () => {
    render(<ConversationList {...mockProps} conversations={[]} />)
    expect(screen.getByText('No conversations yet')).toBeInTheDocument()
  })

  it('renders conversation list', () => {
    render(<ConversationList {...mockProps} />)
    expect(screen.getByText('Chat 1')).toBeInTheDocument()
    expect(screen.getByText('Bob, Charlie')).toBeInTheDocument()
  })

  it('displays conversation preview text', () => {
    render(<ConversationList {...mockProps} />)
    expect(screen.getByText('Hello there')).toBeInTheDocument()
    expect(screen.getByText('How are you?')).toBeInTheDocument()
  })

  it('shows unread badge when unreadCount > 0', () => {
    render(<ConversationList {...mockProps} />)
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('highlights active conversation', () => {
    render(<ConversationList {...mockProps} activeConversationId={1} />)
    const activeItem = screen.getByText('Chat 1').closest('.conversation-item')
    expect(activeItem).toHaveClass('active')
  })

  it('calls onSelectConversation when conversation is clicked', () => {
    render(<ConversationList {...mockProps} />)
    const conversation = screen.getByText('Chat 1').closest('.conversation-item')
    fireEvent.click(conversation)
    expect(mockProps.onSelectConversation).toHaveBeenCalledWith(1)
  })

  it('calls onCreateConversation when new chat button is clicked', () => {
    render(<ConversationList {...mockProps} />)
    const newChatBtn = screen.getByTitle('Start new conversation')
    fireEvent.click(newChatBtn)
    expect(mockProps.onCreateConversation).toHaveBeenCalled()
  })

  it('calls onCreateConversation from empty state button', () => {
    render(<ConversationList {...mockProps} conversations={[]} />)
    const startBtn = screen.getByText('Start a conversation')
    fireEvent.click(startBtn)
    expect(mockProps.onCreateConversation).toHaveBeenCalled()
  })
})
