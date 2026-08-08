'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Sliders, Trash2, Edit2, Copy, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

export interface CustomItem {
  id: string;
  type: 'room' | 'door' | 'corridor' | 'junction';
  name: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
}

interface InspectorPanelProps {
  selectedItem: CustomItem | null;
  onUpdateItem: (id: string, updates: Partial<CustomItem>) => void;
  onDeleteItem: (id: string) => void;
  onDuplicateItem?: (id: string) => void;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  selectedItem,
  onUpdateItem,
  onDeleteItem,
  onDuplicateItem,
}) => {
  if (!selectedItem) {
    return (
      <div className="glass-card rounded-2xl p-6 border border-slate-800/80 text-center space-y-3">
        <Sliders className="w-8 h-8 text-blue-500/60 mx-auto" />
        <h4 className="text-sm font-semibold text-slate-300">Element Inspector</h4>
        <p className="text-xs text-slate-500">
          Click any room, door, corridor, or waypoint node on the layout canvas to view and edit its properties.
        </p>
      </div>
    );
  }

  const hasDimensions = selectedItem.type === 'room' || selectedItem.type === 'corridor';

  const nudge = (dx: number, dy: number) => {
    onUpdateItem(selectedItem.id, {
      x: Math.max(10, Math.min(760, selectedItem.x + dx)),
      y: Math.max(10, Math.min(510, selectedItem.y + dy)),
    });
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800/80 space-y-4 animate-in fade-in duration-200">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Edit2 className="w-4 h-4 text-blue-400" />
          Edit {selectedItem.type.toUpperCase()}
        </h3>
        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
          ID: {selectedItem.id.slice(0, 10)}
        </span>
      </div>

      <div className="space-y-3 text-xs">
        <div>
          <label className="text-slate-400 font-semibold mb-1 block">Label / Name</label>
          <input
            type="text"
            value={selectedItem.name}
            onChange={(e) => onUpdateItem(selectedItem.id, { name: e.target.value })}
            className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-slate-400 font-semibold block">Position (X, Y)</label>
            <span className="text-[10px] text-slate-500">Nudge: 5px</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-slate-400 font-mono text-[11px] mb-2">
            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-xs font-bold text-slate-500">X:</span>
              <input
                type="number"
                value={selectedItem.x}
                onChange={(e) => onUpdateItem(selectedItem.id, { x: parseInt(e.target.value) || 0 })}
                className="w-full bg-transparent text-white font-mono focus:outline-none"
              />
              <span className="text-[10px] text-slate-600">px</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-xs font-bold text-slate-500">Y:</span>
              <input
                type="number"
                value={selectedItem.y}
                onChange={(e) => onUpdateItem(selectedItem.id, { y: parseInt(e.target.value) || 0 })}
                className="w-full bg-transparent text-white font-mono focus:outline-none"
              />
              <span className="text-[10px] text-slate-600">px</span>
            </div>
          </div>

          {/* D-Pad Nudge Buttons */}
          <div className="flex items-center justify-center gap-1 bg-slate-900/60 p-2 rounded-xl border border-slate-800/80">
            <button
              onClick={() => nudge(-5, 0)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Move Left (5px)"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => nudge(0, -5)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Move Up (5px)"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => nudge(0, 5)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Move Down (5px)"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>
            <button
              onClick={() => nudge(5, 0)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Move Right (5px)"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {hasDimensions && (
          <div>
            <label className="text-slate-400 font-semibold mb-1 block">Dimensions (W, H)</label>
            <div className="grid grid-cols-2 gap-2 text-slate-400 font-mono text-[11px]">
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-xs font-bold text-slate-500">W:</span>
                <input
                  type="number"
                  value={selectedItem.w || 120}
                  onChange={(e) => onUpdateItem(selectedItem.id, { w: Math.max(20, parseInt(e.target.value) || 20) })}
                  className="w-full bg-transparent text-white font-mono focus:outline-none"
                />
                <span className="text-[10px] text-slate-600">px</span>
              </div>
              {selectedItem.type === 'room' && (
                <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-xs font-bold text-slate-500">H:</span>
                  <input
                    type="number"
                    value={selectedItem.h || 80}
                    onChange={(e) => onUpdateItem(selectedItem.id, { h: Math.max(20, parseInt(e.target.value) || 20) })}
                    className="w-full bg-transparent text-white font-mono focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-600">px</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 pt-2">
          {onDuplicateItem && (
            <button
              onClick={() => onDuplicateItem(selectedItem.id)}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors border border-slate-700/60"
            >
              <Copy className="w-3.5 h-3.5 text-blue-400" />
              <span>Duplicate</span>
            </button>
          )}

          <button
            onClick={() => onDeleteItem(selectedItem.id)}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium transition-colors border border-red-500/30 ${
              !onDuplicateItem ? 'col-span-2' : ''
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

