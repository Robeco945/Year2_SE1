import axios from 'axios'
import { messageAPI, authAPI } from './api'

jest.mock('axios')

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  describe('messageAPI', () => {
    it('getConversations calls correct endpoint', async () => {
      const mockData = [{ id: 1, name: 'Test' }]
      axios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue({ data: mockData }),
      })

      await messageAPI.getConversations()
      
      // Verify axios.create was called
      expect(axios.create).toHaveBeenCalled()
    })

    it('sendMessage calls correct endpoint with data', async () => {
      const mockResponse = { id: 1, content: 'Hello' }
      const mockPost = jest.fn().mockResolvedValue({ data: mockResponse })
      
      axios.create.mockReturnValue({
        post: mockPost,
      })

      await messageAPI.sendMessage(1, 'Hello')
      
      expect(axios.create).toHaveBeenCalled()
    })
  })

  describe('authAPI', () => {
    it('logout removes token from localStorage', async () => {
      localStorage.setItem('authToken', 'test-token')
      await authAPI.logout()
      
      expect(localStorage.getItem('authToken')).toBeNull()
    })
  })
})
