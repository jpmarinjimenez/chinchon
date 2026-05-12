<template>
  <header class="relative z-10">
    <div class="border-b border-white/5" style="background: linear-gradient(180deg, rgba(26, 45, 66, 0.95) 0%, rgba(10, 25, 41, 0.98) 100%); backdrop-filter: blur(20px);">
      <div class="container mx-auto px-4 py-4">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <!-- Título e información -->
          <div class="flex items-center gap-3">
            <div class="flex items-baseline gap-1.5">
              <span class="text-crimson-400 text-xl">♥</span>
              <h1 class="text-xl sm:text-2xl font-display font-bold text-parchment">Chinchón</h1>
            </div>
            <div class="h-5 w-px bg-white/10 hidden sm:block"></div>
            <div class="text-navy-300 text-xs sm:text-sm flex items-center gap-2 flex-wrap">
              <span>Ronda {{ rondaActual }}</span>
              <span class="text-white/20">·</span>
              <span>Límite {{ limite }} pts</span>
              <span v-if="boteAcumulado > 0" class="text-gold-400 font-semibold">
                · Bote: {{ boteAcumulado }}€
              </span>
            </div>
          </div>

          <!-- Acciones -->
          <div class="flex flex-wrap gap-2">
            <button
              @click="$emit('finalizar-ronda')"
              class="btn-felt text-sm flex items-center gap-1.5"
            >
              <span>✓</span>
              <span class="hidden sm:inline">Finalizar Ronda</span>
              <span class="sm:hidden">Finalizar</span>
            </button>

            <button
              v-if="rondaActual > 1"
              @click="$emit('deshacer-ronda')"
              class="btn-gold text-sm flex items-center gap-1.5"
            >
              <span>↶</span>
              <span class="hidden sm:inline">Deshacer</span>
            </button>

            <button
              v-if="puedeAnadirJugador"
              @click="$emit('anadir-jugador')"
              class="btn-secondary text-sm flex items-center gap-1.5"
            >
              <span>+</span>
              <span class="hidden sm:inline">Jugador</span>
            </button>

            <button
              @click="$emit('volver-inicio')"
              class="btn-secondary text-sm flex items-center gap-1.5 opacity-70 hover:opacity-100"
            >
              <span class="hidden sm:inline">Salir</span>
              <span class="sm:hidden">✕</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'HeaderBar',
  props: {
    rondaActual: {
      type: Number,
      required: true
    },
    limite: {
      type: Number,
      required: true
    },
    boteAcumulado: {
      type: Number,
      default: 0
    },
    puedeAnadirJugador: {
      type: Boolean,
      default: false
    }
  },
  emits: ['finalizar-ronda', 'deshacer-ronda', 'anadir-jugador', 'volver-inicio']
}
</script>
