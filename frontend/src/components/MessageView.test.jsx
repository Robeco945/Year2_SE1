import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import MessageView from './MessageView'
import { messageAPI } from '../services/api'

// Mock the api module
jest.mock('../services/api', () => ({
  messageAPI: {
    getMessages: jest.fn(),
    sendMessage: jest.fn(),
  },
}))

describe('MessageView Component', () => {
  const mockCurrentUser = { user_id: 1, username: 'testuser' }

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    // jsdom doesn't support scrollIntoView
    Element.prototype.scrollIntoView = jest.fn()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders placeholder when no conversation is selected', () => {
    render(<MessageView conversationId={null} currentUser={mockCurrentUser} />)
    expect(screen.getByText('Select a conversation to start chatting')).toBeInTheDocument()
  })

  it('shows loading state initially', () => {
    messageAPI.getMessages.mockReturnValue(new Promise(() => {})) // never resolves
    render(<MessageView conversationId={1} currentUser={mockCurrentUser} />)
    expect(screen.getByText('Loading…')).toBeInTheDocument()
  })

  it('displays messages after loading', async () => {
    messageAPI.getMessages.mockResolvedValue({
      data: [
        { message_id: 1, content: 'Hello!', sender_id: 2, sent_at: '2026-02-10T10:00:00Z' },
        { message_id: 2, content: 'Hi there!', sender_id: 1, sent_at: '2026-02-10T10:01:00Z' },
      ],
    })

    render(<MessageView conversationId={1} currentUser={mockCurrentUser} />)

    await waitFor(() => {
      expect(screen.getByText('Hello!')).toBeInTheDocument()
      expect(screen.getByText('Hi there!')).toBeInTheDocument()
    })
  })

  it('shows empty state when no messages exist', async () => {
    messageAPI.getMessages.mockResolvedValue({ data: [] })

    render(<MessageView conversationId={1} currentUser={mockCurrentUser} />)

    await waitFor(() => {
      expect(screen.getByText('No messages yet. Say hello!')).toBeInTheDocument()
    })
  })

  it('displays error on load failure', async () => {
    messageAPI.getMessages.mockRejectedValue(new Error('Network error'))

    render(<MessageView conversationId={1} currentUser={mockCurrentUser} />)

    await waitFor(() => {
      expect(screen.getByText('Failed to load messages')).toBeInTheDocument()
    })
  })

  it('shows sender label for messages from other users', async () => {
    messageAPI.getMessages.mockResolvedValue({
      data: [
        { message_id: 1, content: 'Hey', sender_id: 2, sent_at: '2026-02-10T10:00:00Z' },
      ],
    })

    render(<MessageView conversationId={1} currentUser={mockCurrentUser} />)

    await waitFor(() => {
      expect(screen.getByText('User 2')).toBeInTheDocument()
    })
  })

  it('does not show sender label for own messages', async () => {
    messageAPI.getMessages.mockResolvedValue({
      data: [
        { message_id: 1, content: 'My message', sender_id: 1, sent_at: '2026-02-10T10:00:00Z' },
      ],
    })

    render(<MessageView conversationId={1} currentUser={mockCurrentUser} />)

    await waitFor(() => {
      expect(screen.getByText('My message')).toBeInTheDocument()
      expect(screen.queryByText('User 1')).not.toBeInTheDocument()
    })
  })

  it('renders the message input form', async () => {
    messageAPI.getMessages.mockResolvedValue({ data: [] })

    render(<MessageView conversationId={1} currentUser={mockCurrentUser} />)

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Type a message…')).toBeInTheDocument()
      expect(screen.getByText('Send')).toBeInTheDocument()
    })
  })

  it('disables send button when input is empty', async () => {
    messageAPI.getMessages.mockResolvedValue({ data: [] })

    render(<MessageView conversationId={1} currentUser={mockCurrentUser} />)

    await waitFor(() => {
      expect(screen.getByText('Send')).toBeDisabled()
    })
  })

  it('enables send button when input has content', async () => {
    messageAPI.getMessages.mockResolvedValue({ data: [] })

    render(<MessageView conversationId={1} currentUser={mockCurrentUser} />)

    await waitFor(() => {
      const input = screen.getByPlaceholderText('Type a message…')
      fireEvent.change(input, { target: { value: 'test message' } })
      expect(screen.getByText('Send')).not.toBeDisabled()
    })
  })

  it('sends message on form submit', async () => {
    messageAPI.getMessages.mockResolvedValue({ data: [] })
    messageAPI.sendMessage.mockResolvedValue({ data: { message_id: 1, content: 'test' } })

    render(<MessageView conversationId={1} currentUser={mockCurrentUser} />)

    await waitFor(() => {
      const input = screen.getByPlaceholderText('Type a message…')
      fireEvent.change(input, { target: { value: 'test message' } })
    })

    const form = screen.getByPlaceholderText('Type a message…').closest('form')
    await act(async () => {
      fireEvent.submit(form)
    })

    expect(messageAPI.sendMessage).toHaveBeenCalledWith(1, 'test message')
  })

  it('clears input after successful send', async () => {
    messageAPI.getMessages.mockResolvedValue({ data: [] })
    messageAPI.sendMessage.mockResolvedValue({ data: { message_id: 1 } })

    render(<MessageView conversationId={1} currentUser={mockCurrentUser} />)

    await waitFor(() => {
      const input = screen.getByPlaceholderText('Type a message…')
      fireEvent.change(input, { target: { value: 'test' } })
    })

    const form = screen.getByPlaceholderText('Type a message…').closest('form')
    await act(async () => {
      fireEvent.submit(form)
    })

    expect(screen.getByPlaceholderText('Type a message…').value).toBe('')
  })

  it('shows error when send fails', async () => {
    messageAPI.getMessages.mockResolvedValue({ data: [] })
    messageAPI.sendMessage.mockRejectedValue(new Error('Send failed'))

    render(<MessageView conversationId={1} currentUser={mockCurrentUser} />)

    await waitFor(() => {
      const input = screen.getByPlaceholderText('Type a message…')
      fireEvent.change(input, { target: { value: 'test' } })
    })

    const form = screen.getByPlaceholderText('Type a message…').closest('form')
    await act(async () => {
      fireEvent.submit(form)
    })

    await waitFor(() => {
      expect(screen.getByText('Failed to send message')).toBeInTheDocument()
    })
  })

  it('reloads messages when conversationId changes', async () => {
    messageAPI.getMessages.mockResolvedValue({ data: [] })

    const { rerender } = render(
      <MessageView conversationId={1} currentUser={mockCurrentUser} />
    )

    await waitFor(() => {
      expect(messageAPI.getMessages).toHaveBeenCalledWith(1)
    })

    rerender(<MessageView conversationId={2} currentUser={mockCurrentUser} />)

    await waitFor(() => {
      expect(messageAPI.getMessages).toHaveBeenCalledWith(2)
    })
  })
})
