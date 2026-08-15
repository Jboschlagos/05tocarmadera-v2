"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, X, SlidersHorizontal } from "lucide-react";
import ProductoMap from "./ProductoMap";

export default function ProductosConMapa({ productos }) {
  const [mostrarMapa, setMostrarMapa] = useState(false);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Valores que el usuario está eligiendo en los <select>, todavía no aplicados.
  const [regionInput, setRegionInput] = useState("");
  const [tallerInput, setTallerInput] = useState("");

  // Valores que realmente se usan para filtrar — solo cambian al hacer clic en "Aplicar filtros".
  const [regionAplicada, setRegionAplicada] = useState("");
  const [tallerAplicado, setTallerAplicado] = useState("");

  if (productos.length === 0) {
    return (
      <p style={{ color: "var(--gris-texto)" }}>
        Aún no hay productos publicados.
      </p>
    );
  }

  // Listas únicas de regiones y talleres, para llenar los <select>.
  const regiones = [
    ...new Set(productos.map((p) => p.region).filter(Boolean)),
  ].sort();
  const talleres = [
    ...new Set(productos.map((p) => p.taller_nombre).filter(Boolean)),
  ].sort();

  const hayFiltrosAplicados = regionAplicada || tallerAplicado;

  const productosFiltrados = productos.filter((p) => {
    const pasaRegion = !regionAplicada || p.region === regionAplicada;
    const pasaTaller = !tallerAplicado || p.taller_nombre === tallerAplicado;
    return pasaRegion && pasaTaller;
  });

  const conUbicacion = productosFiltrados.filter((p) => p.lat && p.lng);

  function aplicarFiltros() {
    setRegionAplicada(regionInput);
    setTallerAplicado(tallerInput);
  }

  function limpiarFiltros() {
    setRegionInput("");
    setTallerInput("");
    setRegionAplicada("");
    setTallerAplicado("");
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Botones toggle — solo visibles en mobile/tablet (ocultos desde lg) */}
      <div className="lg:hidden flex gap-3">
        <button
          onClick={() => setMostrarFiltros((v) => !v)}
          className="flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold text-white"
          style={{ backgroundColor: "var(--verde-musgo)" }}
        >
          {mostrarFiltros ? <X size={18} /> : <SlidersHorizontal size={18} />}
          {mostrarFiltros ? "Ocultar filtros" : "Ver filtros"}
        </button>

        {conUbicacion.length > 0 && (
          <button
            onClick={() => setMostrarMapa((v) => !v)}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold text-white"
            style={{ backgroundColor: "var(--madera)" }}
          >
            {mostrarMapa ? <X size={18} /> : <MapPin size={18} />}
            {mostrarMapa ? "Ocultar mapa" : "Ver mapa"}
          </button>
        )}
      </div>

      {/* Barra lateral — filtros + mapa. Oculta en mobile salvo toggle; siempre visible desde lg. */}
      <div className="lg:order-2 lg:w-[380px] lg:flex-shrink-0 flex flex-col gap-6">
        {/* Panel de filtros */}
        <div
          className={`${mostrarFiltros ? "block" : "hidden"} lg:block rounded-xl p-6 shadow-sm`}
          style={{ backgroundColor: "var(--gris-claro)" }}
        >
          <h3 className="font-bold text-lg mb-4">Filtrar productos</h3>

          <div className="flex flex-col gap-4">
            <div>
              <label
                className="block text-sm mb-1"
                style={{ color: "var(--gris-texto)" }}
              >
                Región
              </label>
              <select
                value={regionInput}
                onChange={(e) => setRegionInput(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 bg-white"
              >
                <option value="">Todas las regiones</option>
                {regiones.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="block text-sm mb-1"
                style={{ color: "var(--gris-texto)" }}
              >
                Taller
              </label>
              <select
                value={tallerInput}
                onChange={(e) => setTallerInput(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 bg-white"
              >
                <option value="">Todos los talleres</option>
                {talleres.map((taller) => (
                  <option key={taller} value={taller}>
                    {taller}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={aplicarFiltros}
              className="rounded-lg px-4 py-2 font-semibold text-white"
              style={{ backgroundColor: "var(--madera)" }}
            >
              Aplicar filtros
            </button>

            {hayFiltrosAplicados && (
              <button
                onClick={limpiarFiltros}
                className="text-sm underline"
                style={{ color: "var(--gris-texto)" }}
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {/* Mapa */}
        {conUbicacion.length > 0 && (
          <div className="lg:sticky lg:top-24">
            <ProductoMap productos={conUbicacion} zoom={5} height="600px" />
          </div>
        )}
      </div>

      {/* Listado de productos */}
      <div className="flex-1 lg:order-1">
        {productosFiltrados.length === 0 ? (
          <p style={{ color: "var(--gris-texto)" }}>
            No hay productos que coincidan con estos filtros.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {productosFiltrados.map((product) => (
              <Link
                key={product.id}
                href={`/mercado/${product.id}`}
                className="block rounded-xl overflow-hidden shadow-sm border border-transparent transition-all duration-200 hover:shadow-md hover:scale-[1.03] hover:border-[var(--madera)]"
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
        )}
      </div>
    </div>
  );
}
