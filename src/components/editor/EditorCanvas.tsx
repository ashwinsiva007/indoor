'use client';

import React, { useRef, useState } from 'react';
import { ToolMode } from './EditorToolbar';
import { RoomZone, MapNode } from '@/types';
import { Square, DoorClosed, Waypoints, GitCommit } from 'lucide-react';

interface CustomItem {
  id: string;
  type: 'room' | 'door' | 'corridor' | 'junction';
  name: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
}

interface EditorCanvasProps {
  activeTool: ToolMode;
  items: CustomItem[];
  selectedItemId: string | null;
  onAddItem: (item: CustomItem) => void;
  onSelectItem: (id: string | null) => void;
}

export const EditorCanvas: React.FC<EditorCanvasProps> = ({
  activeTool,
  items,
  selectedItemId,
  onAddItem,
  onSelectItem,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    if (activeTool === 'select') {
      onSelectItem(null);
      return;
    }

    let newItem: CustomItem;

    if (activeTool === 'add-room') {
      newItem = {
        id: `room-${Date.now()}`,
        type: 'room',
        name: `New Room ${items.filter((i) => i.type === 'room').length + 1}`,
        x: x - 50,
        y: y - 35,
        w: 100,
        h: 70,
      };
    } else if (activeTool === 'add-door') {
      newItem = {
        id: `door-${Date.now()}`,
        type: 'door',
        name: `Door ${items.filter((i) => i.type === 'door').length + 1}`,
        x,
        y,
      };
    } else if (activeTool === 'add-corridor') {
      newItem = {
        id: `corridor-${Date.now()}`,
        type: 'corridor',
        name: `Corridor Path`,
        x,
        y,
        w: 120,
      };
    } else {
      // add-junction
      newItem = {
        id: `junc-${Date.now()}`,
        type: 'junction',
        name: `Waypoint Node ${items.filter((i) => i.type === 'junction').length + 1}`,
        x,
        y,
      };
    }

    onAddItem(newItem);
    onSelectItem(newItem.id);
  };

  return (
    <div className="relative w-full h-[540px] bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl blueprint-grid overflow-hidden flex flex-col justify-between">
      {/* Helper Banner */}
      <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-xl glass-card text-xs text-slate-300 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
        <span>
          Active Tool: <strong className="text-blue-400 capitalize">{activeTool.replace('-', ' ')}</strong> (Click map canvas to place elements)
        </span>
      </div>

      <svg
        ref={svgRef}
        viewBox="0 0 800 540"
        className="w-full h-full cursor-crosshair selection:bg-none"
        onClick={handleCanvasClick}
      >
        {/* Render Base Grid Reference Lines */}
        <line x1="400" y1="0" x2="400" y2="540" stroke="#1e293b" strokeDasharray="4 4" />
        <line x1="0" y1="270" x2="800" y2="270" stroke="#1e293b" strokeDasharray="4 4" />

        {/* Outer Floor Perimeter */}
        <rect
          x="30"
          y="30"
          width="740"
          height="480"
          rx="12"
          fill="none"
          stroke="#334155"
          strokeWidth="2"
          strokeDasharray="6 4"
        />

        {/* Placed Dynamic Items */}
        {items.map((item) => {
          const isSelected = item.id === selectedItemId;

          if (item.type === 'room') {
            return (
              <g
                key={item.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectItem(item.id);
                }}
                className="cursor-pointer"
              >
                <rect
                  x={item.x}
                  y={item.y}
                  width={item.w || 100}
                  height={item.h || 70}
                  rx="6"
                  fill={isSelected ? '#1d4ed8' : '#1e293b'}
                  fillOpacity="0.8"
                  stroke={isSelected ? '#60a5fa' : '#3b82f6'}
                  strokeWidth={isSelected ? '2.5' : '1.5'}
                />
                <text
                  x={item.x + (item.w || 100) / 2}
                  y={item.y + (item.h || 70) / 2 + 4}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="11"
                  fontWeight="600"
                >
                  {item.name}
                </text>
              </g>
            );
          }

          if (item.type === 'corridor') {
            return (
              <g
                key={item.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectItem(item.id);
                }}
                className="cursor-pointer"
              >
                <line
                  x1={item.x}
                  y1={item.y}
                  x2={item.x + (item.w || 120)}
                  y2={item.y}
                  stroke={isSelected ? '#38bdf8' : '#0284c7'}
                  strokeWidth="6"
                  strokeDasharray="6 3"
                />
                <circle cx={item.x} cy={item.y} r="4" fill="#38bdf8" />
                <circle cx={item.x + (item.w || 120)} cy={item.y} r="4" fill="#38bdf8" />
              </g>
            );
          }

          if (item.type === 'door') {
            return (
              <g
                key={item.id}
                transform={`translate(${item.x}, ${item.y})`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectItem(item.id);
                }}
                className="cursor-pointer"
              >
                <rect x="-10" y="-10" width="20" height="20" rx="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                <text x="0" y="3" textAnchor="middle" fill="#000000" fontSize="10" fontWeight="bold">
                  D
                </text>
              </g>
            );
          }

          // Junction Waypoint Node
          return (
            <g
              key={item.id}
              transform={`translate(${item.x}, ${item.y})`}
              onClick={(e) => {
                e.stopPropagation();
                onSelectItem(item.id);
              }}
              className="cursor-pointer"
            >
              <circle r={isSelected ? '8' : '6'} fill={isSelected ? '#10b981' : '#059669'} stroke="#ffffff" strokeWidth="2" />
            </g>
          );
        })}
      </svg>
    </div>
  );
};
