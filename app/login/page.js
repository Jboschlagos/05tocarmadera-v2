"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setCargando(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setCargando(false);

    if (result?.error) {
      setError("Email o contraseña incorrectos");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 sm:px-8 py-8 sm:py-16">
      <div className="w-full max-w-md">
        <h1 className="text-2xl sm:text-3xl font-bold mb-8">Iniciar sesión</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={cargando}
            className="rounded-lg px-4 py-2 text-white font-semibold"
            style={{ backgroundColor: "var(--madera)" }}
          >
            {cargando ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p
          className="text-sm mt-4 text-center"
          style={{ color: "var(--gris-texto)" }}
        >
          <Link href="/forgot-password" className="underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </p>
        <p className="text-sm mt-2" style={{ color: "var(--gris-texto)" }}>
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="underline">
            Regístrate
          </Link>
        </p>
      </div>
    </main>
  );
}
