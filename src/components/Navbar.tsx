import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, List, Info, Home, Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useWaste } from '@/contexts/WasteContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', label: 'Beranda', icon: Home },
  { to: '/peta', label: 'Peta Realtime', icon: MapPin },
  { to: '/lokasi', label: 'Daftar Lokasi', icon: List },
  { to: '/tentang', label: 'Tentang', icon: Info },
];

export function Navbar() {
  const location = useLocation();
  const { isAdmin, setIsAdmin } = useWaste();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform">
              <MapPin className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-foreground">Peta Sampah</span>
              <span className="block text-xs text-muted-foreground">Kabupaten Langkat</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link key={item.to} to={item.to}>
                  <motion.div
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="font-medium text-sm">{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Admin Toggle & Mobile Menu */}
          <div className="flex items-center gap-2">
            <Button
              variant={isAdmin ? "default" : "outline"}
              size="sm"
              onClick={() => setIsAdmin(!isAdmin)}
              className={cn(
                "gap-2 transition-all",
                isAdmin && "bg-primary hover:bg-primary/90"
              )}
            >
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">
                {isAdmin ? 'Mode Admin' : 'Login Admin'}
              </span>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-border/50"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-secondary text-muted-foreground"
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
