<template>
  <div class="min-h-screen relative z-10">
    <!-- Header -->
    <HeaderBar
      :ronda-actual="gameStore.rondaActual"
      :limite="gameStore.limiteEliminacion"
      :bote-acumulado="gameStore.boteAcumulado"
      :puede-anadir-jugador="puedeAnadirJugador"
      @finalizar-ronda="abrirModalFinalizarRonda"
      @deshacer-ronda="deshacerRonda"
      @anadir-jugador="abrirModalAnadirJugador"
      @volver-inicio="volverInicio"
    />

    <!-- Contenido principal -->
    <div class="container mx-auto px-4 py-6">

      <!-- Resumen final si el juego terminó -->
      <div v-if="gameStore.juegoFinalizado" class="mb-6">
        <div class="glass-card text-center overflow-hidden relative">
          <!-- Decorative top strip -->
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-crimson-600 via-gold-400 to-crimson-600"></div>

          <div class="text-5xl sm:text-6xl mb-4 mt-2">🏆</div>
          <h2 class="text-2xl sm:text-3xl font-display font-bold text-parchment mb-2">¡Partida Finalizada!</h2>
          <p v-if="gameStore.ganador?.chinchon" class="text-xl sm:text-2xl mb-2 font-bold animate-pulse text-gold-400">
            ¡CHINCHÓN! 🎉
          </p>
          <p class="text-lg sm:text-xl mb-1 text-navy-200">
            Ganador: <span class="font-bold text-parchment font-display">{{ gameStore.ganador?.nombre }}</span>
          </p>
          <p v-if="gameStore.ganador?.chinchon" class="text-sm text-gold-500">Victoria automática por Chinchón</p>

          <div class="flex flex-wrap gap-3 justify-center mt-6">
            <button @click="verHistorial" class="btn-secondary text-sm">
              📊 Historial
            </button>
            <button @click="nuevaPartida" class="btn-primary text-sm">
              ♻️ Nueva Partida
            </button>
            <button @click="volverAlInicio" class="btn-secondary text-sm">
              ← Inicio
            </button>
          </div>
        </div>
      </div>

      <!-- Vista Desktop: Tabla con columnas -->
      <div class="hidden md:block">
        <div class="glass-card overflow-hidden !p-0">
          <div class="overflow-x-auto">
            <table class="table-bicycle">
              <thead>
                <tr>
                  <th class="text-left">Ronda</th>
                  <th
                    v-for="jugador in gameStore.jugadoresOrdenados"
                    :key="jugador.id"
                    class="text-center"
                    :class="{ 'opacity-40': jugador.eliminado }"
                  >
                    <div class="flex flex-col items-center gap-1">
                      <div class="flex items-center gap-2">
                        <span>{{ jugador.nombre }}</span>
                        <button
                          @click="abrirModalEditarNombre(jugador)"
                          class="text-navy-400 hover:text-gold-400 transition-colors p-0.5"
                          :aria-label="`Editar nombre de ${jugador.nombre}`"
                        >
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                      </div>
                      <span v-if="jugador.eliminado" class="badge badge-eliminated text-[10px]">
                        Eliminado
                      </span>
                      <span v-if="jugador.vecesReenganchado > 0" class="badge badge-rehooked text-[10px]">
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
                >
                  <td class="font-semibold text-navy-300 text-sm">
                    Ronda {{ ronda.numero }}
                  </td>
                  <td
                    v-for="jugador in gameStore.jugadoresOrdenados"
                    :key="jugador.id"
                    class="text-center tabular-nums"
                  >
                    <span
                      v-if="ronda.puntos[jugador.id] !== null && ronda.puntos[jugador.id] !== undefined"
                      :class="{
                        'score-special chinchon-animation': ronda.puntos[jugador.id] === -10,
                        'text-parchment': ronda.puntos[jugador.id] !== -10
                      }"
                    >
                      {{ ronda.puntos[jugador.id] }}
                    </span>
                    <span v-else class="text-navy-600">-</span>
                  </td>
                </tr>

                <!-- Total acumulado -->
                <tr class="border-t-2 border-gold-600/30">
                  <td class="font-bold text-gold-400 py-4 uppercase text-sm tracking-wider">Total</td>
                  <td
                    v-for="jugador in gameStore.jugadoresOrdenados"
                    :key="jugador.id"
                    class="text-center py-4 tabular-nums"
                  >
                    <span
                      class="text-3xl font-bold font-display"
                      :class="{
                        'score-danger': jugador.puntosAcumulados >= gameStore.limiteEliminacion,
                        'score-safe': jugador.puntosAcumulados <= 0 || jugador.puntosAcumulados < gameStore.limiteEliminacion / 2,
                        'score-warning': jugador.puntosAcumulados > 0 && jugador.puntosAcumulados >= gameStore.limiteEliminacion / 2 && jugador.puntosAcumulados < gameStore.limiteEliminacion
                      }"
                    >
                      {{ jugador.puntosAcumulados }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Vista Mobile: Tarjetas -->
      <div class="md:hidden space-y-3">
        <PlayerCard
          v-for="jugador in gameStore.jugadoresOrdenados"
          :key="jugador.id"
          :jugador="jugador"
          :rondas="gameStore.rondas"
          :limite="gameStore.limiteEliminacion"
          @editar-nombre="abrirModalEditarNombre"
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

    <!-- Modal Añadir Jugador -->
    <AnadirJugadorModal
      v-if="mostrarModalAnadirJugador"
      :puntos-reenganche="puntosReenganche"
      :jugadores-existentes="gameStore.jugadores"
      @confirmar="anadirJugador"
      @cerrar="cerrarModalAnadirJugador"
    />

    <!-- Modal Editar Nombre -->
    <EditarNombreModal
      v-if="mostrarModalEditarNombre && jugadorAEditar"
      :jugador="jugadorAEditar"
      :jugadores-existentes="gameStore.jugadores"
      @confirmar="editarNombreJugador"
      @cerrar="cerrarModalEditarNombre"
    />
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameStore'
import { useSeo } from '@/composables/useSeo'
import { useAudio } from '@/composables/useAudio'
import HeaderBar from '@/components/HeaderBar.vue'
import PlayerCard from '@/components/PlayerCard.vue'
import RoundsList from '@/components/RoundsList.vue'
import FinalizarRondaModal from '@/components/FinalizarRondaModal.vue'
import ReengancheModal from '@/components/ReengancheModal.vue'
import AnadirJugadorModal from '@/components/AnadirJugadorModal.vue'
import EditarNombreModal from '@/components/EditarNombreModal.vue'

export default {
  name: 'GameView',
  components: {
    HeaderBar,
    PlayerCard,
    RoundsList,
    FinalizarRondaModal,
    ReengancheModal,
    AnadirJugadorModal,
    EditarNombreModal
  },
  setup() {
    const router = useRouter()
    const gameStore = useGameStore()
    const { reproducirSonidoVictoria, reproducirSonidoDinero } = useAudio()

    // SEO para página de juego
    useSeo({
      title: 'Jugar Chinchón Online',
      description: 'Lleva la puntuación de tu partida de Chinchón online. Contador automático para 2-8 jugadores con sistema de reenganche y guardado automático.',
      canonical: 'https://chinchon.jpmarin.dev/juego'
    })

    // Redirigir si no hay juego activo
    if (!gameStore.juegoActivo && gameStore.jugadores.length === 0) {
      router.push('/')
    }

    const mostrarModalFinalizar = ref(false)
    const mostrarModalReenganche = ref(false)
    const mostrarModalAnadirJugador = ref(false)
    const mostrarModalEditarNombre = ref(false)
    const jugadorAEditar = ref(null)
    const jugadoresQueAlcanzaronLimite = ref([])

    const puntosReenganche = computed(() => {
      const jugadorConMasPuntos = gameStore.jugadorConMasPuntosActivo
      return jugadorConMasPuntos ? jugadorConMasPuntos.puntosAcumulados : 0
    })

    const puedeAnadirJugador = computed(() => {
      return gameStore.juegoActivo && !gameStore.juegoFinalizado && gameStore.jugadores.length < 8
    })

    // Reproducir sonido de victoria cuando el juego finaliza
    watch(() => gameStore.juegoFinalizado, (finalizado, finalizadoAnterior) => {
      if (finalizado && !finalizadoAnterior) {
        // El juego acaba de finalizar, reproducir sonido de victoria
        setTimeout(() => {
          reproducirSonidoVictoria()
        }, 300) // Pequeño delay para que coincida con la animación
      }
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
      
      if (gameStore.precioReenganche > 0) {
        reproducirSonidoDinero()
      }

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
      if (confirm('¿Iniciar una nueva partida con los mismos jugadores? La actual se guardará en el historial.')) {
        // Guardar los nombres de los jugadores actuales
        const nombresJugadores = gameStore.jugadores.map(j => j.nombre)
        const limite = gameStore.limiteEliminacion
        const precioEntrada = gameStore.precioEntrada
        const precioReenganche = gameStore.precioReenganche
        
        // Iniciar nueva partida con los mismos jugadores
        gameStore.iniciarNuevoJuego(limite, nombresJugadores, precioEntrada, precioReenganche)
      }
    }

    const volverAlInicio = () => {
      if (confirm('¿Volver al inicio? La partida actual se guardará en el historial.')) {
        gameStore.reiniciarJuego()
        router.push('/')
      }
    }

    const manejarChinchon = (jugadorId) => {
      const jugador = gameStore.jugadores.find(j => j.id === jugadorId)
      if (!jugador) return

      if (confirm(`¿Estás seguro de que ${jugador.nombre} ha hecho CHINCHÓN?\n\nLa partida terminará inmediatamente y ${jugador.nombre} ganará.`)) {
        // Chinchón: termina la partida inmediatamente
        gameStore.finalizarJuegoPorChinchon(jugadorId)
        cerrarModalFinalizarRonda()
      }
    }

    const abrirModalAnadirJugador = () => {
      if (!gameStore.juegoFinalizado && gameStore.jugadores.length < 8) {
        mostrarModalAnadirJugador.value = true
      }
    }

    const cerrarModalAnadirJugador = () => {
      mostrarModalAnadirJugador.value = false
    }

    const anadirJugador = (nombre) => {
      const resultado = gameStore.anadirJugadorAPartida(nombre)
      
      if (resultado) {
        if (gameStore.precioEntrada > 0) {
          reproducirSonidoDinero()
        }
        // Jugador añadido exitosamente
        cerrarModalAnadirJugador()
      } else {
        // Error al añadir jugador (el modal manejará el error)
        console.error('No se pudo añadir el jugador')
      }
    }

    const abrirModalEditarNombre = (jugador) => {
      jugadorAEditar.value = jugador
      mostrarModalEditarNombre.value = true
    }

    const cerrarModalEditarNombre = () => {
      mostrarModalEditarNombre.value = false
      jugadorAEditar.value = null
    }

    const editarNombreJugador = ({ jugadorId, nuevoNombre }) => {
      // El modal ya validó que no hay duplicados, solo actualizar el nombre
      gameStore.editarNombreJugador(jugadorId, nuevoNombre)
      cerrarModalEditarNombre()
    }

    return {
      gameStore,
      mostrarModalFinalizar,
      mostrarModalReenganche,
      mostrarModalAnadirJugador,
      mostrarModalEditarNombre,
      jugadorAEditar,
      jugadoresQueAlcanzaronLimite,
      puntosReenganche,
      puedeAnadirJugador,
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
      nuevaPartida,
      volverAlInicio,
      abrirModalAnadirJugador,
      cerrarModalAnadirJugador,
      anadirJugador,
      abrirModalEditarNombre,
      cerrarModalEditarNombre,
      editarNombreJugador
    }
  }
}
</script>
