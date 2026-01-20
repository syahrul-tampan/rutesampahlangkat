import { useMemo, useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import { motion } from 'framer-motion';
import { WasteLocation, statusLabels, volumeLabels } from '@/types/waste';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

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
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  const icons = useMemo(() => ({
    pending: createCustomIcon('pending'),
    process: createCustomIcon('process'),
    complete: createCustomIcon('complete'),
  }), []);

  // Default center (Stabat, Langkat)
  const defaultCenter: [number, number] = [3.7436, 98.4466];

  const createPopupContent = useCallback((location: WasteLocation) => {
    const statusColors = {
      pending: '#ef4444',
      process: '#eab308',
      complete: '#22c55e',
    };
    
    const statusBgColors = {
      pending: '#fef2f2',
      process: '#fefce8',
      complete: '#f0fdf4',
    };

    return `
      <div style="padding: 4px; min-width: 250px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 12px;">
          <h3 style="font-weight: 600; font-size: 14px; margin: 0; color: #1a1a1a; line-height: 1.3;">
            ${location.name}
          </h3>
          <span style="
            padding: 2px 8px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 500;
            background-color: ${statusBgColors[location.status]};
            color: ${statusColors[location.status]};
            border: 1px solid ${statusColors[location.status]}30;
            white-space: nowrap;
          ">
            ${statusLabels[location.status]}
          </span>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 8px; font-size: 13px; color: #666;">
          <div style="display: flex; align-items: flex-start; gap: 6px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: 2px;">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span>${location.address}</span>
          </div>
          
          <div style="display: flex; align-items: center; gap: 6px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m7.5 4.27 9 5.15"/>
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
              <path d="m3.3 7 8.7 5 8.7-5"/>
              <path d="M12 22V12"/>
            </svg>
            <span style="
              padding: 2px 8px;
              border-radius: 4px;
              font-size: 11px;
              background-color: #f1f5f9;
              color: #475569;
            ">
              ${volumeLabels[location.volume]}
            </span>
          </div>
          
          <div style="display: flex; align-items: center; gap: 6px; font-size: 11px; color: #888;">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>Update: ${format(new Date(location.lastUpdated), 'dd MMM yyyy, HH:mm', { locale: id })}</span>
          </div>
        </div>
        
        <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb;">
          <a 
            href="https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}"
            target="_blank"
            style="
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 6px;
              width: 100%;
              padding: 8px 12px;
              background: linear-gradient(135deg, #22c55e, #16a34a);
              color: white;
              border-radius: 6px;
              text-decoration: none;
              font-size: 13px;
              font-weight: 500;
            "
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="3 11 22 2 13 21 11 13 3 11"/>
            </svg>
            Petunjuk Arah
          </a>
        </div>
      </div>
    `;
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current).setView(defaultCenter, 12);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update markers when locations change
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    const currentMarkers = markersRef.current;

    // Remove markers that no longer exist
    currentMarkers.forEach((marker, id) => {
      if (!locations.find(l => l.id === id)) {
        marker.remove();
        currentMarkers.delete(id);
      }
    });

    // Add or update markers
    locations.forEach(location => {
      const existingMarker = currentMarkers.get(location.id);
      
      if (existingMarker) {
        // Update existing marker position and icon
        existingMarker.setLatLng([location.latitude, location.longitude]);
        existingMarker.setIcon(icons[location.status]);
        existingMarker.getPopup()?.setContent(createPopupContent(location));
      } else {
        // Create new marker
        const marker = L.marker([location.latitude, location.longitude], {
          icon: icons[location.status]
        })
          .addTo(map)
          .bindPopup(createPopupContent(location), {
            minWidth: 280,
            maxWidth: 320,
            className: 'custom-popup'
          });
        
        marker.on('click', () => {
          onLocationSelect?.(location);
        });

        currentMarkers.set(location.id, marker);
      }
    });

    // Fit bounds if there are locations
    if (locations.length > 0) {
      const bounds = L.latLngBounds(
        locations.map(loc => [loc.latitude, loc.longitude])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [locations, icons, createPopupContent, onLocationSelect]);

  // Handle selected location
  useEffect(() => {
    if (!mapRef.current || !selectedLocationId) return;

    const location = locations.find(l => l.id === selectedLocationId);
    if (location) {
      mapRef.current.setView([location.latitude, location.longitude], 16, {
        animate: true,
      });
      
      const marker = markersRef.current.get(selectedLocationId);
      if (marker) {
        marker.openPopup();
      }
    }
  }, [selectedLocationId, locations]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn("relative rounded-xl overflow-hidden shadow-card", className)}
    >
      <div 
        ref={mapContainerRef} 
        className="h-full w-full min-h-[400px]"
        style={{ zIndex: 1 }}
      />
    </motion.div>
  );
}
