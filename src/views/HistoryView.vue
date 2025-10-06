<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-4xl font-bold text-gray-800">📊 Historial de Partidas</h1>
          <p class="text-gray-600 mt-2">Revisa tus partidas anteriores</p>
        </div>
        <button @click="volverInicio" class="btn-secondary">
          ← Volver
        </button>
      </div>

      <!-- Lista de partidas -->
      <div v-if="gameStore.historialPartidas.length > 0" class="space-y-4">
        <div
          v-for="partida in gameStore.historialPartidas"
          :key="partida.id"
          class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
        >
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <!-- Información de la partida -->
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <span class="text-2xl">🏆</span>
                <div class="flex-1">
                  <div class="flex items-center gap-2 flex-wrap">
                    <h3 class="text-xl font-semibold text-gray-800">
                      Ganador: {{ partida.ganador }}
                    </h3>
                    <span
                      v-if="esGanadorPorChinchon(partida)"
                      class="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-full text-xs animate-pulse"
                    >
                      🎉 CHINCHÓN
                    </span>
                  </div>
                  <p class="text-sm text-gray-500">
                    {{ formatearFecha(partida.fecha) }}
                  </p>
                  <p
                    v-if="esGanadorPorChinchon(partida)"
                    class="text-xs text-orange-600 font-semibold mt-1"
                  >
                    Victoria automática
                  </p>
                </div>
              </div>
              
              <div class="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                <div class="flex items-center gap-2">
                  <span class="font-semibold">Jugadores:</span>
                  <span>{{ partida.jugadores.length }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="font-semibold">Rondas:</span>
                  <span>{{ partida.rondas.length }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="font-semibold">Límite:</span>
                  <span>{{ partida.limiteEliminacion }} pts</span>
                </div>
              </div>

              <!-- Clasificación -->
              <div class="mt-4">
                <p class="text-sm font-semibold text-gray-700 mb-2">Clasificación final:</p>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="(jugador, index) in obtenerClasificacion(partida)"
                    :key="jugador.id"
                    class="px-3 py-1 rounded-full text-sm font-medium"
                    :class="{
                      'bg-yellow-100 text-yellow-800': index === 0,
                      'bg-gray-100 text-gray-700': index > 0
                    }"
                  >
                    {{ index + 1 }}. {{ jugador.nombre }} ({{ jugador.puntosAcumulados }} pts)
                  </span>
                </div>
              </div>
            </div>

            <!-- Acciones -->
            <div class="flex flex-col gap-2">
              <button
                @click="verDetallePartida(partida)"
                class="btn-primary text-sm"
              >
                Ver Detalle
              </button>
              <button
                @click="eliminarPartida(partida.id)"
                class="btn-danger text-sm"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mensaje si no hay partidas -->
      <div v-else class="bg-white rounded-xl shadow-lg p-12 text-center">
        <div class="text-6xl mb-4">📭</div>
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">No hay partidas en el historial</h2>
        <p class="text-gray-500 mb-6">Comienza una nueva partida para verla aquí</p>
        <button @click="volverInicio" class="btn-primary">
          Iniciar Nueva Partida
        </button>
      </div>
    </div>

    <!-- Modal de detalle de partida -->
    <div
      v-if="partidaSeleccionada"
      class="modal-overlay"
      @click.self="cerrarDetalle"
    >
      <div class="modal-content max-w-4xl">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Detalle de Partida</h2>
            <button
              @click="cerrarDetalle"
              class="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <div class="mb-6">
            <p class="text-gray-600">
              <span class="font-semibold">Fecha:</span> {{ formatearFecha(partidaSeleccionada.fecha) }}
            </p>
            <div class="flex items-center gap-2 flex-wrap">
              <p class="text-gray-600">
                <span class="font-semibold">Ganador:</span> {{ partidaSeleccionada.ganador }}
              </p>
              <span
                v-if="esGanadorPorChinchon(partidaSeleccionada)"
                class="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-full text-xs"
              >
                🎉 CHINCHÓN - Victoria automática
              </span>
            </div>
          </div>

          <!-- Tabla de puntuaciones -->
          <div class="overflow-x-auto">
            <table class="w-full border-collapse">
              <thead class="bg-blue-600 text-white">
                <tr>
                  <th class="px-4 py-2 text-left">Ronda</th>
                  <th
                    v-for="jugador in partidaSeleccionada.jugadores"
                    :key="jugador.id"
                    class="px-4 py-2 text-center"
                  >
                    {{ jugador.nombre }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="ronda in partidaSeleccionada.rondas"
                  :key="ronda.numero"
                  class="border-b hover:bg-gray-50"
                >
                  <td class="px-4 py-2 font-semibold">{{ ronda.numero }}</td>
                  <td
                    v-for="jugador in partidaSeleccionada.jugadores"
                    :key="jugador.id"
                    class="px-4 py-2 text-center"
                  >
                    <span
                      :class="{
                        'text-green-600 font-bold': ronda.puntos[jugador.id] === -10
                      }"
                    >
                      {{ ronda.puntos[jugador.id] ?? '-' }}
                    </span>
                  </td>
                </tr>
                <tr class="bg-gray-100 font-bold">
                  <td class="px-4 py-2">Total</td>
                  <td
                    v-for="jugador in partidaSeleccionada.jugadores"
                    :key="jugador.id"
                    class="px-4 py-2 text-center"
                  >
                    {{ jugador.puntosAcumulados }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameStore'

export default {
  name: 'HistoryView',
  setup() {
    const router = useRouter()
    const gameStore = useGameStore()
    
    // Cargar historial al montar
    gameStore.cargarHistorialDesdeLocalStorage()

    const partidaSeleccionada = ref(null)

    const formatearFecha = (fechaISO) => {
      const fecha = new Date(fechaISO)
      return fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const obtenerClasificacion = (partida) => {
      return [...partida.jugadores].sort((a, b) => a.puntosAcumulados - b.puntosAcumulados)
    }

    const verDetallePartida = (partida) => {
      partidaSeleccionada.value = partida
    }

    const cerrarDetalle = () => {
      partidaSeleccionada.value = null
    }

    const eliminarPartida = (partidaId) => {
      if (confirm('¿Estás seguro de que quieres eliminar esta partida del historial?')) {
        gameStore.eliminarPartidaDelHistorial(partidaId)
      }
    }

    const volverInicio = () => {
      router.push('/')
    }

    const esGanadorPorChinchon = (partida) => {
      // Buscar si algún jugador tiene chinchon: true
      const ganadorChinchon = partida.jugadores.find(j => j.chinchon === true)
      return !!ganadorChinchon
    }

    return {
      gameStore,
      partidaSeleccionada,
      formatearFecha,
      obtenerClasificacion,
      verDetallePartida,
      cerrarDetalle,
      eliminarPartida,
      volverInicio,
      esGanadorPorChinchon
    }
  }
}
</script>
