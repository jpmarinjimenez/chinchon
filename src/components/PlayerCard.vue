<template>
  <div
    class="card transition-all"
    :class="{
      'opacity-60 border-2 border-red-300': jugador.eliminado,
      'border-2 border-green-400': !jugador.eliminado && jugador.puntosAcumulados < limite / 2
    }"
  >
    <!-- Header de la tarjeta -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-xl font-bold text-gray-800">{{ jugador.nombre }}</h3>
        <div class="flex gap-2 mt-1">
          <span
            v-if="jugador.eliminado"
            class="text-xs bg-red-500 text-white px-2 py-1 rounded-full"
          >
            Eliminado
          </span>
          <span
            v-if="jugador.vecesReenganchado > 0"
            class="text-xs bg-yellow-400 text-gray-800 px-2 py-1 rounded-full"
          >
            Reenganchado x{{ jugador.vecesReenganchado }}
          </span>
        </div>
      </div>
      
      <div class="text-right">
        <p class="text-sm text-gray-500">Total</p>
        <p
          class="text-3xl font-bold"
          :class="{
            'text-red-600': jugador.puntosAcumulados >= limite,
            'text-green-600': jugador.puntosAcumulados < limite / 2,
            'text-yellow-600': jugador.puntosAcumulados >= limite / 2 && jugador.puntosAcumulados < limite
          }"
        >
          {{ jugador.puntosAcumulados }}
        </p>
      </div>
    </div>

    <!-- Historial de rondas -->
    <div class="border-t pt-3">
      <p class="text-xs text-gray-500 mb-2">Historial de rondas:</p>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="(ronda, index) in rondas"
          :key="index"
          class="px-2 py-1 rounded text-sm"
          :class="{
            'bg-green-100 text-green-700 font-bold': ronda.puntos[jugador.id] === -10,
            'bg-gray-100 text-gray-700': ronda.puntos[jugador.id] !== -10 && ronda.puntos[jugador.id] !== null,
            'bg-gray-50 text-gray-400': ronda.puntos[jugador.id] === null
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
  }
}
</script>
