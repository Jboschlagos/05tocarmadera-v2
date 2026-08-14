"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, X } from "lucide-react";
import TallerMap from "./TallerMap";

export default function TallerPerfilConMapa({ taller, productos, entrevistas }) {
  const [mostrarMapa, setMostrarMapa] = useState(false);
  const tieneUbicacion = taller.lat && taller.lng;

  return (
    <>
      {/* Botón toggle — solo visible en mobile/tablet, arriba de todo */}
      {tieneUbicacion && (
        <button
          onClick={() => setMostrarMapa((v) => !v)}
          className="lg:hidden flex items-center justify-center gap-2 rounded-lg px-4 py-3 mb-6 font-semibold text-white w-full"
          style={{ backgroundColor: "var(--madera)" }}
        >
          {mostrarMapa ? <X size={18} /> : <MapPin size={18} />}
          {mostrarMapa ? "Ocultar mapa" : "Ver mapa"}
        </button>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mapa — oculto en mobile salvo que se togglee; siempre visible desde lg */}
        {tieneUbicacion && (
          <div
            className={`${mostrarMapa ? "block" : "hidden"} lg:block lg:order-2 lg:w-[380px] lg:flex-shrink-0`}
          >
            <div className="lg:sticky lg:top-24">
              <h2 className="text-xl font-bold mb-4">Ubicación del taller</h2>
              <TallerMap
                talleres={[taller]}
                center={[Number(taller.lat), Number(taller.lng)]}
                zoom={12}
                height="300px"
              />
            </div>
          </div>
        )}

        {/* Contenido del perfil */}
        <div className="flex-1 lg:order-1">
          <div className="flex flex-col items-center text-center mb-10">
            {taller.foto_url ? (
              <img
                src={taller.foto_url}
                alt={taller.nombre}
                className="w-32 h-32 rounded-full object-cover mb-4"
              />
            ) : (
              <div
                className="w-32 h-32 rounded-full mb-4 flex items-center justify-center text-4xl font-bold text-white"
                style={{ backgroundColor: "var(--madera)" }}
              >
                {taller.nombre.charAt(0)}
              </div>
            )}
            <h1 className="text-3xl font-bold">{taller.nombre}</h1>
            <p className="text-lg" style={{ color: "var(--madera)" }}>{taller.oficio}</p>
            <p className="text-sm mt-1" style={{ color: "var(--gris-texto)" }}>
              📍 {taller.ciudad}, {taller.region}
            </p>
            {taller.instagram_url && (
              <a href={taller.instagram_url}
                target="_blank"
                className="underline mt-2"
                style={{ color: "var(--madera)" }}
              >
                Ver en Instagram
              </a>
            )}
          </div>

          {taller.bio && (
            <p className="mb-10 text-center max-w-2xl mx-auto" style={{ color: "var(--oscuro)" }}>
              {taller.bio}
            </p>
          )}

          {entrevistas.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold mb-4">Entrevistas</h2>
              <div className="flex flex-col gap-2">
                {entrevistas.map((e) => (
                  <Link
                    key={e.id}
                    href={`/entrevistas/${e.id}`}
                    className="underline"
                    style={{ color: "var(--madera)" }}
                  >
                    {e.titulo}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {productos.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4">Productos</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {productos.map((p) => (
                  <Link
                    key={p.id}
                    href={`/mercado/${p.id}`}
                    className="rounded-xl p-4 shadow-sm"
                    style={{ backgroundColor: "var(--gris-claro)" }}
                  >
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-sm" style={{ color: "var(--madera)" }}>
                      ${Number(p.price).toLocaleString("es-CL")}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
