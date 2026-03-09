import { playNotificationSound } from './notification'

describe('Notification Service', () => {
  let mockOscillator
  let mockGain
  let mockAudioContext

  beforeEach(() => {
    mockOscillator = {
      connect: jest.fn(),
      type: 'sine',
      frequency: {
        setValueAtTime: jest.fn(),
      },
      start: jest.fn(),
      stop: jest.fn(),
    }
    mockGain = {
      connect: jest.fn(),
      gain: {
        setValueAtTime: jest.fn(),
        exponentialRampToValueAtTime: jest.fn(),
      },
    }
    mockAudioContext = {
      createOscillator: jest.fn().mockReturnValue(mockOscillator),
      createGain: jest.fn().mockReturnValue(mockGain),
      destination: {},
      currentTime: 0,
    }
    window.AudioContext = jest.fn().mockImplementation(() => mockAudioContext)
  })

  afterEach(() => {
    delete window.AudioContext
  })

  it('is a function', () => {
    expect(typeof playNotificationSound).toBe('function')
  })

  it('does not throw when AudioContext is unavailable', () => {
    delete window.AudioContext
    delete window.webkitAudioContext
    expect(() => playNotificationSound()).not.toThrow()
  })
})
