'use client';

import React from 'react';
import {
  Plus,
  Minus,
  LocateFixed,
  Compass,
  Ruler,
  Maximize2,
  Box,
  Eye,
  School,
} from 'lucide-react';
import { SRI_SHAKTHI_CENTER } from '@/data/campusLocations';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRecenterCampus: () => void;
  onLocateUser: () => void;
  is3DTilt: boolean;
  onToggle3DTilt: () => void;
  measureMode: boolean;
  onToggleMeasure: () => void;
  measuredDist: number | null;
  onOpenStreetView: () => void;
}

export default function MapControls({
  onZoomIn,
  onZoomOut,
  onRecenterCampus,
  onLocateUser,
  is3DTilt,
  onToggle3DTilt,
  measureMode,
  onToggleMeasure,
  measuredDist,
  onOpenStreetView,
}: MapControlsProps) {
  return (
    <div className="absolute bottom-6 right-4 z-30 flex flex-col items-end gap-2.5">
      {/* Measurement Mode Badge if active */}
      {measureMode && (
        <div className="bg-slate-900 text-white px-3 py-1.5 rounded-xl shadow-xl border border-red-500/50 text-xs flex items-center gap-2 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          <span>Click map to measure: </span>
          <span className="font-bold text-amber-400">
            {measuredDist !== null ? `${measuredDist} m` : 'Select 2 points'}
          </span>
        </div>
      )}

      {/* Street View / 360 Panorama Pegman Button */}
      <button
        onClick={onOpenStreetView}
        title="Open Sri Shakthi 360° Campus Street View"
        className="w-10 h-10 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white shadow-xl flex items-center justify-center transition-transform active:scale-95 group relative"
      >
        <Eye className="w-5 h-5 drop-shadow-sm" />
        <span className="absolute right-12 px-2 py-1 rounded bg-slate-900 text-[10px] font-bold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
          360° Campus View
        </span>
      </button>

      {/* Recenter Sri Shakthi Campus Button */}
      <button
        onClick={onRecenterCampus}
        title="Recenter Sri Shakthi Institute Campus"
        className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-blue-600 dark:text-blue-400 shadow-xl flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-transform active:scale-95"
      >
        <School className="w-5 h-5" />
      </button>

      {/* Measure Distance Ruler Button */}
      <button
        onClick={onToggleMeasure}
        title="Measure Distance on Campus"
        className={`w-10 h-10 rounded-2xl border shadow-xl flex items-center justify-center transition-transform active:scale-95 ${
          measureMode
            ? 'bg-red-600 text-white border-red-500 shadow-red-500/30'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
        }`}
      >
        <Ruler className="w-5 h-5" />
      </button>

      {/* 3D Tilt View Toggle */}
      <button
        onClick={onToggle3DTilt}
        title="Toggle 3D Perspective View"
        className={`w-10 h-10 rounded-2xl border shadow-xl flex items-center justify-center transition-transform active:scale-95 ${
          is3DTilt
            ? 'bg-blue-600 text-white border-blue-500 shadow-blue-500/30'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
        }`}
      >
        <Box className="w-5 h-5" />
      </button>

      {/* GPS Locate Me Button */}
      <button
        onClick={onLocateUser}
        title="Your Location"
        className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 shadow-xl flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-transform active:scale-95"
      >
        <LocateFixed className="w-5 h-5" />
      </button>

      {/* Zoom Control Group (Google Maps style) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col">
        <button
          onClick={onZoomIn}
          title="Zoom in"
          className="w-10 h-10 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-800"
        >
          <Plus className="w-5 h-5" />
        </button>
        <button
          onClick={onZoomOut}
          title="Zoom out"
          className="w-10 h-10 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Minus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
