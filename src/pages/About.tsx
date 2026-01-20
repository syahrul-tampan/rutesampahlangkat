import { motion } from 'framer-motion';
import { MapPin, Globe, RefreshCw, Database, Users, Code, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const technologies = [
  { name: 'React', description: 'Library JavaScript untuk membangun antarmuka pengguna' },
  { name: 'Leaflet', description: 'Library JavaScript open-source untuk peta interaktif' },
  { name: 'TypeScript', description: 'Superset JavaScript dengan tipe data statis' },
  { name: 'Tailwind CSS', description: 'Framework CSS utility-first untuk desain modern' },
];

const features = [
  'Peta interaktif dengan marker lokasi sampah',
  'Pembaruan data secara realtime tanpa refresh halaman',
  'Filter dan pencarian lokasi berdasarkan status dan wilayah',
  'Panel admin untuk manajemen data lokasi',
  'Tampilan responsif untuk desktop dan mobile',
  'Legenda status dengan warna berbeda',
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-16 hero-gradient">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Tentang Sistem Pemetaan
            </h1>
            <p className="text-lg text-white/80">
              Sistem Informasi Geografis berbasis web untuk pemantauan lokasi sampah 
              di Kabupaten Langkat secara realtime.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Deskripsi Proyek */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Deskripsi Proyek
              </h2>
              <div className="prose prose-gray max-w-none text-muted-foreground">
                <p className="text-lg leading-relaxed">
                  Website Pemetaan Lokasi Sampah Kabupaten Langkat adalah proyek mata kuliah yang 
                  bertujuan untuk membangun sistem informasi geografis berbasis web. Sistem ini 
                  memungkinkan pengguna untuk memantau kondisi dan persebaran lokasi tempat 
                  pembuangan sampah (TPS) secara realtime.
                </p>
                <p className="leading-relaxed mt-4">
                  Melalui peta interaktif, pengguna dapat melihat status terkini dari setiap lokasi 
                  sampah, volume sampah, serta waktu pembaruan terakhir. Sistem ini menggunakan 
                  konsep realtime berbasis web, dimana data diperbarui secara berkala tanpa perlu 
                  memuat ulang halaman.
                </p>
              </div>
            </motion.div>

            {/* Konsep Realtime */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <RefreshCw className="w-6 h-6 text-primary" />
                Konsep Realtime
              </h2>
              <Card className="card-elevated">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Sistem ini menggunakan konsep <strong>realtime berbasis web</strong> dengan 
                      karakteristik sebagai berikut:
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                          <CheckCircle className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-muted-foreground">
                          <strong className="text-foreground">Pembaruan Otomatis:</strong> Website 
                          secara berkala mengambil data terbaru dari server setiap 30 detik.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                          <CheckCircle className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-muted-foreground">
                          <strong className="text-foreground">Tanpa Reload:</strong> Marker peta 
                          diperbarui tanpa perlu memuat ulang halaman browser.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                          <CheckCircle className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-muted-foreground">
                          <strong className="text-foreground">Berbasis Web:</strong> Tidak menggunakan 
                          perangkat IoT, melainkan data dikelola melalui sistem manajemen web.
                        </span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Fitur */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Fitur Sistem
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-4 rounded-xl bg-secondary/30 border border-border/50"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Teknologi */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Code className="w-6 h-6 text-primary" />
                Teknologi yang Digunakan
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {technologies.map((tech, index) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="card-elevated h-full">
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-foreground mb-1">{tech.name}</h3>
                        <p className="text-sm text-muted-foreground">{tech.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Info Proyek */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-xl bg-primary/5 border border-primary/20"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Informasi Proyek</h3>
                  <p className="text-muted-foreground">
                    Proyek ini dikembangkan sebagai tugas mata kuliah untuk mendemonstrasikan 
                    implementasi Sistem Informasi Geografis (GIS) berbasis web dengan konsep 
                    pembaruan data realtime. Website ini dapat digunakan sebagai referensi untuk 
                    pengembangan sistem pemantauan lokasi berbasis peta.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2024 Pemetaan Lokasi Sampah Kabupaten Langkat - Proyek Mata Kuliah
          </p>
        </div>
      </footer>
    </div>
  );
}
