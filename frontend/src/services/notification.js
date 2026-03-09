// Generates a short notification sound using the Web Audio API
// No external audio files needed
let audioCtx = null

export function playNotificationSound() {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    }

    const oscillator = audioCtx.createOscillator()
    const gain = audioCtx.createGain()

    oscillator.connect(gain)
    gain.connect(audioCtx.destination)

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime) // A5
    oscillator.frequency.setValueAtTime(660, audioCtx.currentTime + 0.1) // E5

    gain.gain.setValueAtTime(0.3, audioCtx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3)

    oscillator.start(audioCtx.currentTime)
    oscillator.stop(audioCtx.currentTime + 0.3)
  } catch {
    // Audio not available — silently ignore
  }
}
