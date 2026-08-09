import { sql } from "@/lib/db";
import Link from "next/link";

export const metadata = {
  title: "Artesanos | Tocar Madera",
};

export default async function ArtesanosPage() {
  const artesanos = await sql`
    SELECT id, nombre, oficio, foto_url, ciudad, region
    FROM artesanos
    ORDER BY nombre ASC
  `;

  return (
    <main className="max-w-6xl mx-auto px-8 py-16">
      <h1 className="text-3xl font-bold mb-8">Artesanos</h1>

      {artesanos.length === 0 ? (
        <p style={{ color: "var(--gris-texto)" }}>
          Aún no hay artesanos registrados.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {artesanos.map((artesano) => (
            <Link key={artesano.id} href={`/artesanos/${artesano.id}`}
              className="rounded-xl overflow-hidden shadow-sm flex flex-col items-center text-center p-6 hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "var(--gris-claro)" }}
            >
              {artesano.foto_url ? (
                <img
                  src={artesano.foto_url}
                  alt={artesano.nombre}
                  className="w-24 h-24 rounded-full object-cover mb-4"
                />
              ) : (
                <div
                  className="w-24 h-24 rounded-full mb-4 flex items-center justify-center text-2xl font-bold text-white"
                  style={{ backgroundColor: "var(--madera)" }}
                >
                  {artesano.nombre.charAt(0)}
                </div>
              )}
              <h3 className="font-bold text-lg">{artesano.nombre}</h3>
              <p className="text-sm" style={{ color: "var(--gris-texto)" }}>
                {artesano.oficio}
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--gris-texto)" }}>
                {artesano.ciudad}, {artesano.region}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
