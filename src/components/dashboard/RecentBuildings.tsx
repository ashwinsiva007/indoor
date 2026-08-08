'use client';

import React from 'react';
import Link from 'next/link';
import { MOCK_BUILDINGS } from '@/data/mockData';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Layers, MapPin, ExternalLink, Edit3, ArrowRight } from 'lucide-react';

export const RecentBuildings: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Recent Buildings</h2>
          <p className="text-sm text-slate-400">Select a building to view floor plans or test wayfinding</p>
        </div>
        <Link href="/dashboard/buildings">
          <Button variant="ghost" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
            View All Buildings
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {MOCK_BUILDINGS.map((bld) => (
          <Card key={bld.id} className="group relative overflow-hidden border-slate-800/90 flex flex-col justify-between">
            {/* Building Thumbnail */}
            <div className="relative h-40 w-full overflow-hidden rounded-xl bg-slate-900 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={bld.thumbnail}
                alt={bld.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

              <div className="absolute top-3 right-3">
                <Badge variant={bld.status === 'Active' ? 'success' : 'warning'}>{bld.status}</Badge>
              </div>
            </div>

            <CardHeader className="p-0 pb-3">
              <CardTitle className="text-lg group-hover:text-blue-400 transition-colors">{bld.name}</CardTitle>
              <CardDescription>{bld.tagline}</CardDescription>
            </CardHeader>

            <div className="space-y-3 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-400" />
                  {bld.floorsCount} Floors Mapped
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  {bld.totalRooms} Rooms
                </span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Link href="/dashboard/buildings" className="flex-1">
                  <Button variant="secondary" size="sm" className="w-full" icon={<ExternalLink className="w-3.5 h-3.5" />}>
                    Floor Plans
                  </Button>
                </Link>
                <Link href="/dashboard/editor">
                  <Button variant="outline" size="sm" className="px-3" icon={<Edit3 className="w-3.5 h-3.5" />} title="Open Editor" />
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
