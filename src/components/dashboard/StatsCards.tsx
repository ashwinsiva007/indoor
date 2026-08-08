import React from 'react';
import { Card } from '@/components/ui/card';
import { Building2, Layers, MapPin, Compass, TrendingUp } from 'lucide-react';

export const StatsCards: React.FC = () => {
  const stats = [
    {
      title: 'Total Buildings',
      value: '4',
      change: '+1 this month',
      icon: Building2,
      color: 'from-blue-600 to-cyan-500',
    },
    {
      title: 'Active Floor Plans',
      value: '12',
      change: '100% vector mapped',
      icon: Layers,
      color: 'from-cyan-500 to-teal-400',
    },
    {
      title: 'Mapped Rooms & POIs',
      value: '148',
      change: '24 updated recently',
      icon: MapPin,
      color: 'from-purple-600 to-indigo-500',
    },
    {
      title: 'Total Navigations',
      value: '1,240',
      change: '+18% vs last week',
      icon: Compass,
      color: 'from-emerald-500 to-cyan-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;

        return (
          <Card key={`stat-${i}`} className="relative overflow-hidden group hover:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {stat.title}
                </span>
                <div className="text-3xl font-extrabold text-white tracking-tight">{stat.value}</div>
                <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium pt-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{stat.change}</span>
                </div>
              </div>

              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
