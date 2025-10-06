# 🎴 Chinchón - Contador de Puntos

Aplicación web completa para anotar los puntos del juego de cartas **Chinchón**, desarrollada con **Vue 3**, **Pinia**, **Vite** y **Tailwind CSS**.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Requisitos](#-requisitos)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Arquitectura](#-arquitectura)
- [Testing](#-testing)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Tecnologías](#-tecnologías)
- [Checklist de Funcionalidades](#-checklist-de-funcionalidades)

## ✨ Características

### Funcionalidades Principales

- ✅ **Configuración inicial**: Define el límite de puntos para eliminación (default: 100)
- ✅ **2-8 jugadores**: Soporte para partidas de 2 hasta 8 jugadores
- ✅ **Tabla de puntuación**: Vista por columnas (desktop) o tarjetas (móvil)
- ✅ **Finalizar rondas**: Modal para introducir puntos de cada jugador
- ✅ **Chinchón (-10 puntos)**: Resaltado visual y sonoro cuando un jugador hace -10
- ✅ **Sistema de reenganche**: Cuando un jugador alcanza el límite, puede reengancharse con los puntos del jugador activo con más puntos
- ✅ **Múltiples reenganches**: Un jugador puede reengancharse varias veces
- ✅ **Eliminación visual**: Los jugadores eliminados se marcan pero no se borran
- ✅ **Final de juego**: Termina cuando solo queda un jugador activo
- ✅ **Persistencia**: Estado guardado automáticamente en localStorage
- ✅ **Historial de partidas**: Guarda las últimas 20 partidas
- ✅ **Deshacer ronda**: Permite revertir la última ronda jugada
- ✅ **Editar nombres**: Modificar nombres de jugadores
- ✅ **Borrar jugadores**: Eliminar jugadores antes de empezar las rondas
- ✅ **Responsive**: Optimizado para móvil, tablet y desktop
- ✅ **Animaciones**: Transiciones suaves y efectos visuales
- ✅ **Sonidos**: Efectos de audio para chinchón y límite alcanzado
- ✅ **Accesibilidad**: Roles ARIA, navegación por teclado, contraste adecuado

### UX/UI

- 🎨 **Diseño moderno**: Gradientes, sombras y colores vibrantes
- 📱 **Mobile-first**: Prioridad en la experiencia móvil
- 🔄 **Animaciones suaves**: Transiciones y efectos visuales
- 🎵 **Efectos sonoros**: Feedback auditivo opcional
- 🎯 **Ranking visual**: Colores según posición y puntos
- ⚡ **Rápido y fluido**: Sin retrasos ni carga lenta

## 🔧 Requisitos

- **Node.js**: v16 o superior
- **npm**: v7 o superior

## 📥 Instalación

```bash
# Clonar el repositorio (si aplica)
git clone <url-repositorio>
cd chinchon-scorekeeper

# Instalar dependencias
npm install
```

## 🚀 Uso

### Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# La aplicación estará disponible en http://localhost:5173
```

### Producción

```bash
# Construir para producción
npm run build

# Previsualizar build de producción
npm run preview
```

### Testing

```bash
# Ejecutar tests unitarios
npm run test

# Ejecutar tests E2E (requiere que el servidor esté corriendo)
npm run test:e2e

# Ejecutar tests E2E en modo headless
npm run test:e2e:ci
```

## 🏗️ Arquitectura

### Patrón de Diseño

La aplicación sigue una **arquitectura basada en componentes** con gestión de estado centralizada:

```
┌─────────────────────────────────────┐
│           Components                │
│  (Presentación y UI)                │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│          Views/Pages                │
│  (Composición de componentes)       │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│         Store (Pinia)               │
│  (Estado global y lógica)           │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│        localStorage                 │
│  (Persistencia)                     │
└─────────────────────────────────────┘
```

### Store (Pinia)

El **gameStore** centraliza toda la lógica del juego:

- **Estado**: Jugadores, rondas, límite, historial
- **Getters**: Jugadores activos, ordenados, ganador, etc.
- **Actions**:
  - `iniciarNuevoJuego()`: Crea una nueva partida
  - `finalizarRonda()`: Suma puntos y detecta límites
  - `reengancharJugador()`: Reengancha con puntos del líder
  - `eliminarJugador()`: Marca como eliminado
  - `deshacerUltimaRonda()`: Revierte la última ronda
  - `guardarEnLocalStorage()`: Persiste el estado
  - `cargarDesdeLocalStorage()`: Recupera el estado

### Componentes Principales

#### Vistas
- **HomeView**: Pantalla de inicio y configuración
- **GameView**: Vista principal del juego
- **HistoryView**: Historial de partidas

#### Componentes
- **HeaderBar**: Barra de navegación con acciones
- **PlayerCard**: Tarjeta de jugador (vista móvil)
- **PlayerColumn**: Columna de jugador (vista desktop)
- **RoundsList**: Historial de rondas
- **NewGameForm**: Formulario de nueva partida
- **FinalizarRondaModal**: Modal para ingresar puntos
- **ReengancheModal**: Modal de decisión de reenganche

### Flujo de Datos

```
Usuario → Componente → Emit evento → Vista → Store action → Estado actualizado → localStorage
                                                    ↓
                                          Componente re-renderiza
```

## 🧪 Testing

### Tests Unitarios (Vitest)

**27 tests** que cubren el store completo:

- Inicialización del juego
- Finalizar rondas
- Sumar puntos (incluido -10)
- Detectar jugadores que alcanzan el límite
- Sistema de reenganche
- Eliminar jugadores
- Deshacer rondas
- Getters (jugadores activos, ordenados, ganador)
- Edición de jugadores
- Persistencia en localStorage
- Historial de partidas

```bash
npm run test
```

### Tests E2E (Cypress)

**15 tests** que cubren el flujo completo:

- Crear partida
- Finalizar rondas
- Chinchón (-10)
- Reenganche
- Eliminación
- Deshacer ronda
- Persistencia
- Historial
- Validaciones
- Final de juego

```bash
# Terminal 1: Iniciar servidor
npm run dev

# Terminal 2: Ejecutar tests
npm run test:e2e
```

## 📁 Estructura del Proyecto

```
chinchon-scorekeeper/
├── package.json                      # Dependencias y scripts
├── vite.config.js                    # Configuración de Vite
├── tailwind.config.cjs               # Configuración de Tailwind
├── postcss.config.cjs                # Configuración de PostCSS
├── cypress.config.js                 # Configuración de Cypress
├── index.html                        # HTML principal
├── README.md                         # Este archivo
├── ACCESSIBILITY.md                  # Documentación de accesibilidad
├── .gitignore                        # Archivos ignorados por Git
│
├── src/
│   ├── main.js                       # Punto de entrada
│   ├── App.vue                       # Componente raíz
│   │
│   ├── styles/
│   │   └── tailwind.css              # Estilos globales y Tailwind
│   │
│   ├── router/
│   │   └── index.js                  # Configuración de rutas
│   │
│   ├── stores/
│   │   └── gameStore.js              # Store de Pinia (lógica del juego)
│   │
│   ├── views/
│   │   ├── HomeView.vue              # Pantalla de inicio
│   │   ├── GameView.vue              # Vista del juego
│   │   └── HistoryView.vue           # Historial de partidas
│   │
│   └── components/
│       ├── HeaderBar.vue             # Barra de navegación
│       ├── PlayerCard.vue            # Tarjeta de jugador (móvil)
│       ├── RoundsList.vue            # Lista de rondas
│       ├── NewGameForm.vue           # Formulario de nueva partida
│       ├── FinalizarRondaModal.vue   # Modal finalizar ronda
│       └── ReengancheModal.vue       # Modal de reenganche
│
└── tests/
    ├── unit/
    │   └── store.spec.js             # Tests unitarios del store
    │
    └── e2e/
        └── game-flow.spec.js         # Tests end-to-end
```

## 🛠️ Tecnologías

### Core
- **Vue 3** (v3.4.21) - Framework progresivo de JavaScript
- **Pinia** (v2.1.7) - Gestión de estado para Vue
- **Vue Router** (v4.3.0) - Enrutamiento oficial de Vue
- **Vite** (v5.2.0) - Build tool y dev server

### Estilos
- **Tailwind CSS** (v3.4.3) - Framework de utilidades CSS
- **PostCSS** (v8.4.38) - Procesador de CSS
- **Autoprefixer** (v10.4.19) - Prefijos CSS automáticos

### Testing
- **Vitest** (v1.4.0) - Framework de testing unitario
- **Cypress** (v13.7.1) - Framework de testing E2E
- **@vue/test-utils** (v2.4.5) - Utilidades para testear Vue
- **happy-dom** (v14.3.9) - Implementación ligera del DOM

### Desarrollo
- **@vitejs/plugin-vue** (v5.0.4) - Plugin de Vue para Vite

## ✅ Checklist de Funcionalidades

### Requisitos Funcionales
- [x] Preguntar límite de puntos al iniciar
- [x] Pedir nombres de jugadores (máximo 8)
- [x] Mostrar columna por jugador con rondas y total
- [x] Botón "Finalizar ronda" con modal
- [x] Permitir -10 puntos (chinchón) con resaltado visual
- [x] Sumar puntos al total y guardar en historial
- [x] Detectar cuando un jugador alcanza el límite
- [x] Preguntar si quiere reengancharse
- [x] Reenganchar con puntos del jugador con más puntos activo
- [x] Permitir múltiples reenganches
- [x] Marcar jugadores eliminados visualmente
- [x] Finalizar juego cuando solo queda 1 jugador
- [x] Guardar en localStorage
- [x] Cargar partidas previas
- [x] Deshacer última ronda
- [x] Editar nombres
- [x] Borrar jugadores
- [x] Ver historial de partidas
- [x] Responsive (móvil y desktop)
- [x] Animaciones suaves
- [x] Efectos visuales y sonoros para -10 y límite
- [x] Resumen final al terminar partida

### Requisitos Técnicos
- [x] Vue 3 + Vite
- [x] Pinia para estado global
- [x] Tailwind CSS para estilos
- [x] JavaScript (no TypeScript)
- [x] Tests unitarios (Vitest)
- [x] Tests E2E (Cypress)
- [x] Arquitectura basada en componentes
- [x] Persistencia en localStorage
- [x] Accesibilidad básica (ARIA, foco)
- [x] Interfaz en español

### UX/UI
- [x] Diseño claro y moderno
- [x] Vista tabla en desktop
- [x] Scroll horizontal o tarjetas en móvil
- [x] Ranking visual
- [x] Modal de finalizar ronda con validaciones
- [x] Modal de reenganche con explicación
- [x] Animaciones y transiciones

## 🎮 Cómo Jugar

1. **Inicio**: Define el límite de puntos (ej: 100) y los nombres de los jugadores
2. **Rondas**: Después de cada ronda, haz clic en "Finalizar Ronda" e introduce los puntos:
   - **-10**: Si hizo chinchón
   - **0 o más**: Puntos normales
3. **Límite alcanzado**: Si un jugador alcanza el límite, decide si:
   - **Reenganchar**: Continúa con los puntos del jugador líder
   - **Eliminar**: Sale del juego
4. **Final**: El juego termina cuando solo queda un jugador activo
5. **Ganador**: El jugador con menos puntos gana

## 📝 Notas Adicionales

### Persistencia
- El estado se guarda automáticamente en cada acción
- Al recargar la página, se recupera la partida en curso
- El historial guarda las últimas 20 partidas

### Accesibilidad
- Navegación completa por teclado
- Roles ARIA en elementos interactivos
- Contraste de colores WCAG 2.1 AA
- Foco visible en todos los elementos
- Ver `ACCESSIBILITY.md` para más detalles

### Responsive
- **Móvil** (< 768px): Vista de tarjetas
- **Desktop** (≥ 768px): Vista de tabla
- Adaptación automática según el tamaño de pantalla

## 🐛 Solución de Problemas

### El audio no funciona
Los efectos de sonido pueden no funcionar en algunos navegadores por políticas de autoplay. Esto es normal y no afecta la funcionalidad.

### La partida no se guarda
Verifica que el navegador tenga habilitado localStorage y no esté en modo privado/incógnito.

### Los tests E2E fallan
Asegúrate de que el servidor de desarrollo esté corriendo en el puerto 5173 antes de ejecutar los tests.

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

**Desarrollado con ❤️ usando Vue 3, Pinia, Vite y Tailwind CSS**
