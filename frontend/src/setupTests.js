import { TextEncoder, TextDecoder } from 'util'

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Minimal WebSocket stub — prevents "WebSocket is not defined" in jsdom.
// Tests that care about WS behaviour should mock it individually.
class MockWebSocket {
  constructor() {
    this.readyState = 1 // OPEN
  }
  send() {}
  close() {}
}
global.WebSocket = MockWebSocket

import '@testing-library/jest-dom'
