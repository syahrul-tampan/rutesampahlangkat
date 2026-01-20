import { useMemo, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { motion } from 'framer-motion';
import { WasteLocation, statusLabels, volumeLabels } from '@/types/waste';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Clock, MapPin, Package, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';

// Custom marker icons
const createCustomIcon = (status: 'pending' | 'process' | 'complete') => {
  const colors = {
    pending: '#ef4444',
    process: '#eab308',
    complete: '#22c55e',
  };

  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="
        background-color: ${colors[status]};
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 6h18"/>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
        </svg>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
};

// Map bounds updater component
function MapBoundsUpdater({ locations }: { locations: WasteLocation[] }) {
  const map = useMap();

  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(
        locations.map(loc => [loc.latitude, loc.longitude])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [locations, map]);

  return null;
}

// Selected location handler
function SelectedLocationHandler({ 
  selectedId, 
  locations 
}: { 
  selectedId: string | null;
  locations: WasteLocation[];
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedId) {
      const location = locations.find(l => l.id === selectedId);
      if (location) {
        map.setView([location.latitude, location.longitude], 16, {
          animate: true,
          duration: 0.5,
        });
      }
    }
  }, [selectedId, locations, map]);

  return null;
}

interface WasteMapProps {
  locations: WasteLocation[];
  selectedLocationId?: string | null;
  onLocationSelect?: (location: WasteLocation) => void;
  className?: string;
}

export function WasteMap({
  locations,
  selectedLocationId = null,
  onLocationSelect,
  className,
}: WasteMapProps) {
  const [mapReady, setMapReady] = useState(false);

  const icons = useMemo(() => ({
    pending: createCustomIcon('pending'),
    process: createCustomIcon('process'),
    complete: createCustomIcon('complete'),
  }), []);

  // Default center (Stabat, Langkat)
  const defaultCenter: [number, number] = [3.7436, 98.4466];

  const statusStyles = {
    pending: 'status-pending',
    process: 'status-process',
    complete: 'status-complete',
  };

  const volumeStyles = {
    small: 'volume-small',
    medium: 'volume-medium',
    large: 'volume-large',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn("relative rounded-xl overflow-hidden shadow-card", className)}
    >
      <MapContainer
        center={defaultCenter}
        zoom={12}
        className="h-full w-full min-h-[400px]"
        ref={() => setMapReady(true)}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {mapReady && (
          <>
            <MapBoundsUpdater locations={locations} />
            <SelectedLocationHandler 
              selectedId={selectedLocationId} 
              locations={locations} 
            />
          </>
        )}

        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[location.latitude, location.longitude]}
            icon={icons[location.status]}
            eventHandlers={{
              click: () => onLocationSelect?.(location),
            }}
          >
            <Popup className="custom-popup" minWidth={280} maxWidth={320}>
              <div className="p-1">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-semibold text-foreground text-base leading-tight">
                    {location.name}
                  </h3>
                  <Badge
                    variant="outline"
                    className={cn("shrink-0 text-xs", statusStyles[location.status])}
                  >
                    {statusLabels[location.status]}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{location.address}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <Package className="w-4 h-4 text-muted-foreground" />
                      <Badge variant="secondary" className={cn("text-xs", volumeStyles[location.volume])}>
                        {volumeLabels[location.volume]}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      Update: {format(new Date(location.lastUpdated), 'dd MMM yyyy, HH:mm', { locale: id })}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-border/50">
                  <Button
                    size="sm"
                    className="w-full gap-2"
                    onClick={() => {
                      window.open(
                        `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`,
                        '_blank'
                      );
                    }}
                  >
                    <Navigation className="w-4 h-4" />
                    Petunjuk Arah
                  </Button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </motion.div>
  );
}
