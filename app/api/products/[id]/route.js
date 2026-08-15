import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";

// GET /api/products/[id]
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const [product] = await sql`
      SELECT id, name, description, price, image_url, ciudad, region, lat, lng
      FROM products
      WHERE id = ${id}
    `;

    if (!product) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Error al obtener producto:", error);
    return NextResponse.json(
      { error: "No se pudo obtener el producto" },
      { status: 500 },
    );
  }
}

// PUT /api/products/[id] — solo admin
export async function PUT(request, { params }) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      description,
      price,
      image_url,
      ciudad,
      region,
      lat,
      lng,
      taller_id,
    } = body;

    const [updated] = await sql`
      UPDATE products
      SET
        name = COALESCE(${name}, name),
        description = COALESCE(${description}, description),
        price = COALESCE(${price}, price),
        image_url = COALESCE(${image_url}, image_url),
        ciudad = COALESCE(${ciudad}, ciudad),
        region = COALESCE(${region}, region),
        lat = COALESCE(${lat}, lat),
        lng = COALESCE(${lng}, lng),
        taller_id = COALESCE(${taller_id}, taller_id)
      WHERE id = ${id}
      RETURNING id, name, description, price, image_url, ciudad, region, lat, lng, taller_id
    `;

    if (!updated) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({ product: updated });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    return NextResponse.json(
      { error: "No se pudo actualizar el producto" },
      { status: 500 },
    );
  }
}

// DELETE /api/products/[id] — solo admin
export async function DELETE(request, { params }) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const { id } = await params;

    await sql`DELETE FROM product_images WHERE product_id = ${id}`;

    const [deleted] = await sql`
      DELETE FROM products WHERE id = ${id}
      RETURNING id
    `;

    if (!deleted) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Producto eliminado", id: deleted.id });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    return NextResponse.json(
      { error: "No se pudo eliminar el producto" },
      { status: 500 },
    );
  }
}
