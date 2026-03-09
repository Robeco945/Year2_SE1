import axios from 'axios'

const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || 'http://localhost:8000/api'

// Derive WebSocket base URL from the HTTP base URL:
//   http://host/api  →  ws://host
//   https://host/api →  wss://host
export const WS_BASE_URL = API_BASE_URL.replace(/^http/, 'ws').replace(/\/api$/, '')

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

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
  getMessages: (conversationId) =>
    api.get(`/conversations/${conversationId}/messages`),
  
  sendMessage: (conversationId, content) =>
    api.post(`/conversations/${conversationId}/messages`, { content }),
  
  getConversations: () =>
    api.get('/conversations'),
  
  createConversation: (participantIds) =>
    api.post('/conversations', { type: 'private', participant_ids: participantIds }),
  
  getConversation: (conversationId) =>
    api.get(`/conversations/${conversationId}`),
  
  deleteMessage: (conversationId, messageId) =>
    api.delete(`/conversations/${conversationId}/messages/${messageId}`),
  
  editMessage: (conversationId, messageId, content) =>
    api.patch(`/conversations/${conversationId}/messages/${messageId}`, { content }),
}

export const authAPI = {
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  
  register: (name, email, password) =>
    api.post('/auth/register', { name, email, password }),
  
  getCurrentUser: () =>
    api.get('/auth/me'),
  
  updateProfile: (data) =>
    api.put('/auth/profile', data),
  
  changePassword: (currentPassword, newPassword) =>
    api.put('/auth/password', { current_password: currentPassword, new_password: newPassword }),
  
  logout: () => {
    localStorage.removeItem('authToken')
    return Promise.resolve()
  },
}

export default api
