<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-4">
    <div class="max-w-2xl w-full">
      <!-- Logo y título -->
      <div class="text-center mb-8">
        <h1 class="text-5xl font-bold text-blue-700 mb-2">🎴 Chinchón</h1>
        <p class="text-gray-600 text-lg">Contador de Puntos Online Gratis</p>
      </div>

      <!-- Card principal -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <!-- Mostrar formulario si hay juego guardado -->
        <div v-if="juegoGuardado" class="mb-6">
          <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-800 font-semibold">Partida en curso detectada</p>
                <p class="text-blue-600 text-sm mt-1">
                  {{ gameStore.jugadores.length }} jugadores - Límite: {{ gameStore.limiteEliminacion }} puntos
                </p>
              </div>
              <button
                @click="continuarPartida"
                class="btn-primary text-sm"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>

        <!-- Formulario para nueva partida -->
        <NewGameForm @iniciar-juego="iniciarNuevaPartida" />

        <!-- Botón de historial -->
        <div class="mt-6 pt-6 border-t border-gray-200">
          <button
            @click="irAlHistorial"
            class="w-full btn-secondary flex items-center justify-center gap-2"
          >
            <span>📊</span>
            <span>Ver Historial de Partidas</span>
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center mt-8 text-gray-500 text-sm">
        <p>Aplicación web para anotar puntos del juego Chinchón</p>
        <p class="mt-1">Desarrollado con Vue 3 + Pinia + Tailwind CSS</p>
        <p class="mt-2">
          Creado por 
          <a 
            href="https://jpmarin.dev" 
            target="_blank" 
            rel="noopener noreferrer"
            class="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
          >
            Juan Pablo Marín Jiménez
          </a>
        </p>
      </div>

      <!-- Contenido SEO -->
      <section class="mt-12 px-4 max-w-4xl mx-auto text-left">
        <div class="bg-white rounded-xl shadow-md p-6 space-y-6">
          <div>
            <h2 class="text-2xl font-bold text-gray-800 mb-3">Contador de Puntos Chinchón Online Gratis</h2>
            <p class="text-gray-700 leading-relaxed">
              Lleva la puntuación de tus partidas de Chinchón de forma fácil y gratuita. 
              Nuestra aplicación te permite anotar los puntos de 2 a 8 jugadores, con sistema 
              de reenganche, historial de partidas y guardado automático. Sin instalación, 100% online.
            </p>
          </div>
          
          <div>
            <h3 class="text-xl font-semibold text-gray-800 mb-3">¿Cómo funciona el contador de Chinchón?</h3>
            <ul class="space-y-2 text-gray-700">
              <li class="flex items-start gap-2">
                <span class="text-green-600 font-bold">✓</span>
                <span>Configura el límite de puntos para eliminación (por defecto 100)</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-green-600 font-bold">✓</span>
                <span>Añade los nombres de los jugadores (de 2 a 8 jugadores)</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-green-600 font-bold">✓</span>
                <span>Finaliza cada ronda introduciendo los puntos de cada jugador</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-green-600 font-bold">✓</span>
                <span>El marcador se actualiza automáticamente con los totales</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-green-600 font-bold">✓</span>
                <span>Sistema de reenganche cuando un jugador alcanza el límite</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 class="text-xl font-semibold text-gray-800 mb-3">Características del marcador</h3>
            <p class="text-gray-700 leading-relaxed">
              Contador de puntos completo para el juego de cartas Chinchón con todas las 
              funcionalidades que necesitas: marcador de -10 puntos (jugada especial), botón de Chinchón para 
              victoria inmediata, deshacer última ronda, editar nombres de jugadores, historial de las últimas 
              20 partidas, y guardado automático en tu navegador para que nunca pierdas tus datos.
            </p>
          </div>

          <div>
            <h3 class="text-xl font-semibold text-gray-800 mb-3">¿Por qué usar esta app para Chinchón?</h3>
            <ul class="space-y-2 text-gray-700">
              <li class="flex items-start gap-2">
                <span class="text-blue-600">🎯</span>
                <span><strong>Gratis:</strong> Sin costes, sin anuncios molestos</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-blue-600">📱</span>
                <span><strong>Responsive:</strong> Funciona en móvil, tablet y ordenador</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-blue-600">💾</span>
                <span><strong>Guardado automático:</strong> Nunca perderás tu partida</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-blue-600">⚡</span>
                <span><strong>Rápido:</strong> Interfaz ágil y sin esperas</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-blue-600">🎮</span>
                <span><strong>Completo:</strong> Todas las reglas del Chinchón implementadas</span>
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
