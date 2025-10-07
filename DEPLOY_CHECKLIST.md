# ✅ Checklist de Deploy - Chinchón Score Keeper

## 🎉 Auditoría SEO Completada

Todos los cambios de optimización SEO han sido implementados. Este checklist te guiará para el deploy en Vercel.

---

## 📝 Archivos Creados/Modificados

### ✅ Archivos SEO Principales
- [x] `/index.html` - Meta tags completos, Structured Data, Open Graph
- [x] `/public/manifest.json` - PWA configuration
- [x] `/public/robots.txt` - Control de crawlers
- [x] `/public/sitemap.xml` - Mapa del sitio (3 URLs)
- [x] `/vercel.json` - Configuración de Vercel con headers de seguridad
- [x] `/vite.config.js` - Build optimizations (terser, chunking)
- [x] `/src/composables/useSeo.js` - Composable para meta tags dinámicos
- [x] `/src/views/HomeView.vue` - Contenido SEO rico + useSeo
- [x] `/src/views/GameView.vue` - useSeo integrado
- [x] `/src/views/HistoryView.vue` - useSeo integrado

### ✅ Documentación
- [x] `/SEO_OPTIMIZATION_GUIDE.md` - Guía completa de SEO
- [x] `/PRERENDERING_SETUP.md` - Guía de pre-rendering (opcional)
- [x] `/DEPLOY_CHECKLIST.md` - Este archivo

---

## 🚨 TAREAS PENDIENTES ANTES DE DEPLOY

### 1. Crear Imágenes (URGENTE)

Debes crear estos archivos en `/public`:

#### Favicons:
```
/public/favicon.svg          (256x256 o vectorial)
/public/favicon-32x32.png    (32x32)
/public/favicon-16x16.png    (16x16)
/public/apple-touch-icon.png (180x180)
```

#### PWA Icons:
```
/public/icon-192x192.png     (192x192)
/public/icon-512x512.png     (512x512)
```

#### Social Media & SEO:
```
/public/og-image.jpg         (1200x630, < 300KB)
/public/screenshot.jpg       (1280x720)
/public/screenshot-mobile.jpg    (540x720)
/public/screenshot-desktop.jpg   (1280x720)
```

**Herramientas:**
- Favicons: https://favicon.io/
- OG Image: https://www.canva.com/ (plantilla 1200x630)
- Comprimir: https://tinypng.com/

