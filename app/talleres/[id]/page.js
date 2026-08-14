import { sql } from "@/lib/db";
import { notFound } from "next/navigation";
import TallerPerfilConMapa from "@/app/components/TallerPerfilConMapa";

export default async function TallerDetallePage({ params }) {
  const { id } = await params;

  const [taller] = await sql`
    SELECT id, nombre, oficio, bio, foto_url, instagram_url, ciudad, region, lat, lng
    FROM talleres
    WHERE id = ${id}
  `;

  if (!taller) {
    notFound();
  }

  const productos = await sql`
    SELECT id, name, price
    FROM products
    WHERE taller_id = ${id}
  `;

  const entrevistas = await sql`
    SELECT id, titulo, fecha
    FROM entrevistas
    WHERE taller_id = ${id}
  `;

  return (
    <main className="max-w-7xl mx-auto px-8 py-16">
      <TallerPerfilConMapa
        taller={taller}
        productos={productos}
        entrevistas={entrevistas}
      />
    </main>
  );
}
