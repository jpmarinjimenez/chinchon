<template>
  <Transition name="fade">
    <div
      class="modal-overlay"
      @click.self="cerrar"
      role="dialog"
      aria-labelledby="anadir-jugador-title"
      aria-modal="true"
    >
      <Transition name="slide-up">
        <div class="modal-content max-w-md">
          <!-- Header -->
          <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-xl">
            <div class="flex items-center justify-between">
              <h2 id="anadir-jugador-title" class="text-2xl font-bold">Añadir Jugador</h2>
              <button
                @click="cerrar"
                class="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                aria-label="Cerrar modal"
              >
                <span class="text-2xl">×</span>
              </button>
            </div>
            <p class="text-blue-100 mt-2">Introduce el nombre del nuevo jugador</p>
          </div>

          <!-- Body -->
          <div class="p-6">
            <form @submit.prevent="confirmar">
              <!-- Input de nombre -->
              <div class="mb-4">
                <label for="nombre-jugador" class="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del jugador
                </label>
                <input
                  id="nombre-jugador"
                  ref="inputNombre"
                  v-model="nombreJugador"
                  type="text"
                  class="input-field w-full text-lg"
                  placeholder="Ej: Ana, Carlos..."
                  maxlength="20"
                  required
                  @input="limpiarError"
                />
              </div>

              <!-- Mensaje de error -->
              <Transition name="slide-down">
                <div v-if="mensajeError" class="mb-4 bg-red-50 border-l-4 border-red-400 p-4 rounded">
                  <p class="text-sm text-red-800">
                    <span class="font-semibold">❌ Error:</span> {{ mensajeError }}
                  </p>
                </div>
              </Transition>

              <!-- Información sobre el reenganche -->
              <div class="mb-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                <p class="text-sm text-blue-800">
                  <span class="font-semibold">💡 Información:</span>
                  El nuevo jugador empezará con
                  <span class="font-bold">{{ puntosReenganche }} puntos</span>
                  (los mismos que el jugador más cercano al límite).
                </p>
              </div>

              <!-- Botones -->
              <div class="flex gap-3 justify-end">
                <button type="button" @click="cerrar" class="btn-secondary">
                  Cancelar
                </button>
                <button
                  type="submit"
                  class="btn-primary"
                  :disabled="!nombreJugador.trim()"
                >
                  ✓ Añadir Jugador
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue'

export default {
  name: 'AnadirJugadorModal',
  props: {
    puntosReenganche: {
      type: Number,
      required: true
    },
    jugadoresExistentes: {
      type: Array,
      required: true
    }
  },
  emits: ['confirmar', 'cerrar'],
  setup(props, { emit }) {
    const nombreJugador = ref('')
    const mensajeError = ref('')
    const inputNombre = ref(null)

    onMounted(async () => {
      // Enfocar el input
      await nextTick()
      inputNombre.value?.focus()
    })

    const limpiarError = () => {
      mensajeError.value = ''
    }

    const validarNombre = () => {
      const nombre = nombreJugador.value.trim()

      if (!nombre) {
        mensajeError.value = 'El nombre no puede estar vacío'
        return false
      }

      // Verificar si ya existe un jugador con ese nombre
      const nombreExiste = props.jugadoresExistentes.some(
        j => j.nombre.toLowerCase() === nombre.toLowerCase()
      )

      if (nombreExiste) {
        mensajeError.value = 'Ya existe un jugador con ese nombre'
        return false
      }

      return true
    }

    const confirmar = () => {
      if (validarNombre()) {
        emit('confirmar', nombreJugador.value.trim())
      }
    }

    const cerrar = () => {
      emit('cerrar')
    }

    return {
      nombreJugador,
      mensajeError,
      inputNombre,
      limpiarError,
      confirmar,
      cerrar
    }
  }
}
</script>

<style scoped>
/* Animación para el mensaje de error */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
