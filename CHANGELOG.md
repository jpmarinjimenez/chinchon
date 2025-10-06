# Changelog

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

5. **`README.md`**
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
