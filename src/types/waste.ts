export type WasteStatus = 'pending' | 'process' | 'complete';
export type WasteVolume = 'small' | 'medium' | 'large';

export interface WasteLocation {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  status: WasteStatus;
  volume: WasteVolume;
  lastUpdated: Date;
  region: string;
  googleMapsLink?: string;
}

export const statusLabels: Record<WasteStatus, string> = {
  pending: 'Belum Diangkut',
  process: 'Dalam Proses',
  complete: 'Selesai',
};

export const volumeLabels: Record<WasteVolume, string> = {
  small: 'Kecil',
  medium: 'Sedang',
  large: 'Besar',
};

export const regionLabels: Record<string, string> = {
  'stabat': 'Wilayah Stabat & Sekitarnya',
  'binjai-kuala': 'Wilayah Binjai & Kuala Bingai',
  'pusat-kota': 'Wilayah Kota Stabat (Pusat Kota)',
  'tambahan-kota': 'Wilayah Tambahan Kota',
  'protokol': 'Wilayah Jalan Protokol & Permukiman',
  'timur': 'Wilayah Timur & Perumahan',
  'proklamasi': 'Wilayah Proklamasi & Sekitarnya',
  'selesai-binjai': 'Wilayah Selesai & Binjai',
  'tambahan': 'Lokasi Tambahan',
};
