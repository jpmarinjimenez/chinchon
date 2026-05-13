<template>
    <div>
        <h2 class="text-2xl font-display font-bold text-parchment mb-6">Nueva Partida</h2>

        <form @submit.prevent="iniciarJuego">
            <!-- Límite de eliminación -->
            <div class="mb-6">
                <label for="limite" class="block text-sm font-semibold text-navy-200 mb-2">
                    ¿Cuántos puntos para ser eliminado?
                </label>
                <input
                    id="limite"
                    v-model.number="limite"
                    type="number"
                    inputmode="numeric"
                    min="50"
                    max="500"
                    step="1"
                    class="input-field"
                    :class="{ 'border-crimson-500': mostrarErrores && !limiteValido }"
                    required />
                <p v-if="mostrarErrores && !limiteValido" class="text-xs text-crimson-400 mt-1.5">
                    ♦ El límite debe ser al menos 50 puntos
                </p>
                <p v-else class="text-xs text-navy-400 mt-1.5">
                    Si un jugador llega a {{ limite - 1 }} puntos, aún no será eliminado.
                </p>
            </div>

            <!-- Precios de Entrada y Reenganche -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                    <label for="precioEntrada" class="block text-sm font-semibold text-navy-200 mb-2">
                        Precio de entrada (€)
                    </label>
                    <input
                        id="precioEntrada"
                        v-model="precioEntrada"
                        type="text"
                        inputmode="decimal"
                        class="input-field"
                        placeholder="0"
                        @input="precioEntrada = precioEntrada.replace(/[^0-9.,]/g, '').replace(/(\..*)\./g, '$1').replace(/(,.*),/g, '$1')"
                    />
                </div>
                <div>
                    <label for="precioReenganche" class="block text-sm font-semibold text-navy-200 mb-2">
                        Precio de reenganche (€)
                    </label>
                    <input
                        id="precioReenganche"
                        v-model="precioReenganche"
                        type="text"
                        inputmode="decimal"
                        class="input-field"
                        placeholder="0"
                        @input="precioReenganche = precioReenganche.replace(/[^0-9.,]/g, '').replace(/(\..*)\./g, '$1').replace(/(,.*),/g, '$1')"
                    />
                </div>
            </div>

            <!-- Nombres de jugadores -->
            <div class="mb-6">
                <label class="block text-sm font-semibold text-navy-200 mb-3">
                    Nombres de los jugadores (2-8)
                </label>

                <div class="space-y-2.5">
                    <div v-for="(nombre, index) in nombresJugadores" :key="index" class="flex gap-2">
                        <div class="flex items-center justify-center w-8 h-[46px] text-sm font-semibold shrink-0"
                             :class="index % 2 === 0 ? 'text-crimson-400' : 'text-navy-300'">
                            {{ index % 4 === 0 ? '♠' : index % 4 === 1 ? '♥' : index % 4 === 2 ? '♣' : '♦' }}
                        </div>
                        <input
                            ref="inputsJugadores"
                            v-model="nombresJugadores[index]"
                            type="text"
                            :placeholder="`Jugador ${index + 1}`"
                            class="input-field flex-1"
                            :class="{ 'border-crimson-500': mostrarErrores && !nombreValido(index) }"
                            required
                            maxlength="20" />
                        <button
                            v-if="nombresJugadores.length > 2"
                            type="button"
                            @click="eliminarJugador(index)"
                            class="px-3 py-2 rounded-xl text-crimson-400 hover:text-crimson-300 hover:bg-crimson-500/10 transition-all duration-200 shrink-0">
                            ✕
                        </button>
                    </div>
                </div>

                <button
                    v-if="nombresJugadores.length < 8"
                    type="button"
                    @click="agregarJugador"
                    class="mt-3 text-gold-400 hover:text-gold-300 text-sm font-medium flex items-center gap-1.5 transition-colors">
                    <span class="text-lg leading-none">+</span>
                    <span>Agregar jugador</span>
                </button>

                <p v-if="mostrarErrores && !jugadoresValidos" class="text-xs text-crimson-400 mt-2">
                    ♦ Todos los jugadores deben tener un nombre
                </p>
                <p v-if="mostrarErrores && nombresJugadores.length < 2" class="text-xs text-crimson-400 mt-2">
                    ♦ Se necesitan al menos 2 jugadores
                </p>
            </div>

            <!-- Mensaje de error general -->
            <div
                v-if="mostrarErrores && !formularioValido"
                class="mb-4 alert-danger">
                <p class="text-sm text-crimson-300 font-semibold">♦ Revisa los siguientes errores:</p>
                <ul class="mt-2 text-xs text-crimson-400 list-disc list-inside space-y-1">
                    <li v-if="!limiteValido">El límite debe ser al menos 50 puntos</li>
                    <li v-if="nombresJugadores.length < 2">Se necesitan al menos 2 jugadores</li>
                    <li v-if="!jugadoresValidos">Todos los jugadores deben tener un nombre</li>
                </ul>
            </div>

            <!-- Botón de inicio -->
            <button type="submit" class="w-full btn-primary text-base sm:text-lg py-3.5 font-bold">
                ♠ Iniciar Partida
            </button>
        </form>
    </div>
</template>

<script>
import { ref, computed, nextTick } from 'vue';

export default {
    name: 'NewGameForm',
    emits: ['iniciar-juego'],
    setup(props, { emit }) {
        const limite = ref(101);
        const precioEntrada = ref('0');
        const precioReenganche = ref('0');
        const nombresJugadores = ref(['', '']);
        const inputsJugadores = ref([]);
        const mostrarErrores = ref(false);

        const limiteValido = computed(() => limite.value >= 50);

        const jugadoresValidos = computed(() => nombresJugadores.value.every((n) => n.trim().length > 0));

        const formularioValido = computed(() => {
            return limiteValido.value && nombresJugadores.value.length >= 2 && jugadoresValidos.value;
        });

        const nombreValido = (index) => {
            return nombresJugadores.value[index]?.trim().length > 0;
        };

        const agregarJugador = async () => {
            if (nombresJugadores.value.length < 8) {
                nombresJugadores.value.push('');
                await nextTick();
                // Enfocar el último input añadido
                if (inputsJugadores.value && inputsJugadores.value.length > 0) {
                    inputsJugadores.value[inputsJugadores.value.length - 1]?.focus();
                }
            }
        };

        const eliminarJugador = (index) => {
            if (nombresJugadores.value.length > 2) {
                nombresJugadores.value.splice(index, 1);
            }
        };

        const iniciarJuego = () => {
            if (!formularioValido.value) {
                mostrarErrores.value = true;
                return;
            }

            mostrarErrores.value = false;
            emit('iniciar-juego', {
                limite: limite.value,
                jugadores: nombresJugadores.value.filter((n) => n.trim().length > 0),
                precioEntrada: parseFloat(precioEntrada.value.toString().replace(',', '.')) || 0,
                precioReenganche: parseFloat(precioReenganche.value.toString().replace(',', '.')) || 0,
            });
        };

        return {
            limite,
            precioEntrada,
            precioReenganche,
            nombresJugadores,
            inputsJugadores,
            mostrarErrores,
            limiteValido,
            jugadoresValidos,
            formularioValido,
            nombreValido,
            agregarJugador,
            eliminarJugador,
            iniciarJuego,
        };
    },
};
</script>
