'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Compass, Sparkles, ArrowRight, ShieldCheck, Zap, Layers } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-24 pb-16 px-6 max-w-7xl mx-auto text-center gradient-glow">
      {/* Badge Pill */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 mb-6 shadow-lg shadow-blue-900/20">
        <Sparkles className="w-4 h-4 text-cyan-400" />
        <span>Next-Gen Indoor Navigation SaaS MVP</span>
      </div>

      {/* Main Title & Tagline */}
      <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
        Seamless Indoor Wayfinding & <br />
        <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent">
          Real-Time Floor Map Routing
        </span>
      </h1>

      <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
        Transform static architectural blueprints into intelligent, turn-by-turn interactive indoor maps for universities, hospitals, corporate tech parks, and venues.
      </p>

      {/* CTA Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link href="/dashboard">
          <Button variant="primary" size="lg" icon={<Compass className="w-5 h-5" />} className="w-full sm:w-auto glow-blue">
            Launch Platform Dashboard
          </Button>
        </Link>
        <Link href="/dashboard/navigation">
          <Button variant="outline" size="lg" icon={<ArrowRight className="w-5 h-5" />} className="w-full sm:w-auto">
            Test Interactive Route Finder
          </Button>
        </Link>
      </div>

      {/* Trust Badges */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs font-medium text-slate-500">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Sub-Meter Wayfinding Precision</span>
        </div>
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Multi-Floor Graph Mesh</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>ADA Wheelchair Accessible</span>
        </div>
      </div>
    </section>
  );
};
