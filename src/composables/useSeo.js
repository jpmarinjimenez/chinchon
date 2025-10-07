import { watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'

/**
 * Composable para gestionar meta tags SEO dinámicamente por ruta
 * @param {Object} options - Opciones de SEO
 * @param {string} options.title - Título de la página
 * @param {string} options.description - Descripción de la página
 * @param {string} options.canonical - URL canónica
 * @param {string} options.ogImage - Imagen para Open Graph
 */
export function useSeo(options = {}) {
  const route = useRoute()
  
  const updateMeta = () => {
    // Title
    if (options.title) {
      document.title = `${options.title} | Chinchón Score Keeper`
    }
    
    // Description
    const descriptionMeta = document.querySelector('meta[name="description"]')
    if (descriptionMeta && options.description) {
      descriptionMeta.setAttribute('content', options.description)
    }
    
    // Keywords (opcional)
    if (options.keywords) {
      const keywordsMeta = document.querySelector('meta[name="keywords"]')
      if (keywordsMeta) {
        keywordsMeta.setAttribute('content', options.keywords)
      }
    }
    
    // Open Graph Title
    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle && options.title) {
      ogTitle.setAttribute('content', options.title)
    }
    
    // Open Graph Description
    const ogDesc = document.querySelector('meta[property="og:description"]')
    if (ogDesc && options.description) {
      ogDesc.setAttribute('content', options.description)
    }
    
    // Open Graph URL
    const ogUrl = document.querySelector('meta[property="og:url"]')
    if (ogUrl && options.canonical) {
      ogUrl.setAttribute('content', options.canonical)
    }
    
    // Open Graph Image
    if (options.ogImage) {
      const ogImage = document.querySelector('meta[property="og:image"]')
      if (ogImage) {
        ogImage.setAttribute('content', options.ogImage)
      }
    }
    
    // Twitter Card Title
    const twitterTitle = document.querySelector('meta[name="twitter:title"]')
    if (twitterTitle && options.title) {
      twitterTitle.setAttribute('content', options.title)
    }
    
    // Twitter Card Description
    const twitterDesc = document.querySelector('meta[name="twitter:description"]')
    if (twitterDesc && options.description) {
      twitterDesc.setAttribute('content', options.description)
    }
    
    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]')
    if (options.canonical) {
      if (!canonical) {
        canonical = document.createElement('link')
        canonical.setAttribute('rel', 'canonical')
        document.head.appendChild(canonical)
      }
      canonical.setAttribute('href', options.canonical)
    }
  }
  
  onMounted(() => {
    updateMeta()
  })
  
  watch(() => route.path, () => {
    updateMeta()
  })
  
  return {
    updateMeta
  }
}
