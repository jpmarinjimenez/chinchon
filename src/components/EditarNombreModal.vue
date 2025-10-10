<template>
  <Transition name="fade">
    <div
      class="modal-overlay"
      @click.self="cerrar"
      role="dialog"
      aria-labelledby="editar-nombre-title"
      aria-modal="true"
    >
      <Transition name="slide-up">
        <div class="modal-content max-w-md">
          <!-- Header -->
          <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-xl">
            <div class="flex items-center justify-between">
              <h2 id="editar-nombre-title" class="text-2xl font-bold">Editar Nombre</h2>
              <button
                @click="cerrar"
                class="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                aria-label="Cerrar modal"
              >
                <span class="text-2xl">×</span>
              </button>
            </div>
            <p class="text-blue-100 mt-2">Cambia el nombre del jugador</p>
          </div>

          <!-- Body -->
          <div class="p-6">
            <form @submit.prevent="confirmar">
              <!-- Nombre actual -->
              <div class="mb-4 bg-gray-50 border-l-4 border-gray-400 p-4 rounded">
                <p class="text-sm text-gray-600 mb-1">Nombre actual:</p>
                <p class="text-lg font-semibold text-gray-800">{{ jugador.nombre }}</p>
              </div>

              <!-- Input de nuevo nombre -->
              <div class="mb-4">
                <label for="nuevo-nombre" class="block text-sm font-medium text-gray-700 mb-2">
                  Nuevo nombre
                </label>
                <input
                  id="nuevo-nombre"
                  ref="inputNombre"
                  v-model="nuevoNombre"
                  type="text"
                  class="input-field w-full text-lg"
                  placeholder="Introduce el nuevo nombre..."
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

              <!-- Botones -->
              <div class="flex gap-3 justify-end">
                <button type="button" @click="cerrar" class="btn-secondary">
                  Cancelar
                </button>
                <button
                  type="submit"
                  class="btn-primary"
                  :disabled="!nuevoNombre.trim() || nuevoNombre.trim() === jugador.nombre"
                >
                  ✓ Guardar Cambios
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
  name: 'EditarNombreModal',
  props: {
    jugador: {
      type: Object,
      required: true
    },
    jugadoresExistentes: {
      type: Array,
      required: true
    }
  },
  emits: ['confirmar', 'cerrar'],
  setup(props, { emit }) {
    // Guardar el nombre original para comparar
    const nombreOriginal = props.jugador.nombre
    const nuevoNombre = ref(nombreOriginal)
    const mensajeError = ref('')
    const inputNombre = ref(null)

    onMounted(async () => {
      // Enfocar el input y seleccionar el texto
      await nextTick()
      if (inputNombre.value) {
        inputNombre.value.focus()
        inputNombre.value.select()
      }
    })

    const limpiarError = () => {
      mensajeError.value = ''
    }

    const confirmar = () => {
      const nombre = nuevoNombre.value.trim()

      if (!nombre) {
        mensajeError.value = 'El nombre no puede estar vacío'
        return
      }

      if (nombre === nombreOriginal) {
        // No hay cambios, cerrar modal
        emit('cerrar')
        return
      }

      // Validar que no exista otro jugador con ese nombre
      const nombreExiste = props.jugadoresExistentes.some(
        j => j.id !== props.jugador.id && j.nombre.toLowerCase() === nombre.toLowerCase()
      )

      if (nombreExiste) {
        mensajeError.value = 'Ya existe un jugador con ese nombre'
        return
      }

      // Todo OK, emitir evento
      emit('confirmar', { jugadorId: props.jugador.id, nuevoNombre: nombre })
    }

    const cerrar = () => {
      emit('cerrar')
    }

    return {
      nuevoNombre,
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
