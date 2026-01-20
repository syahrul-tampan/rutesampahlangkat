import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Clock, RefreshCw } from 'lucide-react';
import { useWaste } from '@/contexts/WasteContext';
import { WasteMap } from '@/components/WasteMap';
import { LocationCard } from '@/components/LocationCard';
import { LocationForm } from '@/components/LocationForm';
import { StatusLegend } from '@/components/StatusLegend';
import { StatsGrid } from '@/components/StatsCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { WasteLocation, WasteStatus, statusLabels, regionLabels } from '@/types/waste';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function MapPage() {
  const {
    locations,
    isAdmin,
    addLocation,
    updateLocation,
    deleteLocation,
    searchLocations,
    filterByStatus,
    filterByRegion,
    lastUpdate,
    stats,
  } = useWaste();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<WasteStatus | 'all'>('all');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<WasteLocation | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<WasteLocation | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<string | null>(null);

  // Filter locations
  const filteredLocations = useMemo(() => {
    let result = locations;

    if (searchQuery) {
      result = searchLocations(searchQuery);
    }

    if (statusFilter !== 'all') {
      result = result.filter((loc) => loc.status === statusFilter);
    }

    if (regionFilter !== 'all') {
      result = result.filter((loc) => loc.region === regionFilter);
    }

    return result;
  }, [locations, searchQuery, statusFilter, regionFilter, searchLocations]);

  const handleAddLocation = (data: Omit<WasteLocation, 'id' | 'lastUpdated'>) => {
    addLocation(data);
    setFormOpen(false);
  };

  const handleEditLocation = (data: Omit<WasteLocation, 'id' | 'lastUpdated'>) => {
    if (editingLocation) {
      updateLocation(editingLocation.id, data);
      setEditingLocation(null);
    }
  };

  const handleDeleteConfirm = () => {
    if (locationToDelete) {
      deleteLocation(locationToDelete);
      setLocationToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const openEditForm = (location: WasteLocation) => {
    setEditingLocation(location);
    setFormOpen(true);
  };

  const openDeleteDialog = (id: string) => {
    setLocationToDelete(id);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border/50 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Peta Realtime</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Clock className="w-4 h-4" />
                <span>Update terakhir: {format(lastUpdate, 'dd MMM yyyy, HH:mm:ss', { locale: id })}</span>
                <RefreshCw className="w-4 h-4 animate-spin opacity-50" />
              </div>
            </div>

            {isAdmin && (
              <Button onClick={() => setFormOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Tambah Lokasi
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container mx-auto px-4 py-4">
        <StatsGrid stats={stats} />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 rounded-xl bg-card border border-border/50 space-y-4"
            >
              <h2 className="font-semibold text-foreground">Filter Lokasi</h2>
              
              <Input
                placeholder="Cari nama atau alamat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-2">
                <Select
                  value={statusFilter}
                  onValueChange={(v) => setStatusFilter(v as WasteStatus | 'all')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={regionFilter}
                  onValueChange={setRegionFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Wilayah" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Wilayah</SelectItem>
                    {Object.entries(regionLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <p className="text-sm text-muted-foreground">
                Menampilkan {filteredLocations.length} dari {locations.length} lokasi
              </p>
            </motion.div>

            {/* Location List */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl bg-card border border-border/50 overflow-hidden"
            >
              <div className="p-4 border-b border-border/50">
                <h2 className="font-semibold text-foreground">Daftar Lokasi</h2>
              </div>
              <ScrollArea className="h-[400px]">
                <div className="p-3 space-y-2">
                  {filteredLocations.map((location) => (
                    <LocationCard
                      key={location.id}
                      location={location}
                      compact
                      onClick={(loc) => setSelectedLocation(loc)}
                    />
                  ))}
                  {filteredLocations.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      Tidak ada lokasi ditemukan
                    </p>
                  )}
                </div>
              </ScrollArea>
            </motion.div>
          </div>

          {/* Map */}
          <div className="lg:col-span-2 space-y-4">
            <StatusLegend />
            <WasteMap
              locations={filteredLocations}
              selectedLocationId={selectedLocation?.id}
              onLocationSelect={setSelectedLocation}
              className="h-[600px]"
            />
          </div>
        </div>
      </div>

      {/* Location Form Modal */}
      <LocationForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingLocation(null);
        }}
        onSubmit={editingLocation ? handleEditLocation : handleAddLocation}
        initialData={editingLocation}
        mode={editingLocation ? 'edit' : 'add'}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Lokasi?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus lokasi ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
