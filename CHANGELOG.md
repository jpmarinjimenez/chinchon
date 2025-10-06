# Changelog

## [1.4.0] - 2025-10-06

### ✨ Cambios Implementados

#### Victoria Automática cuando Solo Queda un Jugador Bajo el Límite

**Antes:**
- Cuando uno o más jugadores alcanzaban el límite, se mostraba el modal de reenganche independientemente de cuántos jugadores quedaran bajo el límite
- Era posible que todos los jugadores se reengancharan incluso cuando solo quedaba uno por debajo del límite

**Ahora:**
- ✅ Si **solo 1 jugador** queda por debajo del límite, ese jugador **gana automáticamente**
- ✅ Los jugadores que alcanzaron el límite son **eliminados automáticamente**
- ✅ El juego **finaliza inmediatamente** sin mostrar el modal de reenganche
- ✅ Si **2 o más jugadores** quedan bajo el límite, se muestra el modal de reenganche normalmente

**Ejemplos:**

```
Caso 1: 2 jugadores
Límite: 100
- Ana: 105 pts (alcanza límite) ❌
- Bruno: 50 pts (bajo límite) ✅

→ Bruno gana automáticamente
→ No hay modal de reenganche
→ Partida finalizada

Caso 2: 4 jugadores
Límite: 100
- Ana: 110 pts ❌
- Bruno: 105 pts ❌
- Carlos: 102 pts ❌
- Diana: 70 pts ✅

→ Diana gana automáticamente
→ Los 3 jugadores eliminados
→ Partida finalizada

Caso 3: 3 jugadores
Límite: 100
- Ana: 105 pts (alcanza límite)
- Bruno: 60 pts (bajo límite) ✅
- Carlos: 50 pts (bajo límite) ✅

→ Se muestra modal de reenganche para Ana
→ Quedan 2 jugadores en competencia
→ Partida continúa
```

### 🔧 Archivos Modificados

1. **`src/stores/gameStore.js`**
   - Actualizada función `finalizarRonda()`
   - Nueva lógica: Verificar cuántos jugadores quedan bajo el límite
   - Si solo queda 1: eliminar a los demás y finalizar juego
   - Retornar array vacío para evitar modal de reenganche

2. **`tests/unit/store.spec.js`**
   - Nueva sección: "Victoria automática cuando solo queda un jugador bajo el límite"
   - Nuevo test: "debe finalizar el juego si solo queda 1 jugador bajo el límite (2 jugadores)"
   - Nuevo test: "debe finalizar el juego si solo queda 1 jugador bajo el límite (4 jugadores)"
   - Nuevo test: "debe permitir reenganche si quedan 2 o más jugadores bajo el límite"

3. **`tests/e2e/game-flow.spec.js`**
   - Nuevo test: "debe finalizar automáticamente si solo queda 1 jugador bajo el límite"
   - Nuevo test: "debe permitir reenganche si quedan 2 o más jugadores bajo el límite"

4. **`README.md`**
   - Actualizada sección "Funcionalidades Principales"
   - Actualizada sección "Cómo Jugar" con nueva lógica
   - Actualizado checklist de funcionalidades

### 📊 Tests

**Tests Unitarios:** 32 tests (+3 nuevos)
- ✅ Nuevo: "debe finalizar el juego si solo queda 1 jugador bajo el límite (2 jugadores)"
- ✅ Nuevo: "debe finalizar el juego si solo queda 1 jugador bajo el límite (4 jugadores)"
- ✅ Nuevo: "debe permitir reenganche si quedan 2 o más jugadores bajo el límite"

**Tests E2E:** 20 tests (+2 nuevos)
- ✅ Nuevo: "debe finalizar automáticamente si solo queda 1 jugador bajo el límite"
- ✅ Nuevo: "debe permitir reenganche si quedan 2 o más jugadores bajo el límite"

### 💡 Mejoras de Gameplay

