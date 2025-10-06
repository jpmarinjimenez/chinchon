/// <reference types="cypress" />

describe('Flujo completo del juego Chinchón', () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    cy.clearLocalStorage()
    cy.visit('/')
  })

  it('debe mostrar la pantalla de inicio correctamente', () => {
    cy.contains('Chinchón').should('be.visible')
    cy.contains('Nueva Partida').should('be.visible')
    cy.get('input[type="number"]').should('exist')
  })

  it('debe crear una nueva partida con 3 jugadores', () => {
    // Configurar límite de puntos
    cy.get('input#limite').clear().type('100')

    // Agregar nombres de jugadores
    cy.get('input[placeholder="Jugador 1"]').type('Ana')
    cy.get('input[placeholder="Jugador 2"]').type('Bruno')
    
    // Agregar tercer jugador
    cy.contains('Agregar jugador').click()
    cy.get('input[placeholder="Jugador 3"]').type('Carlos')

    // Iniciar partida
    cy.contains('Iniciar Partida').click()

    // Verificar que estamos en la vista de juego
    cy.url().should('include', '/juego')
    cy.contains('Ronda 1').should('be.visible')
    cy.contains('Ana').should('be.visible')
    cy.contains('Bruno').should('be.visible')
    cy.contains('Carlos').should('be.visible')
  })

  it('debe finalizar una ronda correctamente', () => {
    // Crear partida
    crearPartida(['Ana', 'Bruno'], 100)

    // Abrir modal de finalizar ronda
    cy.contains('Finalizar Ronda').click()
    cy.contains('Introduce los puntos').should('be.visible')

    // Introducir puntos
    cy.get('input[type="number"]').eq(0).clear().type('15')
    cy.get('input[type="number"]').eq(1).clear().type('20')

    // Confirmar
    cy.contains('Confirmar Ronda').click()

    // Verificar que los puntos se sumaron
    cy.contains('Total').should('be.visible')
    cy.contains('Ronda 2').should('be.visible')
  })

  it('debe manejar un chinchón (-10 puntos)', () => {
    // Crear partida
    crearPartida(['Ana', 'Bruno'], 100)

    // Finalizar ronda con chinchón
    cy.contains('Finalizar Ronda').click()
    cy.get('input[type="number"]').eq(0).clear().type('-10')
    cy.get('input[type="number"]').eq(1).clear().type('25')

    // Verificar resaltado visual del chinchón
    cy.get('input[type="number"]').eq(0).should('have.class', 'bg-green-100')
    cy.get('div').contains('🎉').should('exist')

    cy.contains('Confirmar Ronda').click()

    // Verificar que la ronda se registró
    cy.contains('Ronda 2').should('be.visible')
  })

  it('debe mostrar modal de reenganche cuando un jugador alcanza el límite', () => {
    // Crear partida con límite bajo para testing
    crearPartida(['Ana', 'Bruno'], 50)

    // Primera ronda
    finalizarRonda([20, 10])

    // Segunda ronda (Ana alcanza el límite)
    cy.contains('Finalizar Ronda').click()
    cy.get('input[type="number"]').eq(0).clear().type('35')
    cy.get('input[type="number"]').eq(1).clear().type('15')
    cy.contains('Confirmar Ronda').click()

    // Verificar modal de reenganche
    cy.contains('Límite Alcanzado').should('be.visible')
    cy.contains('Ana').should('be.visible')
    cy.contains('Reenganchar').should('be.visible')
    cy.contains('Eliminar').should('be.visible')
  })

  it('debe permitir reenganchar a un jugador', () => {
    // Crear partida
    crearPartida(['Ana', 'Bruno', 'Carlos'], 50)

    // Llevar a Ana al límite
    finalizarRonda([25, 10, 15])
    cy.contains('Finalizar Ronda').click()
    cy.get('input[type="number"]').eq(0).clear().type('30')
    cy.get('input[type="number"]').eq(1).clear().type('5')
    cy.get('input[type="number"]').eq(2).clear().type('10')
    cy.contains('Confirmar Ronda').click()

    // Reenganchar a Ana
    cy.contains('Reenganchar').click()

    // Verificar que el modal se cerró
    cy.contains('Límite Alcanzado').should('not.exist')
  })

  it('debe eliminar a un jugador cuando rechaza el reenganche', () => {
    // Crear partida
    crearPartida(['Ana', 'Bruno'], 50)

    // Llevar a Ana al límite
    finalizarRonda([25, 10])
    cy.contains('Finalizar Ronda').click()
    cy.get('input[type="number"]').eq(0).clear().type('30')
    cy.get('input[type="number"]').eq(1).clear().type('5')
    cy.contains('Confirmar Ronda').click()

    // Eliminar a Ana
    cy.contains('Eliminar').click()

    // Verificar que el juego finalizó (solo queda 1 jugador)
    cy.contains('Partida Finalizada').should('be.visible')
    cy.contains('Ganador').should('be.visible')
  })

  it('debe deshacer la última ronda', () => {
    // Crear partida
    crearPartida(['Ana', 'Bruno'], 100)

    // Finalizar dos rondas
    finalizarRonda([15, 20])
    finalizarRonda([10, 25])

    // Verificar que estamos en ronda 3
    cy.contains('Ronda 3').should('be.visible')

    // Deshacer última ronda
    cy.contains('Deshacer').click()

    // Confirmar en el diálogo
    cy.on('window:confirm', () => true)

    // Verificar que volvimos a ronda 2
    cy.contains('Ronda 2').should('be.visible')
  })

  it('debe guardar el estado en localStorage', () => {
    // Crear partida
    crearPartida(['Ana', 'Bruno'], 100)
    finalizarRonda([15, 20])

    // Recargar la página
    cy.reload()

    // Verificar que la partida sigue activa
    cy.visit('/')
    cy.contains('Partida en curso detectada').should('be.visible')
    cy.contains('Continuar').click()

    // Verificar que estamos en la partida guardada
    cy.url().should('include', '/juego')
    cy.contains('Ronda 2').should('be.visible')
  })

  it('debe mostrar el historial de partidas', () => {
    // Crear y finalizar una partida
    crearPartida(['Ana', 'Bruno'], 50)
    finalizarRonda([25, 10])
    finalizarRonda([30, 15])

    // Eliminar al jugador que alcanzó el límite
    cy.contains('Eliminar').click()

    // Ir al historial
    cy.contains('Ver Historial').click()

    // Verificar que estamos en la vista de historial
    cy.url().should('include', '/historial')
    cy.contains('Historial de Partidas').should('be.visible')
    cy.contains('Ganador').should('be.visible')
  })

  it('debe validar que no se pueden ingresar puntos inválidos', () => {
    // Crear partida
    crearPartida(['Ana', 'Bruno'], 100)

    // Abrir modal
    cy.contains('Finalizar Ronda').click()

    // Intentar ingresar un valor inválido (menor a -10)
    cy.get('input[type="number"]').eq(0).clear().type('-20')
    cy.get('input[type="number"]').eq(0).should('have.value', '-10')

    // Intentar ingresar valor negativo que no sea -10
    cy.get('input[type="number"]').eq(0).clear().type('-5')
    cy.get('input[type="number"]').eq(0).should('have.value', '0')
  })

  it('debe finalizar el juego cuando solo queda un jugador', () => {
    // Crear partida con 3 jugadores
    crearPartida(['Ana', 'Bruno', 'Carlos'], 50)

    // Llevar a dos jugadores al límite
    finalizarRonda([25, 25, 10])
    cy.contains('Finalizar Ronda').click()
    cy.get('input[type="number"]').eq(0).clear().type('30')
    cy.get('input[type="number"]').eq(1).clear().type('30')
    cy.get('input[type="number"]').eq(2).clear().type('10')
    cy.contains('Confirmar Ronda').click()

    // Eliminar a Ana
    cy.contains('Eliminar').first().click()

    // Eliminar a Bruno
    cy.contains('Eliminar').click()

    // Verificar que el juego finalizó
    cy.contains('Partida Finalizada').should('be.visible')
    cy.contains('Ganador: Carlos').should('be.visible')
  })

  it('debe poder iniciar una nueva partida desde el juego finalizado', () => {
    // Crear y finalizar partida
    crearPartida(['Ana', 'Bruno'], 50)
    finalizarRonda([30, 10])
    finalizarRonda([25, 15])

    // Eliminar jugador
    cy.contains('Eliminar').click()

    // Verificar que el juego finalizó
    cy.contains('Partida Finalizada').should('be.visible')

    // Iniciar nueva partida
    cy.contains('Nueva Partida').click()

    // Confirmar
    cy.on('window:confirm', () => true)

    // Verificar que volvimos al inicio
    cy.url().should('not.include', '/juego')
    cy.contains('Nueva Partida').should('be.visible')
  })

  // Funciones auxiliares
  function crearPartida(jugadores, limite) {
    cy.get('input#limite').clear().type(limite.toString())

    jugadores.forEach((nombre, index) => {
      if (index < 2) {
        cy.get(`input[placeholder="Jugador ${index + 1}"]`).type(nombre)
      } else {
        cy.contains('Agregar jugador').click()
        cy.get(`input[placeholder="Jugador ${index + 1}"]`).type(nombre)
      }
    })

    cy.contains('Iniciar Partida').click()
  }

  function finalizarRonda(puntos) {
    cy.contains('Finalizar Ronda').click()
    
    puntos.forEach((punto, index) => {
      cy.get('input[type="number"]').eq(index).clear().type(punto.toString())
    })

    cy.contains('Confirmar Ronda').click()

    // Esperar a que se cierre el modal
    cy.wait(300)
  }
})

describe('Validaciones y casos edge', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit('/')
  })

  it('no debe permitir crear partida con menos de 2 jugadores', () => {
    cy.get('input#limite').clear().type('100')
    cy.get('input[placeholder="Jugador 1"]').type('Ana')
    
    // Intentar eliminar el segundo jugador
    cy.get('button').contains('✕').should('not.exist')
  })

  it('no debe permitir más de 8 jugadores', () => {
    cy.get('input#limite').clear().type('100')
    
    // Agregar 8 jugadores
    for (let i = 0; i < 6; i++) {
      cy.contains('Agregar jugador').click()
    }

    // Verificar que no se puede agregar más
    cy.contains('Agregar jugador').should('not.exist')
  })

  it('debe validar que los nombres no estén vacíos', () => {
    cy.get('input#limite').clear().type('100')
    cy.get('input[placeholder="Jugador 1"]').type('Ana')
    // Dejar el segundo jugador vacío

    // El botón debe estar deshabilitado
    cy.contains('Iniciar Partida').should('be.disabled')
  })
})
