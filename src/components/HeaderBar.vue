<template>
  <header class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
    <div class="container mx-auto px-4 py-4">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <!-- Título e información -->
        <div>
          <h1 class="text-2xl md:text-3xl font-bold flex items-center gap-2">
            🎴 Chinchón
          </h1>
          <p class="text-blue-100 text-sm mt-1">
            Ronda {{ rondaActual }} · Límite: {{ limite }} puntos
          </p>
        </div>

        <!-- Acciones -->
        <div class="flex flex-wrap gap-2">
          <button
            @click="$emit('finalizar-ronda')"
            class="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <span>✓</span>
            <span>Finalizar Ronda</span>
          </button>
          
          <button
            v-if="rondaActual > 1"
            @click="$emit('deshacer-ronda')"
            class="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <span>↶</span>
            <span class="hidden sm:inline">Deshacer</span>
          </button>
          
          <button
            @click="$emit('volver-inicio')"
            class="bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Salir
          </button>
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
    }
  },
  emits: ['finalizar-ronda', 'deshacer-ronda', 'volver-inicio']
}
</script>
