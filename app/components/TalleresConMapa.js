"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, X } from "lucide-react";
import TallerMap from "./TallerMap";

export default function TalleresConMapa({ talleres }) {
  const [mostrarMapa, setMostrarMapa] = useState(false);
  const conUbicacion = talleres.filter((t) => t.lat && t.lng);

  if (talleres.length === 0) {
    return (
      <p style={{ color: "var(--gris-texto)" }}>
        Aún no hay talleres registrados.
      </p>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {conUbicacion.length > 0 && (
        <button
          onClick={() => setMostrarMapa((v) => !v)}
          className="lg:hidden flex items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold text-white"
          style={{ backgroundColor: "var(--madera)" }}
        >
          {mostrarMapa ? <X size={18} /> : <MapPin size={18} />}
          {mostrarMapa ? "Ocultar mapa" : "Ver mapa"}
        </button>
      )}

      {conUbicacion.length > 0 && (
        <div
          className={`${mostrarMapa ? "block" : "hidden"} lg:block lg:order-2 lg:w-[380px] lg:flex-shrink-0`}
        >
          <div className="lg:sticky lg:top-24">
            <TallerMap talleres={conUbicacion} zoom={5} height="600px" />
          </div>
        </div>
      )}

      <div className="flex-1 lg:order-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {talleres.map((taller) => (
            <Link
              key={taller.id}
              href={`/talleres/${taller.id}`}
              className="flex flex-col items-center text-center p-6 rounded-xl overflow-hidden shadow-sm border border-transparent transition-all duration-200 hover:shadow-md hover:scale-[1.03] hover:border-[var(--madera)]"
              style={{ backgroundColor: "var(--gris-claro)" }}
            >
              {taller.foto_url ? (
                <img
                  src={taller.foto_url}
                  alt={taller.nombre}
                  className="w-24 h-24 rounded-full object-cover mb-4"
                />
              ) : (
                <div
                  className="w-24 h-24 rounded-full mb-4 flex items-center justify-center text-2xl font-bold text-white"
                  style={{ backgroundColor: "var(--madera)" }}
                >
                  {taller.nombre.charAt(0)}
                </div>
              )}
              <h3 className="font-bold text-lg">{taller.nombre}</h3>
              <p className="text-sm" style={{ color: "var(--gris-texto)" }}>
                {taller.oficio}
              </p>
              {taller.tipo_trabajo && (
                <span
                  className="mt-2 text-xs px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: "var(--madera)", color: "white" }}
                >
                  {taller.tipo_trabajo}
                </span>
              )}
              <p
                className="text-xs mt-2"
                style={{ color: "var(--gris-texto)" }}
              >
                {taller.ciudad}, {taller.region}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
