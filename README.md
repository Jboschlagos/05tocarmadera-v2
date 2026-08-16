# 🪵 Tocar Madera V2

Mercado colaborativo de artesanos chilenos — migración a Next.js del proyecto original [TocarMaderaV1](https://github.com/Jboschlagos/TocarMaderaV1), manteniendo la misma identidad visual y base de datos, con una arquitectura más escalable.

> Proyecto de aprendizaje personal (desarrollo fullstack JavaScript), construido con apoyo de IA.

## Stack

- **Framework:** Next.js 16 (App Router) + React 19
- **Estilos:** Tailwind CSS v4
- **Base de datos:** PostgreSQL (Neon), vía `@neondatabase/serverless`
- **Autenticación:** Auth.js (NextAuth v5) con Credentials Provider + `bcryptjs`
- **Recuperación de contraseña:** [Resend](https://resend.com) para el envío de correos
- **Imágenes:** Cloudinary
- **Mapas:** Leaflet + react-leaflet
- **Iconos:** lucide-react

## Estructura del proyecto

```
app/
├── api/                        # Backend (Route Handlers)
│   ├── products/                 # CRUD de productos (incluye taller_id) + galería de imágenes
│   ├── entrevistas/                # CRUD de historias/blog de artesanos
│   ├── talleres/                     # CRUD de talleres/artesanos
│   ├── cart/                           # Carrito de compras (por usuario)
│   ├── auth/[...nextauth]/               # Auth.js
│   ├── register/                           # Registro de usuarios
│   ├── forgot-password/                      # Solicita el link de recuperación por correo
│   ├── reset-password/                         # Valida el token y guarda la contraseña nueva
│   └── upload/                                   # Subida de imágenes a Cloudinary
├── components/                 # Navbar, Footer, tarjetas con mapa, carrusel, etc.
├── login/ · register/          # Páginas de autenticación
├── forgot-password/              # Formulario para pedir el link de recuperación
├── reset-password/                 # Formulario para la contraseña nueva
├── mercado/ · entrevistas/ · talleres/ # Listados + detalle de cada recurso
├── mapa/                          # Mapa general de talleres
├── nosotros/                        # Página "Nuestra historia" con carrusel
├── layout.js · page.js           # Layout raíz y home
lib/
├── db.js              # Conexión a Neon
├── cloudinary.js       # Configuración de Cloudinary
├── resend.js            # Configuración de Resend (envío de correos)
├── requireAuth.js         # Helper: exige sesión activa
└── requireAdmin.js          # Helper: exige sesión + rol admin
auth.js                # Configuración de Auth.js
```

## Backend — API

Todos los endpoints públicos son de solo lectura (`GET`). Los de escritura (`POST`/`PUT`/`DELETE`) requieren sesión, y en la mayoría de los casos, rol `admin`.

| Recurso                | Rutas                                                                                   | Protección                                    |
| ---------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------- |
| Productos              | `GET/POST /api/products` · `GET/PUT/DELETE /api/products/[id]`                          | Escritura: admin (incluye `taller_id`)        |
| Galería de producto    | `GET/POST /api/products/[id]/images` · `PUT/DELETE /api/products/[id]/images/[imageId]` | Escritura: admin                              |
| Historias / Blog       | `GET/POST /api/entrevistas` · `GET/PUT/DELETE /api/entrevistas/[id]`                    | Escritura: admin                              |
| Talleres               | `GET/POST /api/talleres` · `GET/PUT/DELETE /api/talleres/[id]`                          | Escritura: admin                              |
| Subida de imágenes     | `POST /api/upload`                                                                      | Admin                                         |
| Registro               | `POST /api/register`                                                                    | Pública                                       |
| Autenticación          | `GET/POST /api/auth/[...nextauth]`                                                      | Gestionado por Auth.js                        |
| Recuperar contraseña   | `POST /api/forgot-password`                                                             | Pública (responde igual exista o no el email) |
| Restablecer contraseña | `POST /api/reset-password`                                                              | Pública (requiere token válido y vigente)     |
| Carrito                | `GET/POST /api/cart` · `PUT/DELETE /api/cart/[id]`                                      | Usuario logueado (solo su propio carrito)     |

## Esquema de base de datos

Tablas principales (heredadas del proyecto V1, con extensiones agregadas en esta migración):

- **`users`** — `id, username, email, password_hash, role, reset_token, reset_token_expires`
- **`products`** — `id, name, description, price, image_url, ciudad, region, lat, lng, taller_id`
- **`product_images`** — `id, product_id, image_url, orden`
- **`talleres`** — `id, nombre, oficio, bio, foto_url, instagram_url, ciudad, region, lat, lng, direccion, telefono, whatsapp_url, sitio_web, tecnica, tipo_trabajo`
- **`entrevistas`** — `id, titulo, taller, oficio, descripcion, tecnica, instagram_url, imagen_principal, fecha, ciudad, region, lat, lng, youtube_id`
- **`cart_items`** — `id, user_id, product_id, quantity`

> `reset_token` y `reset_token_expires` se usan solo durante el flujo de "olvidé mi contraseña": se generan al solicitar el link y se limpian (`NULL`) apenas se usan, o quedan vencidos tras 30 minutos.

## Cómo correr el proyecto localmente

```bash
git clone https://github.com/Jboschlagos/05tocarmadera-v2.git
cd 05tocarmadera-v2
npm install
```

Crea un archivo `.env.local` en la raíz con:

```
DATABASE_URL=postgresql://usuario:contraseña@host/neondb?sslmode=require
AUTH_SECRET=genera_uno_con_npx_auth_secret
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
RESEND_API_KEY=tu_resend_api_key
```

> Recuerda: `.env.local` solo funciona en tu máquina. Para producción (Vercel), estas mismas variables se agregan por separado en **Settings → Environment Variables** del proyecto.

Luego:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Roadmap

- [x] CRUD de productos, imágenes y entrevistas
- [x] Autenticación con Auth.js (registro, login, roles)
- [x] Recuperación de contraseña por correo (Resend)
- [x] Carrito de compras
- [x] Subida de imágenes a Cloudinary
- [x] Carrusel Hero
- [x] Mapa interactivo (react-leaflet) con geolocalización de talleres y productos
- [x] Páginas: `/mercado`, `/entrevistas`, `/talleres`, `/nosotros`
- [x] Filtros en `/mercado` (por región y por taller)
- [x] Vinculación de productos a talleres (`taller_id`)
- [ ] Páginas: `/artesanos`, `/obras`, `/blog`
- [ ] Checkout / pasarela de pago
- [ ] Panel de administración visual
- [ ] Verificar dominio propio en Resend (para enviar correos a cualquier usuario, no solo el email de la cuenta Resend)

## Créditos

Proyecto original: [TocarMaderaV1](https://github.com/Jboschlagos/TocarMaderaV1) — Jorge Bosch.
