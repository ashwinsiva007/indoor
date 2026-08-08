'use client';

import React, { useState } from 'react';
import { EditorToolbar, ToolMode } from '@/components/editor/EditorToolbar';
import { EditorCanvas } from '@/components/editor/EditorCanvas';
import { InspectorPanel, CustomItem } from '@/components/editor/InspectorPanel';
import { Edit3, CheckCircle2, Info, Move, Upload } from 'lucide-react';
import { Modal } from '@/components/ui/modal';

const SAMPLE_BLUEPRINT_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="540" viewBox="0 0 800 540">
  <rect width="800" height="540" fill="#090d16"/>
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="800" height="540" fill="url(#grid)" />
  <!-- Building Outline -->
  <rect x="40" y="40" width="720" height="460" rx="12" fill="none" stroke="#0284c7" stroke-width="3" stroke-dasharray="8 4" opacity="0.6"/>
  <!-- Floorplan Architectural Zones -->
  <rect x="60" y="60" width="220" height="180" fill="#0369a1" fill-opacity="0.1" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4 2"/>
  <text x="170" y="90" text-anchor="middle" fill="#38bdf8" font-family="sans-serif" font-size="12" font-weight="bold" opacity="0.8">COMPUTER SCIENCE WING</text>
  
  <rect x="520" y="60" width="220" height="220" fill="#0369a1" fill-opacity="0.1" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4 2"/>
  <text x="630" y="90" text-anchor="middle" fill="#38bdf8" font-family="sans-serif" font-size="12" font-weight="bold" opacity="0.8">LIBRARY & MEDIA HUB</text>
  
  <rect x="250" y="320" width="280" height="160" fill="#0369a1" fill-opacity="0.1" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4 2"/>
  <text x="390" y="350" text-anchor="middle" fill="#38bdf8" font-family="sans-serif" font-size="12" font-weight="bold" opacity="0.8">MAIN ATRIUM & FOYER</text>
  
  <!-- Central Corridor lines -->
  <line x1="280" y1="150" x2="520" y2="150" stroke="#0ea5e9" stroke-width="2" stroke-dasharray="6 4" opacity="0.7"/>
  <line x1="390" y1="150" x2="390" y2="320" stroke="#0ea5e9" stroke-width="2" stroke-dasharray="6 4" opacity="0.7"/>
</svg>
`)}`;

export default function EditorPage() {
  const [activeTool, setActiveTool] = useState<ToolMode>('select');
  const [items, setItems] = useState<CustomItem[]>([
    { id: 'r1', type: 'room', name: 'Main Lobby', x: 280, y: 340, w: 220, h: 120 },
    { id: 'r2', type: 'room', name: 'Computer Lab', x: 70, y: 70, w: 180, h: 140 },
    { id: 'r3', type: 'room', name: 'Library Hub', x: 530, y: 70, w: 200, h: 180 },
    { id: 'j1', type: 'junction', name: 'Waypoint Entrance', x: 390, y: 400 },
  ]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [blueprintUrl, setBlueprintUrl] = useState<string | null>(null);
  const [blueprintOpacity, setBlueprintOpacity] = useState<number>(0.7);

  const handleAddItem = (newItem: CustomItem) => {
    setItems((prev) => [...prev, newItem]);
  };

  const handleUpdateItem = (id: string, updates: Partial<CustomItem>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setSelectedItemId(null);
  };

  const handleDuplicateItem = (id: string) => {
    const original = items.find((i) => i.id === id);
    if (!original) return;
    const duplicated: CustomItem = {
      ...original,
      id: `${original.type}-${Date.now()}`,
      name: `${original.name} (Copy)`,
      x: Math.min(760, original.x + 20),
      y: Math.min(510, original.y + 20),
    };
    setItems((prev) => [...prev, duplicated]);
    setSelectedItemId(duplicated.id);
  };

  const handleBlueprintUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        setBlueprintUrl(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLoadSampleBlueprint = () => {
    setBlueprintUrl(SAMPLE_BLUEPRINT_SVG);
  };

  const handleBlueprintRemove = () => {
    setBlueprintUrl(null);
  };

  const selectedItem = items.find((i) => i.id === selectedItemId) || null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Edit3 className="w-7 h-7 text-blue-500" />
            Building Floor Layout Editor
          </h1>
          <p className="text-sm text-slate-400">
            Upload custom blueprint images, place rooms/waypoints, and drag elements to customize your indoor map layout.
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
        blueprintUrl={blueprintUrl}
        blueprintOpacity={blueprintOpacity}
        onBlueprintUpload={handleBlueprintUpload}
        onBlueprintRemove={handleBlueprintRemove}
        onBlueprintOpacityChange={setBlueprintOpacity}
        onLoadSampleBlueprint={handleLoadSampleBlueprint}
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
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
            blueprintUrl={blueprintUrl}
            blueprintOpacity={blueprintOpacity}
          />
        </div>

        {/* Right Inspector & Instructions */}
        <div className="lg:col-span-4 space-y-6">
          <InspectorPanel
            selectedItem={selectedItem}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
            onDuplicateItem={handleDuplicateItem}
          />

          <div className="glass-card rounded-2xl p-5 border border-slate-800/80 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-400" />
              Editor Controls Guide
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                <span>
                  Select <strong>Select / Move</strong> tool to click and drag any room, door, corridor, or node around the canvas.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                <span>
                  Click the <strong>blue bottom-right corner handle</strong> on selected rooms to resize their dimensions.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <span>
                  Click <strong>Upload Blueprint Image</strong> to upload your own floorplan blueprint image as the canvas background.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span>
                  Use the <strong>Inspector Panel</strong> to fine-tune room names, exact pixel positions, and dimensions.
                </span>
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
              Your floor layout updates (rooms, corridors, doors, and waypoints) have been compiled into the navigation graph.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

