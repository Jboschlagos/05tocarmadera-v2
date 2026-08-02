import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";

// POST /api/register
// Crea un usuario nuevo con contraseña hasheada. Rol por defecto: "user".
export async function POST(request) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Los campos 'username', 'email' y 'password' son obligatorios" },
        { status: 400 },
      );
    }

    // Verificar que no exista ya el email o el username
    const [existing] = await sql`
      SELECT id, username, email FROM users
      WHERE email = ${email} OR username = ${username}
    `;

    if (existing) {
      const campo = existing.email === email ? "email" : "username";
      return NextResponse.json(
        { error: `Ya existe una cuenta con ese ${campo}` },
        { status: 409 },
      );
    }

    const password_hash = await bcrypt.hash(password, 10);

    const [newUser] = await sql`
      INSERT INTO users (username, email, password_hash)
      VALUES (${username}, ${email}, ${password_hash})
      RETURNING id, username, email, role
    `;

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return NextResponse.json(
      { error: "No se pudo registrar el usuario" },
      { status: 500 },
    );
  }
}
