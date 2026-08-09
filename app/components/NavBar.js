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

export default function Navbar() {
  const { data: session, status } = useSession();

  // Estado: ¿el menú mobile está abierto o cerrado?
  // Empieza en `false` porque al cargar la página el menú debe estar cerrado.
  const [menuOpen, setMenuOpen] = useState(false);

  // Array con los links de navegación.
  // Lo sacamos a un array en vez de repetir 4 veces el mismo <Link>
  // porque así lo recorremos con .map() tanto en la versión desktop
  // como en la versión mobile, sin duplicar código (principio DRY).
  const navLinks = [
    { href: "/artesanos", label: "Artesanos", icon: Users },
    { href: "/entrevistas", label: "Entrevistas", icon: Newspaper },
    { href: "/nosotros", label: "Nuestra Historia", icon: BookOpen },
    { href: "/mercado", label: "Mercado", icon: ShoppingBag },
  ];

  return (
    <header className="relative shadow-sm bg-white">
      <nav className="flex justify-between items-center px-4 md:px-8 py-4">
        {/* Logo — siempre visible */}
        <Link href="/" onClick={() => setMenuOpen(false)}>
          <Image
            src="/img/logoSinFondo.png"
            alt="Tocar Madera"
            width={80}
            height={80}
          />
        </Link>

        {/* ── Navegación DESKTOP ─────────────────────────
            "hidden md:flex" = mobile-first:
            - por defecto (mobile) está oculto
            - desde md (768px) se muestra como flex
        */}
        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map(({ href, label, icon: Icon }) => (
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

        {/* ── Botón hamburguesa — solo visible en mobile ──
            "md:hidden" = lo opuesto al de arriba:
            visible por defecto, se oculta desde md.
        */}
        <button
          className="md:hidden text-stone-800"
          onClick={() => setMenuOpen((abierto) => !abierto)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
        >
          {/* Si el menú está abierto mostramos la X, si no, las 3 rayitas */}
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* ── Menú mobile (dropdown) ──────────────────────
          Solo se renderiza si menuOpen es true (renderizado condicional).
          "md:hidden" también aquí, por si la ventana crece de mobile a
          desktop mientras el menú sigue "abierto" en el estado.
      */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-1 px-4 pb-4 border-t">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)} // cierra el menú al navegar
              className="text-stone-800 text-lg flex items-center gap-2 px-3 py-3 hover:text-amber-700"
            >
              <Icon size={18} /> {label}
            </Link>
          ))}

          <div className="border-t pt-3 mt-2">
            {status === "loading" ? null : session?.user ? (
              <div className="flex flex-col gap-2">
                <span
                  className="text-sm px-3"
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
                    setMenuOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="text-stone-800 text-lg flex items-center gap-2 px-3 py-3 hover:text-amber-700"
                >
                  <LogOut size={18} /> Salir
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="text-green-800 text-lg flex items-center gap-2 px-3 py-3 hover:text-amber-700"
              >
                <LogIn size={18} /> Ingresar
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
