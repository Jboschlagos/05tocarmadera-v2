import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-12 px-8" style={{ backgroundColor: "var(--oscuro)" }}>
      <div className="flex flex-col lg:flex-row justify-between gap-8 max-w-6xl mx-auto">
        {/* Columna 1 — Marca. SIEMPRE visible, en todos los tamaños. */}
        <div className="flex flex-col gap-3">
          <h3 className="text-white font-bold text-xl">🪵 Tocar Madera</h3>
          <p className="text-sm" style={{ color: "var(--gris-texto)" }}>
            Conectamos con las historias detrás <br /> de los talleres de Chile
          </p>
          {/* Redes sociales */}
          <div className="flex gap-4 mt-2">
            <a
              href="https://instagram.com/tocarmadera_"
              target="_blank"
              className="text-white hover:opacity-75 text-sm"
            >
              Instagram
            </a>
            <a href="#" className="text-white hover:opacity-75 text-sm">
              YouTube
            </a>
            <a href="#" className="text-white hover:opacity-75 text-sm">
              Facebook
            </a>
          </div>
        </div>

        {/* ── Columnas 2, 3 y 4 — SOLO desde lg (1024px) ──────────
            "hidden lg:flex": oculto por defecto (mobile Y tablet),
            se muestra en fila recién desde 1024px hacia arriba.
            Esto es distinto al Navbar, donde el punto de corte era
            "md" (768px) — acá decidiste que tablet (768-1023px)
            todavía debe ver la versión resumida.
        */}
        <div className="hidden lg:flex gap-8">
          {/* Columna 2 — Navegación */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-bold">Explorar</h4>
            <Link
              href="/artesanos"
              className="text-sm hover:underline underline-offset-4"
              style={{ color: "var(--gris-texto)" }}
            >
              Artesanos
            </Link>
            <Link
              href="/obras"
              className="text-sm hover:underline underline-offset-4"
              style={{ color: "var(--gris-texto)" }}
            >
              Obras
            </Link>
            <Link
              href="#"
              className="text-sm hover:underline underline-offset-4"
              style={{ color: "var(--gris-texto)" }}
            >
              Regiones de Chile
            </Link>
            <Link
              href="#"
              className="text-sm hover:underline underline-offset-4"
              style={{ color: "var(--gris-texto)" }}
            >
              Blog / Entrevistas
            </Link>
          </div>

          {/* Columna 3 — Comunidad */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-bold">Comunidad</h4>
            <Link
              href="#"
              className="text-sm hover:underline underline-offset-4"
              style={{ color: "var(--gris-texto)" }}
            >
              ¿Tienes un taller o trabajas la madera? Únete
            </Link>
            <Link
              href="#"
              className="text-sm hover:underline underline-offset-4"
              style={{ color: "var(--gris-texto)" }}
            >
              Sobre nosotros
            </Link>
            <Link
              href="#"
              className="text-sm hover:underline underline-offset-4"
              style={{ color: "var(--gris-texto)" }}
            >
              Contacto
            </Link>
            <Link
              href="#"
              className="text-sm hover:underline underline-offset-4"
              style={{ color: "var(--gris-texto)" }}
            >
              Prensa
            </Link>
          </div>

          {/* Columna 4 — Contacto */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-bold">Contacto</h4>
            <p className="text-sm" style={{ color: "var(--gris-texto)" }}>
              📧 hola@tocarmadera.cl
            </p>
            <p className="text-sm" style={{ color: "var(--gris-texto)" }}>
              📍 Chile
            </p>
            <p className="text-sm" style={{ color: "var(--gris-texto)" }}>
              📱 +56 9 xxxx xxxx
            </p>
          </div>
        </div>
      </div>

      {/* Línea divisora — SIEMPRE visible (copyright siempre se ve) */}
      <div className="border-t border-gray-700 mt-8 pt-6 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-sm" style={{ color: "var(--gris-texto)" }}>
            © 2026 Tocar Madera — Jorge Bosch
          </p>

          {/* Links legales — mismo criterio que las 3 columnas de arriba:
              ocultos en mobile/tablet, visibles desde lg. */}
          <div className="hidden lg:flex gap-4">
            <Link
              href="#"
              className="text-sm hover:underline"
              style={{ color: "var(--gris-texto)" }}
            >
              Términos y condiciones
            </Link>
            <Link
              href="#"
              className="text-sm hover:underline"
              style={{ color: "var(--gris-texto)" }}
            >
              Política de privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
