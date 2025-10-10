import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', {
  state: () => ({
    // Configuración del juego
    limiteEliminacion: 100,
    jugadores: [],
    rondas: [],
    juegoActivo: false,
    juegoFinalizado: false,
    fechaInicio: null,
    
    // Historial de partidas
    historialPartidas: []
  }),

  getters: {
    /**
     * Retorna los jugadores activos (no eliminados)
     */
    jugadoresActivos: (state) => {
      return state.jugadores.filter(j => !j.eliminado)
    },

    /**
     * Retorna los jugadores ordenados por puntuación (de menor a mayor)
     */
    jugadoresOrdenados: (state) => {
      return [...state.jugadores].sort((a, b) => a.puntosAcumulados - b.puntosAcumulados)
    },

    /**
     * Retorna el número de ronda actual
     */
    rondaActual: (state) => {
      return state.rondas.length + 1
    },

    /**
     * Obtiene el jugador con más puntos que esté por debajo del límite (no eliminado)
     * Este es el jugador con el que se reenganchará alguien que alcance el límite
     */
    jugadorConMasPuntosActivo: (state) => {
      // Filtrar jugadores que no estén eliminados Y que estén por debajo del límite
      const activosBajoLimite = state.jugadores.filter(
        j => !j.eliminado && j.puntosAcumulados < state.limiteEliminacion
      )
      
      if (activosBajoLimite.length === 0) return null
      
      // Retornar el que tenga más puntos (más cerca del límite)
      return activosBajoLimite.reduce((max, j) => 
        j.puntosAcumulados > max.puntosAcumulados ? j : max
      )
    },

    /**
     * Verifica si el juego debe finalizar (solo 1 jugador activo o menos)
     */
    debeFinalizarJuego: (state) => {
      const activos = state.jugadores.filter(j => !j.eliminado)
      return activos.length <= 1
    },

    /**
     * Obtiene el ganador del juego
     */
    ganador: (state) => {
      const activos = state.jugadores.filter(j => !j.eliminado)
      if (activos.length === 1) {
        return activos[0]
      }
      // Si todos fueron eliminados, gana el que menos puntos tiene
      return state.jugadores.reduce((min, j) => 
        j.puntosAcumulados < min.puntosAcumulados ? j : min
      )
    }
  },

  actions: {
    /**
     * Inicializa un nuevo juego
     * @param {number} limite - Puntos límite para ser eliminado
     * @param {Array<string>} nombresJugadores - Array con los nombres de los jugadores
     */
    iniciarNuevoJuego(limite, nombresJugadores) {
      this.limiteEliminacion = limite
      this.jugadores = nombresJugadores.map((nombre, index) => ({
        id: `jugador-${Date.now()}-${index}`,
        nombre: nombre.trim(),
        puntosAcumulados: 0,
        eliminado: false,
        vecesReenganchado: 0,
        chinchon: false, // Indica si ganó por chinchón
        historialPuntos: [] // Historial de puntos por ronda
      }))
      this.rondas = []
      this.juegoActivo = true
      this.juegoFinalizado = false
      this.fechaInicio = new Date().toISOString()
      
      this.guardarEnLocalStorage()
    },

    /**
     * Finaliza una ronda y suma los puntos a cada jugador
     * @param {Object} puntosRonda - Objeto con el id del jugador como key y los puntos como value
     * @returns {Array} - Array de jugadores que alcanzaron el límite
     */
    finalizarRonda(puntosRonda) {
      const jugadoresQueLlegaronAlLimite = []
      
      // Crear objeto de ronda
      const nuevaRonda = {
        numero: this.rondaActual,
        fecha: new Date().toISOString(),
        puntos: {}
      }

      // Procesar puntos de cada jugador
      this.jugadores.forEach(jugador => {
        if (jugador.eliminado) {
          nuevaRonda.puntos[jugador.id] = null // Jugador eliminado no tiene puntos
          return
        }

        const puntos = puntosRonda[jugador.id] || 0
        nuevaRonda.puntos[jugador.id] = puntos
        
        // Actualizar puntos del jugador
        jugador.puntosAcumulados += puntos
        jugador.historialPuntos.push(puntos)

        // Verificar si llegó al límite
        if (jugador.puntosAcumulados >= this.limiteEliminacion) {
          jugadoresQueLlegaronAlLimite.push(jugador)
        }
      })

      // Guardar la ronda
      this.rondas.push(nuevaRonda)
      
      // Verificar cuántos jugadores quedan por debajo del límite
      const jugadoresBajoLimite = this.jugadores.filter(
        j => !j.eliminado && j.puntosAcumulados < this.limiteEliminacion
      )

      // Si solo queda 1 jugador por debajo del límite, ese es el ganador
      if (jugadoresBajoLimite.length === 1 && jugadoresQueLlegaronAlLimite.length > 0) {
        // Eliminar a todos los jugadores que alcanzaron el límite
        jugadoresQueLlegaronAlLimite.forEach(jugador => {
          jugador.eliminado = true
        })
        
        // Finalizar el juego automáticamente
        this.finalizarJuego()
        
        this.guardarEnLocalStorage()
        
        // Retornar array vacío para que no se muestre el modal de reenganche
        return []
      }
      
      this.guardarEnLocalStorage()
      
      return jugadoresQueLlegaronAlLimite
    },

    /**
     * Reengancha a un jugador que alcanzó el límite
     * @param {string} jugadorId - ID del jugador a reenganchar
     */
    reengancharJugador(jugadorId) {
      const jugador = this.jugadores.find(j => j.id === jugadorId)
      if (!jugador) return

      // Obtener los puntos del jugador con más puntos que aún no ha sido eliminado
      const jugadorConMasPuntos = this.jugadorConMasPuntosActivo
      
      if (jugadorConMasPuntos && jugadorConMasPuntos.id !== jugadorId) {
        // Se reengancha con los mismos puntos que el que más tiene
        jugador.puntosAcumulados = jugadorConMasPuntos.puntosAcumulados
      }
      
      jugador.vecesReenganchado++
      
      this.guardarEnLocalStorage()
    },

    /**
     * Elimina a un jugador del juego
     * @param {string} jugadorId - ID del jugador a eliminar
     */
    eliminarJugador(jugadorId) {
      const jugador = this.jugadores.find(j => j.id === jugadorId)
      if (jugador) {
        jugador.eliminado = true
        
        // Verificar si el juego debe finalizar
        if (this.debeFinalizarJuego) {
          this.finalizarJuego()
        }
        
        this.guardarEnLocalStorage()
      }
    },

    /**
     * Deshace la última ronda jugada
     */
    deshacerUltimaRonda() {
      if (this.rondas.length === 0) return

      const ultimaRonda = this.rondas.pop()

      // Revertir puntos de cada jugador
      this.jugadores.forEach(jugador => {
        const puntosRonda = ultimaRonda.puntos[jugador.id]
        
        if (puntosRonda !== null && puntosRonda !== undefined) {
          jugador.puntosAcumulados -= puntosRonda
          jugador.historialPuntos.pop()
          
          // Si estaba eliminado y ahora está por debajo del límite, reactivar
          if (jugador.eliminado && jugador.puntosAcumulados < this.limiteEliminacion) {
            jugador.eliminado = false
          }
        }
      })

      // Si el juego estaba finalizado, reactivarlo
      if (this.juegoFinalizado) {
        this.juegoFinalizado = false
        this.juegoActivo = true
      }

      this.guardarEnLocalStorage()
    },

    /**
     * Edita el nombre de un jugador
     * @param {string} jugadorId - ID del jugador
     * @param {string} nuevoNombre - Nuevo nombre del jugador
     */
    editarNombreJugador(jugadorId, nuevoNombre) {
      const jugador = this.jugadores.find(j => j.id === jugadorId)
      if (jugador) {
        jugador.nombre = nuevoNombre.trim()
        this.guardarEnLocalStorage()
      }
    },

    /**
     * Elimina completamente a un jugador del juego (solo si aún no hay rondas)
     * @param {string} jugadorId - ID del jugador
     */
    borrarJugador(jugadorId) {
      if (this.rondas.length === 0) {
        const index = this.jugadores.findIndex(j => j.id === jugadorId)
        if (index !== -1) {
          this.jugadores.splice(index, 1)
          this.guardarEnLocalStorage()
        }
      }
    },

    /**
     * Añade un nuevo jugador a la partida en curso
     * @param {string} nombre - Nombre del nuevo jugador
     * @returns {Object|null} - El jugador creado o null si hay un error
     */
    anadirJugadorAPartida(nombre) {
      // Validar que no haya más de 8 jugadores
      if (this.jugadores.length >= 8) {
        return null
      }

      const nombreTrim = nombre.trim()
      
      // Validar que el nombre no esté vacío
      if (!nombreTrim) {
        return null
      }

      // Validar que no exista ya un jugador con ese nombre
      const nombreExiste = this.jugadores.some(
        j => j.nombre.toLowerCase() === nombreTrim.toLowerCase()
      )
      
      if (nombreExiste) {
        return null
      }

      // Obtener los puntos del jugador más cercano al límite
      const jugadorConMasPuntos = this.jugadorConMasPuntosActivo
      const puntosIniciales = jugadorConMasPuntos ? jugadorConMasPuntos.puntosAcumulados : 0

      // Crear el nuevo jugador
      const nuevoJugador = {
        id: `jugador-${Date.now()}-${this.jugadores.length}`,
        nombre: nombreTrim,
        puntosAcumulados: puntosIniciales,
        eliminado: false,
        vecesReenganchado: 0, // No tiene la marca de reenganchado al entrar
        chinchon: false,
        historialPuntos: []
      }

      // Añadir el jugador al array
      this.jugadores.push(nuevoJugador)

      // Añadir puntos null en todas las rondas anteriores para este jugador
      this.rondas.forEach(ronda => {
        ronda.puntos[nuevoJugador.id] = null
      })

      this.guardarEnLocalStorage()
      
      return nuevoJugador
    },

    /**
     * Finaliza el juego actual
     */
    finalizarJuego() {
      // Si el juego ya estaba finalizado, no hacer nada (evitar duplicados en historial)
      if (this.juegoFinalizado) return
      
      this.juegoActivo = false
      this.juegoFinalizado = true
      
      // Guardar en el historial
      this.guardarEnHistorial()
      
      this.guardarEnLocalStorage()
    },

    /**
     * Finaliza el juego por chinchón (gana automáticamente el jugador)
     * @param {string} jugadorId - ID del jugador que hizo chinchón
     */
    finalizarJuegoPorChinchon(jugadorId) {
      const jugador = this.jugadores.find(j => j.id === jugadorId)
      if (!jugador) return
      
      // Si el juego ya estaba finalizado, no hacer nada
      if (this.juegoFinalizado) return

      // Marcar al jugador como ganador por chinchón
      jugador.chinchon = true
      
      // Eliminar a todos los demás jugadores
      this.jugadores.forEach(j => {
        if (j.id !== jugadorId) {
          j.eliminado = true
        }
      })

      // Finalizar el juego
      this.juegoActivo = false
      this.juegoFinalizado = true
      
      // Guardar en el historial
      this.guardarEnHistorial()
      
      this.guardarEnLocalStorage()
    },

    /**
     * Guarda la partida actual en el historial
     */
    guardarEnHistorial() {
      const partida = {
        id: `partida-${Date.now()}`,
        fecha: this.fechaInicio,
        fechaFin: new Date().toISOString(),
        limiteEliminacion: this.limiteEliminacion,
        jugadores: JSON.parse(JSON.stringify(this.jugadores)),
        rondas: JSON.parse(JSON.stringify(this.rondas)),
        ganador: this.ganador ? this.ganador.nombre : 'N/A'
      }

      this.historialPartidas.unshift(partida)
      
      // Limitar el historial a 20 partidas
      if (this.historialPartidas.length > 20) {
        this.historialPartidas = this.historialPartidas.slice(0, 20)
      }

      this.guardarHistorialEnLocalStorage()
    },

    /**
     * Carga una partida del historial
     * @param {string} partidaId - ID de la partida a cargar
     */
    cargarPartidaDelHistorial(partidaId) {
      const partida = this.historialPartidas.find(p => p.id === partidaId)
      if (!partida) return

      this.limiteEliminacion = partida.limiteEliminacion
      this.jugadores = JSON.parse(JSON.stringify(partida.jugadores))
      this.rondas = JSON.parse(JSON.stringify(partida.rondas))
      this.juegoActivo = false
      this.juegoFinalizado = true
      this.fechaInicio = partida.fecha

      this.guardarEnLocalStorage()
    },

    /**
     * Elimina una partida del historial
     * @param {string} partidaId - ID de la partida a eliminar
     */
    eliminarPartidaDelHistorial(partidaId) {
      const index = this.historialPartidas.findIndex(p => p.id === partidaId)
      if (index !== -1) {
        this.historialPartidas.splice(index, 1)
        this.guardarHistorialEnLocalStorage()
      }
    },

    /**
     * Reinicia el juego (volver a la pantalla de inicio)
     */
    reiniciarJuego() {
      this.jugadores = []
      this.rondas = []
      this.juegoActivo = false
      this.juegoFinalizado = false
      this.limiteEliminacion = 100
      this.fechaInicio = null
      
      this.guardarEnLocalStorage()
    },

    /**
     * Guarda el estado actual en localStorage
     */
    guardarEnLocalStorage() {
      const estado = {
        limiteEliminacion: this.limiteEliminacion,
        jugadores: this.jugadores,
        rondas: this.rondas,
        juegoActivo: this.juegoActivo,
        juegoFinalizado: this.juegoFinalizado,
        fechaInicio: this.fechaInicio
      }
      localStorage.setItem('chinchon-game-state', JSON.stringify(estado))
    },

    /**
     * Carga el estado desde localStorage
     */
    cargarDesdeLocalStorage() {
      const estadoGuardado = localStorage.getItem('chinchon-game-state')
      if (estadoGuardado) {
        try {
          const estado = JSON.parse(estadoGuardado)
          this.limiteEliminacion = estado.limiteEliminacion
          this.jugadores = estado.jugadores || []
          this.rondas = estado.rondas || []
          this.juegoActivo = estado.juegoActivo || false
          this.juegoFinalizado = estado.juegoFinalizado || false
          this.fechaInicio = estado.fechaInicio
        } catch (error) {
          console.error('Error al cargar el estado:', error)
        }
      }
    },

    /**
     * Guarda el historial en localStorage
     */
    guardarHistorialEnLocalStorage() {
      localStorage.setItem('chinchon-history', JSON.stringify(this.historialPartidas))
    },

    /**
     * Carga el historial desde localStorage
     */
    cargarHistorialDesdeLocalStorage() {
      const historialGuardado = localStorage.getItem('chinchon-history')
      if (historialGuardado) {
        try {
          this.historialPartidas = JSON.parse(historialGuardado)
        } catch (error) {
          console.error('Error al cargar el historial:', error)
          this.historialPartidas = []
        }
      }
    }
  }
})
