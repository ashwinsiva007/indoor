import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Map, Route, Edit3, QrCode, Accessibility, BarChart3 } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      title: 'Interactive 2D Blueprint Canvas',
      description: 'Render high-resolution vector floor plans with custom room boundaries, doors, elevators, and points of interest.',
      icon: Map,
      color: 'from-blue-500 to-cyan-400',
    },
    {
      title: 'Dijkstra Pathfinding Graph Engine',
      description: 'Instant multi-floor route calculation yielding optimal paths, walking duration, and step-by-step guidance.',
      icon: Route,
      color: 'from-cyan-400 to-teal-400',
    },
    {
      title: 'Visual Layout Blueprint Editor',
      description: 'Drag-and-drop tool to quickly place room zones, doors, corridors, and node waypoints directly on maps.',
      icon: Edit3,
      color: 'from-purple-500 to-indigo-400',
    },
    {
      title: 'ADA Accessible Wayfinding',
      description: 'Smart routing mode filtering for elevators and ramps only, providing accessible paths for visitors.',
      icon: Accessibility,
      color: 'from-emerald-400 to-teal-500',
    },
    {
      title: 'Instant QR Code Location Sharing',
      description: 'Generate scan-to-navigate QR codes for building lobby kiosks and room entrances.',
      icon: QrCode,
      color: 'from-amber-400 to-orange-500',
    },
    {
      title: 'Foot Traffic Heatmaps & Analytics',
      description: 'Track popular corridors, peak navigation times, and visitor room search trends.',
      icon: BarChart3,
      color: 'from-pink-500 to-rose-400',
    },
  ];

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto space-y-12">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Engineered for Modern Indoor Spatial Intelligence
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm">
          Everything you need to digitize your campus, hospital, or commercial complex into a searchable, navigable map platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feat, i) => {
          const Icon = feat.icon;

          return (
            <Card key={`feat-${i}`} className="group hover:border-slate-700 transition-all duration-300">
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feat.color} flex items-center justify-center shadow-lg mb-5 group-hover:scale-110 transition-transform duration-200`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <CardHeader className="p-0 pb-2">
                <CardTitle className="text-lg text-white group-hover:text-blue-400 transition-colors">
                  {feat.title}
                </CardTitle>
              </CardHeader>
              <CardDescription className="text-slate-400 text-sm leading-relaxed">
                {feat.description}
              </CardDescription>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
