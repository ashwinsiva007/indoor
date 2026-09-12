'use client';

import React, { useState } from 'react';
import { X, Eye, Compass, ChevronLeft, ChevronRight, MapPin, Maximize, RotateCcw } from 'lucide-react';
import { CAMPUS_LOCATIONS } from '@/data/campusLocations';

interface StreetViewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StreetViewModal({ isOpen, onClose }: StreetViewModalProps) {
  const [selectedSpotIndex, setSelectedSpotIndex] = useState(0);

  if (!isOpen) return null;

  const panoramas = [
    {
      title: 'Sri Shakthi Main Academic Quadrangle',
      location: 'Administrative Block & Central Lawns',
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1600&auto=format&fit=crop&q=85',
      lat: 11.035635,
      lng: 77.069387,
    },
    {
      title: 'Dr. APJ Abdul Kalam Central Library Plaza',
      location: 'West Academic Plaza',
      image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1600&auto=format&fit=crop&q=85',
      lat: 11.035760,
      lng: 77.069160,
    },
    {
      title: 'Innovation & Robotics Laboratory',
      location: 'Tech Park Research Wing',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1600&auto=format&fit=crop&q=85',
      lat: 11.035820,
      lng: 77.070320,
    },
    {
      title: 'Sri Shakthi Sports Arena & Stadium',
      location: 'Athletic Track & Pavilion',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&auto=format&fit=crop&q=85',
      lat: 11.034620,
      lng: 77.070210,
    },
  ];

  const current = panoramas[selectedSpotIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col animate-in fade-in duration-300">
      {/* Top Street View Bar */}
      <div className="p-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent text-white z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-base leading-tight">{current.title}</h3>
            <div className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{current.location}</span>
              <span>·</span>
              <span>
                Lat: {current.lat.toFixed(6)}, Lng: {current.lng.toFixed(6)}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Panoramic Viewer Area */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        <img
          src={current.image}
          alt={current.title}
          className="w-full h-full object-cover animate-in zoom-in-95 duration-500 filter brightness-95"
        />

        {/* Interactive Street View Controls Overlay */}
        <div className="absolute top-6 right-6 flex flex-col gap-2">
          <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xl">
            <Compass className="w-6 h-6 text-amber-400 animate-spin-slow" />
          </div>
        </div>

        {/* Hotspot Arrows (Left & Right) */}
        <button
          onClick={() =>
            setSelectedSpotIndex((prev) =>
              prev === 0 ? panoramas.length - 1 : prev - 1
            )
          }
          className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center border border-white/20 shadow-2xl transition-transform active:scale-95"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={() =>
            setSelectedSpotIndex((prev) =>
              prev === panoramas.length - 1 ? 0 : prev + 1
            )
          }
          className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center border border-white/20 shadow-2xl transition-transform active:scale-95"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Thumbnail Strip */}
      <div className="p-4 bg-black/80 backdrop-blur-md border-t border-white/10 flex items-center justify-between z-10">
        <div className="text-xs text-slate-300 font-medium">
          Sri Shakthi Campus 360° Walkthrough
        </div>

        <div className="flex items-center gap-2">
          {panoramas.map((p, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedSpotIndex(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedSpotIndex === idx
                  ? 'bg-amber-500 text-white shadow-lg scale-105'
                  : 'bg-white/10 hover:bg-white/20 text-slate-300'
              }`}
            >
              {p.title.split(' ')[0]} {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
