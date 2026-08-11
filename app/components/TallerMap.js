"use client";

import dynamic from "next/dynamic";

const TallerMapInner = dynamic(() => import("./TallerMapInner"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full flex items-center justify-center rounded-xl"
      style={{ height: "500px", backgroundColor: "var(--gris-claro)" }}
    >
      <p style={{ color: "var(--gris-texto)" }}>Cargando mapa...</p>
    </div>
  ),
});

export default function TallerMap(props) {
  return <TallerMapInner {...props} />;
}
