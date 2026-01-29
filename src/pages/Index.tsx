import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Trash2, Globe, Clock, Shield, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useWaste } from '@/contexts/WasteContext';
import { StatsGrid } from '@/components/StatsCard';
import heroBg from '@/assets/hero-bg.webp';
import logoDlh from '@/assets/logo-dlh.png';

const features = [
  {
    icon: MapPin,
    title: 'Peta Interaktif',
    description: 'Lihat lokasi sampah di peta dengan marker berwarna berdasarkan status',
  },
  {
    icon: Clock,
    title: 'Pembaruan Realtime',
    description: 'Data diperbarui secara otomatis tanpa perlu refresh halaman',
  },
  {
    icon: Globe,
    title: 'Akses Mudah',
    description: 'Akses dari mana saja melalui browser web di perangkat apapun',
  },
  {
    icon: Shield,
    title: 'Kelola Data',
    description: 'Admin dapat menambah, mengedit, dan menghapus lokasi sampah',
  },
];

export default function Index() {
  const { stats, lastUpdate } = useWaste();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/70 to-primary/90" />
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 mb-6"
            >
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/90 text-sm font-medium">Sistem Pemantauan Realtime</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Pemetaan Lokasi Sampah
              <span className="block text-white/80 mt-2">Kabupaten Langkat</span>
            </h1>

            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Sistem informasi geografis berbasis web untuk memantau kondisi dan persebaran 
              lokasi tempat pembuangan sampah secara realtime di seluruh wilayah Kabupaten Langkat.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/peta">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 shadow-lg gap-2 text-base px-8"
                >
                  <MapPin className="w-5 h-5" />
                  Lihat Peta Realtime
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/lokasi">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 gap-2 text-base"
                >
                  <Trash2 className="w-5 h-5" />
                  Daftar Lokasi
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              className="fill-background"
            />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 -mt-8 relative z-10">
        <div className="container mx-auto px-4">
          <StatsGrid stats={stats} />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Fitur Unggulan
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Sistem pemantauan sampah yang dilengkapi dengan berbagai fitur untuk memudahkan pengelolaan
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full card-elevated hover:shadow-elevated transition-all group">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border/50">
              <Trash2 className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Mulai Pantau Lokasi Sampah
              </h2>
              <p className="text-muted-foreground mb-6">
                Lihat kondisi terkini dari semua lokasi tempat pembuangan sampah 
                di Kabupaten Langkat melalui peta interaktif.
              </p>
              <Link to="/peta">
                <Button size="lg" className="gap-2">
                  Buka Peta Realtime
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img 
                src={logoDlh} 
                alt="Logo DLH" 
                className="w-10 h-10 object-contain"
              />
              <div>
                <span className="font-semibold text-foreground">Peta Sampah Langkat</span>
                <p className="text-xs text-muted-foreground">Sistem Informasi Geografis</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Proyek Mata Kuliah - Pemetaan Lokasi Sampah Berbasis Web
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