1. **Más justo**: Evita situaciones donde todos los jugadores se pueden reenganchar indefinidamente
2. **Más rápido**: El juego termina automáticamente cuando hay un claro ganador
3. **Mejor UX**: No confunde al jugador mostrando opciones de reenganche cuando no tiene sentido
4. **Lógica clara**: Si solo queda uno en pie, ese es el ganador

---

## [1.3.0] - 2025-10-06

### ✨ Cambios Implementados

#### Separación de Conceptos: -10 vs Chinchón

**IMPORTANTE: Corrección de concepto**

**Antes:**
- Se usaba el término "Chinchón" para referirse a la jugada de -10 puntos
- No existía el concepto real de Chinchón (victoria automática)

**Ahora:**
- ✅ **-10 puntos**: Jugada especial que resta 10 puntos. Checkbox en el modal
- ✅ **Chinchón**: Victoria automática. Botón especial "🏆 Chinchón" que termina la partida inmediatamente
- ✅ Confirmación de seguridad antes de declarar chinchón
- ✅ Indicador visual "¡CHINCHÓN! 🎉" en el resumen final
- ✅ El ganador tiene propiedad `chinchon: true` en el store

**Diferencias clave:**
```
-10 puntos (jugada especial):
  - Checkbox en modal
  - Resta 10 puntos
  - La partida continúa
  - Solo un jugador por ronda
  - Icono: ✨

Chinchón (victoria automática):
  - Botón "🏆 Chinchón"
  - Termina la partida
  - Ese jugador gana automáticamente
  - No se puede deshacer
  - Confirmación requerida
  - Icono: 🏆
```

### 🔧 Archivos Modificados

1. **`src/components/FinalizarRondaModal.vue`**
   - Renombrado: `hizoChinchon` → `hizoMenos10`
   - Renombrado: `manejarChinchon()` → `manejarMenos10()`
   - Nueva función: `confirmarChinchon(jugador)`
   - Nuevo botón: "🏆 Chinchón" para cada jugador
   - Checkbox ahora se llama "-10 (especial)"
   - Icono cambiado: 🎉 → ✨ para -10
   - Nuevo emit: `'chinchon'`
   - Confirmación con `confirm()` nativo

2. **`src/views/GameView.vue`**
   - Nueva función: `manejarChinchon(jugadorId)`
   - Llama a `gameStore.finalizarJuegoPorChinchon()`
   - Resumen final actualizado con indicador de chinchón
   - Muestra "¡CHINCHÓN! 🎉" si `ganador.chinchon === true`

3. **`src/stores/gameStore.js`**
   - Nueva acción: `finalizarJuegoPorChinchon(jugadorId)`
   - Nueva propiedad en jugadores: `chinchon: false`
   - Marca `chinchon: true` al ganador
   - Elimina a todos los demás jugadores
   - Finaliza la partida inmediatamente

4. **`tests/e2e/game-flow.spec.js`**
   - Test renombrado: "debe manejar un -10 puntos (jugada especial)"
   - Nuevo test: "debe finalizar la partida con chinchón"
   - Test renombrado: "debe permitir solo un -10 por ronda"
   - Actualizado: Icono 🎉 → ✨

5. **`src/views/HistoryView.vue`**
   - Nueva función: `esGanadorPorChinchon(partida)`
   - Badge "🎉 CHINCHÓN" con animación pulse en lista
   - Indicador "Victoria automática" en detalles
   - Badge también en modal de detalle de partida

6. **`README.md`**
   - Documentación clara de la diferencia entre -10 y Chinchón
   - Sección "Cómo Jugar" actualizada
   - Checklist actualizado con ambas funcionalidades

### 📊 Tests

**Tests E2E:** 18 tests
- ✅ Renombrado: "debe manejar un -10 puntos (jugada especial)"
- ✅ Nuevo: "debe finalizar la partida con chinchón"
- ✅ Renombrado: "debe permitir solo un -10 por ronda"

### 💡 Flujo de Usuario Actualizado

**Para -10 puntos:**
1. Finalizar Ronda → Marcar checkbox "-10" → Confirmar
2. Se restan 10 puntos del total
3. La partida continúa normalmente

