'use client';

import React, { useState, useEffect } from 'react';
import { EditorToolbar, ToolMode } from '@/components/editor/EditorToolbar';
import { EditorCanvas } from '@/components/editor/EditorCanvas';
import { InspectorPanel, CustomItem } from '@/components/editor/InspectorPanel';
import { Edit3, CheckCircle2, Info, FolderPlus, Pencil, X, Save, MapPin } from 'lucide-react';
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
  <text x="630" y="90" text-anchor="middle" fill="#38bdf8" font-family="sans-serif" font-size="12" font-weight="bold" opacity="0.8">LIBRARY &amp; MEDIA HUB</text>
  
  <rect x="250" y="320" width="280" height="160" fill="#0369a1" fill-opacity="0.1" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4 2"/>
  <text x="390" y="350" text-anchor="middle" fill="#38bdf8" font-family="sans-serif" font-size="12" font-weight="bold" opacity="0.8">MAIN ATRIUM &amp; FOYER</text>
  
  <!-- Central Corridor lines -->
  <line x1="280" y1="150" x2="520" y2="150" stroke="#0ea5e9" stroke-width="2" stroke-dasharray="6 4" opacity="0.7"/>
  <line x1="390" y1="150" x2="390" y2="320" stroke="#0ea5e9" stroke-width="2" stroke-dasharray="6 4" opacity="0.7"/>
</svg>
`)}`;

interface SavedPlan {
  id: string;
  name: string;
  createdAt: string;
  items: CustomItem[];
}

