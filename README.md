# 🇻🇪 AyudaVenezuela.org

**Información verificada y práctica para familias venezolanas**

Un sitio web optimizado para móviles que proporciona información esencial sobre recursos humanitarios en Venezuela: alimentos, salud, agua, refugio y servicios básicos.

## 🎯 Características Principales

- ✅ **100% Optimizado para móviles** - Diseñado para conexiones lentas y datos limitados
- ✅ **Bilingüe** - Español/Inglés con cambio instantáneo
- ✅ **Funciona sin conexión (PWA)** - Cachea contenido para acceso offline
- ✅ **Mapa interactivo** - Encuentra recursos cerca de ti con Leaflet.js
- ✅ **Información verificada** - Sistema de badges para recursos confirmados
- ✅ **Contribución comunitaria** - Los usuarios pueden reportar nuevos recursos
- ✅ **Tema venezolano** - Colores de la bandera (amarillo, azul, rojo)
- ✅ **Súper ligero** - Páginas <1MB para cargas rápidas
- ✅ **Sin rastreadores** - Respeto total a la privacidad

## 📱 Optimización Móvil

Este sitio está específicamente diseñado para **usuarios móviles venezolanos** con:
- Conexiones 3G/4G intermitentes
- Planes de datos limitados
- Batería baja
- Dispositivos Android de gama media/baja

**Optimizaciones implementadas:**
- Imágenes WebP comprimidas
- Lazy loading
- Service Worker para modo offline
- CSS y JS minificados
- Caché agresivo
- Tipografía del sistema (sin fuentes externas)

## 🚀 Despliegue Rápido

### Opción 1: GitHub Pages (GRATIS)

1. Haz fork de este repositorio
2. Ve a Settings → Pages
3. Selecciona la rama `main` como fuente
4. Tu sitio estará en `https://tuusuario.github.io/ayudavenezuela.org`

### Opción 2: Netlify (GRATIS, más rápido)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/tuusuario/ayudavenezuela.org)

1. Conecta tu repositorio de GitHub
2. Deploy automático en cada commit
3. CDN global incluido
4. HTTPS automático

### Opción 3: Vercel (GRATIS)

```bash
npm install -g vercel
vercel
```

### Opción 4: Hosting Tradicional

Sube todos los archivos a tu servidor web vía FTP. Cualquier servidor Apache/Nginx funciona.

## 📁 Estructura del Proyecto

```
ayudavenezuela.org/
├── index.html              # Página principal
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker (modo offline)
├── css/
│   └── styles.css          # Estilos completos
├── js/
│   ├── app.js             # Lógica principal
│   └── map.js             # Mapa interactivo
├── data/
│   └── resources.json     # Base de datos de recursos
├── images/                # Iconos y logos
└── README.md
```

## 🔧 Configuración

### 1. Actualizar datos de recursos

Edita `data/resources.json` para añadir/modificar recursos:

```json
{
  "id": 11,
  "type": "food",
  "title": "Nombre del recurso",
  "state": "Estado",
  "location": "Dirección específica",
  "description": "Descripción detallada",
  "contact": "Teléfono o WhatsApp",
  "verified": true,
  "lastUpdated": "2026-01-04",
  "coordinates": [latitud, longitud]
}
```

**Tipos válidos:** `food`, `health`, `water`, `shelter`

### 2. Configurar dominio personalizado

Si tienes `ayudavenezuela.org`:

**GitHub Pages:**
- Crea archivo `CNAME` con tu dominio
- Configura DNS: `A record` → `185.199.108.153`

**Netlify:**
- Settings → Domain Management → Add custom domain
- Sigue las instrucciones de DNS

### 3. Modificar contactos

En `index.html`, busca y actualiza:
- Números de emergencia (línea 248+)
- Email de contacto (línea 367)
- WhatsApp de ayuda (líneas 261, 371)

## 🛠️ Backend para Formularios (Opcional)

