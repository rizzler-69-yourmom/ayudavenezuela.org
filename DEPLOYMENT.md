# 🚀 Guía de Despliegue - AyudaVenezuela.org

## Paso 1: Crear Repositorio en GitHub

1. Ve a [github.com/new](https://github.com/new)
2. Nombre del repositorio: `ayudavenezuela.org`
3. Descripción: "Información verificada y práctica para familias venezolanas"
4. Público
5. NO inicialices con README (ya tenemos uno)
6. Click en "Create repository"

## Paso 2: Subir el Código

Ejecuta estos comandos en tu terminal (desde la carpeta del proyecto):

```bash
# Verificar que estás en la carpeta correcta
cd ayudavenezuela.org

# Añadir el repositorio remoto (reemplaza TU_USUARIO)
git remote add origin https://github.com/TU_USUARIO/ayudavenezuela.org.git

# Cambiar el nombre de la rama a 'main'
git branch -M main

# Subir el código
git push -u origin main
```

## Paso 3: Desplegar (Elige una opción)

### OPCIÓN A: GitHub Pages (Más fácil, GRATIS)

1. En tu repositorio, ve a **Settings** → **Pages**
2. En "Source", selecciona: **Deploy from a branch**
3. En "Branch", selecciona: **main** y **/ (root)**
4. Click en **Save**
5. Espera 1-2 minutos
6. Tu sitio estará en: `https://TU_USUARIO.github.io/ayudavenezuela.org`

**Para usar tu dominio personalizado (ayudavenezuela.org):**

1. En Settings → Pages, añade tu dominio en "Custom domain"
2. En tu proveedor de DNS (donde compraste el dominio):
   - Tipo: `A`
   - Nombre: `@`
   - Valor: `185.199.108.153`
   - Añade también: `185.199.109.153`, `185.199.110.153`, `185.199.111.153`

   - Tipo: `CNAME`
   - Nombre: `www`
   - Valor: `TU_USUARIO.github.io`

3. Espera 5-10 minutos para la propagación DNS
4. Marca "Enforce HTTPS" en GitHub Pages

### OPCIÓN B: Netlify (Más rápido, GRATIS, recomendado)

1. Ve a [netlify.com](https://netlify.com) y regístrate (usa tu cuenta de GitHub)
2. Click en **"Add new site"** → **"Import an existing project"**
3. Conecta con GitHub y selecciona tu repositorio
4. Configuración de build:
   - Build command: (dejar vacío)
   - Publish directory: `.` (punto)
5. Click en **Deploy**
6. Tu sitio estará listo en 30 segundos en `https://NOMBRE-RANDOM.netlify.app`

**Para dominio personalizado:**
1. Site settings → Domain management → Add custom domain
2. Ingresa `ayudavenezuela.org`
3. Sigue las instrucciones para configurar DNS:
   - Tipo: `A`
   - Nombre: `@`
   - Valor: (IP que te da Netlify)

   - Tipo: `CNAME`
   - Nombre: `www`
   - Valor: `TU-SITIO.netlify.app`

4. SSL automático en 1 minuto

### OPCIÓN C: Vercel (GRATIS, muy rápido)

1. Instala Vercel CLI:
```bash
npm install -g vercel
```

2. Desde la carpeta del proyecto:
```bash
vercel
```

3. Sigue las instrucciones en pantalla
4. Tu sitio estará en `https://ayudavenezuela-org.vercel.app`

**Para dominio personalizado:**
```bash
vercel domains add ayudavenezuela.org
```

## Paso 4: Configuración Post-Despliegue

### A. Crear iconos PWA

Necesitas crear iconos para la app móvil. Usa [realfavicongenerator.net](https://realfavicongenerator.net/):

1. Sube un logo cuadrado (512x512px mínimo)
2. Genera todos los tamaños
3. Descarga y coloca en la carpeta `images/`

Tamaños necesarios:
- icon-72.png (72x72)
- icon-96.png (96x96)
- icon-128.png (128x128)
- icon-144.png (144x144)
- icon-152.png (152x152)
- icon-192.png (192x192)
- icon-384.png (384x384)
- icon-512.png (512x512)
- favicon.png (32x32)

### B. Configurar formulario de reportes

Opción 1 - Formspree (más fácil):

1. Regístrate en [formspree.io](https://formspree.io)
2. Crea un formulario
3. Edita `js/app.js` línea 189:

```javascript
await fetch('https://formspree.io/f/TU_ID', {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});
```

Opción 2 - Netlify Forms (si usas Netlify):

1. En `index.html`, añade `data-netlify="true"` al formulario:
```html
<form id="reportForm" class="report-form" data-netlify="true">
```

2. Los envíos aparecerán en: Netlify Dashboard → Forms

### C. Actualizar contactos

Edita `index.html` y cambia:
- Email: busca `info@ayudavenezuela.org` y reemplaza
- WhatsApp: busca `1234567890` y reemplaza con tu número
- Números de emergencia si es necesario

### D. Configurar Google Analytics o Matomo (opcional)

Para privacidad, usa [Matomo](https://matomo.org/) auto-hospedado en lugar de Google Analytics.

Si necesitas analytics básico, añade antes de `</body>`:

```html
<!-- Matomo -->
<script>
  var _paq = window._paq = window._paq || [];
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);
  (function() {
    var u="//TU-MATOMO.COM/";
    _paq.push(['setTrackerUrl', u+'matomo.php']);
    _paq.push(['setSiteId', '1']);
  })();
</script>
```

## Paso 5: Mantenimiento

### Actualizar recursos

1. Edita `data/resources.json`
2. Commit y push:
```bash
git add data/resources.json
git commit -m "Actualizar recursos"
git push
```

El sitio se actualizará automáticamente (Netlify/Vercel) o en 1-2 minutos (GitHub Pages).

### Añadir noticias

Edita `index.html` sección `<section id="noticias">` o crea un archivo JSON separado.

### Moderación de reportes

- **Formspree:** Recibirás emails
- **Netlify Forms:** Ve al dashboard de Netlify
- **Google Forms:** Abre tu spreadsheet

## Paso 6: Promover el Sitio

1. **WhatsApp:** Comparte en grupos venezolanos
2. **Redes sociales:** Twitter, Facebook, Instagram
3. **ONGs:** Contacta Cáritas, Cruz Roja, etc.
4. **Radio local:** Menciona el sitio en emisoras
5. **QR Code:** Crea un código QR del sitio para carteles

Usa [qr-code-generator.com](https://www.qr-code-generator.com/)

## Solución de Problemas

### El sitio no carga
- Verifica que los archivos estén en la raíz del repositorio
- Revisa la consola del navegador (F12)
- Confirma que el despliegue fue exitoso

### El mapa no aparece
- Abre la consola (F12) y busca errores
- Verifica la conexión a internet
- El mapa usa CDN de Leaflet, debe estar accesible

### Los formularios no funcionan
- Sin backend, solo guardan en localStorage
- Implementa Formspree o Netlify Forms (ver arriba)

### Cambios no se reflejan
- Limpia caché: Ctrl+Shift+R (Windows) o Cmd+Shift+R (Mac)
- Espera 5 minutos para propagación CDN

## Costos Estimados

| Servicio | Costo |
|----------|-------|
| Dominio .org | $12/año |
| Hosting (GitHub Pages/Netlify) | GRATIS |
| Formspree (50 envíos/mes) | GRATIS |
| SSL Certificate | GRATIS (incluido) |
| **TOTAL** | **$12/año** |

## Soporte

¿Problemas? Abre un issue en GitHub o escribe a info@ayudavenezuela.org

---

**¡Listo para ayudar a Venezuela! 🇻🇪**
