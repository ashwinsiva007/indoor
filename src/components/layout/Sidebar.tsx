'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Building2, Map, Edit3, Compass, Settings, Layers, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

const NAV_ITEMS = [
  { name: 'Overview Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Buildings & Floors', href: '/dashboard/buildings', icon: Building2 },
  { name: 'Live Route Visualizer', href: '/dashboard/navigation', icon: Compass },
  { name: 'Floor Layout Editor', href: '/dashboard/editor', icon: Edit3 },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 glass-nav border-r border-slate-800/80 min-h-screen flex flex-col justify-between p-4 hidden md:flex">
      <div className="space-y-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 px-2 py-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Map className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-white tracking-wide block leading-tight">NaviWay</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400">Indoor Platform</span>
          </div>
        </Link>

        {/* Navigation Menu */}
        <div className="space-y-1">
          <div className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Main Navigation
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-md shadow-blue-900/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={clsx('w-4 h-4', isActive ? 'text-blue-400' : 'text-slate-500')} />
                  <span>{item.name}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-blue-400" />}
              </Link>
            );
          })}
        </div>

        {/* Workspace Quick Widget */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Layers className="w-4 h-4 text-cyan-400" />
            Active Building
          </div>
          <p className="text-xs text-slate-400 font-mono">College Main Block</p>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-800/80">
            <span>4 Floors Mapped</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Live
            </span>
          </div>
        </div>
      </div>

      {/* Footer Settings */}
      <div className="pt-4 border-t border-slate-800">
        <button className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 w-full transition-colors">
          <Settings className="w-4 h-4 text-slate-500" />
          <span>System Config</span>
        </button>
      </div>
    </aside>
  );
};