export default function EditorPage() {
  const [activeTool, setActiveTool] = useState<ToolMode>('select');
  const [items, setItems] = useState<CustomItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [blueprintUrl, setBlueprintUrl] = useState<string | null>(null);
  const [blueprintOpacity, setBlueprintOpacity] = useState<number>(0.7);

  // Plan naming state
  const [showNewPlanModal, setShowNewPlanModal] = useState(true);
  const [planName, setPlanName] = useState('');
  const [planNameInput, setPlanNameInput] = useState('');
  const [isRenamingPlan, setIsRenamingPlan] = useState(false);
  const [renameInput, setRenameInput] = useState('');
  const [savedAt, setSavedAt] = useState<string | null>(null);

  // Saved plans (persisted to localStorage)
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('indoor_saved_plans');
    if (stored) {
      setSavedPlans(JSON.parse(stored));
    }
  }, []);

  const handleCreatePlan = () => {
    const trimmed = planNameInput.trim();
    if (!trimmed) return;
    setPlanName(trimmed);
    setPlanNameInput('');
    setShowNewPlanModal(false);
    // Start with a blank canvas
    setItems([]);
    setSelectedItemId(null);
    setBlueprintUrl(null);
    setSavedAt(null);
  };

  const handleRenamePlan = () => {
    const trimmed = renameInput.trim();
    if (!trimmed) return;
    setPlanName(trimmed);
    setIsRenamingPlan(false);
    setRenameInput('');
  };

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

  const handleSaveLayout = () => {
    const now = new Date().toLocaleString();
    setSavedAt(now);

    const plan: SavedPlan = {
      id: `plan-${Date.now()}`,
      name: planName,
      createdAt: now,
      items,
    };

    setSavedPlans((prev) => {
      const filtered = prev.filter((p) => p.name !== planName);
      const updated = [plan, ...filtered];
      localStorage.setItem('indoor_saved_plans', JSON.stringify(updated));
      return updated;
    });

    setIsSavedModalOpen(true);
  };

  const selectedItem = items.find((i) => i.id === selectedItemId) || null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* ── New Plan Modal ─────────────────────────────────────────── */}
      {showNewPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md glass-card border border-blue-500/30 rounded-2xl shadow-2xl shadow-blue-900/30 p-8 overflow-hidden">
            {/* Decorative glow */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative">
              {/* Icon */}
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/40 mx-auto mb-5">
                <FolderPlus className="w-7 h-7 text-blue-400" />
              </div>

              <h2 className="text-2xl font-extrabold text-white text-center tracking-tight mb-1">
                Name Your Floor Plan
              </h2>
              <p className="text-sm text-slate-400 text-center mb-6">
                Give this layout a unique name before you start designing — e.g.{' '}
                <span className="text-blue-300 font-medium">Main Hall Block A</span>,{' '}
                <span className="text-blue-300 font-medium">Library Ground Floor</span>
              </p>

              <div className="space-y-3">
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400 pointer-events-none" />
                  <input
                    autoFocus
                    type="text"
                    value={planNameInput}
                    onChange={(e) => setPlanNameInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreatePlan()}
                    placeholder="e.g. Engineering Block – Floor 2"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 text-white placeholder-slate-500 text-sm outline-none transition-all"
                  />
                </div>

                <button
                  onClick={handleCreatePlan}
                  disabled={!planNameInput.trim()}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
                >
                  <FolderPlus className="w-4 h-4" />
                  Create Floor Plan
                </button>
              </div>

              {/* Previously saved plans */}
              {savedPlans.length > 0 && (
                <div className="mt-6 pt-5 border-t border-slate-800">
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-3">
                    Recent Saved Plans
                  </p>
                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {savedPlans.map((sp) => (
                      <button
                        key={sp.id}
                        onClick={() => {
                          setPlanName(sp.name);
                          setItems(sp.items);
                          setShowNewPlanModal(false);
                          setSavedAt(sp.createdAt);
                        }}
                        className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-blue-500/40 transition-all text-left group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span className="text-sm font-medium text-slate-200 truncate">{sp.name}</span>
                        </div>
                        <span className="text-xs text-slate-500 shrink-0 group-hover:text-slate-400">
                          {sp.items.length} items
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Page Title ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Edit3 className="w-7 h-7 text-blue-500 shrink-0" />
            Building Floor Layout Editor
          </h1>

          {/* Plan Name Badge */}
          {planName && !isRenamingPlan && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-2 bg-blue-600/15 border border-blue-500/30 rounded-xl px-3 py-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="text-sm font-semibold text-blue-200 truncate max-w-xs">{planName}</span>
                <button
                  onClick={() => { setRenameInput(planName); setIsRenamingPlan(true); }}
                  className="ml-1 p-0.5 rounded text-slate-500 hover:text-blue-300 transition-colors"
                  title="Rename plan"
                >
                  <Pencil className="w-3 h-3" />
                </button>
              </div>
              {savedAt && (
                <span className="text-xs text-slate-500 hidden sm:block">
                  Last saved: {savedAt}
                </span>
              )}
            </div>
          )}

          {/* Inline Rename Input */}
          {isRenamingPlan && (
            <div className="flex items-center gap-2 mt-2">
              <input
                autoFocus
                type="text"
                value={renameInput}
                onChange={(e) => setRenameInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRenamePlan();
                  if (e.key === 'Escape') setIsRenamingPlan(false);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-blue-500 focus:ring-2 focus:ring-blue-500/30 text-white text-sm outline-none w-64"
              />
              <button
                onClick={handleRenamePlan}
                className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                title="Save name"
              >
                <Save className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsRenamingPlan(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"
                title="Cancel"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {!planName && (
            <p className="text-sm text-slate-400 mt-1">
              Upload custom blueprint images, place rooms/waypoints, and drag elements to customize your indoor map layout.
            </p>
          )}
        </div>

        {/* New Plan Button */}
        <button
          onClick={() => { setPlanNameInput(''); setShowNewPlanModal(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 hover:border-blue-500/40 text-slate-300 hover:text-blue-300 text-sm font-medium transition-all shrink-0"
        >
          <FolderPlus className="w-4 h-4" />
          New Plan
        </button>
      </div>

      {/* ── Editor Toolbar ────────────────────────────────────────── */}
      <EditorToolbar
        activeTool={activeTool}
        onToolSelect={setActiveTool}
        onSaveLayout={handleSaveLayout}
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

      {/* ── Editor Main Section ───────────────────────────────────── */}
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
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <span>
                  <strong>Rotate Corridors &amp; Elements:</strong> Click the <strong>↻ rotate handle</strong> on canvas, press <strong>R key</strong>, or use the <strong>Inspector rotation slider / preset buttons (0°–360°)</strong>.
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

      {/* ── Save Layout Success Modal ─────────────────────────────── */}
      <Modal isOpen={isSavedModalOpen} onClose={() => setIsSavedModalOpen(false)} title="Floor Plan Saved">
        <div className="text-center space-y-4 py-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-600/15 border border-blue-500/30 rounded-xl px-4 py-1.5 mb-3">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span className="text-base font-bold text-blue-200">{planName}</span>
            </div>
            <h4 className="text-base font-bold text-white">Floor Layout Synchronized!</h4>
            <p className="text-xs text-slate-400 mt-1">
              Your floor layout updates ({items.length} item{items.length !== 1 ? 's' : ''} — rooms, corridors, doors, and waypoints) have been compiled into the navigation graph.
            </p>
            {savedAt && (
              <p className="text-xs text-slate-500 mt-2">Saved at {savedAt}</p>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
