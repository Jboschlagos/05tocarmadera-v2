import { sql } from "@/lib/db";
import Link from "next/link";

export const metadata = {
  title: "Mercado | Tocar Madera",
};

export default async function MercadoPage() {
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
  `;

  return (
    <main className="max-w-6xl mx-auto px-8 py-16">
      <h1 className="text-3xl font-bold mb-8" style={{ color: "var(--oscuro)" }}>
        Mercado
      </h1>

      {products.length === 0 ? (
        <p style={{ color: "var(--gris-texto)" }}>
          Aún no hay productos publicados.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link key={product.id} href={`/mercado/${product.id}`}
              className="rounded-xl overflow-hidden shadow-sm block hover:opacity-90 transition-opacity"
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
                <p className="text-sm font-bold" style={{ color: "var(--madera)" }}>
                  ${Number(product.price).toLocaleString("es-CL")}
                </p>
                <p className="text-xs" style={{ color: "var(--gris-texto)" }}>
                  {product.ciudad}, {product.region}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
