import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import * as L from 'leaflet';
import type { LeafletMouseEvent } from 'leaflet';

// react-leaflet TS types sometimes differ across versions in this repo; alias to any to avoid prop type errors
const AnyMapContainer: any = MapContainer;
const AnyTileLayer: any = TileLayer;
const AnyMarker: any = Marker;

const createIcon = (color: string, label = 'Vị trí') =>
  L.divIcon({
    html: `
      <div style="display:flex;align-items:center;gap:6px;white-space:nowrap">
        <span style="width:10px;height:10px;border-radius:50%;background:${color};display:inline-block;flex-shrink:0"></span>
        <span style="font-size:12px;color:#222;font-weight:500">${label}</span>
      </div>
    `,
    className: '',
    iconSize: [90, 24],
    iconAnchor: [10, 12],
  });
import { MapPin, Plus, Minus, Maximize2, Navigation, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Separator } from './ui/separator';

interface Grave {
  id: number | string;
  name: string;
  years?: string;
  latitude: number;
  longitude: number;
  status?: 'verified' | 'unverified' | string;
  description?: string;
}

interface MapAreaProps {
  onMarkerClick: (marker: Grave) => void;
  selectedMarkerId?: string | number | null;
  addMode?: boolean;
  onMapClick?: (latlng: { latitude: number; longitude: number }) => void;
  selectedAddCoords?: { latitude: number; longitude: number } | null;
  refreshSignal?: number;
}

export function MapArea({ onMarkerClick, selectedMarkerId, addMode = false, onMapClick, selectedAddCoords, refreshSignal }: MapAreaProps) {
  const [graves, setGraves] = useState<Grave[]>([]);
  const [loading, setLoading] = useState(false);
  const [showLayers, setShowLayers] = useState({
    verified: true,
    unverified: true,
    routes: false,
    cemeteries: true,
  });

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch('/api/graves');
        if (res.ok) {
          const data = await res.json();
          const mapped = data.map((g: any) => ({
            ...g,
            id: g.id?.toString(),
            latitude: Number(g.latitude),
            longitude: Number(g.longitude),
          }));
          setGraves(mapped);
        } else {
          console.error('Failed to fetch graves', res.status);
        }
      } catch (e) {
        console.error('Error fetching graves', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [refreshSignal]);

  const center = useMemo(() => {
    if (graves.length > 0) return [graves[0].latitude, graves[0].longitude] as [number, number];
    return [10.8231, 106.6297] as [number, number];
  }, [graves]);

  function MapClickHandler() {
    useMapEvents({
      click(e: any) {
        if (addMode && onMapClick) {
          onMapClick({ latitude: e.latlng.lat, longitude: e.latlng.lng });
        }
      },
    });
    return null;
  }

  const getColor = (status?: string) => {
    switch (status) {
      case 'verified':
        return '#FF4D73';
      case 'unverified':
        return '#2FB7EC';
      default:
        return '#8B5CF6';
    }
  };

  return (
    <div className="flex-1 relative bg-[#F6F6F7] overflow-hidden">
      {/* Ensure the map is behind floating UI; leaflets uses absolute positioning so set a base z-index */}
    <AnyMapContainer center={center} zoom={12} className="h-full w-full" style={{ zIndex: 0 }}>
          <AnyTileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler />

        {/* Temporary marker when in add mode */}
        {selectedAddCoords && (
          <AnyMarker
            position={[selectedAddCoords.latitude, selectedAddCoords.longitude]}
            icon={createIcon('#000')}
          />
        )}

        {graves.map((g: Grave) => {
          const show = g.status === 'verified' ? showLayers.verified : showLayers.unverified;
          if (!show) return null;
          return (
            <AnyMarker
              key={g.id}
              position={[g.latitude, g.longitude]}
              icon={createIcon(getColor(g.status))}
              eventHandlers={{ click: () => onMarkerClick(g) }}
            />
          );
        })}
  </AnyMapContainer>

  <Card className="absolute top-6 right-6 p-4 shadow-lg border-[#E6E6EA] bg-white/95 backdrop-blur-sm" style={{ zIndex: 2000 }}>
        <div className="space-y-4">
          <h3 className="font-medium">Chú thích</h3>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getColor('verified') }}></div>
              <span className="text-sm">Đã xác minh</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getColor('unverified') }}></div>
              <span className="text-sm">Chưa xác minh</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getColor('cluster') }}></div>
              <span className="text-sm">Nhiều mộ</span>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Hiển thị lớp</h4>
            <div className="space-y-1">
              {Object.entries(showLayers).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{key}</span>
                  <Button variant="ghost" size="sm" onClick={() => setShowLayers((prev) => ({ ...prev, [key]: !value }))}>
                    {value ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

  <div className="absolute bottom-6 right-6 flex flex-col gap-2" style={{ zIndex: 2000 }}>
        <Button size="icon" variant="outline" className="bg-white shadow-md">
          <Navigation className="w-4 h-4" />
        </Button>
        <Button size="icon" variant="outline" className="bg-white shadow-md">
          <Plus className="w-4 h-4" />
        </Button>
        <Button size="icon" variant="outline" className="bg-white shadow-md">
          <Minus className="w-4 h-4" />
        </Button>
        <Button size="icon" variant="outline" className="bg-white shadow-md">
          <Maximize2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}