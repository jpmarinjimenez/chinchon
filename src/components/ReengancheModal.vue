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
          <div class="p-6 text-center border-b border-white/5" style="background: linear-gradient(135deg, rgba(196, 30, 49, 0.2) 0%, rgba(26, 45, 66, 0.5) 100%);">
            <div class="flex items-center justify-center mb-3">
              <span class="text-5xl sm:text-6xl animate-pulse-fast">⚠️</span>
            </div>
            <h2 id="reenganche-title" class="text-xl sm:text-2xl font-display font-bold text-parchment">
              ¡Límite Alcanzado!
            </h2>
            <p class="text-navy-300 mt-2 text-sm">
              {{ jugadores.length > 1 ? 'Algunos jugadores han' : 'Un jugador ha' }} alcanzado el límite de {{ limite }} puntos
            </p>
          </div>

          <!-- Body -->
          <div class="p-5 sm:p-6">
            <!-- Procesar cada jugador -->
            <div
              v-for="jugador in jugadores"
              :key="jugador.id"
              class="mb-5 last:mb-0"
            >
              <div class="rounded-xl border border-crimson-700/30 bg-crimson-950/20 p-5">
                <!-- Info del jugador -->
                <div class="text-center mb-4">
                  <h3 class="text-xl sm:text-2xl font-display font-bold text-parchment">{{ jugador.nombre }}</h3>
                  <p class="text-crimson-400 font-semibold text-lg mt-1 tabular-nums">
                    {{ jugador.puntosAcumulados }} puntos
                  </p>
                  <p v-if="jugador.vecesReenganchado > 0" class="text-sm text-navy-400 mt-1">
                    Ya se ha reenganchado {{ jugador.vecesReenganchado }} {{ jugador.vecesReenganchado === 1 ? 'vez' : 'veces' }}
                  </p>
                </div>

                <!-- Explicación del reenganche -->
                <div class="rounded-xl p-4 mb-4 bg-white/[0.03] border border-white/5">
                  <p class="text-sm text-navy-200 mb-2">
                    <span class="font-semibold text-parchment">Si se reengancha:</span>
                    Continuará con <span class="font-bold text-gold-400">{{ puntosReenganche }} puntos</span>
                    (los mismos que el jugador más cercano al límite).
                  </p>
                  <p class="text-sm text-navy-200">
                    <span class="font-semibold text-parchment">Si se elimina:</span>
                    Quedará fuera del juego.
                  </p>
                </div>

                <!-- Botones de decisión -->
                <div class="flex gap-3">
                  <button
                    @click="reenganchar(jugador.id)"
                    class="flex-1 btn-primary py-3"
                  >
                    ♻️ Reenganchar
                  </button>
                  <button
                    @click="eliminar(jugador.id)"
                    class="flex-1 btn-danger py-3"
                  >
                    ✕ Eliminar
                  </button>
                </div>
              </div>
            </div>

            <!-- Mensaje si todos decidieron -->
            <div v-if="jugadores.length === 0" class="text-center py-8">
              <p class="text-navy-400">Todos los jugadores han tomado su decisión.</p>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script>
import { onMounted } from 'vue'
import { useAudio } from '@/composables/useAudio'

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
    const { reproducirSonidoAlerta } = useAudio()
    
    onMounted(() => {
      // Reproducir sonido de alerta
      reproducirSonidoAlerta()
    })

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
