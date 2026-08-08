'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Compass, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';

export const InteractiveTeaser: React.FC = () => {
  return (
    <section className="py-16 px-6 max-w-7xl mx-auto">
      <div className="glass-card rounded-3xl p-8 border border-slate-800/80 shadow-2xl relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Interactive Weekend Prototype</span>
            </div>

            <h2 className="text-3xl font-extrabold text-white tracking-tight leading-snug">
              Experience Real-Time Indoor Route Highlighting
            </h2>

            <p className="text-slate-400 text-sm leading-relaxed">
              Try the live prototype featuring <strong>College Main Block</strong>. Select origin and destination points to visualize sub-second route animations, step-by-step turn guidance, and floor plan editor tools.
            </p>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>Pre-loaded with Ground Floor blueprint graph & rooms</span>
              </div>
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>Supports ADA Wheelchair accessible elevator paths</span>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/dashboard/navigation">
                <Button variant="primary" size="lg" icon={<Sparkles className="w-5 h-5" />}>
                  Open Interactive Map Visualizer
                </Button>
              </Link>
            </div>
          </div>

          {/* Mini Interactive Preview Graphic */}
          <div className="relative w-full h-[320px] rounded-2xl bg-slate-950 border border-slate-800 p-4 blueprint-grid flex flex-col justify-between shadow-inner">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-200">College Main Block (Ground Floor)</span>
              <span className="text-emerald-400 font-mono text-[11px]">Status: Graph Active</span>
            </div>

            <svg viewBox="0 0 500 240" className="w-full h-auto">
              <rect x="20" y="20" width="460" height="200" rx="12" fill="#0f172a" fillOpacity="0.8" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />
              
              {/* Rooms */}
              <rect x="40" y="40" width="100" height="70" rx="6" fill="#1e293b" stroke="#3b82f6" strokeWidth="1" />
              <text x="90" y="80" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="600">Lab 101</text>

              <rect x="360" y="40" width="100" height="70" rx="6" fill="#1e293b" stroke="#10b981" strokeWidth="1" />
              <text x="410" y="80" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="600">Library</text>

              <rect x="200" y="140" width="100" height="60" rx="6" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" />
              <text x="250" y="175" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="600">Entrance</text>

              {/* Animated Path */}
              <path d="M 250 140 L 250 90 L 90 90 L 90 75" fill="none" stroke="#3b82f6" strokeWidth="3" className="animate-route-path" />

              {/* Markers */}
              <circle cx="250" cy="140" r="6" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="90" cy="75" r="6" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />
            </svg>

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>Origin: Main Entrance</span>
              <span className="text-blue-400">Dest: CS Lab 101</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
