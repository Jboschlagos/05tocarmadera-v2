import { sql } from "@/lib/db";
import Link from "next/link";
import TallerMap from "@/app/components/TallerMap";

export const metadata = {
  title: "Mapa de Talleres | Tocar Madera",
};

export default async function MapaPage() {
  const artesanos = await sql`
    SELECT id, nombre, oficio, foto_url, ciudad, region, lat, lng
    FROM artesanos
    WHERE lat IS NOT NULL AND lng IS NOT NULL
    ORDER BY nombre ASC
  `;

  return (
    <main className="max-w-6xl mx-auto px-8 py-16">
      <h1 className="text-3xl font-bold mb-2">Mapa de Talleres</h1>
      <p className="mb-8" style={{ color: "var(--gris-texto)" }}>
        Explora la ubicación de los artesanos a lo largo de Chile.
      </p>

      {artesanos.length === 0 ? (
        <p style={{ color: "var(--gris-texto)" }}>
          Aún no hay talleres con ubicación registrada.
        </p>
      ) : (
        <TallerMap talleres={artesanos} zoom={5} height="600px" />
      )}

      <p className="mt-6 text-sm">
        <Link href="/artesanos" className="underline" style={{ color: "var(--madera)" }}>
          ← Ver listado completo de artesanos
        </Link>
      </p>
    </main>
  );
}
