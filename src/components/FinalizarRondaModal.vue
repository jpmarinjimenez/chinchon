<template>
    <Transition name="fade">
        <div class="modal-overlay" @click.self="cerrar" role="dialog" aria-labelledby="modal-title" aria-modal="true">
            <Transition name="slide-up">
                <div class="modal-content">
                    <!-- Header -->
                    <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-xl">
                        <div class="flex items-center justify-between">
                            <h2 id="modal-title" class="text-2xl font-bold">Finalizar Ronda</h2>
                            <button
                                @click="cerrar"
                                class="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                                aria-label="Cerrar modal">
                                <span class="text-2xl">×</span>
                            </button>
                        </div>
                        <p class="text-blue-100 mt-2">Introduce los puntos de cada jugador</p>
                    </div>

                    <!-- Body -->
                    <div class="p-6">
                        <form @submit.prevent="confirmar">
                            <div class="space-y-4 max-h-[60vh] overflow-y-auto">
                                <div
                                    v-for="jugador in jugadores"
                                    :key="jugador.id"
                                    class="flex items-center gap-4 p-4 rounded-lg border-2 transition-all"
                                    :class="{
                                        'border-green-400 bg-green-50': hizoMenos10[jugador.id],
                                        'border-gray-200 bg-white': !hizoMenos10[jugador.id],
                                    }">
                                    <!-- Nombre del jugador -->
                                    <div class="flex-1">
                                        <p class="font-semibold text-gray-800">{{ jugador.nombre }}</p>
                                        <p class="text-sm text-gray-500">
                                            Total actual: {{ jugador.puntosAcumulados }} pts
                                        </p>
                                    </div>

                                    <!-- Input de puntos -->
                                    <div class="w-32">
                                        <input
                                            v-model.number="puntosRonda[jugador.id]"
                                            type="number"
                                            min="0"
                                            max="999"
                                            step="1"
                                            class="input-field text-center text-lg font-semibold"
                                            :class="{
                                                'bg-green-100 border-green-400': hizoMenos10[jugador.id],
                                                'bg-gray-100': hizoMenos10[jugador.id],
                                            }"
                                            placeholder="0"
                                            required
                                            :disabled="hizoMenos10[jugador.id]"
                                            :aria-label="`Puntos para ${jugador.nombre}`"
                                            ref="inputPuntos" />
                                    </div>

                                    <!-- Checkbox de -10 -->
                                    <div class="flex items-center gap-2">
                                        <input
                                            :id="`menos10-${jugador.id}`"
                                            v-model="hizoMenos10[jugador.id]"
                                            type="checkbox"
                                            class="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500 cursor-pointer"
                                            :aria-label="`${jugador.nombre} hizo -10`"
                                            @change="manejarMenos10(jugador.id)" />
                                        <label
                                            :for="`menos10-${jugador.id}`"
                                            class="text-sm font-medium text-gray-700 cursor-pointer select-none">
                                            -10
                                        </label>
                                    </div>

                                    <!-- Indicador de -10 -->
                                    <div v-if="hizoMenos10[jugador.id]" class="text-2xl animate-bounce-slow">✨</div>

                                    <!-- Botón Chinchón -->
                                    <button
                                        type="button"
                                        @click="confirmarChinchon(jugador)"
                                        class="px-3 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all transform hover:scale-105 shadow-md text-xs">
                                        🏆 Chinchón
                                    </button>
                                </div>
                            </div>

                            <!-- Ayuda -->
                            <div class="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4">
                                <p class="text-sm text-blue-800">
                                    <span class="font-semibold">💡 Consejo:</span>
                                    Marca el checkbox <strong>"-10"</strong> si el jugador hizo una jugada especial.
                                    Solo un jugador puede hacer -10 por ronda.
                                    <span class="block mt-1"
                                        >El botón <strong>"🏆 Chinchón"</strong> termina la partida inmediatamente y ese
                                        jugador gana.</span
                                    >
                                </p>
                            </div>

                            <!-- Botones -->
                            <div class="mt-6 flex gap-3 justify-end">
                                <button type="button" @click="cerrar" class="btn-secondary">Cancelar</button>
                                <button type="submit" class="btn-primary" :disabled="!formularioValido">
                                    ✓ Confirmar Ronda
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
import { ref, computed, onMounted, nextTick } from 'vue';

export default {
    name: 'FinalizarRondaModal',
    props: {
        jugadores: {
            type: Array,
            required: true,
        },
    },
    emits: ['confirmar', 'cerrar', 'chinchon'],
    setup(props, { emit }) {
        const puntosRonda = ref({});
        const hizoMenos10 = ref({});
        const inputPuntos = ref([]);

        // Inicializar puntos y checkboxes para cada jugador
        onMounted(async () => {
            props.jugadores.forEach((jugador) => {
                puntosRonda.value[jugador.id] = 0;
                hizoMenos10.value[jugador.id] = false;
            });

            // Enfocar el primer input
            await nextTick();
            if (inputPuntos.value && inputPuntos.value.length > 0) {
                inputPuntos.value[0]?.focus();
            }
        });

        const formularioValido = computed(() => {
            return props.jugadores.every((jugador) => {
                const puntos = puntosRonda.value[jugador.id];
                return puntos !== undefined && puntos !== null && puntos >= 0;
            });
        });

        const manejarMenos10 = (jugadorId) => {
            if (hizoMenos10.value[jugadorId]) {
                // Si marcó -10, desmarcar todos los demás
                Object.keys(hizoMenos10.value).forEach((id) => {
                    if (id !== jugadorId) {
                        hizoMenos10.value[id] = false;
                    }
                });

                // Establecer puntos en 0 (se restará 10 al calcular)
                puntosRonda.value[jugadorId] = 0;

                // Reproducir sonido
                reproducirSonidoEspecial();
            }
        };

        const confirmarChinchon = (jugador) => {
            // Confirmar que está seguro
            if (
                confirm(
                    `¿Estás seguro de que ${jugador.nombre} ha hecho CHINCHÓN?\n\nLa partida terminará inmediatamente y ${jugador.nombre} ganará.`
                )
            ) {
                emit('chinchon', jugador.id);
            }
        };

        const reproducirSonidoEspecial = () => {
            // Efecto de sonido simple usando Web Audio API
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.value = 800;
                oscillator.type = 'sine';

                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
            } catch (error) {
                console.log('Audio no disponible:', error);
            }
        };

        const confirmar = () => {
            if (formularioValido.value) {
                // Construir objeto de puntos, aplicando -10 si marcó la jugada especial
                const puntosFinal = {};
                props.jugadores.forEach((jugador) => {
                    if (hizoMenos10.value[jugador.id]) {
                        puntosFinal[jugador.id] = -10;
                    } else {
                        puntosFinal[jugador.id] = puntosRonda.value[jugador.id];
                    }
                });
                emit('confirmar', puntosFinal);
            }
        };

        const cerrar = () => {
            emit('cerrar');
        };

        return {
            puntosRonda,
            hizoMenos10,
            inputPuntos,
            formularioValido,
            manejarMenos10,
            confirmarChinchon,
            confirmar,
            cerrar,
        };
    },
};
</script>
