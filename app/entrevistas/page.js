import { sql } from "@/lib/db";
import Link from "next/link";

export const metadata = {
  title: "Entrevistas | Tocar Madera",
};

export default async function EntrevistasPage() {
  const entrevistas = await sql`
    SELECT id, titulo, artesano, oficio, imagen_principal, ciudad, region, fecha
    FROM entrevistas
    ORDER BY fecha DESC
  `;

  return (
    <main className="max-w-6xl mx-auto px-8 py-16">
      <h1 className="text-3xl font-bold mb-8">Entrevistas</h1>

      {entrevistas.length === 0 ? (
        <p style={{ color: "var(--gris-texto)" }}>
          Aún no hay entrevistas publicadas.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {entrevistas.map((entrevista) => (
            <Link key={entrevista.id} href={`/entrevistas/${entrevista.id}`}
              className="rounded-xl overflow-hidden shadow-sm block hover:opacity-90 transition-opacity"
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
                <h3 className="font-bold text-lg mb-1">{entrevista.titulo}</h3>
                <p className="text-sm" style={{ color: "var(--gris-texto)" }}>
                  {entrevista.artesano} — {entrevista.oficio}
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--gris-texto)" }}>
                  {entrevista.ciudad}, {entrevista.region}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
