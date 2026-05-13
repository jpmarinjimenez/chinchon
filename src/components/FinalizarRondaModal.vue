<template>
    <Transition name="fade">
        <div class="modal-overlay" @click.self="cerrar" role="dialog" aria-labelledby="modal-title" aria-modal="true">
            <Transition name="slide-up">
                <div class="modal-content">
                    <!-- Header -->
                    <div class="p-5 sm:p-6 border-b border-white/5" style="background: linear-gradient(135deg, rgba(22, 101, 52, 0.3) 0%, rgba(26, 45, 66, 0.5) 100%);">
                        <div class="flex items-center justify-between">
                            <div>
                                <h2 id="modal-title" class="text-xl sm:text-2xl font-display font-bold text-parchment">Finalizar Ronda</h2>
                                <p class="text-navy-300 mt-1 text-sm">Introduce los puntos de cada jugador</p>
                            </div>
                            <button
                                @click="cerrar"
                                class="text-navy-400 hover:text-parchment rounded-full p-2 transition-colors hover:bg-white/5"
                                aria-label="Cerrar modal">
                                <span class="text-2xl leading-none">×</span>
                            </button>
                        </div>
                    </div>

                    <!-- Body -->
                    <div class="p-5 sm:p-6 pb-32 sm:pb-6">
                        <form @submit.prevent="confirmar">
                            <div class="space-y-3">
                                <div
                                    v-for="(jugador, index) in jugadores"
                                    :key="jugador.id"
                                    class="p-4 rounded-xl border transition-all duration-200"
                                    :class="{
                                        'border-felt-600/40 bg-felt-900/20': hizoMenos10[jugador.id],
                                        'border-white/5 bg-white/[0.02]': !hizoMenos10[jugador.id],
                                    }">
                                    <!-- Nombre del jugador -->
                                    <div class="mb-3">
                                        <p class="font-display font-semibold text-parchment text-lg">{{ jugador.nombre }}</p>
                                        <p class="text-xs text-navy-400 mt-0.5">
                                            Total actual: {{ jugador.puntosAcumulados }} pts
                                        </p>
                                    </div>

                                    <!-- Controles: Layout responsive -->
                                    <div class="flex flex-col sm:flex-row sm:items-center gap-3">
                                        <!-- Input de puntos -->
                                        <div class="flex-1 sm:flex-none sm:w-32">
                                            <label :for="`puntos-${jugador.id}`" class="block text-xs text-navy-400 mb-1 sm:hidden">Puntos:</label>
                                            <input
                                                :id="`puntos-${jugador.id}`"
                                                :name="`puntos-${jugador.id}`"
                                                v-model.number="puntosRonda[jugador.id]"
                                                type="tel"
                                                class="input-field text-center text-2xl sm:text-lg font-semibold w-full tabular-nums"
                                                :class="{
                                                    'border-felt-500/40 bg-felt-900/15': hizoMenos10[jugador.id],
                                                }"
                                                placeholder="0"
                                                required
                                                :disabled="hizoMenos10[jugador.id]"
                                                :aria-label="`Puntos para ${jugador.nombre}`"
                                                autocomplete="off" />
                                        </div>

                                        <!-- Controles adicionales -->
                                        <div class="flex items-center gap-2 sm:gap-3 justify-between sm:justify-start">
                                            <!-- Toggle de -10 (Reemplaza al checkbox nativo para no romper tabulación iOS) -->
                                            <div
                                                @click="hizoMenos10[jugador.id] = !hizoMenos10[jugador.id]; manejarMenos10(jugador.id)"
                                                class="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer select-none transition-all duration-200"
                                                :class="hizoMenos10[jugador.id]
                                                    ? 'bg-felt-800/30 border border-felt-600/40'
                                                    : 'bg-white/[0.03] border border-white/8 hover:border-white/15'"
                                                role="switch"
                                                :aria-checked="hizoMenos10[jugador.id]"
                                            >
                                                <div
                                                    class="w-4 h-4 rounded border flex items-center justify-center transition-colors"
                                                    :class="hizoMenos10[jugador.id] ? 'bg-emerald-500 border-emerald-500' : 'bg-transparent border-navy-400'"
                                                >
                                                    <svg v-if="hizoMenos10[jugador.id]" class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                <span class="text-sm font-semibold whitespace-nowrap"
                                                    :class="hizoMenos10[jugador.id] ? 'text-green-300' : 'text-navy-300'">
                                                    -10 ✨
                                                </span>
                                            </div>

                                            <!-- Botón Chinchón -->
                                            <button
                                                type="button"
                                                tabindex="-1"
                                                @click.stop="confirmarChinchon(jugador)"
                                                class="flex-1 sm:flex-none btn-gold text-sm whitespace-nowrap py-2">
                                                🏆 Chinchón
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Botón de ayuda -->
                            <div class="mt-5">
                                <button
                                    type="button"
                                    tabindex="-1"
                                    @click="mostrarAyuda = !mostrarAyuda"
                                    class="flex items-center gap-2 text-navy-400 hover:text-navy-200 text-sm font-medium transition-colors">
                                    <span class="text-base">ℹ️</span>
                                    {{ mostrarAyuda ? 'Ocultar ayuda' : 'Ver ayuda' }}
                                </button>

                                <!-- Ayuda colapsable -->
                                <Transition name="slide-down">
                                    <div
                                        v-if="mostrarAyuda"
                                        class="mt-3 alert-info">
                                        <p class="text-sm text-navy-200">
                                            <span class="font-semibold text-parchment">💡 Consejo:</span>
                                            Marca el checkbox <strong class="text-parchment">"-10"</strong> si el jugador hizo una jugada
                                            especial. Solo un jugador puede hacer -10 por ronda.
                                            <span class="block mt-1">
                                                El botón <strong class="text-gold-400">"🏆 Chinchón"</strong> termina la partida
                                                inmediatamente y ese jugador gana.
                                            </span>
                                        </p>
                                    </div>
                                </Transition>
                            </div>

                            <!-- Botones -->
                            <div class="mt-5 flex gap-3 justify-end">
                                <button type="button" @click="cerrar" class="btn-secondary text-sm" tabindex="-1">
                                    Cancelar
                                </button>
                                <button type="submit" class="btn-felt text-sm" :disabled="!formularioValido">
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
import { useAudio } from '@/composables/useAudio';

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
        const { reproducirSonidoEspecial } = useAudio();
        
        const puntosRonda = ref({});
        const hizoMenos10 = ref({});
        const inputPuntos = ref([]);
        const mostrarAyuda = ref(false);

        // Inicializar puntos y checkboxes para cada jugador
        onMounted(async () => {
            props.jugadores.forEach((jugador) => {
                puntosRonda.value[jugador.id] = null;
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
                // El campo es válido si tiene un valor numérico >= 0 o si hizo -10
                return (
                    hizoMenos10.value[jugador.id] ||
                    (puntos !== null && puntos !== undefined && puntos !== '' && puntos >= 0)
                );
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
            emit('chinchon', jugador.id);
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

        const enfocarSiguiente = (index) => {
            if (index < props.jugadores.length - 1) {
                // Buscar el siguiente input que no esté deshabilitado
                for (let i = index + 1; i < props.jugadores.length; i++) {
                    const nextInput = inputPuntos.value[i];
                    if (nextInput && !nextInput.disabled) {
                        nextInput.focus();
                        return;
                    }
                }
            }
            
            // Si es el último o no hay más disponibles, intentar enviar si es válido
            if (index === props.jugadores.length - 1 && formularioValido.value) {
                confirmar();
            }
        };

        return {
            puntosRonda,
            hizoMenos10,
            inputPuntos,
            mostrarAyuda,
            formularioValido,
            manejarMenos10,
            confirmarChinchon,
            confirmar,
            cerrar,
            enfocarSiguiente,
        };
    },
};
</script>
