import { render, screen, waitFor } from '@testing-library/react'
import App from './App'
import { messageAPI } from './services/api'

// Mock the API
jest.mock('./services/api', () => ({
  messageAPI: {
    getConversations: jest.fn(),
    createConversation: jest.fn(),
  },
}))

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders without crashing', async () => {
    messageAPI.getConversations.mockResolvedValue({ data: [] })
    render(<App />)
    
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    })
    
    expect(screen.getByText(/select a conversation on the left/i)).toBeInTheDocument()
  })

  it('displays loading state initially', () => {
    messageAPI.getConversations.mockResolvedValue({ data: [] })
    render(<App />)
    expect(screen.getByText(/loading conversations/i)).toBeInTheDocument()
  })

  it('loads and displays conversations', async () => {
    const mockConversations = [
      {
        id: 1,
        name: 'Test Chat',
        participants: [{ name: 'John' }],
        lastMessage: { content: 'Hello', createdAt: new Date() },
      },
    ]

    messageAPI.getConversations.mockResolvedValue({ data: mockConversations })
    
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Test Chat')).toBeInTheDocument()
    })
  })

  it('displays error message when API fails', async () => {
    messageAPI.getConversations.mockRejectedValue(new Error('API Error'))

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText(/failed to load conversations/i)).toBeInTheDocument()
    })
  })

  it('calls API on mount', () => {
    messageAPI.getConversations.mockResolvedValue({ data: [] })
    render(<App />)
    expect(messageAPI.getConversations).toHaveBeenCalledTimes(1)
  })
})