**Para Chinchón:**
1. Finalizar Ronda → Botón "🏆 Chinchón"
2. Confirmación: "¿Estás seguro?"
3. Partida termina inmediatamente
4. Ese jugador es declarado ganador
5. Resumen muestra "¡CHINCHÓN! 🎉"

---

## [1.2.0] - 2025-10-06

### ✨ Cambios Implementados

#### Lógica de Reenganche Mejorada

**Antes:**
- Un jugador que alcanzaba el límite se reenganchaba con los puntos del jugador activo (no eliminado) que tuviera más puntos
- Esto podía resultar en reenganches con jugadores que también habían alcanzado o superado el límite

**Ahora:**
- ✅ Un jugador se reengancha con los puntos del jugador que esté **más cerca del límite sin alcanzarlo**
- ✅ Solo se consideran jugadores que estén **por debajo del límite** de eliminación
- ✅ Se ignoran jugadores que hayan alcanzado o superado el límite
- ✅ Mejora la justicia y equilibrio del juego

**Ejemplo:**
```
Límite: 100 puntos
- Ana: 104 puntos (alcanzó el límite) ❌
- Bruno: 95 puntos (el más cercano al límite sin alcanzarlo) ✅
- Carlos: 60 puntos
- Diana: 40 puntos

Si Ana se reengancha → tendrá 95 puntos (los de Bruno)
```

### 🔧 Archivos Modificados

1. **`src/stores/gameStore.js`**
   - Getter `jugadorConMasPuntosActivo` actualizado
   - Filtra jugadores que estén por debajo del límite
   - Retorna el que tenga más puntos (más cerca del límite)

2. **`src/components/ReengancheModal.vue`**
   - Mensaje de explicación actualizado
   - Refleja la nueva lógica: "más cerca del límite sin alcanzarlo"

3. **`tests/unit/store.spec.js`**
   - Test actualizado: "debe reenganchar jugador con los puntos del que está más cerca del límite sin alcanzarlo"
   - Nuevo test: "debe reenganchar con el segundo jugador si el primero también alcanzó el límite"
   - Casos edge cubiertos

4. **`README.md`**
   - Documentación actualizada con nueva lógica de reenganche
   - Sección "Cómo Jugar" mejorada

### 📊 Tests

**Tests Unitarios:** 29 tests
- ✅ Actualizado: "debe reenganchar jugador con los puntos del que está más cerca del límite sin alcanzarlo"
- ✅ Nuevo: "debe reenganchar con el segundo jugador si el primero también alcanzó el límite"

---

## [1.1.0] - 2025-10-06

### ✨ Cambios Implementados

#### Sistema de Chinchón Mejorado

**Antes:**
- Los usuarios ingresaban `-10` manualmente en el campo de puntos
- Era posible ingresar valores negativos incorrectos
- Múltiples jugadores podían tener -10 en la misma ronda

**Ahora:**
- ✅ Checkbox dedicado para marcar chinchón por jugador
- ✅ Solo un jugador puede hacer chinchón por ronda (exclusivo)
- ✅ El input de puntos se deshabilita automáticamente cuando se marca chinchón
- ✅ Resaltado visual (fondo verde) cuando un jugador marca chinchón
- ✅ Efecto sonoro al marcar el checkbox
- ✅ Icono animado (🎉) aparece al lado del checkbox marcado

#### Totales Negativos

- ✅ Los totales pueden ser negativos sin restricciones
- ✅ Los totales negativos se muestran en verde (color de ventaja)
- ✅ Lógica de colores mejorada:
  - **Verde**: Total ≤ 0 o < límite/2 (buena posición)
  - **Amarillo**: Total entre límite/2 y límite (zona de peligro)
  - **Rojo**: Total ≥ límite (eliminado/al límite)

### 🔧 Archivos Modificados

