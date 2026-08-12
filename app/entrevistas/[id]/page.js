import { sql } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function EntrevistaDetallePage({ params }) {
  const { id } = await params;

  const [entrevista] = await sql`
    SELECT e.id, e.titulo, e.taller, e.oficio, e.descripcion, e.tecnica,
      e.instagram_url, e.imagen_principal, e.fecha, e.ciudad, e.region, e.youtube_id,
      t.id AS taller_id
    FROM entrevistas e
    LEFT JOIN talleres t ON t.id = e.taller_id
    WHERE e.id = ${id}
  `;

  if (!entrevista) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto px-8 py-16">
      <h1 className="text-3xl font-bold mb-2">{entrevista.titulo}</h1>
      <p className="text-lg mb-1" style={{ color: "var(--madera)" }}>
        {entrevista.taller_id ? (
          <Link
            href={`/talleres/${entrevista.taller_id}`}
            className="underline"
          >
            {entrevista.taller}
          </Link>
        ) : (
          entrevista.taller
        )}
        {" — "}
        {entrevista.oficio}
      </p>
      <p className="text-sm mb-8" style={{ color: "var(--gris-texto)" }}>
        📍 {entrevista.ciudad}, {entrevista.region} ·{" "}
        {new Date(entrevista.fecha).toLocaleDateString("es-CL")}
      </p>

      {entrevista.youtube_id && (
        <div className="aspect-video mb-8 rounded-xl overflow-hidden">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${entrevista.youtube_id}`}
            title={entrevista.titulo}
            allowFullScreen
          />
        </div>
      )}

      {entrevista.imagen_principal && !entrevista.youtube_id && (
        <img
          src={entrevista.imagen_principal}
          alt={entrevista.titulo}
          className="w-full h-80 object-cover rounded-xl mb-8"
        />
      )}

      <p
        className="mb-4 whitespace-pre-line"
        style={{ color: "var(--oscuro)" }}
      >
        {entrevista.descripcion || "Sin descripción disponible."}
      </p>

      {entrevista.tecnica && (
        <>
          <h3 className="font-bold text-lg mt-6 mb-2">Técnica</h3>
          <p style={{ color: "var(--oscuro)" }}>{entrevista.tecnica}</p>
        </>
      )}

      {entrevista.instagram_url && (
        <a
          href={entrevista.instagram_url}
          target="_blank"
          className="inline-block mt-6 underline"
          style={{ color: "var(--madera)" }}
        >
          Ver en Instagram
        </a>
      )}
    </main>
  );
}
