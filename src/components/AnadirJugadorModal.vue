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
          <div class="p-5 sm:p-6 border-b border-white/5" style="background: linear-gradient(135deg, rgba(36, 59, 83, 0.5) 0%, rgba(26, 45, 66, 0.5) 100%);">
            <div class="flex items-center justify-between">
              <div>
                <h2 id="anadir-jugador-title" class="text-xl sm:text-2xl font-display font-bold text-parchment">Añadir Jugador</h2>
                <p class="text-navy-300 mt-1 text-sm">Introduce el nombre del nuevo jugador</p>
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
              <!-- Input de nombre -->
              <div class="mb-4">
                <label for="nombre-jugador" class="block text-sm font-medium text-navy-200 mb-2">
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
                <div v-if="mensajeError" class="mb-4 alert-danger">
                  <p class="text-sm text-crimson-300">
                    <span class="font-semibold">♦ Error:</span> {{ mensajeError }}
                  </p>
                </div>
              </Transition>

              <!-- Información sobre el reenganche -->
              <div class="mb-6 alert-info">
                <p class="text-sm text-navy-200">
                  <span class="font-semibold text-parchment">💡 Información:</span>
                  El nuevo jugador empezará con
                  <span class="font-bold text-gold-400">{{ puntosReenganche }} puntos</span>
                  (los mismos que el jugador más cercano al límite).
                </p>
              </div>

              <!-- Botones -->
              <div class="flex gap-3 justify-end">
                <button type="button" @click="cerrar" class="btn-secondary text-sm">
                  Cancelar
                </button>
                <button
                  type="submit"
                  class="btn-primary text-sm"
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
