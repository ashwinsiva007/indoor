'use client';

import React from 'react';
import Link from 'next/link';
import { Search, Bell, Sparkles, User, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 h-16 glass-nav border-b border-slate-800/80 px-6 flex items-center justify-between">
      {/* Left: Quick Search */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search rooms, floors, nodes or POIs..."
            className="w-full bg-slate-900/90 border border-slate-800 text-slate-200 text-sm rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400 font-medium">
          <MapPin className="w-3.5 h-3.5" />
          <span>Demo Building: College Main Block</span>
        </div>

        <button className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500" />
        </button>

        <Link href="/dashboard/navigation">
          <Button variant="primary" size="sm" icon={<Sparkles className="w-4 h-4" />}>
            Test Navigation
          </Button>
        </Link>

        {/* User Profile Avatar Mock */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 font-semibold text-xs">
            AD
          </div>
        </div>
      </div>
    </header>
  );
};