1. **`src/components/FinalizarRondaModal.vue`**
   - Nuevo sistema de checkboxes para chinchón
   - Variable reactiva `hizoChinchon` para cada jugador
   - Función `manejarChinchon()` que asegura exclusividad
   - Input de puntos se deshabilita cuando hay chinchón
   - Validación actualizada: solo valores ≥ 0 en inputs

2. **`src/views/GameView.vue`**
   - Actualizada lógica de colores para vista tabla (desktop)
   - Soporte para mostrar totales negativos en verde

3. **`src/components/PlayerCard.vue`**
   - Actualizada lógica de colores para vista tarjetas (móvil)
   - Soporte para mostrar totales negativos en verde

4. **`tests/e2e/game-flow.spec.js`**
   - Test actualizado: "debe manejar un chinchón (-10 puntos)"
   - Nuevo test: "debe permitir solo un chinchón por ronda"
   - Nuevo test: "debe permitir totales negativos"
   - Función auxiliar `finalizarRonda()` actualizada para usar checkboxes

5. **`tests/unit/store.spec.js`**
   - Nuevo test unitario: "debe permitir totales negativos"
   - Verifica que múltiples chinchones resultan en total negativo

6. **`README.md`**
   - Documentación actualizada con nuevo sistema de checkboxes
   - Sección "Cómo Jugar" mejorada con instrucciones detalladas
   - Checklist de funcionalidades actualizado

7. **`CHANGELOG.md`** (nuevo)
   - Documentación de cambios

### 📊 Tests

**Tests Unitarios:** 28 tests (se añadió 1 nuevo)
- ✅ Nuevo: "debe permitir totales negativos"

**Tests E2E:** 16 tests (se modificaron 3, se añadieron 2 nuevos)
- ✅ Modificado: "debe manejar un chinchón (-10 puntos)"
- ✅ Nuevo: "debe permitir solo un chinchón por ronda"
- ✅ Nuevo: "debe permitir totales negativos"

### 🎯 Mejoras de UX

1. **Interfaz más intuitiva**: Checkbox visual en lugar de valor negativo manual
2. **Prevención de errores**: Solo un chinchón por ronda (automático)
3. **Feedback visual mejorado**: Deshabilitar input cuando hay chinchón
4. **Colores consistentes**: Verde para totales negativos (ventaja)
5. **Accesibilidad**: Labels asociados a checkboxes con ARIA

### 🐛 Bugs Solucionados

- ❌ **Antes**: Era posible ingresar valores como -5, -7, -8, etc.
- ✅ **Ahora**: Solo -10 (chinchón) o valores positivos

- ❌ **Antes**: Múltiples jugadores podían tener -10 en la misma ronda
- ✅ **Ahora**: Sistema exclusivo garantiza solo un chinchón por ronda

- ❌ **Antes**: Totales negativos mostraban colores incorrectos
- ✅ **Ahora**: Totales negativos se muestran en verde (ventaja)

### 📝 Notas de Migración

Si tienes partidas guardadas en localStorage del sistema anterior:
- Las partidas existentes son **100% compatibles**
- El store maneja -10 de la misma forma
- Solo cambia la UI de entrada de datos

### 🚀 Próximos Pasos Sugeridos

Para probar los cambios:

```bash
# Ejecutar la aplicación
npm run dev

# Ejecutar tests unitarios
npm run test

# Ejecutar tests E2E
npm run test:e2e
```

### 💡 Flujo de Usuario Actualizado

1. Clic en "Finalizar Ronda"
2. Para cada jugador:
   - **Opción A**: Ingresar puntos normales (0-999)
   - **Opción B**: Marcar checkbox "Chinchón (-10)"
3. Si se marca chinchón:
   - Input se deshabilita
   - Fondo cambia a verde
   - Aparece icono 🎉
   - Se reproduce sonido
   - Si otro jugador marca chinchón, el anterior se desmarca automáticamente
4. Confirmar ronda
5. Los totales se actualizan (pueden ser negativos)

---

**Versión:** 1.1.0  
**Fecha:** 2025-10-06  
**Tipo:** Feature Enhancement + UX Improvement
