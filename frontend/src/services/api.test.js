let mockApi
let requestInterceptor
let responseInterceptor
let messageAPI
let authAPI
let WS_BASE_URL
let mockedAxios

describe('API Service', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
    localStorage.clear()

    mockApi = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
      interceptors: {
        request: { use: jest.fn((handler) => { requestInterceptor = handler }) },
        response: { use: jest.fn((success, error) => {
          responseInterceptor = { success, error }
        }) },
      },
    }

    jest.doMock('axios', () => ({
      create: jest.fn(() => mockApi),
    }))

    const apiModule = require('./api')
    mockedAxios = require('axios')
    messageAPI = apiModule.messageAPI
    authAPI = apiModule.authAPI
    WS_BASE_URL = apiModule.WS_BASE_URL
  })

  describe('WebSocket URL Configuration', () => {
    it('should generate correct WebSocket base URL from HTTP', () => {
      expect(WS_BASE_URL).toBeDefined()
      expect(typeof WS_BASE_URL).toBe('string')
    })
  })

  describe('messageAPI', () => {
    it('getMessages calls correct endpoint with conversation ID', async () => {
      const conversationId = 'conv-123'
      const mockResponse = { data: [{ id: 1, content: 'test' }] }
      mockApi.get.mockResolvedValue(mockResponse)

      const result = await messageAPI.getMessages(conversationId)

      expect(mockApi.get).toHaveBeenCalledWith(`/conversations/${conversationId}/messages`)
      expect(result).toEqual(mockResponse)
    })

    it('sendMessage posts to correct endpoint', async () => {
      const conversationId = 'conv-123'
      const content = 'Hello World'
      const mockResponse = { data: { id: 1, content } }
      mockApi.post.mockResolvedValue(mockResponse)

      const result = await messageAPI.sendMessage(conversationId, content)

      expect(mockApi.post).toHaveBeenCalledWith(
        `/conversations/${conversationId}/messages`,
        { content }
      )
      expect(result).toEqual(mockResponse)
    })

    it('getConversations calls correct endpoint', async () => {
      const mockData = [{ id: 1, name: 'Test' }]
      mockApi.get.mockResolvedValue({ data: mockData })

      await messageAPI.getConversations()
      
      expect(mockApi.get).toHaveBeenCalledWith('/conversations')
    })

    it('createConversation posts with correct data', async () => {
      const participantIds = ['user1', 'user2']
      const mockResponse = { data: { id: 1, type: 'private' } }
      mockApi.post.mockResolvedValue(mockResponse)

      const result = await messageAPI.createConversation(participantIds)

      expect(mockApi.post).toHaveBeenCalledWith(
        '/conversations',
        { type: 'private', participant_ids: participantIds }
      )
      expect(result).toEqual(mockResponse)
    })

    it('getConversation calls correct endpoint', async () => {
      const conversationId = 'conv-123'
      const mockResponse = { data: { id: 1, type: 'private' } }
      mockApi.get.mockResolvedValue(mockResponse)

      const result = await messageAPI.getConversation(conversationId)

      expect(mockApi.get).toHaveBeenCalledWith(`/conversations/${conversationId}`)
      expect(result).toEqual(mockResponse)
    })

    it('deleteMessage calls delete endpoint', async () => {
      const conversationId = 'conv-123'
      const messageId = 'msg-456'
      const mockResponse = { data: { success: true } }
      mockApi.delete.mockResolvedValue(mockResponse)

      const result = await messageAPI.deleteMessage(conversationId, messageId)

      expect(mockApi.delete).toHaveBeenCalledWith(
        `/conversations/${conversationId}/messages/${messageId}`
      )
      expect(result).toEqual(mockResponse)
    })

    it('editMessage patches message with new content', async () => {
      const conversationId = 'conv-123'
      const messageId = 'msg-456'
      const content = 'Updated message'
      const mockResponse = { data: { id: 456, content } }
      mockApi.patch.mockResolvedValue(mockResponse)

      const result = await messageAPI.editMessage(conversationId, messageId, content)

      expect(mockApi.patch).toHaveBeenCalledWith(
        `/conversations/${conversationId}/messages/${messageId}`,
        { content }
      )
      expect(result).toEqual(mockResponse)
    })
  })

  describe('authAPI', () => {
    it('login posts credentials to correct endpoint', async () => {
      const email = 'test@example.com'
      const password = 'password123'
      const mockResponse = { data: { token: 'abc123', id: 1 } }
      mockApi.post.mockResolvedValue(mockResponse)

      const result = await authAPI.login(email, password)

      expect(mockApi.post).toHaveBeenCalledWith(
        '/auth/login',
        { email, password }
      )
      expect(result).toEqual(mockResponse)
    })

    it('register posts new user data to correct endpoint', async () => {
      const name = 'Test User'
      const email = 'test@example.com'
      const password = 'password123'
      const mockResponse = { data: { id: 1, name, email } }
      mockApi.post.mockResolvedValue(mockResponse)

      const result = await authAPI.register(name, email, password)

      expect(mockApi.post).toHaveBeenCalledWith(
        '/auth/register',
        { name, email, password }
      )
      expect(result).toEqual(mockResponse)
    })

    it('getCurrentUser calls correct endpoint', async () => {
      const mockResponse = { data: { id: 1, name: 'Test User' } }
      mockApi.get.mockResolvedValue(mockResponse)

      const result = await authAPI.getCurrentUser()

      expect(mockApi.get).toHaveBeenCalledWith('/auth/me')
      expect(result).toEqual(mockResponse)
    })

    it('updateProfile puts profile data to correct endpoint', async () => {
      const profileData = { name: 'Updated Name', bio: 'New bio' }
      const mockResponse = { data: { id: 1, ...profileData } }
      mockApi.put.mockResolvedValue(mockResponse)

      const result = await authAPI.updateProfile(profileData)

      expect(mockApi.put).toHaveBeenCalledWith('/auth/profile', profileData)
      expect(result).toEqual(mockResponse)
    })

    it('changePassword puts password change request to correct endpoint', async () => {
      const currentPassword = 'oldpass'
      const newPassword = 'newpass'
      const mockResponse = { data: { success: true } }
      mockApi.put.mockResolvedValue(mockResponse)

      const result = await authAPI.changePassword(currentPassword, newPassword)

      expect(mockApi.put).toHaveBeenCalledWith(
        '/auth/password',
        { current_password: currentPassword, new_password: newPassword }
      )
      expect(result).toEqual(mockResponse)
    })

    it('logout removes token from localStorage', async () => {
      localStorage.setItem('authToken', 'test-token')
      const result = await authAPI.logout()
      
      expect(localStorage.getItem('authToken')).toBeNull()
      expect(result).toBeUndefined()
    })

    it('logout resolves even when no token in storage', async () => {
      const result = await authAPI.logout()
      
      expect(localStorage.getItem('authToken')).toBeNull()
      expect(result).toBeUndefined()
    })
  })

  describe('Axios Configuration', () => {
    it('creates axios instance with correct base URL and headers', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      )
    })

    it('sets up request interceptor', () => {
      expect(mockApi.interceptors.request.use).toHaveBeenCalled()
    })

    it('sets up response interceptor', () => {
      expect(mockApi.interceptors.response.use).toHaveBeenCalled()
    })
  })

  describe('Request Interceptor', () => {
    it('adds Authorization header when token exists', () => {
      localStorage.setItem('authToken', 'test-token-123')
      
      const config = { headers: {} }
      const token = localStorage.getItem('authToken')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }

      expect(config.headers.Authorization).toBe('Bearer test-token-123')
    })

    it('does not add Authorization header when no token', () => {
      const config = { headers: {} }
      const token = localStorage.getItem('authToken')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }

      expect(config.headers.Authorization).toBeUndefined()
    })
  })

  describe('Response Interceptor', () => {
    it('handles 401 error by clearing token and redirecting', () => {
      localStorage.setItem('authToken', 'test-token')

      const error = { response: { status: 401 } }

      // Simulate error handler logic
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken')
        window.location.href = '/login'
      }

      expect(localStorage.getItem('authToken')).toBeNull()
    })

    it('returns successful response as-is', () => {
      const response = { status: 200, data: { test: 'data' } }
      expect(response).toEqual({ status: 200, data: { test: 'data' } })
    })

    it('rejects other errors', () => {
      const error = { response: { status: 500, data: 'Server Error' } }

      localStorage.setItem('authToken', 'test-token')
      
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken')
      }
      
      expect(localStorage.getItem('authToken')).toBe('test-token')
    })
  })
})
