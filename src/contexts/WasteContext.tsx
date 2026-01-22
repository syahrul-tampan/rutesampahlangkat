import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { WasteLocation, WasteStatus, WasteVolume } from '@/types/waste';
import { initialWasteLocations } from '@/data/wasteLocations';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface WasteContextType {
  locations: WasteLocation[];
  isAdmin: boolean;
  addLocation: (location: Omit<WasteLocation, 'id' | 'lastUpdated'>) => void;
  updateLocation: (id: string, updates: Partial<WasteLocation>) => void;
  deleteLocation: (id: string) => void;
  updateStatus: (id: string, status: WasteStatus) => void;
  getLocationById: (id: string) => WasteLocation | undefined;
  searchLocations: (query: string) => WasteLocation[];
  filterByStatus: (status: WasteStatus | 'all') => WasteLocation[];
  filterByRegion: (region: string | 'all') => WasteLocation[];
  lastUpdate: Date;
  stats: {
    total: number;
    pending: number;
    process: number;
    complete: number;
  };
}

const WasteContext = createContext<WasteContextType | undefined>(undefined);

export function WasteProvider({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAuth();
  const [locations, setLocations] = useState<WasteLocation[]>(initialWasteLocations);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate realtime updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLocations(prev => {
        const updated = [...prev];
        // Randomly update 1-3 locations
        const numUpdates = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < numUpdates; i++) {
          const randomIndex = Math.floor(Math.random() * updated.length);
          const statuses: WasteStatus[] = ['pending', 'process', 'complete'];
          const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
          
          if (updated[randomIndex].status !== newStatus) {
            updated[randomIndex] = {
              ...updated[randomIndex],
              status: newStatus,
              lastUpdated: new Date(),
            };
          }
        }
        return updated;
      });
      setLastUpdate(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const addLocation = useCallback((location: Omit<WasteLocation, 'id' | 'lastUpdated'>) => {
    const newLocation: WasteLocation = {
      ...location,
      id: Date.now().toString(),
      lastUpdated: new Date(),
    };
    setLocations(prev => [...prev, newLocation]);
    setLastUpdate(new Date());
    toast.success('Lokasi berhasil ditambahkan!');
  }, []);

  const updateLocation = useCallback((id: string, updates: Partial<WasteLocation>) => {
    setLocations(prev =>
      prev.map(loc =>
        loc.id === id
          ? { ...loc, ...updates, lastUpdated: new Date() }
          : loc
      )
    );
    setLastUpdate(new Date());
    toast.success('Lokasi berhasil diperbarui!');
  }, []);

  const deleteLocation = useCallback((id: string) => {
    setLocations(prev => prev.filter(loc => loc.id !== id));
    setLastUpdate(new Date());
    toast.success('Lokasi berhasil dihapus!');
  }, []);

  const updateStatus = useCallback((id: string, status: WasteStatus) => {
    updateLocation(id, { status });
  }, [updateLocation]);

  const getLocationById = useCallback((id: string) => {
    return locations.find(loc => loc.id === id);
  }, [locations]);

  const searchLocations = useCallback((query: string) => {
    const lowerQuery = query.toLowerCase();
    return locations.filter(
      loc =>
        loc.name.toLowerCase().includes(lowerQuery) ||
        loc.address.toLowerCase().includes(lowerQuery)
    );
  }, [locations]);

  const filterByStatus = useCallback((status: WasteStatus | 'all') => {
    if (status === 'all') return locations;
    return locations.filter(loc => loc.status === status);
  }, [locations]);

  const filterByRegion = useCallback((region: string | 'all') => {
    if (region === 'all') return locations;
    return locations.filter(loc => loc.region === region);
  }, [locations]);

  const stats = {
    total: locations.length,
    pending: locations.filter(l => l.status === 'pending').length,
    process: locations.filter(l => l.status === 'process').length,
    complete: locations.filter(l => l.status === 'complete').length,
  };

  return (
    <WasteContext.Provider
      value={{
        locations,
        isAdmin,
        addLocation,
        updateLocation,
        deleteLocation,
        updateStatus,
        getLocationById,
        searchLocations,
        filterByStatus,
        filterByRegion,
        lastUpdate,
        stats,
      }}
    >
      {children}
    </WasteContext.Provider>
  );
}

export function useWaste() {
  const context = useContext(WasteContext);
  if (context === undefined) {
    throw new Error('useWaste must be used within a WasteProvider');
  }
  return context;
}
