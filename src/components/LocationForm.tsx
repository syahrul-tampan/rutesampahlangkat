import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { WasteLocation, WasteStatus, WasteVolume, statusLabels, volumeLabels, regionLabels } from '@/types/waste';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { MapPin, Save, X } from 'lucide-react';

const locationSchema = z.object({
  name: z.string().min(1, 'Nama lokasi wajib diisi'),
  address: z.string().min(1, 'Alamat wajib diisi'),
  latitude: z.number().min(-90).max(90, 'Latitude tidak valid'),
  longitude: z.number().min(-180).max(180, 'Longitude tidak valid'),
  status: z.enum(['pending', 'process', 'complete']),
  volume: z.enum(['small', 'medium', 'large']),
  region: z.string().min(1, 'Wilayah wajib dipilih'),
  googleMapsLink: z.string().optional(),
});

type LocationFormData = z.infer<typeof locationSchema>;

interface LocationFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: LocationFormData) => void;
  initialData?: WasteLocation | null;
  mode: 'add' | 'edit';
}

export function LocationForm({
  open,
  onClose,
  onSubmit,
  initialData,
  mode,
}: LocationFormProps) {
  const form = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: '',
      address: '',
      latitude: 3.7436,
      longitude: 98.4466,
      status: 'pending',
      volume: 'medium',
      region: 'stabat',
      googleMapsLink: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        address: initialData.address,
        latitude: initialData.latitude,
        longitude: initialData.longitude,
        status: initialData.status,
        volume: initialData.volume,
        region: initialData.region,
        googleMapsLink: initialData.googleMapsLink || '',
      });
    } else {
      form.reset({
        name: '',
        address: '',
        latitude: 3.7436,
        longitude: 98.4466,
        status: 'pending',
        volume: 'medium',
        region: 'stabat',
        googleMapsLink: '',
      });
    }
  }, [initialData, form]);

  const handleSubmit = (data: LocationFormData) => {
    onSubmit(data);
    form.reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            {mode === 'add' ? 'Tambah Lokasi Baru' : 'Edit Lokasi'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Lokasi</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: TPS Container Pasar" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: Jl. Merdeka No. 123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder="3.7436"
                        value={field.value !== undefined && field.value !== null ? String(field.value) : ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '' || val === '-') {
                            return;
                          }
                          const num = parseFloat(val);
                          if (!isNaN(num)) {
                            field.onChange(num);
                          }
                        }}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder="98.4466"
                        value={field.value !== undefined && field.value !== null ? String(field.value) : ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '' || val === '-') {
                            return;
                          }
                          const num = parseFloat(val);
                          if (!isNaN(num)) {
                            field.onChange(num);
                          }
                        }}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="volume"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Volume</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih volume" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(volumeLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wilayah</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih wilayah" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(regionLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="googleMapsLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link Google Maps (Opsional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://maps.google.com/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                <X className="w-4 h-4 mr-2" />
                Batal
              </Button>
              <Button type="submit">
                <Save className="w-4 h-4 mr-2" />
                {mode === 'add' ? 'Tambah Lokasi' : 'Simpan Perubahan'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
