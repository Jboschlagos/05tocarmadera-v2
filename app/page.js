import { sql } from "@/lib/db";
import Carousel from "./components/Carousel";

// Mismas imágenes que usamos en /nosotros. Las repito acá porque cada
// página puede querer un carrusel distinto en el futuro (por ejemplo,
// fotos de productos destacados en vez de "nuestra historia").
// Si más adelante quieres que ambas páginas compartan siempre las mismas
// imágenes, se puede sacar este array a un archivo compartido
// (ej: lib/constants.js) para no repetirlo — pero eso lo dejamos para
// cuando definamos bien qué mostrar en cada carrusel.
const imagenesHero = [
  "/img/carrusel/01.jpg",
  "/img/carrusel/02.jpg",
  "/img/carrusel/03.jpg",
  "/img/carrusel/04.jpg",
  "/img/carrusel/05.jpg",
];

export default async function HomePage() {
  const entrevistas = await sql`
    SELECT id, titulo, taller, oficio, imagen_principal, ciudad, region, fecha
    FROM entrevistas
    ORDER BY fecha DESC
    LIMIT 3
  `;

  const products = await sql`
    SELECT
      p.id, p.name, p.price, p.ciudad, p.region,
      (
        SELECT pi.image_url
        FROM product_images pi
        WHERE pi.product_id = p.id
        ORDER BY pi.orden ASC
        LIMIT 1
      ) AS image_url
    FROM products p
    ORDER BY p.id DESC
    LIMIT 4
  `;

  return (
    <main>
      {/* ── Carrusel Hero ─────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-8 py-8">
        <Carousel images={imagenesHero} />
      </section>
      {/* ── Mensaje introductorio ─────────────────────── */}
      <section className="max-w-3xl mx-auto px-8 pb-8 text-center">
        <p className="text-lg" style={{ color: "var(--gris-texto)" }}>
          Piezas de madera hechas por talleres chilenos. Conoce a los artesanos,
          su técnica y su ubicación antes de comprar.
        </p>
        <hr
          className="mt-8"
          style={{ borderColor: "#4a4a4a", borderTopWidth: "1px" }}
        />
      </section>
      {/* ── Historias / Blog ──────────────────────────── */}
      <section className="max-w-6xl mx-auto px-8 py-16 bg-white">
        <h2 className="text-3xl font-bold mb-8">Historias de Talleres</h2>
        {entrevistas.length === 0 ? (
          <p style={{ color: "var(--gris-texto)" }}>
            Aún no hay historias publicadas.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {entrevistas.map((entrevista) => (
              <div
                key={entrevista.id}
                className="rounded-xl overflow-hidden shadow-sm"
                style={{ backgroundColor: "var(--gris-claro)" }}
              >
                {entrevista.imagen_principal && (
                  <img
                    src={entrevista.imagen_principal}
                    alt={entrevista.titulo}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-1">
                    {entrevista.titulo}
                  </h3>
                  <p className="text-sm" style={{ color: "var(--gris-texto)" }}>
                    {entrevista.taller} — {entrevista.oficio}
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: "var(--gris-texto)" }}
                  >
                    {entrevista.ciudad}, {entrevista.region}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Mercado ───────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-8 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-3xl font-bold mb-8"
            style={{ color: "var(--oscuro)" }}
          >
            Mercado
          </h2>
          {products.length === 0 ? (
            <p style={{ color: "var(--gris-texto)" }}>
              Aún no hay productos publicados.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="rounded-xl overflow-hidden shadow-sm"
                  style={{ backgroundColor: "white" }}
                >
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold">{product.name}</h3>
                    <p
                      className="text-sm font-bold"
                      style={{ color: "var(--madera)" }}
                    >
                      ${Number(product.price).toLocaleString("es-CL")}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "var(--gris-texto)" }}
                    >
                      {product.ciudad}, {product.region}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
