import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";

// GET /api/talleres/[id]
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const [taller] = await sql`
      SELECT id, nombre, oficio, bio, foto_url, instagram_url,
        ciudad, region, lat, lng,
        direccion, telefono, whatsapp_url, sitio_web, tecnica, tipo_trabajo
      FROM talleres
      WHERE id = ${id}
    `;

    if (!taller) {
      return NextResponse.json({ error: "Taller no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ taller });
  } catch (error) {
    console.error("Error al obtener taller:", error);
    return NextResponse.json({ error: "No se pudo obtener el taller" }, { status: 500 });
  }
}

// PUT /api/talleres/[id] — solo admin
export async function PUT(request, { params }) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const { id } = await params;
    const body = await request.json();
    const {
      nombre, oficio, bio, foto_url, instagram_url, ciudad, region, lat, lng,
      direccion, telefono, whatsapp_url, sitio_web, tecnica, tipo_trabajo,
    } = body;

    const [updated] = await sql`
      UPDATE talleres
      SET
        nombre = COALESCE(${nombre}, nombre),
        oficio = COALESCE(${oficio}, oficio),
        bio = COALESCE(${bio}, bio),
        foto_url = COALESCE(${foto_url}, foto_url),
        instagram_url = COALESCE(${instagram_url}, instagram_url),
        ciudad = COALESCE(${ciudad}, ciudad),
        region = COALESCE(${region}, region),
        lat = COALESCE(${lat}, lat),
        lng = COALESCE(${lng}, lng),
        direccion = COALESCE(${direccion}, direccion),
        telefono = COALESCE(${telefono}, telefono),
        whatsapp_url = COALESCE(${whatsapp_url}, whatsapp_url),
        sitio_web = COALESCE(${sitio_web}, sitio_web),
        tecnica = COALESCE(${tecnica}, tecnica),
        tipo_trabajo = COALESCE(${tipo_trabajo}, tipo_trabajo),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING id, nombre, oficio, bio, foto_url, instagram_url, ciudad, region, lat, lng,
        direccion, telefono, whatsapp_url, sitio_web, tecnica, tipo_trabajo
    `;

    if (!updated) {
      return NextResponse.json({ error: "Taller no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ taller: updated });
  } catch (error) {
    console.error("Error al actualizar taller:", error);
    return NextResponse.json({ error: "No se pudo actualizar el taller" }, { status: 500 });
  }
}

// DELETE /api/talleres/[id] — solo admin
export async function DELETE(request, { params }) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const { id } = await params;

    const [deleted] = await sql`
      DELETE FROM talleres WHERE id = ${id}
      RETURNING id
    `;

    if (!deleted) {
      return NextResponse.json({ error: "Taller no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ message: "Taller eliminado", id: deleted.id });
  } catch (error) {
    console.error("Error al eliminar taller:", error);
    return NextResponse.json({ error: "No se pudo eliminar el taller" }, { status: 500 });
  }
}
