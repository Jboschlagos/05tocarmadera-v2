export default function HomePage() {
  return (
    <main>
      {/* ── Carrusel Hero ─────────────────────────────── */}
      <section
        className="w-full h-96 flex items-center justify-center"
        style={{ backgroundColor: "var(--gris-claro)" }}
      >
        <p style={{ color: "var(--gris-texto)" }}>
          [ Carrusel — próxima sesión ]
        </p>
      </section>

      {/* ── Historias / Blog ──────────────────────────── */}
      <section className="max-w-6xl mx-auto px-8 py-16 bg-white">
        <h2 className="text-3xl font-bold mb-8">Historias de Talleres</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-xl p-6 shadow-sm"
              style={{ backgroundColor: "var(--gris-claro)" }}
            >
              <p style={{ color: "var(--gris-texto)" }}>
                [ Historia {i} — próxima sesión ]
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mercado ───────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-8 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-3xl font-bold mb-8"
            style={{ color: "var(--oscuro)" }}
          >
            Mercado
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-xl p-6 shadow-sm"
                style={{ backgroundColor: "white" }}
              >
                <p style={{ color: "var(--gris-texto)" }}>
                  [ Obra {i} — próxima sesión ]
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
