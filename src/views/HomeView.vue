<template>
  <div class="min-h-screen flex flex-col items-center justify-start pt-8 sm:pt-12 md:justify-center md:pt-0 px-4 pb-8 relative z-10">
    <div class="max-w-2xl w-full">

      <!-- Logo y título con estilo Bicycle -->
      <div class="text-center mb-8 md:mb-10">
        <div class="flex items-center justify-center gap-3 mb-3">
          <span class="text-3xl md:text-4xl animate-float-suit">♠</span>
          <span class="text-2xl md:text-3xl animate-float-suit" style="animation-delay: 0.5s">♥</span>
        </div>
        <h1 class="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-parchment tracking-tight">
          Chinchón
        </h1>
        <div class="ornamental-divider mt-4 mb-3">
          <span>No. 808</span>
        </div>
        <p class="text-navy-300 text-base sm:text-lg font-light">Contador de Puntos Online</p>
      </div>

      <!-- Card principal -->
      <div class="glass-card">
        <!-- Partida en curso detectada -->
        <div v-if="juegoGuardado" class="mb-6">
          <div class="alert-success">
            <div class="flex items-center justify-between gap-4">
              <div>
                <p class="text-green-300 font-semibold text-sm sm:text-base">♣ Partida en curso detectada</p>
                <p class="text-green-400/60 text-xs sm:text-sm mt-1">
                  {{ gameStore.jugadores.length }} jugadores · Límite: {{ gameStore.limiteEliminacion }} pts
                </p>
              </div>
              <button
                @click="continuarPartida"
                class="btn-felt text-sm whitespace-nowrap"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>

        <!-- Formulario para nueva partida -->
        <NewGameForm @iniciar-juego="iniciarNuevaPartida" />

        <!-- Botón de historial -->
        <div class="mt-6 pt-6 border-t border-white/5">
          <button
            @click="irAlHistorial"
            class="w-full btn-secondary flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <span>📊</span>
            <span>Ver Historial de Partidas</span>
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center mt-8 text-navy-400 text-xs sm:text-sm">
        <p>Aplicación web para anotar puntos del juego Chinchón</p>
        <p class="mt-2">
          Creado por
          <a
            href="https://jpmarin.dev"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gold-400 hover:text-gold-300 font-medium transition-colors"
          >
            Juan Pablo Marín Jiménez
          </a>
        </p>
      </div>

      <!-- Contenido SEO -->
      <section class="mt-12 max-w-4xl mx-auto text-left">
        <div class="glass-card space-y-6">
          <div>
            <h2 class="text-2xl font-display font-bold text-parchment mb-3">Contador de Puntos Chinchón Online Gratis</h2>
            <p class="text-navy-200 leading-relaxed text-sm sm:text-base">
              Lleva la puntuación de tus partidas de Chinchón de forma fácil y gratuita.
              Nuestra aplicación te permite anotar los puntos de 2 a 8 jugadores, con sistema
              de reenganche, historial de partidas y guardado automático. Sin instalación, 100% online.
            </p>
          </div>

          <div>
            <h3 class="text-xl font-display font-semibold text-parchment mb-3">¿Cómo funciona el contador de Chinchón?</h3>
            <ul class="space-y-2 text-navy-200 text-sm sm:text-base">
              <li class="flex items-start gap-2">
                <span class="suit-red font-bold mt-0.5">♦</span>
                <span>Configura el límite de puntos para eliminación (por defecto 100)</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="suit-red font-bold mt-0.5">♥</span>
                <span>Añade los nombres de los jugadores (de 2 a 8 jugadores)</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="suit-black font-bold mt-0.5">♠</span>
                <span>Finaliza cada ronda introduciendo los puntos de cada jugador</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="suit-black font-bold mt-0.5">♣</span>
                <span>El marcador se actualiza automáticamente con los totales</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="suit-gold font-bold mt-0.5">★</span>
                <span>Sistema de reenganche cuando un jugador alcanza el límite</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 class="text-xl font-display font-semibold text-parchment mb-3">Características del marcador</h3>
            <p class="text-navy-200 leading-relaxed text-sm sm:text-base">
              Contador de puntos completo para el juego de cartas Chinchón con todas las
              funcionalidades que necesitas: marcador de -10 puntos (jugada especial), botón de Chinchón para
              victoria inmediata, deshacer última ronda, editar nombres de jugadores, historial de las últimas
              20 partidas, y guardado automático en tu navegador para que nunca pierdas tus datos.
            </p>
          </div>

          <div>
            <h3 class="text-xl font-display font-semibold text-parchment mb-3">¿Por qué usar esta app para Chinchón?</h3>
            <ul class="space-y-2 text-navy-200 text-sm sm:text-base">
              <li class="flex items-start gap-2">
                <span class="suit-gold">★</span>
                <span><strong class="text-parchment">Gratis:</strong> Sin costes, sin anuncios molestos</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="suit-gold">★</span>
                <span><strong class="text-parchment">Responsive:</strong> Funciona en móvil, tablet y ordenador</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="suit-gold">★</span>
                <span><strong class="text-parchment">Guardado automático:</strong> Nunca perderás tu partida</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="suit-gold">★</span>
                <span><strong class="text-parchment">Rápido:</strong> Interfaz ágil y sin esperas</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="suit-gold">★</span>
                <span><strong class="text-parchment">Completo:</strong> Todas las reglas del Chinchón implementadas</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameStore'
import NewGameForm from '@/components/NewGameForm.vue'
import { useSeo } from '@/composables/useSeo'

export default {
  name: 'HomeView',
  components: {
    NewGameForm
  },
  setup() {
    const router = useRouter()
    const gameStore = useGameStore()

    // SEO para página principal
    useSeo({
      title: 'Contador de Puntos Chinchón Online Gratis',
      description: 'Contador de puntos gratuito para el juego de cartas Chinchón. Lleva la puntuación de 2-8 jugadores online desde tu móvil o ordenador. Sin instalación, 100% gratis.',
      canonical: 'https://chinchon.jpmarin.dev/',
      keywords: 'contador chinchón, chinchón puntos online, app chinchón gratis, chinchón marcador'
    })

    // Cargar datos al montar el componente
    gameStore.cargarDesdeLocalStorage()
    gameStore.cargarHistorialDesdeLocalStorage()

    const juegoGuardado = computed(() => {
      return gameStore.juegoActivo && gameStore.jugadores.length > 0
    })

    const iniciarNuevaPartida = ({ limite, jugadores, precioEntrada, precioReenganche }) => {
      gameStore.iniciarNuevoJuego(limite, jugadores, precioEntrada, precioReenganche)
      router.push('/juego')
    }

    const continuarPartida = () => {
      router.push('/juego')
    }

    const irAlHistorial = () => {
      router.push('/historial')
    }

    return {
      gameStore,
      juegoGuardado,
      iniciarNuevaPartida,
      continuarPartida,
      irAlHistorial
    }
  }
}
</script>
