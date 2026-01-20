import { motion } from 'framer-motion';
import { WasteLocation, statusLabels, volumeLabels } from '@/types/waste';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, Package, Edit, Trash2, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface LocationCardProps {
  location: WasteLocation;
  isAdmin?: boolean;
  onEdit?: (location: WasteLocation) => void;
  onDelete?: (id: string) => void;
  onClick?: (location: WasteLocation) => void;
  compact?: boolean;
}

export function LocationCard({
  location,
  isAdmin = false,
  onEdit,
  onDelete,
  onClick,
  compact = false,
}: LocationCardProps) {
  const statusStyles = {
    pending: 'status-pending',
    process: 'status-process',
    complete: 'status-complete',
  };

  const volumeStyles = {
    small: 'volume-small',
    medium: 'volume-medium',
    large: 'volume-large',
  };

  const statusIcon = {
    pending: '🔴',
    process: '🟡',
    complete: '🟢',
  };

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.01 }}
        className="p-3 rounded-lg border border-border/50 bg-card hover:shadow-soft transition-all cursor-pointer"
        onClick={() => onClick?.(location)}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-lg">{statusIcon[location.status]}</span>
            <div className="min-w-0">
              <p className="font-medium text-sm truncate">{location.name}</p>
              <p className="text-xs text-muted-foreground truncate">{location.address}</p>
            </div>
          </div>
          <Badge variant="secondary" className={cn("text-xs shrink-0", volumeStyles[location.volume])}>
            {volumeLabels[location.volume]}
          </Badge>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden card-elevated hover:shadow-elevated transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base font-semibold line-clamp-2">
              {location.name}
            </CardTitle>
            <Badge
              variant="outline"
              className={cn("shrink-0", statusStyles[location.status])}
            >
              {statusLabels[location.status]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
            <span className="line-clamp-2">{location.address}</span>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <Package className="w-4 h-4 text-muted-foreground" />
              <Badge variant="secondary" className={volumeStyles[location.volume]}>
                {volumeLabels[location.volume]}
              </Badge>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-xs">
                {format(new Date(location.lastUpdated), 'dd MMM, HH:mm', { locale: id })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-border/50">
            {location.googleMapsLink && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-1.5"
                asChild
              >
                <a href={location.googleMapsLink} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3.5 h-3.5" />
                  Google Maps
                </a>
              </Button>
            )}
            
            {isAdmin && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit?.(location)}
                  className="gap-1.5"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete?.(location.id)}
                  className="gap-1.5 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
