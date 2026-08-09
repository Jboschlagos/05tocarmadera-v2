import { sql } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function ArtesanoDetallePage({ params }) {
  const { id } = await params;

  const [artesano] = await sql`
    SELECT id, nombre, oficio, bio, foto_url, instagram_url, ciudad, region
    FROM artesanos
    WHERE id = ${id}
  `;

  if (!artesano) {
    notFound();
  }

  const productos = await sql`
    SELECT id, name, price
    FROM products
    WHERE artesano_id = ${id}
  `;

  const entrevistas = await sql`
    SELECT id, titulo, fecha
    FROM entrevistas
    WHERE artesano_id = ${id}
  `;

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-16">
      <div className="flex flex-col items-center text-center mb-10">
        {artesano.foto_url ? (
          <img
            src={artesano.foto_url}
            alt={artesano.nombre}
            className="w-32 h-32 rounded-full object-cover mb-4"
          />
        ) : (
          <div
            className="w-32 h-32 rounded-full mb-4 flex items-center justify-center text-4xl font-bold text-white"
            style={{ backgroundColor: "var(--madera)" }}
          >
            {artesano.nombre.charAt(0)}
          </div>
        )}
        <h1 className="text-3xl font-bold">{artesano.nombre}</h1>
        <p className="text-lg" style={{ color: "var(--madera)" }}>
          {artesano.oficio}
        </p>
        <p className="text-sm mt-1" style={{ color: "var(--gris-texto)" }}>
          📍 {artesano.ciudad}, {artesano.region}
        </p>
        {artesano.instagram_url && (
          <a
            href={artesano.instagram_url}
            target="_blank"
            className="underline mt-2"
            style={{ color: "var(--madera)" }}
          >
            Ver en Instagram
          </a>
        )}
      </div>

      {artesano.bio && (
        <p
          className="mb-10 text-center max-w-2xl mx-auto"
          style={{ color: "var(--oscuro)" }}
        >
          {artesano.bio}
        </p>
      )}

      {entrevistas.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">Entrevistas</h2>
          <div className="flex flex-col gap-2">
            {entrevistas.map((e) => (
              <Link
                key={e.id}
                href={`/entrevistas/${e.id}`}
                className="underline"
                style={{ color: "var(--madera)" }}
              >
                {e.titulo}
              </Link>
            ))}
          </div>
        </section>
      )}

      {productos.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Productos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {productos.map((p) => (
              <Link
                key={p.id}
                href={`/mercado/${p.id}`}
                className="rounded-xl p-4 shadow-sm"
                style={{ backgroundColor: "var(--gris-claro)" }}
              >
                <p className="font-semibold">{p.name}</p>
                <p className="text-sm" style={{ color: "var(--madera)" }}>
                  ${Number(p.price).toLocaleString("es-CL")}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
