'use client';

import React from 'react';
import { MapNode } from '@/types';
import { Button } from '@/components/ui/button';
import { Navigation, MapPin, Accessibility, ArrowRightLeft, Sparkles } from 'lucide-react';

interface NavigationControlsProps {
  nodes: MapNode[];
  sourceId: string;
  destId: string;
  accessibleOnly: boolean;
  onSourceChange: (id: string) => void;
  onDestChange: (id: string) => void;
  onAccessibleChange: (val: boolean) => void;
  onFindRoute: () => void;
  onSwapLocations: () => void;
}

export const NavigationControls: React.FC<NavigationControlsProps> = ({
  nodes,
  sourceId,
  destId,
  accessibleOnly,
  onSourceChange,
  onDestChange,
  onAccessibleChange,
  onFindRoute,
  onSwapLocations,
}) => {
  // Only expose non-internal nodes (rooms, junctions, doors) — not auto-generated
  // corridor endpoint sub-nodes like corridor_L / corridor_R
  const selectableNodes = nodes.filter((n) => !n.isInternal);

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800/80 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Navigation className="w-4 h-4 text-blue-400" />
          Route Planner
        </h3>
        <button
          onClick={onSwapLocations}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Swap Source and Destination"
        >
          <ArrowRightLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Source Dropdown */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-blue-400" />
          Starting Location
        </label>
        <select
          value={sourceId}
          onChange={(e) => onSourceChange(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
        >
          {selectableNodes.map((node) => (
            <option key={`src-${node.id}`} value={node.id}>
              {node.name} {node.roomCode ? `(${node.roomCode})` : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Destination Dropdown */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          Destination Location
        </label>
        <select
          value={destId}
          onChange={(e) => onDestChange(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
        >
          {selectableNodes.map((node) => (
            <option key={`dst-${node.id}`} value={node.id}>
              {node.name} {node.roomCode ? `(${node.roomCode})` : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Accessible Route Checkbox */}
      <div className="flex items-center justify-between pt-1">
        <label className="text-xs text-slate-300 flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={accessibleOnly}
            onChange={(e) => onAccessibleChange(e.target.checked)}
            className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-blue-500/50"
          />
          <span className="flex items-center gap-1.5">
            <Accessibility className="w-3.5 h-3.5 text-cyan-400" />
            Wheelchair / Elevator Only Route
          </span>
        </label>
      </div>

      {/* Find Route Button */}
      <Button
        variant="primary"
        size="lg"
        onClick={onFindRoute}
        className="w-full mt-2 font-bold tracking-wide"
        icon={<Sparkles className="w-4 h-4" />}
      >
        Find Route & Highlight Map
      </Button>
    </div>
  );
};