**Contenido de og-image.jpg:**
- Título: "Chinchón Score Keeper"
- Subtítulo: "Contador de Puntos Online Gratis"
- Captura de pantalla de la app
- Colores: Azul (#4F46E5) + Gradiente

---

## 🚀 Deploy en Vercel

### Paso 1: Commit de Cambios

```bash
git add .
git commit -m "feat: complete SEO optimization for chinchon.jpmarin.dev"
git push origin main
```

### Paso 2: Conectar a Vercel

1. Ve a https://vercel.com/
2. **Sign up/Login** (recomendado: usar GitHub)
3. Click en **"Add New Project"**
4. **Import Git Repository:**
   - Selecciona tu repositorio de GitHub
   - Si no aparece, dale permisos a Vercel en GitHub Settings
5. **Configure Project:**
   - Framework Preset: **Vite** (auto-detectado)
   - Root Directory: `./` (raíz)
   - Build Command: `npm run build` (default)
   - Output Directory: `dist` (default)
6. Click **"Deploy"**

### Paso 3: Configurar Dominio

Una vez deployado:

1. Ve a **Project Settings** → **Domains**
2. Click **"Add Domain"**
3. Introduce: `chinchon.jpmarin.dev`
4. Vercel te dará instrucciones DNS:
   - **Tipo:** CNAME
   - **Name:** chinchon
   - **Value:** cname.vercel-dns.com
5. Configura en tu proveedor DNS (jpmarin.dev)
6. Espera propagación DNS (5-30 minutos)
7. SSL automático se activará

### Paso 4: Variables de Entorno (Opcional)

Si necesitas variables de entorno:
- Settings → Environment Variables
- Añade las necesarias
- Redeploy si es necesario

---

## 📊 Configurar Google Analytics

### Paso 1: Crear Propiedad

1. Ve a https://analytics.google.com/
2. **Admin** → **Create Property**
3. Nombre: "Chinchón Score Keeper"
4. Zona horaria: Europe/Madrid
5. Moneda: EUR (Euro)
6. Click **Next**
7. Categoría: Games
8. Click **Create**

### Paso 2: Crear Data Stream

1. Plataforma: **Web**
2. URL: `https://chinchon.jpmarin.dev`
3. Nombre: "Chinchón Web App"
4. Click **Create Stream**
5. **Copiar Measurement ID** (formato: `G-XXXXXXXXXX`)

### Paso 3: Actualizar index.html

En `/index.html`, líneas 128-136:

1. **Descomentar** el código de Google Analytics
2. **Reemplazar** `G-XXXXXXXXXX` con tu Measurement ID real (2 lugares)

```html
<!-- Antes (comentado): -->
<!-- 
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
...
-->

<!-- Después (descomentado y con tu ID): -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-ABC123DEF4"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-ABC123DEF4');
</script>
```

3. **Commit y push:**
```bash
git add index.html
git commit -m "feat: add Google Analytics tracking"
git push
```

4. Vercel auto-deployará

---

## 🔍 Configurar Google Search Console

### Paso 1: Añadir Propiedad

1. Ve a https://search.google.com/search-console
2. Click **"Añadir propiedad"**
3. Selecciona **"Prefijo de URL"**
4. Introduce: `https://chinchon.jpmarin.dev`
5. Click **"Continuar"**

### Paso 2: Verificar Propiedad

**Método 1 - Meta Tag HTML (Más Fácil):**

1. Search Console te da un meta tag como:
   ```html
   <meta name="google-site-verification" content="ABC123...XYZ" />
   ```
2. Copia ese tag
3. Pégalo en `/index.html` dentro de `<head>`, después de las otras meta tags
4. Commit y push
5. Espera 1-2 minutos (deploy de Vercel)
6. Click **"Verificar"** en Search Console

**Método 2 - Google Analytics:**
- Si ya configuraste Analytics, selecciona esta opción
- Verificación automática

### Paso 3: Enviar Sitemap

1. En Search Console, ve a **"Sitemaps"** (menú izquierdo)
2. Introduce: `sitemap.xml`
3. Click **"Enviar"**
4. Verifica que aparezca como "Correcto"

### Paso 4: Solicitar Indexación

1. Ve a **"Inspección de URLs"**
2. Introduce cada URL:
   - `https://chinchon.jpmarin.dev/`
   - `https://chinchon.jpmarin.dev/juego`
   - `https://chinchon.jpmarin.dev/historial`
3. Click **"Solicitar indexación"**
4. Repite para cada URL

---

## 🧪 Verificación Post-Deploy

### 1. Verificar que el sitio funciona

```bash
# Abre en navegador:
https://chinchon.jpmarin.dev/
https://chinchon.jpmarin.dev/juego
https://chinchon.jpmarin.dev/historial
```

Verifica:
- ✅ Todas las rutas funcionan
- ✅ No hay errores 404
- ✅ Las imágenes cargan correctamente
- ✅ El manifest.json es accesible: https://chinchon.jpmarin.dev/manifest.json

### 2. Test de Meta Tags

**Herramienta:** https://metatags.io/

1. Introduce: `https://chinchon.jpmarin.dev/`
2. Verifica que aparezcan:
   - ✅ Title correcto
   - ✅ Description
   - ✅ OG Image (debe mostrar preview)
   - ✅ Twitter Card

### 3. Test de Open Graph

**Herramienta:** https://www.opengraph.xyz/

1. Introduce URL
2. Verifica preview de Facebook/LinkedIn
3. La imagen og-image.jpg debe aparecer

### 4. Test de Twitter Card

**Herramienta:** https://cards-dev.twitter.com/validator

1. Introduce URL
2. Verifica preview de Twitter
3. Card type debe ser "summary_large_image"

### 5. Validar Structured Data

**Herramienta:** https://validator.schema.org/

1. Introduce URL o pega el JSON-LD del index.html
2. Verifica:
   - ✅ 0 Errors
   - ✅ 0 Warnings
   - ✅ Type: WebApplication detectado

### 6. Google Lighthouse Audit

```
1. Abre Chrome
2. Abre DevTools (F12)
3. Tab "Lighthouse"
4. Selecciona: Performance, Accessibility, Best Practices, SEO, PWA
5. Mode: Desktop y Mobile
6. Click "Analyze page load"
```

**Objetivos:**
- Performance: > 85
- Accessibility: > 90
- Best Practices: > 90
- **SEO: > 90** ⭐
- PWA: Installable

### 7. PageSpeed Insights

**Herramienta:** https://pagespeed.web.dev/

1. Introduce: `https://chinchon.jpmarin.dev/`
2. Analiza Mobile y Desktop
3. Verifica Core Web Vitals:
   - ✅ LCP < 2.5s (verde)
   - ✅ FID < 100ms (verde)
   - ✅ CLS < 0.1 (verde)

### 8. Mobile-Friendly Test

**Herramienta:** https://search.google.com/test/mobile-friendly

1. Introduce URL
2. Verifica: "Page is mobile-friendly" ✅

### 9. Security Headers

**Herramienta:** https://securityheaders.com/

1. Introduce URL
2. **Objetivo:** Rating A o A+
3. Verifica headers de vercel.json aplicados

### 10. Verificar Indexación (después de 1-2 semanas)

En Google:
```
site:chinchon.jpmarin.dev
```

Debe mostrar:
- Página principal
- /juego
- /historial

---

## 📅 Timeline de Resultados Esperados

### Semana 1
- ✅ Deploy completado
- ✅ Google Analytics recibiendo datos
- ✅ Search Console configurado
- ⏳ Indexación en progreso

### Semana 2-3
- ✅ Primeras páginas indexadas
- ✅ Aparición en resultados de búsqueda (posiciones 30-50)
- ⏳ Crawlers visitando el sitio regularmente

### Mes 2
- ✅ Indexación completa
- ✅ Posiciones 20-30 en keywords principales
- ⏳ Tráfico orgánico inicial (10-50 visitas/mes)

### Mes 3-4
- ✅ Posiciones 10-20 en keywords principales
- ✅ Tráfico orgánico creciente (50-200 visitas/mes)
- ⏳ Empezar a ver conversiones (inicios de partida)

### Mes 6+
- 🎯 Top 5-10 en "contador chinchón"
- 🎯 Top 10-15 en keywords secundarias
- 🎯 Tráfico estable 200-500+ visitas/mes

---

## 🎯 Objetivos SEO - KPIs

### Google Search Console (Revisar Mensual)

**Mes 1:**
- Impresiones: 100+
- Clicks: 5-10
- CTR: 2-5%
- Posición media: < 40

**Mes 3:**
- Impresiones: 500+
- Clicks: 25-50
- CTR: 3-8%
- Posición media: < 25

**Mes 6:**
- Impresiones: 1000+
- Clicks: 100+
- CTR: 5-10%
- Posición media: < 15

### Google Analytics (Revisar Mensual)

**Métricas clave:**
- Usuarios: Crecimiento mes a mes
- Bounce Rate: < 60%
- Session Duration: > 2 minutos
- Páginas/Sesión: > 2
- Conversión (iniciar partida): > 40%

---

## 🔧 Mantenimiento Post-Deploy

### Semanal (Primeras 4 semanas)
- [ ] Verificar Google Search Console (errores de crawl)
- [ ] Revisar Google Analytics (tráfico, errores)
- [ ] Verificar que todas las páginas sean accesibles

### Mensual
- [ ] Revisar posicionamiento de keywords
- [ ] Analizar búsquedas en Search Console
- [ ] Optimizar contenido según búsquedas reales
- [ ] Verificar Core Web Vitals
- [ ] Revisar backlinks (si los hay)

### Trimestral
- [ ] Lighthouse audit completo
- [ ] Actualizar sitemap si cambió contenido
- [ ] Revisar competencia
- [ ] Ajustar estrategia SEO

---

## 🆘 Troubleshooting

### Problema: Google no indexa mi sitio después de 2 semanas

**Soluciones:**
1. Verifica robots.txt no bloquee Google
2. Verifica sitemap.xml es accesible
3. En Search Console, solicita indexación manual
4. Verifica que no haya errores de crawl en Search Console
5. Espera 1-2 semanas más (indexación puede tardar)

### Problema: OG Image no aparece en Facebook

**Soluciones:**
1. Verifica og-image.jpg existe y es < 8MB
2. Usa Facebook Debugger: https://developers.facebook.com/tools/debug/
3. Click "Scrape Again" para limpiar caché
4. Espera 24-48h

### Problema: Lighthouse SEO score bajo

**Checklist:**
- [ ] Meta description presente
- [ ] Title presente y único
- [ ] Images tienen alt
- [ ] Links tienen texto descriptivo
- [ ] Canonical presente
- [ ] robots.txt accesible
- [ ] sitemap.xml accesible

### Problema: Core Web Vitals en rojo

**Soluciones:**
1. Comprimir imágenes más (usa TinyPNG)
2. Lazy load imágenes no críticas
3. Reducir bundle size
4. Usar Vercel Analytics para identificar bottlenecks

---

## ✅ Checklist Final Pre-Deploy

- [ ] Todas las imágenes creadas y en `/public`
- [ ] Google Analytics configurado en index.html
- [ ] Dominio `chinchon.jpmarin.dev` apuntando a Vercel
- [ ] Código commiteado y pusheado a GitHub
- [ ] Deploy en Vercel completado
- [ ] Sitio accesible en https://chinchon.jpmarin.dev/
- [ ] Google Search Console verificado
- [ ] Sitemap enviado a Search Console
- [ ] URLs principales indexadas solicitadas
- [ ] Tests de verificación pasados (Lighthouse, PageSpeed, etc.)

---

## 🎉 ¡Listo para Lanzar!

Una vez completado este checklist:

1. ✅ Tu app está optimizada para SEO
2. ✅ Google puede indexarla correctamente
3. ✅ Tienes analytics configurado
4. ✅ Search Console monitoreando

**Próximos pasos:**
- Promocionar en redes sociales
- Conseguir backlinks (link building)
- Monitorear y ajustar según datos reales

**¡Buena suerte con el lanzamiento! 🚀**

---

**Recursos:**
- [SEO_OPTIMIZATION_GUIDE.md](./SEO_OPTIMIZATION_GUIDE.md) - Guía completa de SEO
- [PRERENDERING_SETUP.md](./PRERENDERING_SETUP.md) - Pre-rendering (opcional)
- [README.md](./README.md) - Documentación de la app

---

**Dominio:** https://chinchon.jpmarin.dev/  
**Fecha:** 7 de octubre de 2025  
**Versión:** 1.0.0
