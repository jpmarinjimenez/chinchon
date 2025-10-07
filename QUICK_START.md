# ⚡ Quick Start - Deploy SEO Optimizado

## 🚀 5 Pasos para Deploy

### 1️⃣ Crear Imágenes (30 min)

Crea estos archivos en `/public/`:

```bash
# Mínimo necesario para funcionar:
favicon.svg              # 256x256
og-image.jpg            # 1200x630 (para redes sociales)
icon-192x192.png        # PWA icon
icon-512x512.png        # PWA icon

# Usa: https://favicon.io/ y https://www.canva.com/
```

### 2️⃣ Commit y Push (2 min)

```bash
git add .
git commit -m "feat: SEO optimization complete"
git push origin main
```

### 3️⃣ Deploy Vercel (5 min)

1. Ve a https://vercel.com/
2. **Import Project** → Selecciona tu repo
3. Framework: **Vite** (auto-detectado)
4. **Deploy**
5. Configura dominio: `chinchon.jpmarin.dev`
6. Configura DNS CNAME según instrucciones

### 4️⃣ Google Analytics (5 min)

1. https://analytics.google.com/ → Crear propiedad
2. Copia tu **Measurement ID** (G-XXXXXXXXXX)
3. En `/index.html` líneas 128-136: Descomenta y pega tu ID
4. Commit + push (auto-deploy)

### 5️⃣ Google Search Console (10 min)

1. https://search.google.com/search-console
2. Añadir propiedad: `https://chinchon.jpmarin.dev`
3. Verificar con meta tag
4. Enviar sitemap: `sitemap.xml`
5. Solicitar indexación de: `/`, `/juego`, `/historial`

---

## ✅ Verificación Rápida

Después del deploy, verifica:

1. **Sitio funciona:** https://chinchon.jpmarin.dev/ ✅
2. **Lighthouse:** DevTools → Lighthouse → SEO > 90 ✅
3. **Meta tags:** https://metatags.io/ ✅
4. **Mobile:** https://search.google.com/test/mobile-friendly ✅

---

## 📊 Resultados Esperados

- **Semana 1:** Indexado en Google
- **Mes 1:** Posición 30-40
- **Mes 3:** Posición 10-20 en keywords principales
- **Mes 6:** Top 5-10 en "contador chinchón"

---

## 📚 Documentación Completa

- [SEO_SUMMARY.md](./SEO_SUMMARY.md) - Resumen ejecutivo
- [SEO_OPTIMIZATION_GUIDE.md](./SEO_OPTIMIZATION_GUIDE.md) - Guía detallada
- [DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md) - Checklist completo

---

**¿Dudas?** Revisa la documentación completa arriba.

**¡Listo para lanzar! 🚀**
