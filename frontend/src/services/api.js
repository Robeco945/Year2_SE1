import axios from 'axios'

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const messageAPI = {
  // Get all messages for a conversation
  getMessages: (conversationId) =>
    api.get(`/conversations/${conversationId}/messages`),
  
  // Send a new message
  sendMessage: (conversationId, content) =>
    api.post(`/conversations/${conversationId}/messages`, { content }),
  
  // Get all conversations
  getConversations: () =>
    api.get('/conversations'),
  
  // Create a new conversation
  createConversation: (participantIds) =>
    api.post('/conversations', { participantIds }),
  
  // Get conversation details
  getConversation: (conversationId) =>
    api.get(`/conversations/${conversationId}`),
  
  // Delete a message
  deleteMessage: (conversationId, messageId) =>
    api.delete(`/conversations/${conversationId}/messages/${messageId}`),
  
  // Edit a message
  editMessage: (conversationId, messageId, content) =>
    api.patch(`/conversations/${conversationId}/messages/${messageId}`, { content }),
}

export const authAPI = {
  // User login
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  
  // User registration
  register: (name, email, password) =>
    api.post('/auth/register', { name, email, password }),
  
  // Get current user
  getCurrentUser: () =>
    api.get('/auth/me'),
  
  // Logout
  logout: () => {
    localStorage.removeItem('authToken')
    return Promise.resolve()
  },
}

export default api
