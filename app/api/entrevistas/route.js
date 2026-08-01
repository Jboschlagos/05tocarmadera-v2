import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

// GET /api/entrevistas
// Devuelve todas las historias/entrevistas de artesanos. Pública, sin auth.
export async function GET() {
  try {
    const entrevistas = await sql`
      SELECT
        id, titulo, artesano, oficio, descripcion, tecnica,
        instagram_url, imagen_principal, fecha, ciudad, region,
        lat, lng, youtube_id
      FROM entrevistas
      ORDER BY fecha DESC
    `;

    return NextResponse.json({ entrevistas });
  } catch (error) {
    console.error("Error al obtener entrevistas:", error);
    return NextResponse.json(
      { error: "No se pudieron obtener las entrevistas" },
      { status: 500 },
    );
  }
}

// POST /api/entrevistas
// Crea una entrevista nueva. Por ahora sin protección de auth (se agrega después).
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      titulo,
      artesano,
      oficio,
      descripcion,
      tecnica,
      instagram_url,
      imagen_principal,
      fecha,
      ciudad,
      region,
      lat,
      lng,
      youtube_id,
    } = body;

    // Validación: estos campos son NOT NULL en la tabla
    const faltantes = [];
    if (!titulo) faltantes.push("titulo");
    if (!artesano) faltantes.push("artesano");
    if (!oficio) faltantes.push("oficio");
    if (!fecha) faltantes.push("fecha");
    if (!youtube_id) faltantes.push("youtube_id");

    if (faltantes.length > 0) {
      return NextResponse.json(
        { error: `Faltan campos obligatorios: ${faltantes.join(", ")}` },
        { status: 400 },
      );
    }

    const [newEntrevista] = await sql`
      INSERT INTO entrevistas (
        titulo, artesano, oficio, descripcion, tecnica,
        instagram_url, imagen_principal, fecha, ciudad, region,
        lat, lng, youtube_id
      )
      VALUES (
        ${titulo}, ${artesano}, ${oficio}, ${descripcion ?? null}, ${tecnica ?? null},
        ${instagram_url ?? null}, ${imagen_principal ?? null}, ${fecha}, ${ciudad ?? null}, ${region ?? null},
        ${lat ?? null}, ${lng ?? null}, ${youtube_id}
      )
      RETURNING id, titulo, artesano, oficio, descripcion, tecnica,
        instagram_url, imagen_principal, fecha, ciudad, region, lat, lng, youtube_id
    `;

    return NextResponse.json({ entrevista: newEntrevista }, { status: 201 });
  } catch (error) {
    console.error("Error al crear entrevista:", error);
    return NextResponse.json(
      { error: "No se pudo crear la entrevista" },
      { status: 500 },
    );
  }
}
