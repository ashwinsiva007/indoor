'use client';

import React from 'react';
import { ExternalLink, CloudSun, MapPin } from 'lucide-react';
import { SRI_SHAKTHI_CENTER } from '@/data/campusLocations';

interface BottomStatusBarProps {
  currentCoordinates?: { lat: number; lng: number } | null;
}

export default function BottomStatusBar({
  currentCoordinates,
}: BottomStatusBarProps) {
  const lat = currentCoordinates?.lat ?? SRI_SHAKTHI_CENTER.lat;
  const lng = currentCoordinates?.lng ?? SRI_SHAKTHI_CENTER.lng;

  return (
    <div className="absolute bottom-1 right-24 hidden md:flex items-center gap-4 px-3 py-1 bg-white/85 dark:bg-slate-900/85 backdrop-blur-sm rounded-lg text-[10px] text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-800/60 z-20 pointer-events-auto">
      {/* Live Campus Coordinates */}
      <div className="flex items-center gap-1 font-mono">
        <MapPin className="w-3 h-3 text-red-500" />
        <span>
          {lat.toFixed(6)}° N, {lng.toFixed(6)}° E
        </span>
      </div>

      {/* Weather Info */}
      <div className="flex items-center gap-1.5 border-l border-slate-200 dark:border-slate-800 pl-3">
        <CloudSun className="w-3.5 h-3.5 text-amber-500" />
        <span>Coimbatore · 28°C Partly Cloudy</span>
      </div>

      {/* Scale Bar */}
      <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-800 pl-3">
        <div className="w-10 h-1.5 border-b-2 border-l-2 border-r-2 border-slate-600 dark:border-slate-400" />
        <span>50 m</span>
      </div>

      {/* Google Maps link */}
      <a
        href="https://maps.app.goo.gl/3a39i7AbYPSL5FPg8?g_st=sa"
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 font-semibold border-l border-slate-200 dark:border-slate-800 pl-3 transition-colors"
      >
        <span>Open in Google Maps</span>
        <ExternalLink className="w-2.5 h-2.5" />
      </a>
    </div>
  );
}
