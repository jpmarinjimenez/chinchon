<template>
  <div
    class="card transition-all duration-300"
    :class="{
      'opacity-50 border-crimson-700/40': jugador.eliminado,
      'border-felt-700/30': !jugador.eliminado && jugador.puntosAcumulados < limite / 2
    }"
  >
    <!-- Header de la tarjeta -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2">
          <span class="text-lg shrink-0" :class="jugador.eliminado ? 'text-crimson-500 opacity-50' : 'text-crimson-400'">♥</span>
          <h3 class="text-lg sm:text-xl font-display font-bold text-parchment truncate">{{ jugador.nombre }}</h3>
          <button
            @click="$emit('editar-nombre', jugador)"
            class="text-navy-400 hover:text-gold-400 transition-colors p-1 shrink-0"
            :aria-label="`Editar nombre de ${jugador.nombre}`"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
        <div class="flex gap-2 mt-1.5 flex-wrap">
          <span
            v-if="jugador.eliminado"
            class="badge badge-eliminated"
          >
            ✕ Eliminado
          </span>
          <span
            v-if="jugador.vecesReenganchado > 0"
            class="badge badge-rehooked"
          >
            ♻ Reenganchado x{{ jugador.vecesReenganchado }}
          </span>
        </div>
      </div>

      <div class="text-right pl-4 shrink-0">
        <p class="text-xs text-navy-400 uppercase tracking-wider font-medium">Total</p>
        <p
          class="text-3xl sm:text-4xl font-display font-bold tabular-nums"
          :class="scoreColor"
        >
          {{ jugador.puntosAcumulados }}
        </p>
      </div>
    </div>

    <!-- Historial de rondas -->
    <div class="border-t border-white/5 pt-3">
      <p class="text-xs text-navy-400 mb-2 uppercase tracking-wider">Rondas</p>
      <div class="flex flex-wrap gap-1.5">
        <span
          v-for="(ronda, index) in rondas"
          :key="index"
          class="px-2.5 py-1 rounded-lg text-xs font-medium tabular-nums"
          :class="{
            'bg-green-500/15 text-green-300 font-bold ring-1 ring-green-500/20': ronda.puntos[jugador.id] === -10,
            'bg-white/5 text-navy-200': ronda.puntos[jugador.id] !== -10 && ronda.puntos[jugador.id] !== null,
            'bg-white/[0.02] text-navy-500': ronda.puntos[jugador.id] === null
          }"
        >
          R{{ index + 1 }}: {{ ronda.puntos[jugador.id] ?? '-' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlayerCard',
  props: {
    jugador: {
      type: Object,
      required: true
    },
    rondas: {
      type: Array,
      required: true
    },
    limite: {
      type: Number,
      required: true
    }
  },
  emits: ['editar-nombre'],
  computed: {
    scoreColor() {
      const pts = this.jugador.puntosAcumulados
      if (pts >= this.limite) return 'score-danger'
      if (pts >= this.limite / 2) return 'score-warning'
      return 'score-safe'
    }
  }
}
</script>
