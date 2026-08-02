# 🪵 Tocar Madera V2

Mercado colaborativo de artesanos chilenos — migración a Next.js del proyecto original [TocarMaderaV1](https://github.com/Jboschlagos/TocarMaderaV1), manteniendo la misma identidad visual y base de datos, con una arquitectura más escalable.

> Proyecto de aprendizaje personal (desarrollo fullstack JavaScript), construido con apoyo de IA.

## Stack

- **Framework:** Next.js 16 (App Router) + React 19
- **Estilos:** Tailwind CSS v4
- **Base de datos:** PostgreSQL (Neon), vía `@neondatabase/serverless`
- **Autenticación:** Auth.js (NextAuth v5) con Credentials Provider + `bcryptjs`
- **Imágenes:** Cloudinary
- **Iconos:** lucide-react

## Estructura del proyecto

```
app/
├── api/                      # Backend (Route Handlers)
│   ├── products/              # CRUD de productos + galería de imágenes
│   ├── entrevistas/            # CRUD de historias/blog de artesanos
│   ├── cart/                    # Carrito de compras (por usuario)
│   ├── auth/[...nextauth]/       # Auth.js
│   ├── register/                  # Registro de usuarios
│   └── upload/                      # Subida de imágenes a Cloudinary
├── components/                # Navbar, Footer
├── login/ · register/         # Páginas de autenticación
├── layout.js · page.js        # Layout raíz y home
lib/
├── db.js              # Conexión a Neon
├── cloudinary.js       # Configuración de Cloudinary
├── requireAuth.js       # Helper: exige sesión activa
└── requireAdmin.js       # Helper: exige sesión + rol admin
auth.js                # Configuración de Auth.js
```

## Backend — API

Todos los endpoints públicos son de solo lectura (`GET`). Los de escritura (`POST`/`PUT`/`DELETE`) requieren sesión, y en la mayoría de los casos, rol `admin`.

| Recurso             | Rutas                                                                                   | Protección                                |
| ------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------- |
| Productos           | `GET/POST /api/products` · `GET/PUT/DELETE /api/products/[id]`                          | Escritura: admin                          |
| Galería de producto | `GET/POST /api/products/[id]/images` · `PUT/DELETE /api/products/[id]/images/[imageId]` | Escritura: admin                          |
| Historias / Blog    | `GET/POST /api/entrevistas` · `GET/PUT/DELETE /api/entrevistas/[id]`                    | Escritura: admin                          |
| Subida de imágenes  | `POST /api/upload`                                                                      | Admin                                     |
| Registro            | `POST /api/register`                                                                    | Pública                                   |
| Autenticación       | `GET/POST /api/auth/[...nextauth]`                                                      | Gestionado por Auth.js                    |
| Carrito             | `GET/POST /api/cart` · `PUT/DELETE /api/cart/[id]`                                      | Usuario logueado (solo su propio carrito) |

## Esquema de base de datos

Tablas principales (heredadas del proyecto V1, mismo esquema):

- **`users`** — `id, username, email, password_hash, role`
- **`products`** — `id, name, description, price, image_url, ciudad, region, lat, lng`
- **`product_images`** — `id, product_id, image_url, orden`
- **`entrevistas`** — `id, titulo, artesano, oficio, descripcion, tecnica, instagram_url, imagen_principal, fecha, ciudad, region, lat, lng, youtube_id`
- **`cart_items`** — `id, user_id, product_id, quantity`

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
```

Luego:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Roadmap

- [x] CRUD de productos, imágenes y entrevistas
- [x] Autenticación con Auth.js (registro, login, roles)
- [x] Carrito de compras
- [x] Subida de imágenes a Cloudinary
- [ ] Páginas: `/artesanos`, `/obras`, `/blog`, `/nosotros`, `/mercado`
- [ ] Carrusel Hero
- [ ] Mapa interactivo (react-leaflet) con geolocalización de artesanos y productos
- [ ] Checkout / pasarela de pago
- [ ] Panel de administración visual

## Créditos

Proyecto original: [TocarMaderaV1](https://github.com/Jboschlagos/TocarMaderaV1) — Jorge Bosch.
