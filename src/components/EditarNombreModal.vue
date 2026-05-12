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
          <div class="p-5 sm:p-6 border-b border-white/5" style="background: linear-gradient(135deg, rgba(36, 59, 83, 0.5) 0%, rgba(26, 45, 66, 0.5) 100%);">
            <div class="flex items-center justify-between">
              <div>
                <h2 id="editar-nombre-title" class="text-xl sm:text-2xl font-display font-bold text-parchment">Editar Nombre</h2>
                <p class="text-navy-300 mt-1 text-sm">Cambia el nombre del jugador</p>
              </div>
              <button
                @click="cerrar"
                class="text-navy-400 hover:text-parchment rounded-full p-2 transition-colors hover:bg-white/5"
                aria-label="Cerrar modal"
              >
                <span class="text-2xl leading-none">×</span>
              </button>
            </div>
          </div>

          <!-- Body -->
          <div class="p-5 sm:p-6">
            <form @submit.prevent="confirmar">
              <!-- Nombre actual -->
              <div class="mb-4 alert-info">
                <p class="text-xs text-navy-400 mb-1 uppercase tracking-wider">Nombre actual</p>
                <p class="text-base font-display font-semibold text-parchment">{{ jugador.nombre }}</p>
              </div>

              <!-- Input de nuevo nombre -->
              <div class="mb-4">
                <label for="nuevo-nombre" class="block text-sm font-medium text-navy-200 mb-2">
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
                <div v-if="mensajeError" class="mb-4 alert-danger">
                  <p class="text-sm text-crimson-300">
                    <span class="font-semibold">♦ Error:</span> {{ mensajeError }}
                  </p>
                </div>
              </Transition>

              <!-- Botones -->
              <div class="flex gap-3 justify-end">
                <button type="button" @click="cerrar" class="btn-secondary text-sm">
                  Cancelar
                </button>
                <button
                  type="submit"
                  class="btn-primary text-sm"
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
