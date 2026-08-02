"use client";

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
} from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="flex justify-between items-center px-8 py-4 shadow-sm bg-white">
      <Link href="/">
        <Image
          src="/img/logoSinFondo.png"
          alt="Tocar Madera"
          width={80}
          height={80}
        />
      </Link>
      <div className="flex gap-8 items-center">
        <Link
          href="/artesanos"
          className="text-stone-800 text-lg flex items-center gap-2 px-3 py-2 transition-all duration-200 hover:text-amber-700"
        >
          <Users size={18} /> Artesanos
        </Link>
        <Link
          href="/entrevistas"
          className="text-stone-800 text-lg flex items-center gap-2 px-3 py-2 transition-all duration-200 hover:text-amber-700"
        >
          <Newspaper size={18} /> Entrevistas
        </Link>
        <Link
          href="/nosotros"
          className="text-stone-800 text-lg flex items-center gap-2 px-3 py-2 transition-all duration-200 hover:text-amber-700"
        >
          <BookOpen size={18} /> Nuestra Historia
        </Link>
        <Link
          href="/mercado"
          className="text-stone-800 text-lg flex items-center gap-2 px-3 py-2 transition-all duration-200 hover:text-amber-700"
        >
          <ShoppingBag size={18} /> Mercado
        </Link>

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
    </nav>
  );
}
