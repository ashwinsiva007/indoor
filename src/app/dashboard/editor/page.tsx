'use client';

import React, { useState } from 'react';
import { EditorToolbar, ToolMode } from '@/components/editor/EditorToolbar';
import { EditorCanvas } from '@/components/editor/EditorCanvas';
import { InspectorPanel } from '@/components/editor/InspectorPanel';
import { Edit3, CheckCircle2, Info } from 'lucide-react';
import { Modal } from '@/components/ui/modal';

interface CustomItem {
  id: string;
  type: 'room' | 'door' | 'corridor' | 'junction';
  name: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
}

export default function EditorPage() {
  const [activeTool, setActiveTool] = useState<ToolMode>('select');
  const [items, setItems] = useState<CustomItem[]>([
    { id: 'r1', type: 'room', name: 'Main Lobby', x: 280, y: 380, w: 220, h: 90 },
    { id: 'r2', type: 'room', name: 'Computer Lab', x: 80, y: 100, w: 160, h: 120 },
    { id: 'r3', type: 'room', name: 'Library Hub', x: 540, y: 100, w: 180, h: 160 },
    { id: 'j1', type: 'junction', name: 'Waypoint Entrance', x: 390, y: 420 },
  ]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);

  const handleAddItem = (newItem: CustomItem) => {
    setItems((prev) => [...prev, newItem]);
  };

  const handleUpdateItemName = (id: string, name: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, name } : item)));
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setSelectedItemId(null);
  };

  const selectedItem = items.find((i) => i.id === selectedItemId) || null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Edit3 className="w-7 h-7 text-blue-500" />
            Building Floor Layout Editor (Prototype)
          </h1>
          <p className="text-sm text-slate-400">
            Interactive canvas tool for mapping room boundaries, doors, corridors, and navigation waypoints
          </p>
        </div>
      </div>

      {/* Editor Toolbar */}
      <EditorToolbar
        activeTool={activeTool}
        onToolSelect={setActiveTool}
        onSaveLayout={() => setIsSavedModalOpen(true)}
        onClearCanvas={() => {
          setItems([]);
          setSelectedItemId(null);
        }}
        itemCount={items.length}
      />

      {/* Editor Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Canvas Area */}
        <div className="lg:col-span-8">
          <EditorCanvas
            activeTool={activeTool}
            items={items}
            selectedItemId={selectedItemId}
            onAddItem={handleAddItem}
            onSelectItem={setSelectedItemId}
          />
        </div>

        {/* Right Inspector & Instructions */}
        <div className="lg:col-span-4 space-y-6">
          <InspectorPanel
            selectedItem={selectedItem}
            onUpdateItemName={handleUpdateItemName}
            onDeleteItem={handleDeleteItem}
          />

          <div className="glass-card rounded-2xl p-5 border border-slate-800/80 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-400" />
              Editor Controls Guide
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                <span>Select <strong>Add Room</strong> and click anywhere on canvas to create an interactive room zone.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <span>Select <strong>Add Junction</strong> to place waypoint graph nodes used by the route finder engine.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span>Click any element to modify its name in the Inspector panel.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Save Layout Success Modal */}
      <Modal isOpen={isSavedModalOpen} onClose={() => setIsSavedModalOpen(false)} title="Layout Blueprint Saved">
        <div className="text-center space-y-4 py-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
          <div>
            <h4 className="text-base font-bold text-white">Floor Layout Synchronized!</h4>
            <p className="text-xs text-slate-400 mt-1">
              Your layout updates (rooms, corridors, doors, and waypoints) have been compiled into the navigation graph.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
