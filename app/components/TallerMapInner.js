"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { Locate } from "lucide-react";

// Fix: Next.js/webpack rompe las rutas de los íconos por defecto de Leaflet.
// Usamos los íconos desde un CDN en vez de copiarlos a /public.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Botón que centra el mapa para que se vean todos los marcadores.
function BotonCentrar({ puntos }) {
  const map = useMap();

  function centrar() {
    if (puntos.length === 0) return;
    const bounds = puntos.map((p) => [Number(p.lat), Number(p.lng)]);
    map.fitBounds(bounds, { padding: [40, 40] });
  }

  return (
    <button
      onClick={centrar}
      title="Centrar mapa"
      className="absolute top-3 right-3 z-[1000] bg-white rounded-lg p-2 shadow-md hover:bg-gray-100 transition-colors"
    >
      <Locate size={20} color="#1a1a1a" />
    </button>
  );
}

export default function TallerMapInner({ talleres, center, zoom = 5, height = "500px" }) {
  const puntos = talleres.filter((t) => t.lat && t.lng);

  const centroMapa =
    center ||
    (puntos.length > 0
      ? [Number(puntos[0].lat), Number(puntos[0].lng)]
      : [-33.45, -70.66]); // Santiago por defecto

  return (
    <div style={{ position: "relative" }}>
      <MapContainer
        center={centroMapa}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height, width: "100%", borderRadius: "0.75rem", zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <BotonCentrar puntos={puntos} />
        {puntos.map((t) => (
          <Marker key={t.id} position={[Number(t.lat), Number(t.lng)]}>
            <Popup>
              <div style={{ textAlign: "center", minWidth: "140px" }}>
                {t.foto_url && (
                  <img
                    src={t.foto_url}
                    alt={t.nombre}
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      margin: "0 auto 6px",
                    }}
                  />
                )}
                <p style={{ fontWeight: "bold", margin: 0 }}>{t.nombre}</p>
                <p style={{ fontSize: "0.8rem", color: "#6b6b6b", margin: "2px 0 6px" }}>
                  {t.oficio}
                </p>
                <Link
                  href={`/talleres/${t.id}`}
                  style={{ color: "#8b5e3c", textDecoration: "underline", fontSize: "0.85rem" }}
                >
                  Ver perfil
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
