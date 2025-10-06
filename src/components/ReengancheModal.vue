<template>
  <Transition name="fade">
    <div
      class="modal-overlay"
      @click.self="cerrar"
      role="dialog"
      aria-labelledby="reenganche-title"
      aria-modal="true"
    >
      <Transition name="slide-up">
        <div class="modal-content max-w-lg">
          <!-- Header con alerta -->
          <div class="bg-gradient-to-r from-red-500 to-orange-500 text-white p-6 rounded-t-xl">
            <div class="flex items-center justify-center mb-3">
              <span class="text-6xl animate-pulse-fast">⚠️</span>
            </div>
            <h2 id="reenganche-title" class="text-2xl font-bold text-center">
              ¡Límite Alcanzado!
            </h2>
            <p class="text-center text-red-100 mt-2">
              {{ jugadores.length > 1 ? 'Algunos jugadores han' : 'Un jugador ha' }} alcanzado el límite de {{ limite }} puntos
            </p>
          </div>

          <!-- Body -->
          <div class="p-6">
            <!-- Procesar cada jugador -->
            <div
              v-for="jugador in jugadores"
              :key="jugador.id"
              class="mb-6 last:mb-0"
            >
              <div class="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-red-300 rounded-xl p-5">
                <!-- Info del jugador -->
                <div class="text-center mb-4">
                  <h3 class="text-2xl font-bold text-gray-800">{{ jugador.nombre }}</h3>
                  <p class="text-red-600 font-semibold text-lg mt-1">
                    {{ jugador.puntosAcumulados }} puntos
                  </p>
                  <p v-if="jugador.vecesReenganchado > 0" class="text-sm text-gray-600 mt-1">
                    Ya se ha reenganchado {{ jugador.vecesReenganchado }} {{ jugador.vecesReenganchado === 1 ? 'vez' : 'veces' }}
                  </p>
                </div>

                <!-- Explicación del reenganche -->
                <div class="bg-white rounded-lg p-4 mb-4">
                  <p class="text-sm text-gray-700 mb-2">
                    <span class="font-semibold">Si se reengancha:</span>
                    Continuará con <span class="font-bold text-blue-600">{{ puntosReenganche }} puntos</span>
                    (los mismos que el jugador que está más cerca del límite sin alcanzarlo).
                  </p>
                  <p class="text-sm text-gray-700">
                    <span class="font-semibold">Si se elimina:</span>
                    Quedará fuera del juego.
                  </p>
                </div>

                <!-- Botones de decisión -->
                <div class="flex gap-3">
                  <button
                    @click="reenganchar(jugador.id)"
                    class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    ♻️ Reenganchar
                  </button>
                  <button
                    @click="eliminar(jugador.id)"
                    class="flex-1 btn-danger py-3"
                  >
                    ❌ Eliminar
                  </button>
                </div>
              </div>
            </div>

            <!-- Mensaje si todos decidieron -->
            <div v-if="jugadores.length === 0" class="text-center py-8">
              <p class="text-gray-600">Todos los jugadores han tomado su decisión.</p>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script>
import { onMounted } from 'vue'

export default {
  name: 'ReengancheModal',
  props: {
    jugadores: {
      type: Array,
      required: true
    },
    limite: {
      type: Number,
      required: true
    },
    puntosReenganche: {
      type: Number,
      required: true
    }
  },
  emits: ['reenganchar', 'eliminar', 'cerrar'],
  setup(props, { emit }) {
    onMounted(() => {
      // Reproducir sonido de alerta
      reproducirSonidoAlerta()
    })

    const reproducirSonidoAlerta = () => {
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

    const reenganchar = (jugadorId) => {
      emit('reenganchar', jugadorId)
    }

    const eliminar = (jugadorId) => {
      emit('eliminar', jugadorId)
    }

    const cerrar = () => {
      emit('cerrar')
    }

    return {
      reenganchar,
      eliminar,
      cerrar
    }
  }
}
</script>
