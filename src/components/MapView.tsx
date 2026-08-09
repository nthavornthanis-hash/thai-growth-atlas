import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Polygon,
  Polyline,
  Tooltip,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { sphereTileUrl } from "@/lib/sphere";
import type { Zone } from "@/lib/zones";
import { useI18n } from "@/lib/i18n";

export interface LayerState {
  heatmap: boolean;
  theos: boolean;
  roads: boolean;
  poi: boolean;
  population: boolean;
  price: boolean;
}

export const PHUKET_CENTER: [number, number] = [7.8804, 98.3923];
const THAILAND_CENTER: [number, number] = [13.5, 100.9];

export const scoreColor = (s: number) =>
  s >= 75
    ? "#0D9488"
    : s >= 60
      ? "#14B8A6"
      : s >= 45
        ? "#F59E0B"
        : s >= 30
          ? "#F97316"
          : "#64748B";

// Mock THEOS-2 AI detected expansion footprints (Phuket focus)
const theosPolygon = (lat: number, lon: number, size: number): [number, number][] => {
  const d = 0.004 + size / 20000;
  return [
    [lat + d, lon - d],
    [lat + d * 0.6, lon + d],
    [lat - d, lon + d * 0.7],
    [lat - d * 0.7, lon - d * 0.9],
  ];
};

const PHUKET_ROADS: [number, number][][] = [
  [
    [8.129, 98.311],
    [8.033, 98.34],
    [7.9857, 98.345],
    [7.9351, 98.3799],
    [7.8845, 98.3888],
    [7.8283, 98.335],
    [7.7793, 98.3244],
  ],
  [
    [7.9126, 98.3325],
    [7.8916, 98.2977],
    [7.846, 98.2963],
  ],
  [
    [7.9977, 98.3006],
    [7.9531, 98.2837],
    [7.9126, 98.3325],
  ],
];

function Recenter({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
}

interface Props {
  zones: Zone[];
  view: "macro" | "micro";
  layers: LayerState;
  selectedId?: string;
  onSelect: (z: Zone) => void;
}

export default function MapView({ zones, view, layers, selectedId, onSelect }: Props) {
  const { lang } = useI18n();
  const micro = view === "micro";
  const center = micro ? PHUKET_CENTER : THAILAND_CENTER;
  const zoom = micro ? 11 : 6;
  const visible = micro ? zones.filter((z) => z.phuket) : zones;

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom
      className="h-full w-full"
      worldCopyJump
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution="&copy; OpenStreetMap, CARTO"
      />
      <TileLayer url={sphereTileUrl()} opacity={0.85} attribution="&copy; GISTDA Sphere" />
      <Recenter center={center} zoom={zoom} />

      {layers.theos &&
        visible.map((z) => (
          <Polygon
            key={`t-${z.id}`}
            positions={theosPolygon(z.lat, z.lon, z.urbanNewBuildings)}
            pathOptions={{ color: "#F59E0B", weight: 1, fillOpacity: 0.22, dashArray: "4 3" }}
          />
        ))}

      {layers.roads &&
        micro &&
        PHUKET_ROADS.map((line, i) => (
          <Polyline
            key={`r-${i}`}
            positions={line}
            pathOptions={{ color: "#38BDF8", weight: 3, opacity: 0.8 }}
          />
        ))}

      {layers.population &&
        visible.map((z) => (
          <CircleMarker
            key={`p-${z.id}`}
            center={[z.lat, z.lon]}
            radius={6 + (z.populationDensity / 4000) * 26}
            pathOptions={{ color: "transparent", fillColor: "#6366F1", fillOpacity: 0.15 }}
          />
        ))}

      {layers.heatmap &&
        visible.map((z) => (
          <CircleMarker
            key={`h-${z.id}`}
            center={[z.lat, z.lon]}
            radius={8 + (z.potential / 100) * 22}
            pathOptions={{
              color: scoreColor(z.potential),
              fillColor: scoreColor(z.potential),
              fillOpacity: 0.32,
              weight: selectedId === z.id ? 3 : 1,
            }}
            eventHandlers={{ click: () => onSelect(z) }}
          />
        ))}

      {visible.map((z) => (
        <CircleMarker
          key={`c-${z.id}`}
          center={[z.lat, z.lon]}
          radius={selectedId === z.id ? 9 : 5}
          pathOptions={{
            color: "#ffffff",
            weight: 1.5,
            fillColor: scoreColor(z.potential),
            fillOpacity: 1,
          }}
          eventHandlers={{ click: () => onSelect(z) }}
        >
          <Tooltip direction="top" offset={[0, -6]}>
            <span className="text-xs font-medium">
              {lang === "th" ? z.tumbonTh : z.tumbonEn} · {z.potential.toFixed(1)}
            </span>
          </Tooltip>
        </CircleMarker>
      ))}

      {layers.poi &&
        visible.flatMap((z) =>
          Array.from({ length: Math.min(8, Math.round(z.poiCount / 6) + 1) }, (_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return (
              <CircleMarker
                key={`poi-${z.id}-${i}`}
                center={[z.lat + Math.sin(a) * 0.012, z.lon + Math.cos(a) * 0.012]}
                radius={3}
                pathOptions={{ color: "#0EA5E9", fillColor: "#0EA5E9", fillOpacity: 0.9 }}
              />
            );
          }),
        )}

      {layers.price &&
        visible.map((z) => (
          <CircleMarker
            key={`pr-${z.id}`}
            center={[z.lat, z.lon]}
            radius={4 + Math.min(1, z.avgAppraisal / 120000) * 30}
            pathOptions={{
              color: "#A855F7",
              weight: 1,
              fillColor: "#A855F7",
              fillOpacity: 0.08,
            }}
          />
        ))}
    </MapContainer>
  );
}