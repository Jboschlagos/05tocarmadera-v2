import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAuth } from "@/lib/requireAuth";

// PUT /api/cart/[id]
// Cambia la cantidad de un ítem. Solo si pertenece al usuario logueado.
export async function PUT(request, { params }) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;
    const body = await request.json();
    const { quantity } = body;

    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { error: "El campo 'quantity' debe ser mayor o igual a 1" },
        { status: 400 },
      );
    }

    const [updated] = await sql`
      UPDATE cart_items
      SET quantity = ${quantity}
      WHERE id = ${id} AND user_id = ${session.user.id}
      RETURNING id, user_id, product_id, quantity
    `;

    if (!updated) {
      return NextResponse.json({ error: "Ítem no encontrado en tu carrito" }, { status: 404 });
    }

    return NextResponse.json({ item: updated });
  } catch (err) {
    console.error("Error al actualizar ítem del carrito:", err);
    return NextResponse.json({ error: "No se pudo actualizar el ítem" }, { status: 500 });
  }
}

// DELETE /api/cart/[id]
// Elimina un ítem del carrito. Solo si pertenece al usuario logueado.
export async function DELETE(request, { params }) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;

    const [deleted] = await sql`
      DELETE FROM cart_items
      WHERE id = ${id} AND user_id = ${session.user.id}
      RETURNING id
    `;

    if (!deleted) {
      return NextResponse.json({ error: "Ítem no encontrado en tu carrito" }, { status: 404 });
    }

    return NextResponse.json({ message: "Ítem eliminado", id: deleted.id });
  } catch (err) {
    console.error("Error al eliminar ítem del carrito:", err);
    return NextResponse.json({ error: "No se pudo eliminar el ítem" }, { status: 500 });
  }
}
