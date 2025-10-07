# 🔧 Guía de Pre-rendering para SEO

## ¿Por qué Pre-rendering?

Como Chinchón Score Keeper es una SPA (Single Page Application), el contenido se genera en el cliente mediante JavaScript. Esto dificulta que los crawlers de Google indexen el contenido correctamente.

El **pre-rendering** genera HTML estático de tus rutas principales durante el build, mejorando significativamente el SEO.

---

## 📦 Opción 1: vite-plugin-ssr (Recomendado para SSR/SSG)

### Instalación

```bash
npm install -D vite-plugin-ssr
```

### Configuración en vite.config.js

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import ssr from 'vite-plugin-ssr/plugin'

export default defineConfig({
  plugins: [
    vue(),
    ssr()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router', 'pinia']
        }
      }
    },
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 600
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**', '**/*.e2e.spec.js']
  }
})
```

**NOTA:** vite-plugin-ssr requiere una reestructuración significativa de la app para SSR completo. **No es trivial**.

---

## 📦 Opción 2: vite-plugin-prerender (Más Simple - RECOMENDADO)

Esta es la opción más simple y no requiere cambios en tu código Vue.

### Instalación

```bash
npm install -D vite-plugin-prerender
```

### Configuración en vite.config.js

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import Prerender from 'vite-plugin-prerender'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    Prerender({
      // Rutas que quieres pre-renderizar
      routes: ['/', '/juego', '/historial'],
      
      // Opciones de Puppeteer
      renderer: '@prerenderer/renderer-puppeteer',
      rendererOptions: {
        maxConcurrentRoutes: 1,
        renderAfterTime: 500, // Espera 500ms después de que la página cargue
      },
      
      // Opciones de post-procesamiento
      postProcess(renderedRoute) {
        // Reemplazar URLs del servidor de dev por URLs de producción
        renderedRoute.html = renderedRoute.html
          .replace(/http:\/\/localhost:\d+/g, 'https://chinchon.jpmarin.dev')
        
        return renderedRoute
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router', 'pinia']
        }
      }
    },
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 600
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**', '**/*.e2e.spec.js']
  }
})
```

### Instalar renderer

```bash
npm install -D @prerenderer/renderer-puppeteer
```

---

## 📦 Opción 3: prerender-spa-plugin (Webpack-style para Vite)

**NOTA:** Este plugin está más orientado a Webpack. Para Vite, usa vite-plugin-prerender.

---

## 🚀 Opción Más Simple: Renderizado Manual con Puppeteer

Si no quieres modificar tu configuración de Vite, puedes crear un script que genere HTML estático después del build.

### Script: prerender.js

Crea un archivo `scripts/prerender.js`:

```javascript
import { createServer } from 'vite'
import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distPath = path.resolve(__dirname, '../dist')

const routes = ['/', '/juego', '/historial']

async function prerender() {
  // Iniciar servidor Vite en modo preview
  const server = await createServer({
    server: { port: 5173 },
    preview: { port: 5173 }
  })
  
  await server.listen()
  console.log('Server started on http://localhost:5173')
  
  // Iniciar Puppeteer
  const browser = await puppeteer.launch()
  
  for (const route of routes) {
    const page = await browser.newPage()
    const url = `http://localhost:5173${route}`
    
    console.log(`Rendering ${route}...`)
    await page.goto(url, { waitUntil: 'networkidle0' })
    
    // Esperar a que Vue monte
    await page.waitForTimeout(1000)
    
    // Obtener HTML renderizado
    const html = await page.content()
    
    // Guardar HTML
    const fileName = route === '/' ? 'index.html' : `${route.slice(1)}.html`
    const filePath = path.join(distPath, fileName)
    
    // Crear directorio si no existe
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    
    fs.writeFileSync(filePath, html)
    console.log(`✓ Saved ${fileName}`)
    
    await page.close()
  }
  
  await browser.close()
  await server.close()
  
  console.log('Pre-rendering complete!')
}

prerender().catch(console.error)
```

### Instalar dependencias

```bash
npm install -D puppeteer
```

### Modificar package.json

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:prerender": "vite build && node scripts/prerender.js",
    "preview": "vite preview",
    "test": "vitest",
    "test:e2e": "cypress open",
    "test:e2e:ci": "cypress run"
  }
}
```

### Uso

```bash
npm run build:prerender
```

---

## ⚠️ Consideraciones Importantes

