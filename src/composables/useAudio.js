/**
 * Composable para manejar efectos de sonido en la aplicación
 * Utiliza Web Audio API para generar sonidos procedurales
 */

/**
 * Reproduce un sonido especial cuando un jugador hace -10 puntos
 */
export const reproducirSonidoEspecial = () => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = 800
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.3)
  } catch (error) {
    console.log('Audio no disponible:', error)
  }
}

/**
 * Reproduce un sonido de victoria cuando finaliza la partida
 * Crea una melodía festiva con múltiples tonos ascendentes
 */
export const reproducirSonidoVictoria = () => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    
    // Secuencia de notas para la melodía de victoria
    const notas = [
      { freq: 523.25, time: 0, duration: 0.15 },      // C5
      { freq: 659.25, time: 0.15, duration: 0.15 },   // E5
      { freq: 783.99, time: 0.3, duration: 0.15 },    // G5
      { freq: 1046.50, time: 0.45, duration: 0.3 }    // C6
    ]

    notas.forEach(nota => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = nota.freq
      oscillator.type = 'triangle'

      // Envelope para hacer el sonido más musical
      const startTime = audioContext.currentTime + nota.time
      const endTime = startTime + nota.duration

      gainNode.gain.setValueAtTime(0, startTime)
      gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.02)
      gainNode.gain.exponentialRampToValueAtTime(0.01, endTime)

      oscillator.start(startTime)
      oscillator.stop(endTime)
    })

    // Añadir un efecto de "brillo" al final
    setTimeout(() => {
      const sparkleOsc = audioContext.createOscillator()
      const sparkleGain = audioContext.createGain()

      sparkleOsc.connect(sparkleGain)
      sparkleGain.connect(audioContext.destination)

      sparkleOsc.frequency.value = 2093 // C7
      sparkleOsc.type = 'sine'

      sparkleGain.gain.setValueAtTime(0.15, audioContext.currentTime)
      sparkleGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4)

      sparkleOsc.start(audioContext.currentTime)
      sparkleOsc.stop(audioContext.currentTime + 0.4)
    }, 750)
  } catch (error) {
    console.log('Audio no disponible:', error)
  }
}

/**
 * Reproduce un sonido de alerta cuando un jugador alcanza el límite
 */
export const reproducirSonidoAlerta = () => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    
    // Primer tono
    const oscillator1 = audioContext.createOscillator()
    const gainNode1 = audioContext.createGain()
    
    oscillator1.connect(gainNode1)
    gainNode1.connect(audioContext.destination)
    
    oscillator1.frequency.value = 500
    oscillator1.type = 'square'
    gainNode1.gain.setValueAtTime(0.2, audioContext.currentTime)
    gainNode1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
    
    oscillator1.start(audioContext.currentTime)
    oscillator1.stop(audioContext.currentTime + 0.2)
    
    // Segundo tono
    const oscillator2 = audioContext.createOscillator()
    const gainNode2 = audioContext.createGain()
    
    oscillator2.connect(gainNode2)
    gainNode2.connect(audioContext.destination)
    
    oscillator2.frequency.value = 400
    oscillator2.type = 'square'
    gainNode2.gain.setValueAtTime(0.2, audioContext.currentTime + 0.2)
    gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4)
    
    oscillator2.start(audioContext.currentTime + 0.2)
    oscillator2.stop(audioContext.currentTime + 0.4)
  } catch (error) {
    console.log('Audio no disponible:', error)
  }
}

export function useAudio() {
  return {
    reproducirSonidoEspecial,
    reproducirSonidoVictoria,
    reproducirSonidoAlerta
  }
}
