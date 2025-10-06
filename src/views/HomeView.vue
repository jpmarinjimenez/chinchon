<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-4">
    <div class="max-w-2xl w-full">
      <!-- Logo y título -->
      <div class="text-center mb-8">
        <h1 class="text-5xl font-bold text-blue-700 mb-2">🎴 Chinchón</h1>
        <p class="text-gray-600 text-lg">Contador de Puntos</p>
      </div>

      <!-- Card principal -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <!-- Mostrar formulario si hay juego guardado -->
        <div v-if="juegoGuardado" class="mb-6">
          <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-800 font-semibold">Partida en curso detectada</p>
                <p class="text-blue-600 text-sm mt-1">
                  {{ gameStore.jugadores.length }} jugadores - Límite: {{ gameStore.limiteEliminacion }} puntos
                </p>
              </div>
              <button
                @click="continuarPartida"
                class="btn-primary text-sm"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>

        <!-- Formulario para nueva partida -->
        <NewGameForm @iniciar-juego="iniciarNuevaPartida" />

        <!-- Botón de historial -->
        <div class="mt-6 pt-6 border-t border-gray-200">
          <button
            @click="irAlHistorial"
            class="w-full btn-secondary flex items-center justify-center gap-2"
          >
            <span>📊</span>
            <span>Ver Historial de Partidas</span>
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center mt-8 text-gray-500 text-sm">
        <p>Aplicación web para anotar puntos del juego Chinchón</p>
        <p class="mt-1">Desarrollado con Vue 3 + Pinia + Tailwind CSS</p>
        <p class="mt-2">
          Creado por 
          <a 
            href="https://jpmarin.dev" 
            target="_blank" 
            rel="noopener noreferrer"
            class="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
          >
            Juan Pablo Marín Jiménez
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameStore'
import NewGameForm from '@/components/NewGameForm.vue'

export default {
  name: 'HomeView',
  components: {
    NewGameForm
  },
  setup() {
    const router = useRouter()
    const gameStore = useGameStore()

    // Cargar datos al montar el componente
    gameStore.cargarDesdeLocalStorage()
    gameStore.cargarHistorialDesdeLocalStorage()

    const juegoGuardado = computed(() => {
      return gameStore.juegoActivo && gameStore.jugadores.length > 0
    })

    const iniciarNuevaPartida = ({ limite, jugadores }) => {
      gameStore.iniciarNuevoJuego(limite, jugadores)
      router.push('/juego')
    }

    const continuarPartida = () => {
      router.push('/juego')
    }

    const irAlHistorial = () => {
      router.push('/historial')
    }

    return {
      gameStore,
      juegoGuardado,
      iniciarNuevaPartida,
      continuarPartida,
      irAlHistorial
    }
  }
}
</script>
