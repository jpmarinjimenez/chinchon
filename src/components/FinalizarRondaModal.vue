<template>
  <Transition name="fade">
    <div
      class="modal-overlay"
      @click.self="cerrar"
      role="dialog"
      aria-labelledby="modal-title"
      aria-modal="true"
    >
      <Transition name="slide-up">
        <div class="modal-content">
          <!-- Header -->
          <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-xl">
            <div class="flex items-center justify-between">
              <h2 id="modal-title" class="text-2xl font-bold">Finalizar Ronda</h2>
              <button
                @click="cerrar"
                class="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                aria-label="Cerrar modal"
              >
                <span class="text-2xl">×</span>
              </button>
            </div>
            <p class="text-blue-100 mt-2">Introduce los puntos de cada jugador</p>
          </div>

          <!-- Body -->
          <div class="p-6">
            <form @submit.prevent="confirmar">
              <div class="space-y-4 max-h-[60vh] overflow-y-auto">
                <div
                  v-for="jugador in jugadores"
                  :key="jugador.id"
                  class="flex items-center gap-4 p-4 rounded-lg border-2 transition-all"
                  :class="{
                    'border-green-400 bg-green-50': puntosRonda[jugador.id] === -10,
                    'border-gray-200 bg-white': puntosRonda[jugador.id] !== -10
                  }"
                >
                  <!-- Nombre del jugador -->
                  <div class="flex-1">
                    <p class="font-semibold text-gray-800">{{ jugador.nombre }}</p>
                    <p class="text-sm text-gray-500">
                      Total actual: {{ jugador.puntosAcumulados }} pts
                    </p>
                  </div>

                  <!-- Input de puntos -->
                  <div class="w-32">
                    <input
                      v-model.number="puntosRonda[jugador.id]"
                      type="number"
                      :min="-10"
                      max="999"
                      step="1"
                      class="input-field text-center text-lg font-semibold"
                      :class="{
                        'bg-green-100 border-green-400': puntosRonda[jugador.id] === -10
                      }"
                      placeholder="0"
                      required
                      :aria-label="`Puntos para ${jugador.nombre}`"
                      @input="validarPuntos(jugador.id)"
                      ref="inputPuntos"
                    />
                  </div>

                  <!-- Indicador de chinchón -->
                  <div v-if="puntosRonda[jugador.id] === -10" class="text-2xl animate-bounce-slow">
                    🎉
                  </div>
                </div>
              </div>

              <!-- Ayuda -->
              <div class="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4">
                <p class="text-sm text-blue-800">
                  <span class="font-semibold">💡 Consejo:</span>
                  Introduce <strong>-10</strong> si el jugador hizo chinchón.
                  Los demás valores deben ser <strong>0 o positivos</strong>.
                </p>
              </div>

              <!-- Botones -->
              <div class="mt-6 flex gap-3 justify-end">
                <button
                  type="button"
                  @click="cerrar"
                  class="btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  class="btn-primary"
                  :disabled="!formularioValido"
                >
                  ✓ Confirmar Ronda
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script>
import { ref, computed, onMounted, nextTick } from 'vue'

export default {
  name: 'FinalizarRondaModal',
  props: {
    jugadores: {
      type: Array,
      required: true
    }
  },
  emits: ['confirmar', 'cerrar'],
  setup(props, { emit }) {
    const puntosRonda = ref({})
    const inputPuntos = ref([])

    // Inicializar puntos en 0 para cada jugador
    onMounted(async () => {
      props.jugadores.forEach(jugador => {
        puntosRonda.value[jugador.id] = 0
      })

      // Enfocar el primer input
      await nextTick()
      if (inputPuntos.value && inputPuntos.value.length > 0) {
        inputPuntos.value[0]?.focus()
      }
    })

    const formularioValido = computed(() => {
      return props.jugadores.every(jugador => {
        const puntos = puntosRonda.value[jugador.id]
        return puntos !== undefined && puntos !== null && (puntos === -10 || puntos >= 0)
      })
    })

    const validarPuntos = (jugadorId) => {
      const puntos = puntosRonda.value[jugadorId]
      
      // Validar que sea -10 o >= 0
      if (puntos < -10) {
        puntosRonda.value[jugadorId] = -10
      } else if (puntos > -10 && puntos < 0) {
        puntosRonda.value[jugadorId] = 0
      }

      // Reproducir sonido si es -10 (chinchón)
      if (puntos === -10) {
        reproducirSonidoChinchon()
      }
    }

    const reproducirSonidoChinchon = () => {
      // Efecto de sonido simple usando Web Audio API
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

    const confirmar = () => {
      if (formularioValido.value) {
        emit('confirmar', { ...puntosRonda.value })
      }
    }

    const cerrar = () => {
      emit('cerrar')
    }

    return {
      puntosRonda,
      inputPuntos,
      formularioValido,
      validarPuntos,
      confirmar,
      cerrar
    }
  }
}
</script>