### 1. LocalStorage y Estado
El pre-rendering genera HTML estático. **No incluye**:
- Estado de Pinia
- Datos de localStorage
- Estado dinámico de usuario

**Solución:** El HTML estático sirve para SEO. Una vez que JavaScript carga, Vue "hidrata" la aplicación y carga el estado real.

### 2. Rutas Dinámicas
Si tienes rutas con parámetros (ej: `/juego/:id`), debes:
- Listar todas las variantes en el array de rutas
- O ignorar esas rutas del pre-rendering

### 3. APIs y Datos Externos
Si tu app carga datos de una API:
- El pre-rendering captura el estado inicial vacío
- Considera usar SSR real (Nuxt.js) si necesitas datos en HTML

---

## 🎯 Recomendación para Chinchón Score Keeper

### Para tu caso específico:

**OPCIÓN RECOMENDADA: No usar pre-rendering complejo**

**Razones:**
1. ✅ **Ya tienes contenido SEO en HomeView** (texto real, no generado por JS)
2. ✅ **Meta tags en index.html** (Google puede leerlos sin problema)
3. ✅ **Structured Data estático** (ya está en HTML)
4. ✅ **No tienes contenido dinámico crítico para SEO**
5. ✅ **Google indexa JS desde 2015** (tu app es crawleable)

### Lo que SÍ ayuda más (ya implementado):
- ✅ Meta tags completos
- ✅ Structured Data
- ✅ Sitemap.xml
- ✅ Contenido de texto en HomeView
- ✅ Performance optimizado
- ✅ Composable useSeo para meta tags dinámicos

### Cuándo SÍ usar pre-rendering:
- Si después de 2-3 meses no estás satisfecho con el posicionamiento
- Si ves en Search Console que Google no indexa correctamente
- Si quieres alcanzar top 3 en keywords muy competitivas

---

## 🔄 Alternativa: Nuxt.js (SSR/SSG Real)

Si en el futuro el SEO se vuelve crítico:

### Migración a Nuxt 3:
1. Nuxt 3 = Vue 3 + SSR/SSG automático
2. Misma sintaxis de Vue
3. SEO out-of-the-box
4. Pre-rendering nativo

### Esfuerzo:
- 1-2 días de migración
- Reestructurar a `/pages` en lugar de `/views`
- Adaptar Pinia para SSR
- **Resultado:** SEO perfecto (95-100/100)

---

## 📊 Comparativa de Opciones

| Opción | Complejidad | SEO Score | Recomendado |
|--------|-------------|-----------|-------------|
| **Sin pre-rendering** | Fácil | 85-90 | ✅ **SÍ (actual)** |
| **vite-plugin-prerender** | Media | 90-95 | ⚠️ Si necesitas más |
| **Script Puppeteer** | Media | 90-95 | ⚠️ Si necesitas más |
| **vite-plugin-ssr** | Alta | 95-98 | ❌ Muy complejo |
| **Nuxt.js** | Alta | 98-100 | ✅ Si migras |

---

## ✅ Conclusión

**Para Chinchón Score Keeper:**

### AHORA (Fase 1 - Implementado):
- ✅ Mantén la configuración actual de Vite
- ✅ Meta tags + Structured Data + Sitemap
- ✅ Contenido SEO en HomeView
- ✅ Monitor Google Search Console durante 1-2 meses

### DESPUÉS (Fase 2 - Solo si es necesario):
- Si no alcanzas top 10-15: Añade vite-plugin-prerender
- Si quieres top 3-5: Considera migrar a Nuxt.js

### Resultado esperado sin pre-rendering:
- **SEO Score:** 85-90/100
- **Posición:** Top 10-20 en keywords principales
- **Tiempo:** 2-3 meses para ver resultados

**Esto es más que suficiente para una app de nicho como contador de Chinchón.**

---

## 🚀 Si Decides Implementar Pre-rendering

### Pasos:

1. **Opción simple (vite-plugin-prerender):**
```bash
npm install -D vite-plugin-prerender @prerenderer/renderer-puppeteer
```

2. **Actualizar vite.config.js** (código arriba)

3. **Build:**
```bash
npm run build
```

4. **Verificar:**
- Abre `dist/index.html`
- Busca el contenido de HomeView
- Debe estar en el HTML (no solo cargado por JS)

5. **Deploy en Vercel**
- Deploy normal
- Vercel sirve el HTML pre-renderizado

---

**¿Preguntas? Revisa primero los resultados actuales antes de añadir pre-rendering.**
