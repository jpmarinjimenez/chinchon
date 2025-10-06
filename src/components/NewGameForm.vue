<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Nueva Partida</h2>
    
    <form @submit.prevent="iniciarJuego">
      <!-- Límite de eliminación -->
      <div class="mb-6">
        <label for="limite" class="block text-sm font-semibold text-gray-700 mb-2">
          ¿Cuántos puntos para ser eliminado?
        </label>
        <input
          id="limite"
          v-model.number="limite"
          type="number"
          min="50"
          max="500"
          step="10"
          class="input-field"
          required
        />
        <p class="text-xs text-gray-500 mt-1">Valor típico: 100 puntos</p>
      </div>

      <!-- Nombres de jugadores -->
      <div class="mb-6">
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Nombres de los jugadores (2-8)
        </label>
        
        <div class="space-y-2">
          <div
            v-for="(nombre, index) in nombresJugadores"
            :key="index"
            class="flex gap-2"
          >
            <input
              v-model="nombresJugadores[index]"
              type="text"
              :placeholder="`Jugador ${index + 1}`"
              class="input-field"
              required
              maxlength="20"
            />
            <button
              v-if="nombresJugadores.length > 2"
              type="button"
              @click="eliminarJugador(index)"
              class="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <button
          v-if="nombresJugadores.length < 8"
          type="button"
          @click="agregarJugador"
          class="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
        >
          <span>+</span>
          <span>Agregar jugador</span>
        </button>
      </div>

      <!-- Botón de inicio -->
      <button
        type="submit"
        class="w-full btn-primary text-lg py-3"
        :disabled="!formularioValido"
      >
        🎮 Iniciar Partida
      </button>
    </form>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'NewGameForm',
  emits: ['iniciar-juego'],
  setup(props, { emit }) {
    const limite = ref(100)
    const nombresJugadores = ref(['', ''])

    const formularioValido = computed(() => {
      return (
        limite.value >= 50 &&
        nombresJugadores.value.length >= 2 &&
        nombresJugadores.value.every(n => n.trim().length > 0)
      )
    })

    const agregarJugador = () => {
      if (nombresJugadores.value.length < 8) {
        nombresJugadores.value.push('')
      }
    }

    const eliminarJugador = (index) => {
      if (nombresJugadores.value.length > 2) {
        nombresJugadores.value.splice(index, 1)
      }
    }

    const iniciarJuego = () => {
      if (formularioValido.value) {
        emit('iniciar-juego', {
          limite: limite.value,
          jugadores: nombresJugadores.value.filter(n => n.trim().length > 0)
        })
      }
    }

    return {
      limite,
      nombresJugadores,
      formularioValido,
      agregarJugador,
      eliminarJugador,
      iniciarJuego
    }
  }
}
</script>
