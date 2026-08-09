import { sql } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function ProductoDetallePage({ params }) {
  const { id } = await params;

  const [product] = await sql`
    SELECT p.id, p.name, p.description, p.price, p.ciudad, p.region,
      a.id AS artesano_id, a.nombre AS artesano_nombre
    FROM products p
    LEFT JOIN artesanos a ON a.id = p.artesano_id
    WHERE p.id = ${id}
  `;

  if (!product) {
    notFound();
  }

  const images = await sql`
    SELECT id, image_url
    FROM product_images
    WHERE product_id = ${id}
    ORDER BY orden ASC
  `;

  return (
    <main className="max-w-5xl mx-auto px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Galería */}
        <div>
          {images.length === 0 ? (
            <div
              className="w-full h-80 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "var(--gris-claro)" }}
            >
              <p style={{ color: "var(--gris-texto)" }}>Sin imágenes</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <img
                src={images[0].image_url}
                alt={product.name}
                className="w-full h-80 object-cover rounded-xl"
              />
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.slice(1).map((img) => (
                    <img
                      key={img.id}
                      src={img.image_url}
                      alt={product.name}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Información */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-2xl font-bold mb-4" style={{ color: "var(--madera)" }}>
            ${Number(product.price).toLocaleString("es-CL")}
          </p>

          {product.artesano_nombre && (
            <p className="text-sm mb-4" style={{ color: "var(--gris-texto)" }}>
              Hecho por{" "}
              <Link href={`/artesanos/${product.artesano_id}`} className="underline font-semibold">
                {product.artesano_nombre}
              </Link>
            </p>
          )}

          <p className="mb-6" style={{ color: "var(--oscuro)" }}>
            {product.description || "Sin descripción disponible."}
          </p>

          <p className="text-sm mb-6" style={{ color: "var(--gris-texto)" }}>
            📍 {product.ciudad}, {product.region}
          </p>

          <button
            className="rounded-lg px-6 py-3 text-white font-semibold"
            style={{ backgroundColor: "var(--madera)" }}
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </main>
  );
}
