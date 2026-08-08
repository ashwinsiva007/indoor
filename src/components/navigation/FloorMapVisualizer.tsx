'use client';

import React, { useState } from 'react';
import { GROUND_FLOOR_ROOMS, GROUND_FLOOR_NODES } from '@/data/mockData';
import { RouteResult, MapNode } from '@/types';
import { MapPin, Navigation, ZoomIn, ZoomOut, RotateCcw, Layers } from 'lucide-react';
import { clsx } from 'clsx';

interface FloorMapVisualizerProps {
  routeResult: RouteResult | null;
  selectedSourceId: string;
  selectedDestId: string;
  onSelectNode?: (nodeId: string) => void;
}

export const FloorMapVisualizer: React.FC<FloorMapVisualizerProps> = ({
  routeResult,
  selectedSourceId,
  selectedDestId,
  onSelectNode,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showNodes, setShowNodes] = useState(true);

  // Generate SVG path string from route nodes
  const pathPoints = routeResult?.pathNodes.map((n) => `${n.x},${n.y}`).join(' L ');
  const svgPathString = pathPoints ? `M ${pathPoints}` : '';

  const sourceNode = GROUND_FLOOR_NODES.find((n) => n.id === selectedSourceId);
  const destNode = GROUND_FLOOR_NODES.find((n) => n.id === selectedDestId);

  return (
    <div className="relative w-full h-[580px] bg-slate-950 rounded-2xl border border-slate-800/90 overflow-hidden shadow-2xl blueprint-grid flex flex-col justify-between">
      {/* Top Map Status Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-xl glass-card border border-slate-700/80 text-xs font-semibold text-slate-200">
          <Layers className="w-4 h-4 text-blue-400" />
          <span>College Main Block — Ground Floor (2D Interactive Plan)</span>
        </div>

        {/* Map Controls */}
        <div className="pointer-events-auto flex items-center gap-1.5 p-1 rounded-xl glass-card border border-slate-700/80">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 1.5))}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.7))}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Reset Zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-slate-800 my-auto" />
          <button
            onClick={() => setShowNodes((v) => !v)}
            className={clsx(
              'px-2 py-1 rounded-lg text-xs font-medium transition-colors',
              showNodes ? 'bg-blue-600/30 text-blue-400' : 'text-slate-400 hover:text-slate-200'
            )}
          >
            {showNodes ? 'Hide Waypoints' : 'Show Waypoints'}
          </button>
        </div>
      </div>

      {/* SVG Canvas Map Area */}
      <div className="w-full h-full flex items-center justify-center p-6 overflow-auto">
        <div
          className="transition-transform duration-300 ease-out origin-center w-full max-w-[800px]"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <svg viewBox="0 0 800 680" className="w-full h-auto drop-shadow-2xl selection:bg-none">
            <defs>
              {/* Pulsing Gradient for Navigation Path */}
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>

              {/* Marker Filters */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Outer Building Boundary */}
            <rect
              x="40"
              y="100"
              width="720"
              height="550"
              rx="16"
              fill="#0f172a"
              fillOpacity="0.8"
              stroke="#334155"
              strokeWidth="2"
              strokeDasharray="6 4"
            />

            {/* Central Courtyard / Atrium */}
            <rect
              x="260"
              y="250"
              width="280"
              height="160"
              rx="12"
              fill="#1e293b"
              stroke="#475569"
              strokeWidth="1.5"
            />
            <text x="400" y="335" textAnchor="middle" fill="#64748b" fontSize="13" fontWeight="600" className="select-none">
              Open Atrium Quad
            </text>

            {/* Render Room Zones */}
            {GROUND_FLOOR_ROOMS.map((room) => {
              const isSourceRoom = sourceNode?.roomCode === room.code;
              const isDestRoom = destNode?.roomCode === room.code;

              return (
                <g key={room.id} className="cursor-pointer group">
                  {/* Room Box */}
                  <rect
                    x={room.x}
                    y={room.y}
                    width={room.width}
                    height={room.height}
                    rx="8"
                    fill={isSourceRoom ? '#1e3a8a' : isDestRoom ? '#064e3b' : '#1e293b'}
                    fillOpacity="0.85"
                    stroke={isSourceRoom ? '#3b82f6' : isDestRoom ? '#10b981' : room.color || '#475569'}
                    strokeWidth={isSourceRoom || isDestRoom ? '2.5' : '1.5'}
                    className="transition-all duration-200 group-hover:fill-slate-800"
                  />
                  {/* Room Code Badge */}
                  <rect
                    x={room.x + 8}
                    y={room.y + 8}
                    width="55"
                    height="18"
                    rx="4"
                    fill="#0f172a"
                    fillOpacity="0.8"
                  />
                  <text
                    x={room.x + 35}
                    y={room.y + 21}
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="10"
                    fontWeight="700"
                    className="select-none"
                  >
                    {room.code}
                  </text>
                  {/* Room Name */}
                  <text
                    x={room.x + room.width / 2}
                    y={room.y + room.height / 2 + 10}
                    textAnchor="middle"
                    fill="#f8fafc"
                    fontSize="12"
                    fontWeight="600"
                    className="select-none pointer-events-none"
                  >
                    {room.name}
                  </text>
                </g>
              );
            })}

            {/* Render Waypoints / Nodes */}
            {showNodes &&
              GROUND_FLOOR_NODES.map((node) => {
                const isSelected = node.id === selectedSourceId || node.id === selectedDestId;
                const isPathNode = routeResult?.pathNodes.some((n) => n.id === node.id);

                return (
                  <g
                    key={node.id}
                    className="cursor-pointer"
                    onClick={() => onSelectNode && onSelectNode(node.id)}
                  >
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isSelected ? '8' : isPathNode ? '5' : '4'}
                      fill={
                        node.id === selectedSourceId
                          ? '#3b82f6'
                          : node.id === selectedDestId
                          ? '#10b981'
                          : isPathNode
                          ? '#06b6d4'
                          : '#475569'
                      }
                      stroke="#0f172a"
                      strokeWidth="2"
                    />
                  </g>
                );
              })}

            {/* Render Calculated Navigation Route Path */}
            {routeResult && svgPathString && (
              <g>
                {/* Glow backdrop path */}
                <path
                  d={svgPathString}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="8"
                  strokeOpacity="0.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#glow)"
                />
                {/* Animated active path line */}
                <path
                  d={svgPathString}
                  fill="none"
                  stroke="url(#routeGradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-route-path"
                />

                {/* Path Nodes Pulse Markers */}
                {routeResult.pathNodes.map((n, idx) => (
                  <circle
                    key={`path-pt-${n.id}-${idx}`}
                    cx={n.x}
                    cy={n.y}
                    r="4"
                    fill="#38bdf8"
                    stroke="#0284c7"
                    strokeWidth="1.5"
                  />
                ))}
              </g>
            )}

            {/* Source Pin Marker */}
            {sourceNode && (
              <g transform={`translate(${sourceNode.x}, ${sourceNode.y})`}>
                <circle r="16" fill="#3b82f6" fillOpacity="0.25" className="animate-ping" />
                <circle r="10" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                <circle r="4" fill="#ffffff" />
              </g>
            )}

            {/* Destination Pin Marker */}
            {destNode && (
              <g transform={`translate(${destNode.x}, ${destNode.y - 12})`}>
                <g transform="translate(-12, -24)">
                  <path
                    d="M12 0C5.37 0 0 5.37 0 12c0 9 12 20 12 20s12-11 12-20c0-6.63-5.37-12-12-12zm0 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
                    fill="#10b981"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    filter="url(#glow)"
                  />
                </g>
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Bottom Map Legend */}
      <div className="p-3 bg-slate-900/90 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Start Node</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>Destination</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-1 rounded bg-gradient-to-r from-blue-500 to-cyan-400" />
            <span>Optimal Path</span>
          </div>
        </div>

        <div className="text-slate-500 font-mono text-[11px]">
          Floor Dimensions: 80m x 65m (Grid: 10m)
        </div>
      </div>
    </div>
  );
};
