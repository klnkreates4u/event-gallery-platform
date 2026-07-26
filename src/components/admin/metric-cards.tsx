'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Calendar, Eye, Download, HardDrive, TrendingUp, Clock,
  AlertTriangle, ImageIcon, Video, Wifi, Plus, ArrowUpRight,
} from 'lucide-react';
import { Card } from '@/components/ui/card';

export interface DashboardMetrics {
  totalEvents: number;
  totalMedia: number;
  totalViews: number;
  totalDownloads: number;
  upcomingExpirations: number;
}

export function MetricCards({ metrics }: { metrics: DashboardMetrics }) {
  const METRIC_CARDS = [
    { label: 'Total Events', value: metrics.totalEvents, icon: Calendar, trend: 'All time', up: true },
    { label: 'Total Media', value: metrics.totalMedia.toLocaleString(), icon: ImageIcon, trend: 'Photos & videos', up: true },
    { label: 'Gallery Views', value: metrics.totalViews.toLocaleString(), icon: Eye, trend: 'All time views', up: true },
    { label: 'Downloads', value: metrics.totalDownloads.toLocaleString(), icon: Download, trend: 'All time', up: false },
    { label: 'Expirations', value: metrics.upcomingExpirations, icon: AlertTriangle, trend: 'Within 30 days', up: false },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
      {METRIC_CARDS.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
          >
            <Card className="relative overflow-hidden h-full">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-gray">{card.label}</span>
                <div className="p-2 rounded-button bg-soft-cream dark:bg-neutral-800 text-primary-black dark:text-soft-cream">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-primary-black dark:text-soft-cream font-editorial">
                {card.value}
              </h2>
              <div className={`flex items-center gap-1 text-xs mt-1 ${card.up ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-gray'}`}>
                {card.up ? <TrendingUp className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                <span>{card.trend}</span>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
