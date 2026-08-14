"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import {
  Hammer,
  BookOpen,
  Users,
  LogIn,
  LogOut,
  Newspaper,
  ShoppingBag,
  Menu,
  X,
} from "lucide-react";

const links = [
  { href: "/talleres", label: "Talleres", icon: Users },
  { href: "/entrevistas", label: "Entrevistas", icon: Newspaper },
  { href: "/nosotros", label: "Nuestra Historia", icon: BookOpen },
  { href: "/mercado", label: "Mercado", icon: ShoppingBag },
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const [menuAbierto, setMenuAbierto] = useState(false);

  function cerrarMenu() {
    setMenuAbierto(false);
  }

  return (
    <nav className="relative flex justify-between items-center px-4 sm:px-8 py-4 shadow-sm bg-white">
      <Link href="/" onClick={cerrarMenu}>
        <Image
          src="/img/logoSinFondo.png"
          alt="Tocar Madera"
          width={80}
          height={80}
        />
      </Link>

      {/* ── Enlaces — visibles desde md (768px) ─────────── */}
      <div className="hidden md:flex gap-8 items-center">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="text-stone-800 text-lg flex items-center gap-2 px-3 py-2 transition-all duration-200 hover:text-amber-700"
          >
            <Icon size={18} /> {label}
          </Link>
        ))}

        {status === "loading" ? null : session?.user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm" style={{ color: "var(--gris-texto)" }}>
              Hola, <strong>{session.user.name}</strong>
              {session.user.role === "admin" && (
                <span
                  className="ml-2 text-xs px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: "var(--madera)", color: "white" }}
                >
                  admin
                </span>
              )}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-stone-800 text-lg flex items-center gap-2 px-3 py-2 transition-all duration-200 hover:text-amber-700"
            >
              <LogOut size={18} /> Salir
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="text-green-800 text-lg flex items-center gap-2 px-3 py-2 transition-all duration-200 hover:text-amber-700"
          >
            <LogIn size={18} /> Ingresar
          </Link>
        )}
      </div>

      {/* ── Botón hamburguesa — solo visible bajo md ────── */}
      <button
        onClick={() => setMenuAbierto((v) => !v)}
        className="md:hidden text-stone-800 p-2 -mr-2"
        aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={menuAbierto}
      >
        {menuAbierto ? <X size={26} /> : <Menu size={26} />}
      </button>

      {/* ── Menú desplegable mobile — bajo md ────────────── */}
      {menuAbierto && (
        <div
          className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md flex flex-col py-2 z-50"
          style={{ borderTop: "1px solid var(--gris-claro)" }}
        >
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={cerrarMenu}
              className="text-stone-800 text-lg flex items-center gap-3 px-6 py-3 transition-all duration-200 hover:text-amber-700 hover:bg-stone-50"
            >
              <Icon size={18} /> {label}
            </Link>
          ))}

          <div
            className="mt-2 pt-3 px-6"
            style={{ borderTop: "1px solid var(--gris-claro)" }}
          >
            {status === "loading" ? null : session?.user ? (
              <div className="flex flex-col gap-3">
                <span
                  className="text-sm"
                  style={{ color: "var(--gris-texto)" }}
                >
                  Hola, <strong>{session.user.name}</strong>
                  {session.user.role === "admin" && (
                    <span
                      className="ml-2 text-xs px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: "var(--madera)",
                        color: "white",
                      }}
                    >
                      admin
                    </span>
                  )}
                </span>
                <button
                  onClick={() => {
                    cerrarMenu();
                    signOut({ callbackUrl: "/" });
                  }}
                  className="text-stone-800 text-lg flex items-center gap-2 py-2 transition-all duration-200 hover:text-amber-700"
                >
                  <LogOut size={18} /> Salir
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={cerrarMenu}
                className="text-green-800 text-lg flex items-center gap-2 py-2 transition-all duration-200 hover:text-amber-700"
              >
                <LogIn size={18} /> Ingresar
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
