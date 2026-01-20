import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, MapPin, Grid, List as ListIcon } from 'lucide-react';
import { useWaste } from '@/contexts/WasteContext';
import { LocationCard } from '@/components/LocationCard';
import { LocationForm } from '@/components/LocationForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
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
import { WasteLocation, WasteStatus, statusLabels, volumeLabels, regionLabels } from '@/types/waste';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Edit, Trash2 } from 'lucide-react';

export default function LocationList() {
  const {
    locations,
    isAdmin,
    addLocation,
    updateLocation,
    deleteLocation,
    searchLocations,
  } = useWaste();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<WasteStatus | 'all'>('all');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
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

  const statusStyles = {
    pending: 'status-pending',
    process: 'status-process',
    complete: 'status-complete',
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border/50 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <MapPin className="w-6 h-6 text-primary" />
                Daftar Lokasi Sampah
              </h1>
              <p className="text-muted-foreground mt-1">
                Total {filteredLocations.length} lokasi dari {locations.length} lokasi
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex items-center border border-border rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                >
                  <ListIcon className="w-4 h-4" />
                </Button>
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
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row gap-4 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama atau alamat lokasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as WasteStatus | 'all')}
          >
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter Status" />
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

          <Select value={regionFilter} onValueChange={setRegionFilter}>
            <SelectTrigger className="w-full md:w-64">
              <SelectValue placeholder="Filter Wilayah" />
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
        </motion.div>

        {/* Content */}
        {viewMode === 'grid' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredLocations.map((location) => (
              <LocationCard
                key={location.id}
                location={location}
                isAdmin={isAdmin}
                onEdit={openEditForm}
                onDelete={openDeleteDialog}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border border-border/50 overflow-hidden bg-card"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Lokasi</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead>Wilayah</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Volume</TableHead>
                  <TableHead>Update Terakhir</TableHead>
                  {isAdmin && <TableHead className="text-right">Aksi</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLocations.map((location) => (
                  <TableRow key={location.id}>
                    <TableCell className="font-medium">{location.name}</TableCell>
                    <TableCell className="text-muted-foreground">{location.address}</TableCell>
                    <TableCell>
                      <span className="text-sm">{regionLabels[location.region] || location.region}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusStyles[location.status]}>
                        {statusLabels[location.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>{volumeLabels[location.volume]}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {format(new Date(location.lastUpdated), 'dd MMM, HH:mm', { locale: id })}
                    </TableCell>
                    {isAdmin && (
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditForm(location)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteDialog(location.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        )}

        {filteredLocations.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground">Tidak ada lokasi ditemukan</p>
            <p className="text-muted-foreground">Coba ubah filter pencarian Anda</p>
          </div>
        )}
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
