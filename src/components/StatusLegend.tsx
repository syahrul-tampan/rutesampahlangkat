import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusLegendProps {
  className?: string;
}

export function StatusLegend({ className }: StatusLegendProps) {
  const statuses = [
    { status: 'pending', label: 'Belum Diangkut', color: 'bg-red-500' },
    { status: 'process', label: 'Dalam Proses', color: 'bg-yellow-500' },
    { status: 'complete', label: 'Selesai', color: 'bg-green-500' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-wrap items-center gap-3 p-3 rounded-lg bg-card/80 backdrop-blur border border-border/50",
        className
      )}
    >
      <span className="text-sm font-medium text-muted-foreground">Status:</span>
      {statuses.map(({ status, label, color }) => (
        <div key={status} className="flex items-center gap-1.5">
          <div className={cn("w-3 h-3 rounded-full shadow-sm", color)} />
          <span className="text-sm text-foreground">{label}</span>
        </div>
      ))}
    </motion.div>
  );
}
