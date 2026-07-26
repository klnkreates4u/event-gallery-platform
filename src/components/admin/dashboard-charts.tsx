'use client';

import React from 'react';

export interface BarChartProps {
  data: { label: string; value: number }[];
  color?: string;
  height?: number;
  className?: string;
}

export function BarChart({ data, color = '#7B1E2B', height = 120, className = '' }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className={`flex items-end gap-2 ${className}`} style={{ height }}>
      {data.map((item, i) => {
        const barH = Math.max((item.value / max) * (height - 24), 4);
        return (
          <div
            key={i}
            className="flex flex-col items-center justify-end gap-1 flex-1 min-w-0 group"
            title={`${item.label}: ${item.value.toLocaleString()}`}
          >
            <div
              className="w-full rounded-t-sm transition-all duration-500 ease-out opacity-80 group-hover:opacity-100"
              style={{ height: barH, backgroundColor: color }}
            />
            <span className="text-[9px] text-muted-gray font-medium truncate max-w-full">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
  className?: string;
}

export function DonutChart({ data, size = 100, className = '' }: DonutChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className={`flex items-center gap-6 ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="flex-shrink-0">
        {data.map((slice, i) => {
          const pct = slice.value / total;
          const dash = pct * circumference;
          const gap = circumference - dash;
          const rotation = (offset / total) * 360 - 90;
          offset += slice.value;
          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={slice.color}
              strokeWidth={10}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={circumference * 0.25}
              transform={`rotate(${rotation} ${size / 2} ${size / 2})`}
              className="transition-all duration-500"
            />
          );
        })}
        <circle cx={size / 2} cy={size / 2} r={radius - 6} fill="currentColor" className="text-white dark:text-neutral-900" />
      </svg>

      <div className="space-y-1.5 text-xs">
        {data.map((slice, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: slice.color }} />
            <span className="text-muted-gray">{slice.label}</span>
            <span className="font-semibold text-primary-black dark:text-soft-cream ml-auto pl-3">{slice.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
