<template>
  <div class="bg-white rounded-xl shadow-lg p-6">
    <h2 class="text-2xl font-bold text-gray-800 mb-4">📋 Historial de Rondas</h2>
    
    <div class="space-y-3">
      <div
        v-for="ronda in rondas"
        :key="ronda.numero"
        class="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded-r"
      >
        <div class="flex items-center justify-between">
          <h3 class="font-semibold text-gray-800">Ronda {{ ronda.numero }}</h3>
          <span class="text-xs text-gray-500">{{ formatearFecha(ronda.fecha) }}</span>
        </div>
        
        <div class="mt-2 flex flex-wrap gap-3 text-sm">
          <span
            v-for="jugador in jugadores"
            :key="jugador.id"
            class="text-gray-700"
          >
            <span class="font-medium">{{ jugador.nombre }}:</span>
            <span
              :class="{
                'text-green-600 font-bold': ronda.puntos[jugador.id] === -10
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
