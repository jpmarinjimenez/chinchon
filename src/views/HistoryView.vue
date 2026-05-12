<template>
  <div class="min-h-screen py-6 sm:py-8 relative z-10">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl sm:text-4xl font-display font-bold text-parchment flex items-center gap-3">
            <span class="text-crimson-400">♠</span>
            Historial de Partidas
          </h1>
          <p class="text-navy-400 mt-2 text-sm sm:text-base">Revisa tus partidas anteriores</p>
        </div>
        <button @click="volverInicio" class="btn-secondary text-sm self-start sm:self-auto">
          ← Volver
        </button>
      </div>

      <!-- Lista de partidas -->
      <div v-if="gameStore.historialPartidas.length > 0" class="space-y-4">
        <div
          v-for="partida in gameStore.historialPartidas"
          :key="partida.id"
          class="glass-card hover:border-gold-600/20 transition-all duration-300"
        >
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <!-- Información de la partida -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-3 mb-2">
                <span class="text-2xl">🏆</span>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <h3 class="text-lg sm:text-xl font-display font-semibold text-parchment truncate">
                      Ganador: {{ partida.ganador }}
                    </h3>
                    <span
                      v-if="esGanadorPorChinchon(partida)"
                      class="badge bg-gradient-to-r from-gold-500/20 to-gold-600/20 text-gold-300 border-gold-500/30 border animate-pulse-fast text-[10px] sm:text-xs"
                    >
                      🎉 CHINCHÓN
                    </span>
                  </div>
                  <p class="text-xs sm:text-sm text-navy-400 mt-0.5">
                    {{ formatearFecha(partida.fecha) }}
                  </p>
                  <p
                    v-if="esGanadorPorChinchon(partida)"
                    class="text-xs text-gold-500 font-semibold mt-1"
                  >
                    Victoria automática
                  </p>
                </div>
              </div>
              
              <div class="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs sm:text-sm text-navy-300">
                <div class="flex items-center gap-1.5">
                  <span class="text-crimson-400">♥</span>
                  <span class="font-medium text-navy-200">{{ partida.jugadores.length }}</span> jugadores
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="text-navy-400">♣</span>
                  <span class="font-medium text-navy-200">{{ partida.rondas.length }}</span> rondas
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="text-gold-500">♦</span>
                  <span class="font-medium text-navy-200">{{ partida.limiteEliminacion }}</span> pts
                </div>
              </div>

              <!-- Clasificación -->
              <div class="mt-4">
                <p class="text-xs font-semibold text-navy-400 mb-2 uppercase tracking-wider">Clasificación final</p>
                <div class="flex flex-wrap gap-1.5">
                  <span
                    v-for="(jugador, index) in obtenerClasificacion(partida)"
                    :key="jugador.id"
                    class="badge text-[10px] sm:text-xs"
                    :class="{
                      'bg-gold-500/15 text-gold-300 border border-gold-500/20': index === 0,
                      'bg-white/5 text-navy-300 border border-white/5': index > 0
                    }"
                  >
                    {{ index + 1 }}. {{ jugador.nombre }} ({{ jugador.puntosAcumulados }} pts)
                  </span>
                </div>
              </div>
            </div>

            <!-- Acciones -->
            <div class="flex sm:flex-col gap-2 shrink-0">
              <button
                @click="verDetallePartida(partida)"
                class="btn-primary text-xs sm:text-sm flex-1 sm:flex-none"
              >
                Ver Detalle
              </button>
              <button
                @click="eliminarPartida(partida.id)"
                class="btn-danger text-xs sm:text-sm flex-1 sm:flex-none"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mensaje si no hay partidas -->
      <div v-else class="glass-card text-center py-12">
        <div class="text-5xl sm:text-6xl mb-4 opacity-50">📭</div>
        <h2 class="text-xl sm:text-2xl font-display font-semibold text-parchment mb-2">No hay partidas en el historial</h2>
        <p class="text-navy-400 mb-6 text-sm sm:text-base">Comienza una nueva partida para verla aquí</p>
        <button @click="volverInicio" class="btn-primary">
          ♠ Iniciar Nueva Partida
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
        <div class="p-5 sm:p-6 border-b border-white/5" style="background: linear-gradient(135deg, rgba(36, 59, 83, 0.5) 0%, rgba(26, 45, 66, 0.5) 100%);">
          <div class="flex items-center justify-between">
            <h2 class="text-xl sm:text-2xl font-display font-bold text-parchment">Detalle de Partida</h2>
            <button
              @click="cerrarDetalle"
              class="text-navy-400 hover:text-parchment text-2xl leading-none p-2 rounded-full hover:bg-white/5 transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        <div class="p-5 sm:p-6">
          <div class="mb-5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-navy-300">
            <p>
              <span class="font-semibold text-navy-200">Fecha:</span> {{ formatearFecha(partidaSeleccionada.fecha) }}
            </p>
            <div class="flex items-center gap-2 flex-wrap">
              <p>
                <span class="font-semibold text-navy-200">Ganador:</span> {{ partidaSeleccionada.ganador }}
              </p>
              <span
                v-if="esGanadorPorChinchon(partidaSeleccionada)"
                class="badge bg-gold-500/15 text-gold-300 border border-gold-500/20 text-[10px]"
              >
                🎉 CHINCHÓN
              </span>
            </div>
          </div>

          <!-- Tabla de puntuaciones -->
          <div class="overflow-x-auto rounded-xl">
            <table class="table-bicycle">
              <thead>
                <tr>
                  <th class="text-left">Ronda</th>
                  <th
                    v-for="jugador in partidaSeleccionada.jugadores"
                    :key="jugador.id"
                    class="text-center"
                  >
                    {{ jugador.nombre }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="ronda in partidaSeleccionada.rondas"
                  :key="ronda.numero"
                >
                  <td class="font-semibold text-navy-300 text-sm">{{ ronda.numero }}</td>
                  <td
                    v-for="jugador in partidaSeleccionada.jugadores"
                    :key="jugador.id"
                    class="text-center tabular-nums"
                  >
                    <span
                      :class="{
                        'score-special': ronda.puntos[jugador.id] === -10
                      }"
                    >
                      {{ ronda.puntos[jugador.id] ?? '-' }}
                    </span>
                  </td>
                </tr>
                <tr class="border-t-2 border-gold-600/30">
                  <td class="font-bold text-gold-400 py-4 uppercase text-sm tracking-wider">Total</td>
                  <td
                    v-for="jugador in partidaSeleccionada.jugadores"
                    :key="jugador.id"
                    class="text-center py-4 tabular-nums"
                  >
                    <span class="font-bold font-display text-parchment">
                      {{ jugador.puntosAcumulados }}
                    </span>
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
import { useSeo } from '@/composables/useSeo'

export default {
  name: 'HistoryView',
  setup() {
    const router = useRouter()
    const gameStore = useGameStore()

    // SEO para página de historial
    useSeo({
      title: 'Historial de Partidas de Chinchón',
      description: 'Consulta el historial de tus partidas de Chinchón. Revisa las estadísticas, ganadores y puntuaciones de tus partidas anteriores.',
      canonical: 'https://chinchon.jpmarin.dev/historial'
    })
    
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
