import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/requireAdmin";

// POST /api/upload — solo admin
export async function POST(request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { error: "No se recibió ningún archivo (campo 'file')" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder: "tocarmadera",
    });

    return NextResponse.json(
      { image_url: result.secure_url, public_id: result.public_id },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error al subir imagen a Cloudinary:", error);
    return NextResponse.json(
      { error: "No se pudo subir la imagen" },
      { status: 500 },
    );
  }
}
