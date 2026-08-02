import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAuth } from "@/lib/requireAuth";

// GET /api/cart
// Devuelve el carrito del usuario logueado, con los datos del producto incluidos.
export async function GET() {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const items = await sql`
      SELECT
        ci.id, ci.quantity,
        p.id AS product_id, p.name, p.price, p.image_url
      FROM cart_items ci
      JOIN products p ON p.id = ci.product_id
      WHERE ci.user_id = ${session.user.id}
      ORDER BY ci.id DESC
    `;

    return NextResponse.json({ items });
  } catch (err) {
    console.error("Error al obtener el carrito:", err);
    return NextResponse.json({ error: "No se pudo obtener el carrito" }, { status: 500 });
  }
}

// POST /api/cart
// Agrega un producto al carrito. Si ya existe, suma la cantidad en vez de duplicar.
export async function POST(request) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const { product_id, quantity } = body;

    if (!product_id) {
      return NextResponse.json({ error: "El campo 'product_id' es obligatorio" }, { status: 400 });
    }

    const cantidad = quantity ?? 1;

    const [existing] = await sql`
      SELECT id, quantity FROM cart_items
      WHERE user_id = ${session.user.id} AND product_id = ${product_id}
    `;

    let item;
    if (existing) {
      [item] = await sql`
        UPDATE cart_items
        SET quantity = quantity + ${cantidad}
        WHERE id = ${existing.id}
        RETURNING id, user_id, product_id, quantity
      `;
    } else {
      [item] = await sql`
        INSERT INTO cart_items (user_id, product_id, quantity)
        VALUES (${session.user.id}, ${product_id}, ${cantidad})
        RETURNING id, user_id, product_id, quantity
      `;
    }

    return NextResponse.json({ item }, { status: 201 });
  } catch (err) {
    console.error("Error al agregar al carrito:", err);
    return NextResponse.json({ error: "No se pudo agregar al carrito" }, { status: 500 });
  }
}
