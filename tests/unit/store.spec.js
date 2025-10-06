import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameStore } from '@/stores/gameStore'

describe('GameStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // Mock localStorage
    global.localStorage = {
      store: {},
      getItem(key) {
        return this.store[key] || null
      },
      setItem(key, value) {
        this.store[key] = value
      },
      removeItem(key) {
        delete this.store[key]
      },
      clear() {
        this.store = {}
      }
    }
  })

  describe('Inicialización del juego', () => {
    it('debe iniciar un nuevo juego correctamente', () => {
      const store = useGameStore()
      const nombresJugadores = ['Ana', 'Bruno', 'Carlos']
      
      store.iniciarNuevoJuego(100, nombresJugadores)
      
      expect(store.limiteEliminacion).toBe(100)
      expect(store.jugadores).toHaveLength(3)
      expect(store.jugadores[0].nombre).toBe('Ana')
      expect(store.jugadores[0].puntosAcumulados).toBe(0)
      expect(store.jugadores[0].eliminado).toBe(false)
      expect(store.juegoActivo).toBe(true)
      expect(store.juegoFinalizado).toBe(false)
    })

    it('debe asignar IDs únicos a cada jugador', () => {
      const store = useGameStore()
      store.iniciarNuevoJuego(100, ['Ana', 'Bruno'])
      
      const ids = store.jugadores.map(j => j.id)
      const idsUnicos = new Set(ids)
      
      expect(idsUnicos.size).toBe(2)
    })
  })

  describe('Finalizar ronda', () => {
    it('debe sumar puntos correctamente a cada jugador', () => {
      const store = useGameStore()
      store.iniciarNuevoJuego(100, ['Ana', 'Bruno'])
      
      const [ana, bruno] = store.jugadores
      const puntosRonda = {
        [ana.id]: 15,
        [bruno.id]: 20
      }
      
      store.finalizarRonda(puntosRonda)
      
      expect(ana.puntosAcumulados).toBe(15)
      expect(bruno.puntosAcumulados).toBe(20)
      expect(store.rondas).toHaveLength(1)
    })

    it('debe detectar jugadores que alcanzan el límite', () => {
      const store = useGameStore()
      store.iniciarNuevoJuego(100, ['Ana', 'Bruno'])
      
      const [ana, bruno] = store.jugadores
      const puntosRonda = {
        [ana.id]: 105,
        [bruno.id]: 20
      }
      
      const jugadoresAlLimite = store.finalizarRonda(puntosRonda)
      
      expect(jugadoresAlLimite).toHaveLength(1)
      expect(jugadoresAlLimite[0].id).toBe(ana.id)
    })

    it('debe manejar puntos negativos (-10)', () => {
      const store = useGameStore()
      store.iniciarNuevoJuego(100, ['Ana'])
      
      const [ana] = store.jugadores
      ana.puntosAcumulados = 50
      
      const puntosRonda = {
        [ana.id]: -10
      }
      
      store.finalizarRonda(puntosRonda)
      
      expect(ana.puntosAcumulados).toBe(40)
    })

    it('debe guardar el historial de puntos de cada jugador', () => {
      const store = useGameStore()
      store.iniciarNuevoJuego(100, ['Ana'])
      
      const [ana] = store.jugadores
      
      store.finalizarRonda({ [ana.id]: 10 })
      store.finalizarRonda({ [ana.id]: 15 })
      store.finalizarRonda({ [ana.id]: -10 })
      
      expect(ana.historialPuntos).toEqual([10, 15, -10])
    })

    it('debe permitir totales negativos', () => {
      const store = useGameStore()
      store.iniciarNuevoJuego(100, ['Ana', 'Bruno'])
      
      const [ana, bruno] = store.jugadores
      
      // Ana hace chinchón 3 veces
      store.finalizarRonda({ [ana.id]: -10, [bruno.id]: 25 })
      store.finalizarRonda({ [ana.id]: -10, [bruno.id]: 30 })
      store.finalizarRonda({ [ana.id]: -10, [bruno.id]: 20 })
      
      expect(ana.puntosAcumulados).toBe(-30)
      expect(bruno.puntosAcumulados).toBe(75)
    })
  })

  describe('Reenganche', () => {
    it('debe reenganchar jugador con los puntos del que está más cerca del límite sin alcanzarlo', () => {
      const store = useGameStore()
      store.iniciarNuevoJuego(100, ['Ana', 'Bruno', 'Carlos'])
      
      const [ana, bruno, carlos] = store.jugadores
      
      // Simular puntuaciones
      ana.puntosAcumulados = 104 // Alcanzó el límite
      bruno.puntosAcumulados = 95 // Más cercano al límite sin alcanzarlo
      carlos.puntosAcumulados = 60
      
      store.reengancharJugador(ana.id)
      
      expect(ana.puntosAcumulados).toBe(95) // Se reengancha con los puntos de Bruno (más cercano al límite)
      expect(ana.vecesReenganchado).toBe(1)
    })

    it('debe reenganchar con el segundo jugador si el primero también alcanzó el límite', () => {
      const store = useGameStore()
      store.iniciarNuevoJuego(100, ['Ana', 'Bruno', 'Carlos', 'Diana'])
      
      const [ana, bruno, carlos, diana] = store.jugadores
      
      // Simular puntuaciones
      ana.puntosAcumulados = 110 // Alcanzó el límite
      bruno.puntosAcumulados = 105 // También alcanzó el límite
      carlos.puntosAcumulados = 98 // Más cercano al límite sin alcanzarlo
      diana.puntosAcumulados = 40
      
      // Marcar a Bruno como eliminado (ya alcanzó el límite antes)
      bruno.eliminado = true
      
      store.reengancharJugador(ana.id)
      
      expect(ana.puntosAcumulados).toBe(98) // Se reengancha con Carlos, no con Bruno
      expect(ana.vecesReenganchado).toBe(1)
    })

    it('debe permitir múltiples reenganches', () => {
      const store = useGameStore()
      store.iniciarNuevoJuego(100, ['Ana', 'Bruno'])
      
      const [ana, bruno] = store.jugadores
      ana.puntosAcumulados = 100
      bruno.puntosAcumulados = 50
      
      store.reengancharJugador(ana.id)
      expect(ana.vecesReenganchado).toBe(1)
      
      ana.puntosAcumulados = 100
      store.reengancharJugador(ana.id)
      expect(ana.vecesReenganchado).toBe(2)
    })
  })

  describe('Eliminar jugador', () => {
    it('debe marcar jugador como eliminado', () => {
      const store = useGameStore()
      store.iniciarNuevoJuego(100, ['Ana', 'Bruno'])
      
      const [ana] = store.jugadores
      
      store.eliminarJugador(ana.id)
      
      expect(ana.eliminado).toBe(true)
    })

    it('debe finalizar juego si solo queda 1 jugador activo', () => {
      const store = useGameStore()
      store.iniciarNuevoJuego(100, ['Ana', 'Bruno'])
      
      const [ana] = store.jugadores
      
      store.eliminarJugador(ana.id)
      
      expect(store.juegoFinalizado).toBe(true)
      expect(store.juegoActivo).toBe(false)
    })
  })

  describe('Deshacer última ronda', () => {
    it('debe revertir puntos de la última ronda', () => {
      const store = useGameStore()
      store.iniciarNuevoJuego(100, ['Ana', 'Bruno'])
      
      const [ana, bruno] = store.jugadores
      
      store.finalizarRonda({ [ana.id]: 20, [bruno.id]: 30 })
      store.finalizarRonda({ [ana.id]: 15, [bruno.id]: 25 })
      
      expect(ana.puntosAcumulados).toBe(35)
      expect(bruno.puntosAcumulados).toBe(55)
      
      store.deshacerUltimaRonda()
      
      expect(ana.puntosAcumulados).toBe(20)
      expect(bruno.puntosAcumulados).toBe(30)
      expect(store.rondas).toHaveLength(1)
    })

    it('no debe hacer nada si no hay rondas', () => {
      const store = useGameStore()
      store.iniciarNuevoJuego(100, ['Ana'])
      
      const [ana] = store.jugadores
      
      store.deshacerUltimaRonda()
      
      expect(ana.puntosAcumulados).toBe(0)
      expect(store.rondas).toHaveLength(0)
    })

    it('debe reactivar jugador eliminado si vuelve debajo del límite', () => {
      const store = useGameStore()
      store.iniciarNuevoJuego(100, ['Ana', 'Bruno'])
      
      const [ana, bruno] = store.jugadores
      
      store.finalizarRonda({ [ana.id]: 110, [bruno.id]: 30 })
      
      ana.eliminado = true
      
      store.deshacerUltimaRonda()
      
      expect(ana.puntosAcumulados).toBe(0)
      expect(ana.eliminado).toBe(false)
    })
  })

  describe('Getters', () => {
    it('jugadoresActivos debe retornar solo jugadores no eliminados', () => {
      const store = useGameStore()
      store.iniciarNuevoJuego(100, ['Ana', 'Bruno', 'Carlos'])
      
      const [ana, , carlos] = store.jugadores
      
      ana.eliminado = true
      
      expect(store.jugadoresActivos).toHaveLength(2)
      expect(store.jugadoresActivos.find(j => j.id === carlos.id)).toBeDefined()
    })

    it('jugadoresOrdenados debe ordenar por puntos ascendente', () => {
      const store = useGameStore()
      store.iniciarNuevoJuego(100, ['Ana', 'Bruno', 'Carlos'])
      
      const [ana, bruno, carlos] = store.jugadores
      
      ana.puntosAcumulados = 50
      bruno.puntosAcumulados = 20
      carlos.puntosAcumulados = 80
      
      const ordenados = store.jugadoresOrdenados
      
      expect(ordenados[0].id).toBe(bruno.id)
      expect(ordenados[1].id).toBe(ana.id)
      expect(ordenados[2].id).toBe(carlos.id)
    })

    it('debeFinalizarJuego debe retornar true si hay 1 o menos jugadores activos', () => {
      const store = useGameStore()
      store.iniciarNuevoJuego(100, ['Ana', 'Bruno'])
      
      expect(store.debeFinalizarJuego).toBe(false)
      
      const [ana] = store.jugadores
      ana.eliminado = true
      
      expect(store.debeFinalizarJuego).toBe(true)
    })

    it('ganador debe retornar el único jugador activo', () => {
      const store = useGameStore()
      store.iniciarNuevoJuego(100, ['Ana', 'Bruno'])
      
      const [ana, bruno] = store.jugadores
      
      ana.eliminado = true
      
      expect(store.ganador.id).toBe(bruno.id)
    })
  })

  describe('Edición de jugadores', () => {
    it('debe editar nombre de jugador', () => {
      const store = useGameStore()
      store.iniciarNuevoJuego(100, ['Ana'])
      
      const [ana] = store.jugadores
      
      store.editarNombreJugador(ana.id, 'Anita')
      
      expect(ana.nombre).toBe('Anita')
    })

    it('debe borrar jugador si no hay rondas', () => {
      const store = useGameStore()
      store.iniciarNuevoJuego(100, ['Ana', 'Bruno'])
      
      const [ana] = store.jugadores
      
      store.borrarJugador(ana.id)
      
      expect(store.jugadores).toHaveLength(1)
    })

    it('no debe borrar jugador si ya hay rondas', () => {
      const store = useGameStore()
      store.iniciarNuevoJuego(100, ['Ana', 'Bruno'])
      
      const [ana, bruno] = store.jugadores
      
      store.finalizarRonda({ [ana.id]: 10, [bruno.id]: 20 })
      store.borrarJugador(ana.id)
      
      expect(store.jugadores).toHaveLength(2)
    })
  })

  describe('Persistencia', () => {
    it('debe guardar estado en localStorage', () => {
      const store = useGameStore()
      store.iniciarNuevoJuego(100, ['Ana'])
      
      const guardado = JSON.parse(localStorage.getItem('chinchon-game-state'))
      
      expect(guardado.limiteEliminacion).toBe(100)
      expect(guardado.jugadores).toHaveLength(1)
      expect(guardado.juegoActivo).toBe(true)
    })

    it('debe cargar estado desde localStorage', () => {
      const store = useGameStore()
      
      const estado = {
        limiteEliminacion: 150,
        jugadores: [{ id: '1', nombre: 'Test', puntosAcumulados: 50, eliminado: false }],
        rondas: [],
        juegoActivo: true,
        juegoFinalizado: false
      }
      
      localStorage.setItem('chinchon-game-state', JSON.stringify(estado))
      
      store.cargarDesdeLocalStorage()
      
      expect(store.limiteEliminacion).toBe(150)
      expect(store.jugadores).toHaveLength(1)
      expect(store.jugadores[0].nombre).toBe('Test')
    })
  })

  describe('Historial de partidas', () => {
    it('debe guardar partida en historial al finalizar', () => {
      const store = useGameStore()
      store.iniciarNuevoJuego(100, ['Ana', 'Bruno'])
      
      const [ana, bruno] = store.jugadores
      store.finalizarRonda({ [ana.id]: 50, [bruno.id]: 110 })
      
      store.eliminarJugador(bruno.id)
      
      expect(store.historialPartidas).toHaveLength(1)
      expect(store.historialPartidas[0].ganador).toBe('Ana')
    })

    it('debe limitar historial a 20 partidas', () => {
      const store = useGameStore()
      
      // Crear 25 partidas
      for (let i = 0; i < 25; i++) {
        store.iniciarNuevoJuego(100, ['Ana'])
        store.finalizarJuego()
      }
      
      expect(store.historialPartidas.length).toBeLessThanOrEqual(20)
    })

    it('debe eliminar partida del historial', () => {
      const store = useGameStore()
      store.iniciarNuevoJuego(100, ['Ana'])
      store.finalizarJuego()
      
      const partidaId = store.historialPartidas[0].id
      
      store.eliminarPartidaDelHistorial(partidaId)
      
      expect(store.historialPartidas).toHaveLength(0)
    })
  })
})
