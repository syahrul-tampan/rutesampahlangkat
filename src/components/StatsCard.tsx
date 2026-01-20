import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Trash2, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  variant?: 'default' | 'pending' | 'process' | 'complete';
  delay?: number;
}

export function StatCard({
  title,
  value,
  icon,
  trend = 'neutral',
  trendValue,
  variant = 'default',
  delay = 0,
}: StatCardProps) {
  const variantStyles = {
    default: 'bg-card',
    pending: 'bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/20 dark:to-red-900/10',
    process: 'bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-950/20 dark:to-yellow-900/10',
    complete: 'bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10',
  };

  const iconStyles = {
    default: 'bg-primary/10 text-primary',
    pending: 'bg-red-500/10 text-red-600',
    process: 'bg-yellow-500/10 text-yellow-600',
    complete: 'bg-green-500/10 text-green-600',
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-muted-foreground';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1 }}
    >
      <Card className={cn("card-elevated border-border/50", variantStyles[variant])}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-3xl font-bold text-foreground">{value}</p>
              {trendValue && (
                <div className={cn("flex items-center gap-1 text-sm", trendColor)}>
                  <TrendIcon className="w-4 h-4" />
                  <span>{trendValue}</span>
                </div>
              )}
            </div>
            <div className={cn("p-3 rounded-xl", iconStyles[variant])}>
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface StatsGridProps {
  stats: {
    total: number;
    pending: number;
    process: number;
    complete: number;
  };
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Lokasi"
        value={stats.total}
        icon={<Trash2 className="w-6 h-6" />}
        delay={0}
      />
      <StatCard
        title="Belum Diangkut"
        value={stats.pending}
        icon={<AlertCircle className="w-6 h-6" />}
        variant="pending"
        delay={1}
      />
      <StatCard
        title="Dalam Proses"
        value={stats.process}
        icon={<Clock className="w-6 h-6" />}
        variant="process"
        delay={2}
      />
      <StatCard
        title="Selesai"
        value={stats.complete}
        icon={<CheckCircle className="w-6 h-6" />}
        variant="complete"
        delay={3}
      />
    </div>
  );
}
