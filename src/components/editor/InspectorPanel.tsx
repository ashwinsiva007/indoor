'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Sliders, Trash2, Edit2, Tag } from 'lucide-react';

interface CustomItem {
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
  onUpdateItemName: (id: string, name: string) => void;
  onDeleteItem: (id: string) => void;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  selectedItem,
  onUpdateItemName,
  onDeleteItem,
}) => {
  if (!selectedItem) {
    return (
      <div className="glass-card rounded-2xl p-6 border border-slate-800/80 text-center space-y-3">
        <Sliders className="w-8 h-8 text-slate-600 mx-auto" />
        <h4 className="text-sm font-semibold text-slate-300">Element Inspector</h4>
        <p className="text-xs text-slate-500">
          Click any placed room, door, corridor, or node on the layout canvas to edit properties.
        </p>
      </div>
    );
  }

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
            onChange={(e) => onUpdateItemName(selectedItem.id, e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 text-slate-400 font-mono text-[11px]">
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
            X Position: <span className="text-white">{selectedItem.x}px</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
            Y Position: <span className="text-white">{selectedItem.y}px</span>
          </div>
        </div>

        <Button
          variant="danger"
          size="sm"
          onClick={() => onDeleteItem(selectedItem.id)}
          icon={<Trash2 className="w-4 h-4" />}
          className="w-full mt-2"
        >
          Remove Element
        </Button>
      </div>
    </div>
  );
};
