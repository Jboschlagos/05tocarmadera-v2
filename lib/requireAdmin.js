import { NextResponse } from "next/server";
import { auth } from "@/auth";

// Verifica que haya sesión activa y que el usuario sea admin.
// Devuelve null si todo está bien (puede seguir el endpoint),
// o un NextResponse de error listo para retornar directamente.
export async function requireAdmin() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "No tienes permisos de administrador" }, { status: 403 });
  }

  return null;
}
