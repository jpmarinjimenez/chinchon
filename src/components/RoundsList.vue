<template>
  <div class="glass-card">
    <h2 class="text-xl sm:text-2xl font-display font-bold text-parchment mb-4 flex items-center gap-2">
      <span class="text-crimson-400">♦</span>
      Historial de Rondas
    </h2>
    
    <div class="space-y-2.5">
      <div
        v-for="ronda in rondas"
        :key="ronda.numero"
        class="border-l-2 border-crimson-700/40 pl-4 py-2.5 rounded-r-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
      >
        <div class="flex items-center justify-between">
          <h3 class="font-semibold text-parchment text-sm font-display">Ronda {{ ronda.numero }}</h3>
          <span class="text-xs text-navy-500">{{ formatearFecha(ronda.fecha) }}</span>
        </div>
        
        <div class="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <span
            v-for="jugador in jugadores"
            :key="jugador.id"
            class="text-navy-300"
          >
            <span class="font-medium text-navy-200">{{ jugador.nombre }}:</span>
            <span
              class="tabular-nums ml-1"
              :class="{
                'score-special': ronda.puntos[jugador.id] === -10
              }"
            >
              {{ ronda.puntos[jugador.id] ?? '-' }}
            </span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RoundsList',
  props: {
    rondas: {
      type: Array,
      required: true
    },
    jugadores: {
      type: Array,
      required: true
    }
  },
  methods: {
    formatearFecha(fechaISO) {
      const fecha = new Date(fechaISO)
      return fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    }
  }
}
</script>
