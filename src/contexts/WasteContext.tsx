import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { WasteLocation, WasteStatus, WasteVolume } from '@/types/waste';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface WasteContextType {
  locations: WasteLocation[];
  isAdmin: boolean;
  isLoading: boolean;
  addLocation: (location: Omit<WasteLocation, 'id' | 'lastUpdated'>) => Promise<void>;
  updateLocation: (id: string, updates: Partial<WasteLocation>) => Promise<void>;
  deleteLocation: (id: string) => Promise<void>;
  updateStatus: (id: string, status: WasteStatus) => Promise<void>;
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
  refetch: () => Promise<void>;
}

const WasteContext = createContext<WasteContextType | undefined>(undefined);

export function WasteProvider({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAuth();
  const [locations, setLocations] = useState<WasteLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Fetch locations from database
  const fetchLocations = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('waste_locations')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      const mappedLocations: WasteLocation[] = (data || []).map((loc) => ({
        id: loc.id,
        name: loc.name,
        address: loc.address,
        latitude: loc.latitude,
        longitude: loc.longitude,
        status: loc.status as WasteStatus,
        volume: loc.volume as WasteVolume,
        region: loc.region,
        googleMapsLink: loc.google_maps_link || undefined,
        lastUpdated: new Date(loc.last_updated),
      }));

      setLocations(mappedLocations);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast.error('Gagal memuat data lokasi');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  // Subscribe to realtime changes
  useEffect(() => {
    const channel = supabase
      .channel('waste_locations_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'waste_locations',
        },
        () => {
          fetchLocations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchLocations]);

  const addLocation = useCallback(async (location: Omit<WasteLocation, 'id' | 'lastUpdated'>) => {
    try {
      const { error } = await supabase.from('waste_locations').insert({
        name: location.name,
        address: location.address,
        latitude: location.latitude,
        longitude: location.longitude,
        status: location.status,
        volume: location.volume,
        region: location.region,
        google_maps_link: location.googleMapsLink || null,
      });

      if (error) throw error;
      toast.success('Lokasi berhasil ditambahkan!');
    } catch (error: any) {
      console.error('Error adding location:', error);
      toast.error(error.message || 'Gagal menambahkan lokasi');
    }
  }, []);

  const updateLocation = useCallback(async (id: string, updates: Partial<WasteLocation>) => {
    try {
      const updateData: Record<string, any> = {};
      
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.address !== undefined) updateData.address = updates.address;
      if (updates.latitude !== undefined) updateData.latitude = updates.latitude;
      if (updates.longitude !== undefined) updateData.longitude = updates.longitude;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.volume !== undefined) updateData.volume = updates.volume;
      if (updates.region !== undefined) updateData.region = updates.region;
      if (updates.googleMapsLink !== undefined) updateData.google_maps_link = updates.googleMapsLink;

      const { error } = await supabase
        .from('waste_locations')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      toast.success('Lokasi berhasil diperbarui!');
    } catch (error: any) {
      console.error('Error updating location:', error);
      toast.error(error.message || 'Gagal memperbarui lokasi');
    }
  }, []);

  const deleteLocation = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('waste_locations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Lokasi berhasil dihapus!');
    } catch (error: any) {
      console.error('Error deleting location:', error);
      toast.error(error.message || 'Gagal menghapus lokasi');
    }
  }, []);

  const updateStatus = useCallback(async (id: string, status: WasteStatus) => {
    await updateLocation(id, { status });
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
        isLoading,
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
        refetch: fetchLocations,
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
