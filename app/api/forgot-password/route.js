import { NextResponse } from "next/server";
import crypto from "crypto";
import { sql } from "@/lib/db";
import { resend } from "@/lib/resend";

// POST /api/forgot-password
// Recibe un email, y si existe un usuario con ese email, le manda un
// correo con un link para resetear su contraseña. Por seguridad,
// respondemos igual (mensaje genérico) exista o no el email — así
// alguien malintencionado no puede usar este endpoint para adivinar
// qué correos están registrados en tu sitio.
export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "El campo 'email' es obligatorio" },
        { status: 400 },
      );
    }

    const [user] = await sql`
      SELECT id, email, username FROM users WHERE email = ${email}
    `;

    // Si el usuario existe, generamos el token y mandamos el correo.
    // Si no existe, no hacemos nada — pero igual respondemos "ok" más abajo.
    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      const expira = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos desde ahora

      await sql`
        UPDATE users
        SET reset_token = ${token}, reset_token_expires = ${expira}
        WHERE id = ${user.id}
      `;

      const origin = new URL(request.url).origin;
      const link = `${origin}/reset-password?token=${token}`;

      await resend.emails.send({
        from: "Tocar Madera <onboarding@resend.dev>",
        to: user.email,
        subject: "Recupera tu contraseña — Tocar Madera",
        html: `
          <p>Hola ${user.username},</p>
          <p>Recibimos una solicitud para restablecer tu contraseña. Haz clic en el siguiente link (válido por 30 minutos):</p>
          <p><a href="${link}">${link}</a></p>
          <p>Si no pediste esto, puedes ignorar este correo.</p>
        `,
      });
    }

    return NextResponse.json({
      message:
        "Si el correo existe en nuestro sistema, te enviamos un link de recuperación.",
    });
  } catch (error) {
    console.error("Error al procesar recuperación de contraseña:", error);
    return NextResponse.json(
      { error: "No se pudo procesar la solicitud" },
      { status: 500 },
    );
  }
}