El sitio funciona 100% sin backend, pero para recibir reportes de usuarios, puedes usar:

### Opción A: Formspree (Más fácil)

1. Regístrate en [Formspree.io](https://formspree.io) (gratis para 50 envíos/mes)
2. Crea un formulario y obtén el endpoint
3. En `js/app.js` línea 189, reemplaza el `console.log` con:

```javascript
async handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(this.form);

    await fetch('https://formspree.io/f/TU_ID_AQUI', {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    });

    this.showSuccessMessage();
    this.form.reset();
}
```

### Opción B: Google Forms

1. Crea un Google Form
2. Obtén el link y úsalo como `action` en el formulario

### Opción C: Backend Propio (Cloudflare Workers)

Ver `backend-examples/cloudflare-worker.js` para un ejemplo serverless gratuito.

## 🎨 Personalización de Colores

El tema usa variables CSS en `css/styles.css`:

```css
:root {
    --vz-yellow: #FECB00;  /* Amarillo venezolano */
    --vz-blue: #00247D;    /* Azul venezolano */
    --vz-red: #CF142B;     /* Rojo venezolano */
}
```

Cambia estos valores para ajustar el esquema de colores.

## 📊 Actualizaciones de Contenido

### Noticias Diarias

Edita la sección de noticias en `index.html` (línea 190+) o crea un archivo JSON separado:

```json
{
  "updates": [
    {
      "date": "2026-01-04",
      "category": "utilities",
      "title": "Estado de servicios públicos",
      "excerpt": "Información actualizada...",
      "content": "Contenido completo..."
    }
  ]
}
```

### Moderación de Reportes

Los reportes de usuarios se guardan en `localStorage`. Para producción:
1. Configura un backend (ver sección anterior)
2. Crea un panel de administración simple
3. O recibe reportes por email y actualiza manualmente

## 🔒 Seguridad y Privacidad

- ✅ Sin cookies
- ✅ Sin rastreadores de terceros
- ✅ Sin Google Analytics (usa Matomo auto-hospedado si necesitas)
- ✅ Todos los datos procesados localmente
- ✅ HTTPS obligatorio en producción

## 💰 Costos de Operación

### Opción Gratuita (100%)
- **Hosting:** GitHub Pages o Netlify (gratis)
- **Dominio:** .org ~$12/año (ya lo tienes)
- **Formularios:** Formspree gratis (50/mes)
- **Total:** $12/año

### Opción Premium
- **Hosting:** Netlify Pro $19/mes
- **Backend:** Cloudflare Workers gratis (100k req/día)
- **Base de datos:** Supabase gratis (500MB)
- **Total:** ~$240/año

## 📈 Escalabilidad

Este sitio puede manejar:
- ✅ 100,000+ visitantes/mes (GitHub Pages/Netlify gratis)
- ✅ Miles de recursos en el mapa
- ✅ Envíos de formularios ilimitados (con backend propio)

Si creces más, migra a:
- Cloudflare Pages (gratis, ilimitado)
- Vercel Pro ($20/mes, 1M visitantes)

## 🤝 Contribuir

¡Las contribuciones son bienvenidas!

1. Fork el proyecto
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'Añadir nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

## 📞 Soporte

- **Email:** info@ayudavenezuela.org
- **Issues:** [GitHub Issues](https://github.com/tuusuario/ayudavenezuela.org/issues)

## 📄 Licencia

MIT License - Libre para usar, modificar y distribuir.

## 🙏 Créditos

- Construido con ❤️ para Venezuela
- Mapa: [Leaflet.js](https://leafletjs.com/)
- Tiles: [OpenStreetMap](https://www.openstreetmap.org/)
- Iconos: Unicode Emoji

---

**¿Preguntas?** Abre un [Issue](https://github.com/tuusuario/ayudavenezuela.org/issues) o envía un email.

**¡Ayúdanos a ayudar! Comparte este sitio con familias venezolanas.**
