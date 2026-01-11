"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// 修复 Leaflet 默认图标问题
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  country?: string;
  city?: string;
  date?: string;
  notes?: string;
}

interface MapComponentProps {
  locations: Location[];
  onAddLocation: (location: Omit<Location, "id">) => void;
}

function AddMarkerOnClick({ onAdd }: { onAdd: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onAdd(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MapComponent({ locations, onAddLocation }: MapComponentProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddMarker = async (lat: number, lng: number) => {
    // 使用 Nominatim 反向地理编码获取地点名称
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();

      const name = data.address?.city ||
                   data.address?.town ||
                   data.address?.village ||
                   data.address?.country ||
                   "未知地点";

      const city = data.address?.city ||
                   data.address?.town ||
                   data.address?.village;

      const country = data.address?.country;

      const newLocation = {
        name,
        lat,
        lng,
        city,
        country,
        date: new Date().toISOString(),
      };

      onAddLocation(newLocation);
    } catch (error) {
      console.error("获取地点信息失败:", error);

      // 如果 API 失败，使用坐标作为名称
      const newLocation = {
        name: `位置 (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
        lat,
        lng,
        date: new Date().toISOString(),
      };

      onAddLocation(newLocation);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      className="h-full w-full"
      style={{ background: "#f0f0f0" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <AddMarkerOnClick onAdd={handleAddMarker} />

      {locations.map((location) => (
        <Marker key={location.id} position={[location.lat, location.lng]}>
          <Popup>
            <div className="p-2">
              <h3 className="font-bold text-lg mb-1">{location.name}</h3>
              {location.date && (
                <p className="text-sm text-gray-600">📅 {location.date}</p>
              )}
              {location.notes && (
                <p className="text-sm mt-2">{location.notes}</p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
