import { render, screen, waitFor } from '@testing-library/react'
import App from './App'

// Mock the API module
jest.mock('./services/api', () => ({
  WS_BASE_URL: 'ws://localhost:8000',
  messageAPI: {
    getConversations: jest.fn(),
    getMessages: jest.fn(),
    createConversation: jest.fn(),
    sendMessage: jest.fn(),
  },
  authAPI: {
    getCurrentUser: jest.fn(),
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn().mockResolvedValue(),
    updateProfile: jest.fn(),
    changePassword: jest.fn(),
  },
}))

jest.mock('./services/notification', () => ({
  playNotificationSound: jest.fn(),
}))

import { messageAPI, authAPI } from './services/api'

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    window.history.pushState({}, '', '/')
    Element.prototype.scrollIntoView = jest.fn()
  })

  it('renders without crashing', () => {
    render(<App />)
    // Should show login page when no token
    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument()
  })

  it('redirects to login when no auth token', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument()
  })

  it('shows chat UI when authenticated', async () => {
    localStorage.setItem('authToken', 'test-token')
    authAPI.getCurrentUser.mockResolvedValue({
      data: { user_id: 1, username: 'testuser', email: 'test@test.com' },
    })
    messageAPI.getConversations.mockResolvedValue({ data: [] })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('ChatApp')).toBeInTheDocument()
    })
  })

  it('displays current user name when authenticated', async () => {
    localStorage.setItem('authToken', 'test-token')
    authAPI.getCurrentUser.mockResolvedValue({
      data: { user_id: 1, username: 'alice', email: 'alice@test.com' },
    })
    messageAPI.getConversations.mockResolvedValue({ data: [] })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('alice')).toBeInTheDocument()
    })
  })

  it('shows conversations list when authenticated', async () => {
    localStorage.setItem('authToken', 'test-token')
    authAPI.getCurrentUser.mockResolvedValue({
      data: { user_id: 1, username: 'alice', email: 'alice@test.com' },
    })
    messageAPI.getConversations.mockResolvedValue({
      data: [
        { conversation_id: 1, type: 'private', created_at: '2026-01-01T00:00:00Z' },
      ],
    })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Conversation #1')).toBeInTheDocument()
    })
  })

  it('shows empty state when no conversations', async () => {
    localStorage.setItem('authToken', 'test-token')
    authAPI.getCurrentUser.mockResolvedValue({
      data: { user_id: 1, username: 'alice', email: 'alice@test.com' },
    })
    messageAPI.getConversations.mockResolvedValue({ data: [] })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('No conversations yet')).toBeInTheDocument()
    })
  })

  it('shows settings button in sidebar', async () => {
    localStorage.setItem('authToken', 'test-token')
    authAPI.getCurrentUser.mockResolvedValue({
      data: { user_id: 1, username: 'alice', email: 'alice@test.com' },
    })
    messageAPI.getConversations.mockResolvedValue({ data: [] })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText(/Settings/)).toBeInTheDocument()
    })
  })

  it('shows logout button', async () => {
    localStorage.setItem('authToken', 'test-token')
    authAPI.getCurrentUser.mockResolvedValue({
      data: { user_id: 1, username: 'alice', email: 'alice@test.com' },
    })
    messageAPI.getConversations.mockResolvedValue({ data: [] })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Log out')).toBeInTheDocument()
    })
  })

  it('shows message placeholder when no conversation selected', async () => {
    localStorage.setItem('authToken', 'test-token')
    authAPI.getCurrentUser.mockResolvedValue({
      data: { user_id: 1, username: 'alice', email: 'alice@test.com' },
    })
    messageAPI.getConversations.mockResolvedValue({ data: [] })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Select a conversation to start chatting')).toBeInTheDocument()
    })
  })
})
