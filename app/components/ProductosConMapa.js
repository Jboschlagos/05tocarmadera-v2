"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, X } from "lucide-react";
import ProductoMap from "./ProductoMap";

export default function ProductosConMapa({ productos }) {
  const [mostrarMapa, setMostrarMapa] = useState(false);
  const conUbicacion = productos.filter((p) => p.lat && p.lng);

  if (productos.length === 0) {
    return (
      <p style={{ color: "var(--gris-texto)" }}>
        Aún no hay productos publicados.
      </p>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Botón toggle — solo visible en mobile/tablet (oculto desde lg) */}
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

      {/* Mapa — oculto en mobile salvo que se togglee; siempre visible desde lg */}
      {conUbicacion.length > 0 && (
        <div
          className={`${mostrarMapa ? "block" : "hidden"} lg:block lg:order-2 lg:w-[380px] lg:flex-shrink-0`}
        >
          <div className="lg:sticky lg:top-24">
            <ProductoMap productos={conUbicacion} zoom={5} height="600px" />
          </div>
        </div>
      )}

      {/* Listado de productos */}
      <div className="flex-1 lg:order-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {productos.map((product) => (
            <Link
              key={product.id}
              href={`/mercado/${product.id}`}
              className="rounded-xl overflow-hidden shadow-sm block hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "white" }}
            >
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="font-semibold">{product.name}</h3>
                <p
                  className="text-sm font-bold"
                  style={{ color: "var(--madera)" }}
                >
                  ${Number(product.price).toLocaleString("es-CL")}
                </p>
                <p className="text-xs" style={{ color: "var(--gris-texto)" }}>
                  {product.ciudad}, {product.region}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
