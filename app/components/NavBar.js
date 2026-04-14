import Link from "next/link";
import Image from "next/image";
import {
  Hammer,
  BookOpen,
  Users,
  LogIn,
  Newspaper,
  ShoppingBag,
} from "lucide-react";

export default function Navbar() {
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
      <div className="flex gap-8">
        <Link
          href="/artesanos"
          className="text-stone-800 text-lg flex items-center gap-2 px-3 py-2 transition-all duration-200 hover:text-amber-700"
        >
          <Users size={18} /> Artesanos
        </Link>
        <Link
          href="/obras"
          className="text-stone-800 text-lg flex items-center gap-2 px-3 py-2 transition-all duration-200 hover:text-amber-700"
        >
          <Hammer size={18} /> Obras
        </Link>
        <Link
          href="/blog"
          className="text-stone-800 text-lg flex items-center gap-2 px-3 py-2 transition-all duration-200 hover:text-amber-700"
        >
          <Newspaper size={18} /> Blog
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
        <Link
          href="/login"
          className="text-green-800 text-lg flex items-center gap-2 px-3 py-2 transition-all duration-200 hover:text-amber-700"
        >
          <LogIn size={18} /> Ingresar
        </Link>
      </div>
    </nav>
  );
}
