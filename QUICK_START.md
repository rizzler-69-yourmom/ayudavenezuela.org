# ⚡ Inicio Rápido - 5 Minutos

## 1. Sube a GitHub (2 minutos)

```bash
# Desde la carpeta del proyecto
cd ayudavenezuela.org

# Conecta con GitHub (reemplaza TU_USUARIO con tu usuario de GitHub)
git remote add origin https://github.com/TU_USUARIO/ayudavenezuela.org.git

# Sube el código
git branch -M main
git push -u origin main
```

## 2. Activa GitHub Pages (1 minuto)

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (arriba a la derecha)
3. Click en **Pages** (menú izquierdo)
4. En "Branch" selecciona **main**
5. Click en **Save**

✅ **¡Listo!** Tu sitio estará en `https://TU_USUARIO.github.io/ayudavenezuela.org` en 1-2 minutos.

## 3. Conecta tu Dominio (2 minutos)

### En GitHub:
1. En Settings → Pages → Custom domain
2. Escribe: `ayudavenezuela.org`
3. Click **Save**

### En tu proveedor de DNS (donde compraste el dominio):

Añade estos registros:

| Tipo | Nombre | Valor |
|------|--------|-------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | TU_USUARIO.github.io |

Espera 5-10 minutos y tu sitio estará en `https://ayudavenezuela.org` 🎉

## 4. Tareas Inmediatas

### A. Crear iconos (usa tu logo)
Ve a [realfavicongenerator.net](https://realfavicongenerator.net/) y genera todos los tamaños.

### B. Actualizar contactos en `index.html`:
- Busca `info@ayudavenezuela.org` → tu email real
- Busca `1234567890` → tu WhatsApp real
- Busca `+1 234 567 890` → tu WhatsApp real

### C. Configurar formulario de reportes:

**Opción más fácil - Formspree:**
1. Regístrate en [formspree.io](https://formspree.io) (gratis)
2. Crea un formulario
3. Copia el endpoint
4. Edita `js/app.js` línea 189-206 y reemplaza `console.log` con:

```javascript
async handleSubmit(e) {
    e.preventDefault();

    const formData = {
        type: document.getElementById('resourceType').value,
        state: document.getElementById('state').value,
        location: document.getElementById('location').value,
        description: document.getElementById('description').value,
        contact: document.getElementById('contact').value,
        timestamp: new Date().toISOString()
    };

    try {
        await fetch('https://formspree.io/f/TU_ID_AQUI', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        this.showSuccessMessage();
        this.form.reset();
    } catch (error) {
        alert('Error al enviar. Por favor intenta de nuevo.');
    }
}
```

5. Guarda y sube:
```bash
git add js/app.js
git commit -m "Configurar Formspree"
git push
```

## 5. Añadir Recursos

Edita `data/resources.json` y añade tus recursos reales:

```json
{
  "id": 11,
  "type": "food",
  "title": "Nombre del lugar",
  "state": "Estado",
  "location": "Dirección completa",
  "description": "Descripción detallada, horarios, requisitos",
  "contact": "Teléfono o WhatsApp",
  "verified": true,
  "lastUpdated": "2026-01-04",
  "coordinates": [latitud, longitud]
}
```

**Para obtener coordenadas:**
1. Ve a [Google Maps](https://maps.google.com)
2. Click derecho en el lugar → "¿Qué hay aquí?"
3. Copia las coordenadas (ej: 10.5061, -66.9146)

Sube los cambios:
```bash
git add data/resources.json
git commit -m "Actualizar recursos"
git push
```

## 6. Promover el Sitio

1. **WhatsApp:** Comparte en grupos
2. **Redes sociales:** Postea en Twitter/Facebook
3. **Crea un QR:** [qr-code-generator.com](https://www.qr-code-generator.com/)
4. **Imprime volantes** con el QR y URL

---

## ¿Necesitas Ayuda?

- 📖 Guía completa: lee `DEPLOYMENT.md`
- 📧 Soporte: abre un Issue en GitHub
- 💬 Comunidad: busca "AyudaVenezuela" en Discord/Telegram

## Próximos Pasos

- [ ] Contacta ONGs locales (Cáritas, Cruz Roja) para compartir datos
- [ ] Consigue voluntarios para actualizar noticias diariamente
- [ ] Configura donaciones (PayPal, Zelle, Airtm)
- [ ] Añade más recursos de tu región

**¡Estás listo para ayudar! 🇻🇪**
