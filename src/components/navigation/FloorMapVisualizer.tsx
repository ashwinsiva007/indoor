'use client';

import React, { useState } from 'react';
import { RouteResult, MapNode, RoomZone } from '@/types';
import { MapPin, Navigation, ZoomIn, ZoomOut, RotateCcw, Layers } from 'lucide-react';
import { clsx } from 'clsx';

interface FloorMapVisualizerProps {
  routeResult: RouteResult | null;
  selectedSourceId: string;
  selectedDestId: string;
  onSelectNode?: (nodeId: string) => void;
  /** Dynamic rooms from selected plan */
  rooms: RoomZone[];
  /** Dynamic nodes from selected plan */
  nodes: MapNode[];
  /** Label shown in the top status bar */
  planLabel?: string;
}

export const FloorMapVisualizer: React.FC<FloorMapVisualizerProps> = ({
  routeResult,
  selectedSourceId,
  selectedDestId,
  onSelectNode,
  rooms,
  nodes,
  planLabel = 'Floor Plan — 2D Interactive View',
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showNodes, setShowNodes] = useState(true);

  // Generate SVG path string from route nodes
  const pathPoints = routeResult?.pathNodes.map((n) => `${n.x},${n.y}`).join(' L ');
  const svgPathString = pathPoints ? `M ${pathPoints}` : '';

  const sourceNode = nodes.find((n) => n.id === selectedSourceId);
  const destNode   = nodes.find((n) => n.id === selectedDestId);

  // Compute SVG viewBox to fit all items with padding
  const allX = [...rooms.map((r) => r.x), ...rooms.map((r) => r.x + r.width),  ...nodes.map((n) => n.x)];
  const allY = [...rooms.map((r) => r.y), ...rooms.map((r) => r.y + r.height), ...nodes.map((n) => n.y)];
  const PAD  = 60;
  const minX = allX.length ? Math.min(...allX) - PAD : 0;
  const minY = allY.length ? Math.min(...allY) - PAD : 0;
  const maxX = allX.length ? Math.max(...allX) + PAD : 800;
  const maxY = allY.length ? Math.max(...allY) + PAD : 680;
  const vbWidth  = Math.max(maxX - minX, 400);
  const vbHeight = Math.max(maxY - minY, 400);
  const viewBox  = `${minX} ${minY} ${vbWidth} ${vbHeight}`;

  return (
    <div className="relative w-full h-[580px] bg-slate-950 rounded-2xl border border-slate-800/90 overflow-hidden shadow-2xl blueprint-grid flex flex-col justify-between">

      {/* Top Map Status Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-xl glass-card border border-slate-700/80 text-xs font-semibold text-slate-200 max-w-[55%] truncate">
          <Layers className="w-4 h-4 text-blue-400 shrink-0" />
          <span className="truncate">{planLabel}</span>
        </div>

        {/* Map Controls */}
        <div className="pointer-events-auto flex items-center gap-1.5 p-1 rounded-xl glass-card border border-slate-700/80">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 2.0))}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.5))}
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
          <svg viewBox={viewBox} className="w-full h-auto drop-shadow-2xl selection:bg-none">
            <defs>
              {/* Pulsing Gradient for Navigation Path */}
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#3b82f6" />
                <stop offset="50%"  stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>

              {/* Glow filter */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Outer Building Boundary */}
            <rect
              x={minX + PAD / 2}
              y={minY + PAD / 2}
              width={vbWidth - PAD}
              height={vbHeight - PAD}
              rx="16"
              fill="#0f172a"
              fillOpacity="0.6"
              stroke="#334155"
              strokeWidth="2"
              strokeDasharray="6 4"
            />

            {/* Render Room Zones */}
            {rooms.map((room) => {
              const isSourceRoom = sourceNode?.roomCode === room.code;
              const isDestRoom   = destNode?.roomCode   === room.code;

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
                    stroke={isSourceRoom ? '#3b82f6' : isDestRoom ? '#10b981' : (room.color ?? '#475569')}
                    strokeWidth={isSourceRoom || isDestRoom ? '2.5' : '1.5'}
                    className="transition-all duration-200 group-hover:fill-slate-800"
                  />
                  {/* Room Code Badge */}
                  <rect
                    x={room.x + 8}
                    y={room.y + 8}
                    width={Math.min(room.width - 16, 72)}
                    height="18"
                    rx="4"
                    fill="#0f172a"
                    fillOpacity="0.8"
                  />
                  <text
                    x={room.x + Math.min(room.width - 16, 72) / 2 + 8}
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
                    {room.name.length > 18 ? room.name.slice(0, 16) + '…' : room.name}
                  </text>
                </g>
              );
            })}

            {/* Auto-generated edges preview: only show edges between non-internal nodes */}
            {showNodes && nodes.filter(n => !n.isInternal).map((node, i, arr) =>
              arr.slice(i + 1).map((other) => {
                const d = Math.sqrt((node.x - other.x) ** 2 + (node.y - other.y) ** 2);
                if (d > 260) return null;
                return (
                  <line
                    key={`edge-${node.id}-${other.id}`}
                    x1={node.x} y1={node.y}
                    x2={other.x} y2={other.y}
                    stroke="#334155"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                    strokeOpacity="0.5"
                  />
                );
              })
            )}

            {/* Render Waypoints / Nodes */}
            {showNodes &&
              nodes.map((node) => {
                const isSource   = node.id === selectedSourceId;
                const isDest     = node.id === selectedDestId;
                const isPathNode = routeResult?.pathNodes.some((n) => n.id === node.id);
                // Internal corridor endpoint nodes: only show if on the active path
                if (node.isInternal && !isPathNode) return null;

                const nodeRadius = node.isInternal
                  ? 3                                         // small dot for corridor waypoints
                  : isSource || isDest ? 8 : isPathNode ? 5 : 4;

                return (
                  <g
                    key={node.id}
                    className="cursor-pointer"
                    onClick={() => onSelectNode && onSelectNode(node.id)}
                  >
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={nodeRadius}
                      fill={
                        isSource     ? '#3b82f6'
                        : isDest     ? '#10b981'
                        : isPathNode ? '#06b6d4'
                        :              '#475569'
                      }
                      stroke="#0f172a"
                      strokeWidth={node.isInternal ? 1 : 2}
                    />
                    {/* Node label — hide for internal corridor nodes */}
                    {!node.isInternal && (
                      <text
                        x={node.x}
                        y={node.y - 10}
                        textAnchor="middle"
                        fill="#94a3b8"
                        fontSize="9"
                        className="select-none pointer-events-none"
                      >
                        {node.name.length > 14 ? node.name.slice(0, 12) + '…' : node.name}
                      </text>
                    )}
                  </g>
                );
              })}

            {/* Render Calculated Navigation Route Path */}
            {routeResult && svgPathString && (
              <g>
                {/* Glow backdrop */}
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
                {/* Animated active path */}
                <path
                  d={svgPathString}
                  fill="none"
                  stroke="url(#routeGradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-route-path"
                />
                {/* Path node dots */}
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

            {/* Source Pin */}
            {sourceNode && (
              <g transform={`translate(${sourceNode.x}, ${sourceNode.y})`}>
                <circle r="16" fill="#3b82f6" fillOpacity="0.25" className="animate-ping" />
                <circle r="10" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                <circle r="4"  fill="#ffffff" />
              </g>
            )}

            {/* Destination Pin */}
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

            {/* Empty plan hint */}
            {rooms.length === 0 && nodes.length === 0 && (
              <text
                x={(minX + maxX) / 2}
                y={(minY + maxY) / 2}
                textAnchor="middle"
                fill="#475569"
                fontSize="16"
                fontWeight="600"
              >
                No items in this plan yet. Add rooms in the Floor Layout Editor.
              </text>
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
          {nodes.filter(n => !n.isInternal).length} waypoints · {rooms.length} rooms
        </div>
      </div>
    </div>
  );
};
