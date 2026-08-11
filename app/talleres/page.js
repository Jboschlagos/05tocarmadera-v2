import { sql } from "@/lib/db";
import Link from "next/link";
import TallerMap from "@/app/components/TallerMap";

export const metadata = {
  title: "Talleres | Tocar Madera",
};

export default async function TalleresPage() {
  const talleres = await sql`
    SELECT id, nombre, oficio, foto_url, ciudad, region, lat, lng
    FROM talleres
    ORDER BY nombre ASC
  `;

  const conUbicacion = talleres.filter((t) => t.lat && t.lng);

  return (
    <main className="max-w-6xl mx-auto px-8 py-16">
      <h1 className="text-3xl font-bold mb-8">Talleres</h1>

      {conUbicacion.length > 0 && (
        <div className="mb-12">
          <TallerMap talleres={conUbicacion} zoom={5} height="400px" />
        </div>
      )}

      {talleres.length === 0 ? (
        <p style={{ color: "var(--gris-texto)" }}>
          Aún no hay talleres registrados.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {talleres.map((taller) => (
            <Link
              key={taller.id}
              href={`/talleres/${taller.id}`}
              className="rounded-xl overflow-hidden shadow-sm flex flex-col items-center text-center p-6 hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "var(--gris-claro)" }}
            >
              {taller.foto_url ? (
                <img
                  src={taller.foto_url}
                  alt={taller.nombre}
                  className="w-24 h-24 rounded-full object-cover mb-4"
                />
              ) : (
                <div
                  className="w-24 h-24 rounded-full mb-4 flex items-center justify-center text-2xl font-bold text-white"
                  style={{ backgroundColor: "var(--madera)" }}
                >
                  {taller.nombre.charAt(0)}
                </div>
              )}
              <h3 className="font-bold text-lg">{taller.nombre}</h3>
              <p className="text-sm" style={{ color: "var(--gris-texto)" }}>
                {taller.oficio}
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: "var(--gris-texto)" }}
              >
                {taller.ciudad}, {taller.region}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
