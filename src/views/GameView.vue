<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- Header -->
    <HeaderBar
      :ronda-actual="gameStore.rondaActual"
      :limite="gameStore.limiteEliminacion"
      @finalizar-ronda="abrirModalFinalizarRonda"
      @deshacer-ronda="deshacerRonda"
      @volver-inicio="volverInicio"
    />

    <!-- Contenido principal -->
    <div class="container mx-auto px-4 py-6">
      <!-- Resumen final si el juego terminó -->
      <div v-if="gameStore.juegoFinalizado" class="mb-6">
        <div class="bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-2xl shadow-2xl p-8 text-center">
          <div class="text-6xl mb-4">🏆</div>
          <h2 class="text-3xl font-bold mb-2">¡Partida Finalizada!</h2>
          <p v-if="gameStore.ganador?.chinchon" class="text-2xl mb-2 font-bold animate-pulse">
            ¡CHINCHÓN! 🎉
          </p>
          <p class="text-xl mb-4">Ganador: <span class="font-bold">{{ gameStore.ganador?.nombre }}</span></p>
          <p v-if="gameStore.ganador?.chinchon" class="text-sm opacity-90">Victoria automática por Chinchón</p>
          <div class="flex gap-4 justify-center mt-6">
            <button @click="verHistorial" class="btn-secondary bg-white text-orange-600 hover:bg-gray-100">
              Ver Historial
            </button>
            <button @click="nuevaPartida" class="btn-primary bg-orange-600 hover:bg-orange-700">
              Nueva Partida
            </button>
          </div>
        </div>
      </div>

      <!-- Vista Desktop: Tabla con columnas -->
      <div class="hidden md:block">
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <tr>
                  <th class="px-4 py-3 text-left font-semibold">Posición</th>
                  <th
                    v-for="jugador in gameStore.jugadoresOrdenados"
                    :key="jugador.id"
                    class="px-4 py-3 text-center font-semibold"
                    :class="{ 'opacity-60': jugador.eliminado }"
                  >
                    <div class="flex flex-col items-center">
                      <span>{{ jugador.nombre }}</span>
                      <span v-if="jugador.eliminado" class="text-xs bg-red-500 px-2 py-1 rounded-full mt-1">
                        Eliminado
                      </span>
                      <span v-if="jugador.vecesReenganchado > 0" class="text-xs bg-yellow-400 text-gray-800 px-2 py-1 rounded-full mt-1">
                        Reenganchado x{{ jugador.vecesReenganchado }}
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <!-- Rondas -->
                <tr
                  v-for="(ronda, index) in gameStore.rondas"
                  :key="ronda.numero"
                  class="border-b hover:bg-gray-50 transition-colors"
                >
                  <td class="px-4 py-3 font-semibold text-gray-700">
                    Ronda {{ ronda.numero }}
                  </td>
                  <td
                    v-for="jugador in gameStore.jugadoresOrdenados"
                    :key="jugador.id"
                    class="px-4 py-3 text-center"
                  >
                    <span
                      v-if="ronda.puntos[jugador.id] !== null && ronda.puntos[jugador.id] !== undefined"
                      :class="{
                        'text-green-600 font-bold text-lg chinchon-animation': ronda.puntos[jugador.id] === -10,
                        'text-gray-800': ronda.puntos[jugador.id] !== -10
                      }"
                    >
                      {{ ronda.puntos[jugador.id] }}
                    </span>
                    <span v-else class="text-gray-400">-</span>
                  </td>
                </tr>

                <!-- Total acumulado -->
                <tr class="bg-gradient-to-r from-gray-100 to-gray-200 font-bold text-lg">
                  <td class="px-4 py-4 text-gray-800">Total</td>
                  <td
                    v-for="jugador in gameStore.jugadoresOrdenados"
                    :key="jugador.id"
                    class="px-4 py-4 text-center"
                    :class="{
                      'text-red-600': jugador.puntosAcumulados >= gameStore.limiteEliminacion,
                      'text-green-600': jugador.puntosAcumulados <= 0 || jugador.puntosAcumulados < gameStore.limiteEliminacion / 2,
                      'text-yellow-600': jugador.puntosAcumulados > 0 && jugador.puntosAcumulados >= gameStore.limiteEliminacion / 2 && jugador.puntosAcumulados < gameStore.limiteEliminacion
                    }"
                  >
                    {{ jugador.puntosAcumulados }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Vista Mobile: Tarjetas -->
      <div class="md:hidden space-y-4">
        <PlayerCard
          v-for="jugador in gameStore.jugadoresOrdenados"
          :key="jugador.id"
          :jugador="jugador"
          :rondas="gameStore.rondas"
          :limite="gameStore.limiteEliminacion"
        />
      </div>

      <!-- Sección de lista de rondas (opcional) -->
      <div v-if="gameStore.rondas.length > 0" class="mt-8">
        <RoundsList :rondas="gameStore.rondas" :jugadores="gameStore.jugadores" />
      </div>
    </div>

    <!-- Modal Finalizar Ronda -->
    <FinalizarRondaModal
      v-if="mostrarModalFinalizar"
      :jugadores="gameStore.jugadoresActivos"
      @confirmar="finalizarRonda"
      @chinchon="manejarChinchon"
      @cerrar="cerrarModalFinalizarRonda"
    />

    <!-- Modal Reenganche -->
    <ReengancheModal
      v-if="mostrarModalReenganche"
      :jugadores="jugadoresQueAlcanzaronLimite"
      :limite="gameStore.limiteEliminacion"
      :puntos-reenganche="puntosReenganche"
      @reenganchar="reengancharJugador"
      @eliminar="eliminarJugador"
      @cerrar="cerrarModalReenganche"
    />
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameStore'
import HeaderBar from '@/components/HeaderBar.vue'
import PlayerCard from '@/components/PlayerCard.vue'
import RoundsList from '@/components/RoundsList.vue'
import FinalizarRondaModal from '@/components/FinalizarRondaModal.vue'
import ReengancheModal from '@/components/ReengancheModal.vue'

export default {
  name: 'GameView',
  components: {
    HeaderBar,
    PlayerCard,
    RoundsList,
    FinalizarRondaModal,
    ReengancheModal
  },
  setup() {
    const router = useRouter()
    const gameStore = useGameStore()

    // Redirigir si no hay juego activo
    if (!gameStore.juegoActivo && gameStore.jugadores.length === 0) {
      router.push('/')
    }

    const mostrarModalFinalizar = ref(false)
    const mostrarModalReenganche = ref(false)
    const jugadoresQueAlcanzaronLimite = ref([])

    const puntosReenganche = computed(() => {
      const jugadorConMasPuntos = gameStore.jugadorConMasPuntosActivo
      return jugadorConMasPuntos ? jugadorConMasPuntos.puntosAcumulados : 0
    })

    const abrirModalFinalizarRonda = () => {
      if (!gameStore.juegoFinalizado) {
        mostrarModalFinalizar.value = true
      }
    }

    const cerrarModalFinalizarRonda = () => {
      mostrarModalFinalizar.value = false
    }

    const finalizarRonda = (puntosRonda) => {
      const jugadoresAlLimite = gameStore.finalizarRonda(puntosRonda)
      
      cerrarModalFinalizarRonda()

      // Si hay jugadores que alcanzaron el límite, mostrar modal de reenganche
      if (jugadoresAlLimite.length > 0) {
        jugadoresQueAlcanzaronLimite.value = jugadoresAlLimite
        mostrarModalReenganche.value = true
      }
    }

    const cerrarModalReenganche = () => {
      mostrarModalReenganche.value = false
      jugadoresQueAlcanzaronLimite.value = []
    }

    const reengancharJugador = (jugadorId) => {
      gameStore.reengancharJugador(jugadorId)
      
      // Remover jugador de la lista
      jugadoresQueAlcanzaronLimite.value = jugadoresQueAlcanzaronLimite.value.filter(
        j => j.id !== jugadorId
      )

      // Si no quedan más jugadores, cerrar modal
      if (jugadoresQueAlcanzaronLimite.value.length === 0) {
        cerrarModalReenganche()
      }
    }

    const eliminarJugador = (jugadorId) => {
      gameStore.eliminarJugador(jugadorId)
      
      // Remover jugador de la lista
      jugadoresQueAlcanzaronLimite.value = jugadoresQueAlcanzaronLimite.value.filter(
        j => j.id !== jugadorId
      )

      // Si no quedan más jugadores, cerrar modal
      if (jugadoresQueAlcanzaronLimite.value.length === 0) {
        cerrarModalReenganche()
      }
    }

    const deshacerRonda = () => {
      if (confirm('¿Estás seguro de que quieres deshacer la última ronda?')) {
        gameStore.deshacerUltimaRonda()
      }
    }

    const volverInicio = () => {
      if (confirm('¿Quieres salir de la partida? El progreso se guardará automáticamente.')) {
        router.push('/')
      }
    }

    const verHistorial = () => {
      router.push('/historial')
    }

    const nuevaPartida = () => {
      if (confirm('¿Iniciar una nueva partida? La actual se guardará en el historial.')) {
        gameStore.reiniciarJuego()
        router.push('/')
      }
    }

    const manejarChinchon = (jugadorId) => {
      // Chinchón: termina la partida inmediatamente
      gameStore.finalizarJuegoPorChinchon(jugadorId)
      cerrarModalFinalizarRonda()
    }

    return {
      gameStore,
      mostrarModalFinalizar,
      mostrarModalReenganche,
      jugadoresQueAlcanzaronLimite,
      puntosReenganche,
      abrirModalFinalizarRonda,
      cerrarModalFinalizarRonda,
      finalizarRonda,
      manejarChinchon,
      cerrarModalReenganche,
      reengancharJugador,
      eliminarJugador,
      deshacerRonda,
      volverInicio,
      verHistorial,
      nuevaPartida
    }
  }
}
</script>
