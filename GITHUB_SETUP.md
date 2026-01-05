# 🚀 Configuración de GitHub - Pasos Exactos

## Paso 1: Crear el Repositorio en GitHub

1. Ve a [github.com/new](https://github.com/new)
2. Completa:
   - **Repository name:** `ayudavenezuela.org`
   - **Description:** `🇻🇪 Información verificada y práctica para familias venezolanas - Mobile-first humanitarian aid platform`
   - **Visibility:** ✅ Public
   - **NO marques** "Add a README file"
   - **NO marques** "Add .gitignore"
   - **NO marques** "Choose a license"
3. Click **Create repository**

## Paso 2: Conectar tu Código Local con GitHub

Copia tu nombre de usuario de GitHub, luego ejecuta estos comandos:

```bash
# Ir a la carpeta del proyecto
cd C:\Users\erik\ayudavenezuela.org

# Añadir el repositorio remoto (REEMPLAZA 'TU_USUARIO' con tu usuario real de GitHub)
git remote add origin https://github.com/TU_USUARIO/ayudavenezuela.org.git

# Verificar que se añadió correctamente
git remote -v

# Cambiar el nombre de la rama a 'main' (estándar de GitHub)
git branch -M main

# Subir el código a GitHub
git push -u origin main
```

**Ejemplo con usuario real:**
```bash
# Si tu usuario es "juanperez", el comando sería:
git remote add origin https://github.com/juanperez/ayudavenezuela.org.git
git branch -M main
git push -u origin main
```

Cuando te pida credenciales:
- **Username:** Tu usuario de GitHub
- **Password:** Usa un Personal Access Token (no tu contraseña)

### Cómo crear un Personal Access Token:

1. Ve a [github.com/settings/tokens](https://github.com/settings/tokens)
2. Click **Generate new token** → **Generate new token (classic)**
3. Nombre: `ayudavenezuela-deploy`
4. Selecciona: ✅ **repo** (todas las opciones de repo)
5. Click **Generate token**
6. **COPIA EL TOKEN** (solo se muestra una vez)
7. Úsalo como contraseña cuando hagas `git push`

## Paso 3: Activar GitHub Pages

1. Ve a tu repositorio: `https://github.com/TU_USUARIO/ayudavenezuela.org`
2. Click en **Settings** (pestaña arriba)
3. En el menú izquierdo, scroll hasta **Pages**
4. En "Build and deployment":
   - **Source:** Deploy from a branch
   - **Branch:** main
   - **Folder:** / (root)
5. Click **Save**
6. Espera 1-2 minutos

✅ Tu sitio estará en: `https://TU_USUARIO.github.io/ayudavenezuela.org`

## Paso 4: Configurar el Dominio Personalizado

### A. En GitHub Pages:

1. Todavía en Settings → Pages
2. En "Custom domain", escribe: `ayudavenezuela.org`
3. Click **Save**
4. Marca ✅ **Enforce HTTPS** (puede tardar unos minutos en habilitarse)

### B. En tu Proveedor de Dominio:

Ve al panel de control donde compraste `ayudavenezuela.org` y añade estos registros DNS:

#### Registros A (IPv4):
| Tipo | Nombre/Host | Valor/Destino | TTL |
|------|-------------|---------------|-----|
| A | @ | 185.199.108.153 | 3600 |
| A | @ | 185.199.109.153 | 3600 |
| A | @ | 185.199.110.153 | 3600 |
| A | @ | 185.199.111.153 | 3600 |

#### Registro CNAME (para www):
| Tipo | Nombre/Host | Valor/Destino | TTL |
|------|-------------|---------------|-----|
| CNAME | www | TU_USUARIO.github.io | 3600 |

**Ejemplo:** Si tu usuario es "juanperez", el CNAME sería:
- Nombre: `www`
- Destino: `juanperez.github.io`

### C. Proveedores Comunes:

**GoDaddy:**
1. DNS Management
2. Add Record → Tipo A → @ → 185.199.108.153 (repetir 4 veces)
3. Add Record → Tipo CNAME → www → TU_USUARIO.github.io

**Namecheap:**
1. Advanced DNS
2. Add New Record → A Record → @ → 185.199.108.153 (repetir 4 veces)
3. Add New Record → CNAME → www → TU_USUARIO.github.io

**Cloudflare:**
1. DNS settings
2. Add record → Type A → Name @ → IPv4 185.199.108.153 (repetir 4 veces)
3. Add record → Type CNAME → Name www → Target TU_USUARIO.github.io

⏱️ **Propagación:** Puede tomar de 5 minutos a 48 horas. Usualmente es rápido (10-30 min).

Verifica con: [dnschecker.org](https://dnschecker.org/)

## Paso 5: Verificar el Despliegue

1. **GitHub Pages:** `https://TU_USUARIO.github.io/ayudavenezuela.org`
2. **Dominio personalizado:** `https://ayudavenezuela.org` (después de la propagación DNS)

### Solución de Problemas:

**Error: "remote: Permission denied"**
- Usa un Personal Access Token en lugar de tu contraseña
- Verifica que el token tenga permisos de `repo`

**El sitio no carga:**
- Espera 2-3 minutos después de activar Pages
- Limpia caché: Ctrl+Shift+R
- Verifica en Settings → Pages que diga "Your site is live at..."

**Error 404:**
- Confirma que el archivo `index.html` está en la raíz (no en una subcarpeta)
- Verifica que la rama sea `main` en Settings → Pages

**Dominio no funciona:**
- Espera más tiempo (hasta 24 horas)
- Verifica DNS con dnschecker.org
- Confirma que HTTPS esté habilitado en GitHub Pages

## Paso 6: Futuras Actualizaciones

Cada vez que hagas cambios al sitio:

```bash
# Ver qué cambió
git status

# Añadir todos los cambios
git add -A

# Crear un commit descriptivo
git commit -m "Descripción de los cambios"

# Subir a GitHub
git push
```

El sitio se actualizará automáticamente en 1-2 minutos.

## Comandos Útiles

```bash
# Ver historial de commits
git log --oneline

# Ver estado actual
git status

# Deshacer cambios locales (antes de commit)
git checkout -- nombre-archivo.html

# Ver diferencias
git diff

# Ver remote configurado
git remote -v
```

## Próximos Pasos

✅ Sigue la guía `QUICK_START.md` para:
1. Crear iconos PWA
2. Configurar formulario de reportes
3. Actualizar contactos
4. Añadir recursos reales

---

**¿Problemas?** Abre un issue en tu repositorio o consulta la documentación completa en `DEPLOYMENT.md`
