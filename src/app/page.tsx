import React from 'react';
import Link from 'next/link';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { InteractiveTeaser } from '@/components/landing/InteractiveTeaser';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Map, Compass, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#090d16]">
      {/* Top Header */}
      <header className="sticky top-0 z-50 glass-nav px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Map className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-white tracking-wide block leading-tight">NaviWay</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400">Indoor Platform</span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="hidden sm:block text-xs font-semibold text-slate-300 hover:text-white transition-colors">
            Dashboard
          </Link>
          <Link href="/dashboard/navigation" className="hidden sm:block text-xs font-semibold text-slate-300 hover:text-white transition-colors">
            Live Map
          </Link>
          <Link href="/dashboard">
            <Button variant="primary" size="sm" icon={<Compass className="w-4 h-4" />}>
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 space-y-12">
        <HeroSection />
        <InteractiveTeaser />
        <FeaturesSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
