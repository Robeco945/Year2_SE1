import { render, screen, fireEvent } from '@testing-library/react'
import ConversationList from './ConversationList'

describe('ConversationList Component', () => {
  const mockConversations = [
    {
      conversation_id: 1,
      type: 'private',
      created_at: '2026-02-10T10:00:00Z',
    },
    {
      conversation_id: 2,
      type: 'group',
      created_at: '2026-02-10T09:00:00Z',
    },
  ]

  const mockProps = {
    conversations: mockConversations,
    activeConversationId: null,
    onSelectConversation: jest.fn(),
    onCreateConversation: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

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

  it('renders conversation items', () => {
    render(<ConversationList {...mockProps} />)
    expect(screen.getByText('Conversation #1')).toBeInTheDocument()
    expect(screen.getByText('Conversation #2')).toBeInTheDocument()
  })

  it('displays conversation type and date', () => {
    render(<ConversationList {...mockProps} />)
    const items = screen.getAllByText(/private|group/i)
    expect(items.length).toBeGreaterThanOrEqual(1)
  })

  it('highlights active conversation', () => {
    render(<ConversationList {...mockProps} activeConversationId={1} />)
    const activeItem = screen.getByText('Conversation #1').closest('.conversation-item')
    expect(activeItem).toHaveClass('active')
  })

  it('does not highlight inactive conversations', () => {
    render(<ConversationList {...mockProps} activeConversationId={1} />)
    const inactiveItem = screen.getByText('Conversation #2').closest('.conversation-item')
    expect(inactiveItem).not.toHaveClass('active')
  })

  it('calls onSelectConversation when conversation is clicked', () => {
    render(<ConversationList {...mockProps} />)
    const conversation = screen.getByText('Conversation #1').closest('.conversation-item')
    fireEvent.click(conversation)
    expect(mockProps.onSelectConversation).toHaveBeenCalledWith(1)
  })

  it('calls onCreateConversation when new chat button is clicked', () => {
    render(<ConversationList {...mockProps} />)
    const newChatBtn = screen.getByTitle('Start new conversation')
    fireEvent.click(newChatBtn)
    expect(mockProps.onCreateConversation).toHaveBeenCalledTimes(1)
  })

  it('calls onCreateConversation from empty state button', () => {
    render(<ConversationList {...mockProps} conversations={[]} />)
    const startBtn = screen.getByText('Start a conversation')
    fireEvent.click(startBtn)
    expect(mockProps.onCreateConversation).toHaveBeenCalledTimes(1)
  })

  it('renders all conversations in the list', () => {
    const manyConvs = Array.from({ length: 5 }, (_, i) => ({
      conversation_id: i + 1,
      type: i % 2 === 0 ? 'private' : 'group',
      created_at: new Date().toISOString(),
    }))
    render(<ConversationList {...mockProps} conversations={manyConvs} />)
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByText(`Conversation #${i}`)).toBeInTheDocument()
    }
  })
})
