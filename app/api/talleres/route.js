import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";

// GET /api/artesanos
export async function GET() {
  try {
    const artesanos = await sql`
      SELECT id, nombre, oficio, bio, foto_url, instagram_url,
        ciudad, region, lat, lng
      FROM artesanos
      ORDER BY nombre ASC
    `;

    return NextResponse.json({ artesanos });
  } catch (error) {
    console.error("Error al obtener artesanos:", error);
    return NextResponse.json(
      { error: "No se pudieron obtener los artesanos" },
      { status: 500 },
    );
  }
}

// POST /api/artesanos — solo admin
export async function POST(request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const body = await request.json();
    const { nombre, oficio, bio, foto_url, instagram_url, ciudad, region, lat, lng } = body;

    if (!nombre) {
      return NextResponse.json(
        { error: "El campo 'nombre' es obligatorio" },
        { status: 400 },
      );
    }

    const [newArtesano] = await sql`
      INSERT INTO artesanos (nombre, oficio, bio, foto_url, instagram_url, ciudad, region, lat, lng)
      VALUES (${nombre}, ${oficio ?? null}, ${bio ?? null}, ${foto_url ?? null}, ${instagram_url ?? null}, ${ciudad ?? null}, ${region ?? null}, ${lat ?? null}, ${lng ?? null})
      RETURNING id, nombre, oficio, bio, foto_url, instagram_url, ciudad, region, lat, lng
    `;

    return NextResponse.json({ artesano: newArtesano }, { status: 201 });
  } catch (error) {
    console.error("Error al crear artesano:", error);
    return NextResponse.json(
      { error: "No se pudo crear el artesano" },
      { status: 500 },
    );
  }
}
