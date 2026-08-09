import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";

// GET /api/artesanos/[id]
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const [artesano] = await sql`
      SELECT id, nombre, oficio, bio, foto_url, instagram_url,
        ciudad, region, lat, lng
      FROM artesanos
      WHERE id = ${id}
    `;

    if (!artesano) {
      return NextResponse.json({ error: "Artesano no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ artesano });
  } catch (error) {
    console.error("Error al obtener artesano:", error);
    return NextResponse.json({ error: "No se pudo obtener el artesano" }, { status: 500 });
  }
}

// PUT /api/artesanos/[id] — solo admin
export async function PUT(request, { params }) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const { id } = await params;
    const body = await request.json();
    const { nombre, oficio, bio, foto_url, instagram_url, ciudad, region, lat, lng } = body;

    const [updated] = await sql`
      UPDATE artesanos
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
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING id, nombre, oficio, bio, foto_url, instagram_url, ciudad, region, lat, lng
    `;

    if (!updated) {
      return NextResponse.json({ error: "Artesano no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ artesano: updated });
  } catch (error) {
    console.error("Error al actualizar artesano:", error);
    return NextResponse.json({ error: "No se pudo actualizar el artesano" }, { status: 500 });
  }
}

// DELETE /api/artesanos/[id] — solo admin
export async function DELETE(request, { params }) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const { id } = await params;

    const [deleted] = await sql`
      DELETE FROM artesanos WHERE id = ${id}
      RETURNING id
    `;

    if (!deleted) {
      return NextResponse.json({ error: "Artesano no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ message: "Artesano eliminado", id: deleted.id });
  } catch (error) {
    console.error("Error al eliminar artesano:", error);
    return NextResponse.json({ error: "No se pudo eliminar el artesano" }, { status: 500 });
  }
}
