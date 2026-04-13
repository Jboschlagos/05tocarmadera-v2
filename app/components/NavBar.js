import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      style={{
        backgroundColor: "var(--verde-musgo)",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Link
        href="/"
        style={{ color: "white", fontWeight: "bold", fontSize: "1.2rem" }}
      >
        🪵 Tocar Madera
      </Link>
      <div style={{ display: "flex", gap: "1.5rem" }}>
        <Link href="/artesanos" style={{ color: "white" }}>
          Artesanos
        </Link>
        <Link href="/obras" style={{ color: "white" }}>
          Obras
        </Link>
        <Link href="/login" style={{ color: "white" }}>
          Ingresar
        </Link>
      </div>
    </nav>
  );
}
