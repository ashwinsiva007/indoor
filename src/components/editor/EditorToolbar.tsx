'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Square, DoorClosed, GitCommit, Waypoints, Save, Trash2, Undo, Redo, MousePointer } from 'lucide-react';
import { clsx } from 'clsx';

export type ToolMode = 'select' | 'add-room' | 'add-door' | 'add-corridor' | 'add-junction';

interface EditorToolbarProps {
  activeTool: ToolMode;
  onToolSelect: (tool: ToolMode) => void;
  onSaveLayout: () => void;
  onClearCanvas: () => void;
  itemCount: number;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  activeTool,
  onToolSelect,
  onSaveLayout,
  onClearCanvas,
  itemCount,
}) => {
  const tools = [
    { id: 'select' as ToolMode, label: 'Select / Move', icon: MousePointer },
    { id: 'add-room' as ToolMode, label: 'Add Room', icon: Square },
    { id: 'add-door' as ToolMode, label: 'Add Door', icon: DoorClosed },
    { id: 'add-corridor' as ToolMode, label: 'Add Corridor', icon: GitCommit },
    { id: 'add-junction' as ToolMode, label: 'Add Junction', icon: Waypoints },
  ];

  return (
    <div className="glass-card rounded-2xl p-3.5 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
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
          title="Reset Canvas"
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
  );
};
