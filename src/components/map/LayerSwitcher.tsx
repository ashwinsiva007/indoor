'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Layers, Map as MapIcon, Globe, Moon, Mountain, Check, ShieldCheck } from 'lucide-react';
import { MapLayerType } from './GoogleMapView';

interface LayerSwitcherProps {
  activeLayer: MapLayerType;
  onChangeLayer: (layer: MapLayerType) => void;
  showBoundary: boolean;
  onToggleBoundary: () => void;
}

export default function LayerSwitcher({
  activeLayer,
  onChangeLayer,
  showBoundary,
  onToggleBoundary,
}: LayerSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const layers: { id: MapLayerType; label: string; icon: any; preview: string }[] = [
    {
      id: 'streets',
      label: 'Default Vector',
      icon: MapIcon,
      preview: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=200&auto=format&fit=crop&q=80',
    },
    {
      id: 'satellite',
      label: 'Satellite View',
      icon: Globe,
      preview: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=200&auto=format&fit=crop&q=80',
    },
    {
      id: 'dark',
      label: 'Dark Mode',
      icon: Moon,
      preview: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=200&auto=format&fit=crop&q=80',
    },
    {
      id: 'terrain',
      label: 'Terrain / OSM',
      icon: Mountain,
      preview: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div ref={containerRef} className="absolute bottom-6 left-4 z-30">
      {/* Expanded Layers Popup */}
      {isOpen && (
        <div className="mb-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-3.5 shadow-2xl border border-slate-200/80 dark:border-slate-800/80 w-64 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="text-xs font-bold text-slate-800 dark:text-slate-100 mb-2.5 flex items-center justify-between">
            <span>Map Layers & Details</span>
            <Layers className="w-3.5 h-3.5 text-blue-500" />
          </div>

          {/* Layer Options Grid */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            {layers.map((layer) => {
              const isSelected = activeLayer === layer.id;
              const Icon = layer.icon;
              return (
                <button
                  key={layer.id}
                  onClick={() => onChangeLayer(layer.id)}
                  className={`relative rounded-xl overflow-hidden border text-left p-1.5 flex flex-col items-center gap-1 transition-all ${
                    isSelected
                      ? 'border-blue-600 ring-2 ring-blue-500/40 bg-blue-50/50 dark:bg-blue-900/30'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-400 bg-slate-50 dark:bg-slate-800'
                  }`}
                >
                  <div className="w-full h-12 rounded-lg overflow-hidden relative">
                    <img
                      src={layer.preview}
                      alt={layer.label}
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">
                    {layer.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Map Overlay Toggles */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-2.5 space-y-1.5">
            <label className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 p-1.5 rounded-lg cursor-pointer">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                <span>Campus Zone Boundary</span>
              </span>
              <input
                type="checkbox"
                checked={showBoundary}
                onChange={onToggleBoundary}
                className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 accent-blue-600"
              />
            </label>
          </div>
        </div>
      )}

      {/* Floating Layer Toggle Square (Google Maps style) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative w-12 h-12 rounded-2xl overflow-hidden shadow-xl border-2 border-white dark:border-slate-800 focus:outline-none transition-transform active:scale-95"
      >
        <img
          src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=100&auto=format&fit=crop&q=80"
          alt="Layers Preview"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <Layers className="w-5 h-5 text-white drop-shadow-md" />
        </div>
        <div className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] font-bold text-white text-center py-0.5">
          Layers
        </div>
      </button>
    </div>
  );
}
