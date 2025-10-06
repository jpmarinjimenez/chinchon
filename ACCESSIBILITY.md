# Accesibilidad y Responsividad

## 📱 Responsividad

### Breakpoints utilizados
- **Móvil**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Adaptaciones por dispositivo

#### Móvil (< 768px)
- **Vista de tarjetas**: Cada jugador tiene su propia tarjeta (`PlayerCard.vue`)
- **Scroll vertical**: Las tarjetas se apilan verticalmente
- **Botones grandes**: Optimizados para touch (min 44x44px)
- **Formularios adaptados**: Inputs y botones a ancho completo

#### Tablet y Desktop (≥ 768px)
- **Vista de tabla**: Columnas por jugador con scroll horizontal si es necesario
- **Disposición en grid**: Aprovecha el espacio horizontal
- **Múltiples columnas**: Información más densa
- **Hover states**: Efectos visuales adicionales

### Componentes responsivos

1. **GameView.vue**
   ```vue
   <!-- Desktop: Tabla -->
   <div class="hidden md:block">...</div>
   
   <!-- Móvil: Tarjetas -->
   <div class="md:hidden">...</div>
   ```

2. **HeaderBar.vue**
   - Botones se reorganizan en móvil
   - Texto se oculta en pantallas pequeñas (`hidden sm:inline`)

3. **Modales**
   - Se adaptan al tamaño de la pantalla
   - `max-w-2xl` con padding responsive

## ♿ Accesibilidad

### Roles ARIA implementados

1. **Modales**
   ```vue
   role="dialog"
   aria-modal="true"
   aria-labelledby="modal-title"
   ```

2. **Inputs**
   ```vue
   :aria-label="`Puntos para ${jugador.nombre}`"
   ```

3. **Botones**
   ```vue
   aria-label="Cerrar modal"
   ```

### Navegación por teclado

- **Tab**: Navega entre inputs y botones
- **Enter**: Confirma acciones en modales
- **Escape**: Cierra modales (implementado en eventos @keydown)
- **Foco automático**: Los modales enfocan automáticamente el primer input

### Contraste de colores

- Cumple con WCAG 2.1 nivel AA
- Texto oscuro sobre fondos claros (ratio ≥ 4.5:1)
- Botones con contraste adecuado
- Estados de hover claramente diferenciados

### Estados visuales

- **Foco**: Anillo visible en todos los elementos interactivos (`focus:ring-2`)
- **Hover**: Cambios de color en botones y enlaces
- **Activo**: Feedback visual al hacer click
- **Deshabilitado**: Opacidad reducida y cursor no permitido

### Animaciones

- **Reducción de movimiento**: Respetar `prefers-reduced-motion` (implementado en CSS)
- **Duraciones cortas**: < 0.5s para evitar mareos
- **Animaciones opcionales**: Pueden desactivarse si es necesario

### Formularios accesibles

1. **Labels asociados**: Todos los inputs tienen labels
2. **Validación visible**: Mensajes de error claros
3. **Placeholders descriptivos**: Ayuda adicional
4. **Autocompletado**: Atributos `autocomplete` donde aplica

### Mensajes y feedback

- **Confirmaciones visuales**: Colores y animaciones
- **Sonidos opcionales**: Se pueden silenciar si no funciona el audio
- **Mensajes de error**: Textos claros y descriptivos
- **Estados de carga**: Indicadores cuando sea necesario

## 🎨 UX Mejorada

### Animaciones implementadas

1. **Chinchón (-10 puntos)**
   - Resaltado visual con fondo verde
   - Icono animado (🎉)
   - Sonido opcional
   - Clase `chinchon-animation`

2. **Límite alcanzado**
   - Modal con animación de alerta
   - Colores rojos/naranjas
   - Sonido de advertencia
   - Animación `pulse-fast`

3. **Transiciones**
   - `fade`: Entrada/salida de modales
   - `slide-up`: Contenido de modales
   - Duración: 0.3s

### Feedback visual

- **Jugador líder**: Fondo verde en tarjeta
- **Jugador cerca del límite**: Fondo amarillo
- **Jugador eliminado**: Opacidad reducida, borde rojo
- **Ronda con chinchón**: Texto verde, negrita

## 📊 Pruebas de accesibilidad recomendadas

1. **Navegación por teclado**: Probar toda la app sin ratón
2. **Lector de pantalla**: VoiceOver (Mac), NVDA (Windows)
3. **Zoom**: Probar al 200% de zoom
4. **Contraste**: Verificar con herramientas como WAVE
5. **Móvil real**: Probar en dispositivos físicos

## 🔧 Mejoras futuras

- [ ] Soporte para `prefers-reduced-motion`
- [ ] Modo alto contraste
- [ ] Tamaños de fuente ajustables
- [ ] Teclas de acceso rápido (shortcuts)
- [ ] Internacionalización (i18n)
