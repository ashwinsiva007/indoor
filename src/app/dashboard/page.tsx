import React from 'react';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { RecentBuildings } from '@/components/dashboard/RecentBuildings';
import { QuickActions } from '@/components/dashboard/QuickActions';

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Platform Overview
          </h1>
          <p className="text-sm text-slate-400">
            Spatial indoor mapping status, active floor plans, and navigation statistics
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Quick Blueprint Action */}
      <QuickActions />

      {/* Recent Buildings Section */}
      <RecentBuildings />
    </div>
  );
}
