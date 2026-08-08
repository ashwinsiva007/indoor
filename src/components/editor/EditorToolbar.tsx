'use client';

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Square, DoorClosed, GitCommit, Waypoints, Save, Trash2, MousePointer, Upload, Image, ImageOff, Eye } from 'lucide-react';
import { clsx } from 'clsx';

export type ToolMode = 'select' | 'add-room' | 'add-door' | 'add-corridor' | 'add-junction';

interface EditorToolbarProps {
  activeTool: ToolMode;
  onToolSelect: (tool: ToolMode) => void;
  onSaveLayout: () => void;
  onClearCanvas: () => void;
  itemCount: number;
  blueprintUrl: string | null;
  blueprintOpacity: number;
  onBlueprintUpload: (file: File) => void;
  onBlueprintRemove: () => void;
  onBlueprintOpacityChange: (opacity: number) => void;
  onLoadSampleBlueprint: () => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  activeTool,
  onToolSelect,
  onSaveLayout,
  onClearCanvas,
  itemCount,
  blueprintUrl,
  blueprintOpacity,
  onBlueprintUpload,
  onBlueprintRemove,
  onBlueprintOpacityChange,
  onLoadSampleBlueprint,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onBlueprintUpload(file);
      // Reset input value so re-uploading the same file triggers onChange
      e.target.value = '';
    }
  };

  const tools = [
    { id: 'select' as ToolMode, label: 'Select / Move', icon: MousePointer },
    { id: 'add-room' as ToolMode, label: 'Add Room', icon: Square },
    { id: 'add-door' as ToolMode, label: 'Add Door', icon: DoorClosed },
    { id: 'add-corridor' as ToolMode, label: 'Add Corridor', icon: GitCommit },
    { id: 'add-junction' as ToolMode, label: 'Add Junction', icon: Waypoints },
  ];

  return (
    <div className="glass-card rounded-2xl p-3.5 border border-slate-800/80 space-y-3">
      {/* Top Row: Tool Selection & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left Tools Group */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {tools.map((t) => {
            const Icon = t.icon;
            const isActive = activeTool === t.id;

            return (
              <button
                key={t.id}
                onClick={() => onToolSelect(t.id)}
                className={clsx(
                  'flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150',
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Actions Group */}
        <div className="flex items-center gap-2">
          <div className="text-xs text-slate-500 font-mono hidden md:block">
            Placed Items: <span className="text-blue-400 font-bold">{itemCount}</span>
          </div>

          <button
            onClick={onClearCanvas}
            className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
            title="Reset Canvas Elements"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <Button
            variant="primary"
            size="sm"
            onClick={onSaveLayout}
            icon={<Save className="w-4 h-4" />}
            className="shadow-blue-600/20"
          >
            Save Layout
          </Button>
        </div>
      </div>

      {/* Bottom Row: Blueprint Background Controls */}
      <div className="pt-2 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,.svg"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-blue-400 border border-blue-500/30 hover:border-blue-500/60 transition-all font-medium"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Blueprint Image</span>
          </button>

          {!blueprintUrl && (
            <button
              onClick={onLoadSampleBlueprint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/50 transition-all"
            >
              <Image className="w-3.5 h-3.5 text-cyan-400" />
              <span>Use Sample Plan</span>
            </button>
          )}

          {blueprintUrl && (
            <button
              onClick={onBlueprintRemove}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-red-400 border border-slate-800 transition-all"
              title="Remove blueprint image"
            >
              <ImageOff className="w-3.5 h-3.5" />
              <span>Remove Plan</span>
            </button>
          )}
        </div>

        {blueprintUrl && (
          <div className="flex items-center gap-3 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-400">
            <div className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-blue-400" />
              <span>Blueprint Opacity:</span>
              <span className="font-mono text-white font-semibold">{Math.round(blueprintOpacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={blueprintOpacity}
              onChange={(e) => onBlueprintOpacityChange(parseFloat(e.target.value))}
              className="w-24 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        )}
      </div>
    </div>
  );
};

