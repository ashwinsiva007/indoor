'use client';

import React, { useState } from 'react';
import { GROUND_FLOOR_NODES, GROUND_FLOOR_EDGES } from '@/data/mockData';
import { RouteResult } from '@/types';
import { findRoute } from '@/lib/pathfinder';
import { FloorMapVisualizer } from '@/components/navigation/FloorMapVisualizer';
import { NavigationControls } from '@/components/navigation/NavigationControls';
import { TurnByTurnDrawer } from '@/components/navigation/TurnByTurnDrawer';
import { Navigation, Sparkles } from 'lucide-react';

export default function NavigationPage() {
  const [sourceId, setSourceId] = useState<string>('n_entrance'); // Main Entrance
  const [destId, setDestId] = useState<string>('n_cs_lab_101'); // CS Lab 101
  const [accessibleOnly, setAccessibleOnly] = useState<boolean>(false);
  const [routeResult, setRouteResult] = useState<RouteResult | null>(() => {
    // Initial auto route calculation so map renders with path pre-loaded
    return findRoute('n_entrance', 'n_cs_lab_101', GROUND_FLOOR_NODES, GROUND_FLOOR_EDGES, false);
  });

  const handleFindRoute = () => {
    const res = findRoute(sourceId, destId, GROUND_FLOOR_NODES, GROUND_FLOOR_EDGES, accessibleOnly);
    setRouteResult(res);
  };

  const handleSwapLocations = () => {
    const temp = sourceId;
    setSourceId(destId);
    setDestId(temp);
  };

  const handleSelectNodeFromMap = (nodeId: string) => {
    if (nodeId === sourceId) return;
    setDestId(nodeId);
    const res = findRoute(sourceId, nodeId, GROUND_FLOOR_NODES, GROUND_FLOOR_EDGES, accessibleOnly);
    setRouteResult(res);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Navigation className="w-7 h-7 text-blue-500" />
            Interactive 2D Route Visualizer
          </h1>
          <p className="text-sm text-slate-400">
            Real-time graph wayfinding on College Main Block — Ground Floor
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Live Dijkstra Path Finder</span>
        </div>
      </div>

      {/* Main Grid: Controls Left, SVG Map Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Route Controls & Turn-by-Turn Guidance */}
        <div className="lg:col-span-4 space-y-6">
          <NavigationControls
            nodes={GROUND_FLOOR_NODES}
            sourceId={sourceId}
            destId={destId}
            accessibleOnly={accessibleOnly}
            onSourceChange={setSourceId}
            onDestChange={setDestId}
            onAccessibleChange={setAccessibleOnly}
            onFindRoute={handleFindRoute}
            onSwapLocations={handleSwapLocations}
          />

          <TurnByTurnDrawer routeResult={routeResult} />
        </div>

        {/* Right Column: Interactive SVG Floor Map */}
        <div className="lg:col-span-8">
          <FloorMapVisualizer
            routeResult={routeResult}
            selectedSourceId={sourceId}
            selectedDestId={destId}
            onSelectNode={handleSelectNodeFromMap}
          />
        </div>
      </div>
    </div>
  );
}
