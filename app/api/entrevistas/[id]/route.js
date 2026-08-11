import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";

// GET /api/entrevistas/[id]
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const [entrevista] = await sql`
      SELECT id, titulo, taller, oficio, descripcion, tecnica,
        instagram_url, imagen_principal, fecha, ciudad, region,
        lat, lng, youtube_id
      FROM entrevistas
      WHERE id = ${id}
    `;

    if (!entrevista) {
      return NextResponse.json({ error: "Entrevista no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ entrevista });
  } catch (error) {
    console.error("Error al obtener entrevista:", error);
    return NextResponse.json({ error: "No se pudo obtener la entrevista" }, { status: 500 });
  }
}

// PUT /api/entrevistas/[id] — solo admin
export async function PUT(request, { params }) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const { id } = await params;
    const body = await request.json();
    const {
      titulo, taller, oficio, descripcion, tecnica,
      instagram_url, imagen_principal, fecha, ciudad, region,
      lat, lng, youtube_id,
    } = body;

    const [updated] = await sql`
      UPDATE entrevistas
      SET
        titulo = COALESCE(${titulo}, titulo),
        taller = COALESCE(${taller}, taller),
        oficio = COALESCE(${oficio}, oficio),
        descripcion = COALESCE(${descripcion}, descripcion),
        tecnica = COALESCE(${tecnica}, tecnica),
        instagram_url = COALESCE(${instagram_url}, instagram_url),
        imagen_principal = COALESCE(${imagen_principal}, imagen_principal),
        fecha = COALESCE(${fecha}, fecha),
        ciudad = COALESCE(${ciudad}, ciudad),
        region = COALESCE(${region}, region),
        lat = COALESCE(${lat}, lat),
        lng = COALESCE(${lng}, lng),
        youtube_id = COALESCE(${youtube_id}, youtube_id),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING id, titulo, taller, oficio, descripcion, tecnica,
        instagram_url, imagen_principal, fecha, ciudad, region, lat, lng, youtube_id
    `;

    if (!updated) {
      return NextResponse.json({ error: "Entrevista no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ entrevista: updated });
  } catch (error) {
    console.error("Error al actualizar entrevista:", error);
    return NextResponse.json({ error: "No se pudo actualizar la entrevista" }, { status: 500 });
  }
}

// DELETE /api/entrevistas/[id] — solo admin
export async function DELETE(request, { params }) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const { id } = await params;
    const [deleted] = await sql`
      DELETE FROM entrevistas WHERE id = ${id}
      RETURNING id
    `;

    if (!deleted) {
      return NextResponse.json({ error: "Entrevista no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ message: "Entrevista eliminada", id: deleted.id });
  } catch (error) {
    console.error("Error al eliminar entrevista:", error);
    return NextResponse.json({ error: "No se pudo eliminar la entrevista" }, { status: 500 });
  }
}
