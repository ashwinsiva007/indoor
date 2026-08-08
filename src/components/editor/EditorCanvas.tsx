'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ToolMode } from './EditorToolbar';
import { CustomItem } from './InspectorPanel';
import { MousePointer, Move, Maximize2 } from 'lucide-react';

interface EditorCanvasProps {
  activeTool: ToolMode;
  items: CustomItem[];
  selectedItemId: string | null;
  onAddItem: (item: CustomItem) => void;
  onSelectItem: (id: string | null) => void;
  onUpdateItem: (id: string, updates: Partial<CustomItem>) => void;
  onDeleteItem?: (id: string) => void;
  blueprintUrl?: string | null;
  blueprintOpacity?: number;
}

interface DragState {
  id: string;
  isResizing: boolean;
  startMouseX: number;
  startMouseY: number;
  startItemX: number;
  startItemY: number;
  startItemW: number;
  startItemH: number;
}

export const EditorCanvas: React.FC<EditorCanvasProps> = ({
  activeTool,
  items,
  selectedItemId,
  onAddItem,
  onSelectItem,
  onUpdateItem,
  onDeleteItem,
  blueprintUrl = null,
  blueprintOpacity = 0.7,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [wasDragged, setWasDragged] = useState(false);

  // Helper to convert browser client mouse/touch coords into SVG viewBox coordinates (0..800, 0..540)
  const getSVGCoordsFromClient = useCallback((clientX: number, clientY: number) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = 800 / Math.max(rect.width, 1);
    const scaleY = 540 / Math.max(rect.height, 1);
    return {
      x: Math.round((clientX - rect.left) * scaleX),
      y: Math.round((clientY - rect.top) * scaleY),
    };
  }, []);

  const getSVGCoords = useCallback((e: React.MouseEvent<SVGSVGElement> | React.PointerEvent) => {
    return getSVGCoordsFromClient(e.clientX, e.clientY);
  }, [getSVGCoordsFromClient]);

  // Global drag handler with pointer events
  useEffect(() => {
    if (!dragState) return;

    const handlePointerMove = (e: PointerEvent) => {
      const { x, y } = getSVGCoordsFromClient(e.clientX, e.clientY);
      const dx = x - dragState.startMouseX;
      const dy = y - dragState.startMouseY;

      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
        setWasDragged(true);
      }

      if (dragState.isResizing) {
        const newW = Math.max(40, Math.min(700, dragState.startItemW + dx));
        const newH = Math.max(30, Math.min(500, dragState.startItemH + dy));
        onUpdateItem(dragState.id, { w: newW, h: newH });
      } else {
        const newX = Math.max(10, Math.min(760, dragState.startItemX + dx));
        const newY = Math.max(10, Math.min(510, dragState.startItemY + dy));
        onUpdateItem(dragState.id, { x: newX, y: newY });
      }
    };

    const handlePointerUp = () => {
      setDragState(null);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [dragState, getSVGCoordsFromClient, onUpdateItem]);

  // Keyboard navigation for selected items (Arrow keys, Delete, Backspace, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedItemId) return;
      
      const activeTag = (document.activeElement?.tagName || '').toUpperCase();
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(activeTag)) return;

      const selectedItem = items.find((i) => i.id === selectedItemId);
      if (!selectedItem) return;

      const step = e.shiftKey ? 10 : 2;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onUpdateItem(selectedItemId, { x: Math.max(10, selectedItem.x - step) });
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onUpdateItem(selectedItemId, { x: Math.min(760, selectedItem.x + step) });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        onUpdateItem(selectedItemId, { y: Math.max(10, selectedItem.y - step) });
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        onUpdateItem(selectedItemId, { y: Math.min(510, selectedItem.y + step) });
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (onDeleteItem) {
          e.preventDefault();
          onDeleteItem(selectedItemId);
        }
      } else if (e.key === 'Escape') {
        onSelectItem(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItemId, items, onUpdateItem, onDeleteItem, onSelectItem]);

  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (wasDragged) {
      setWasDragged(false);
      return;
    }

    if (activeTool === 'select') {
      onSelectItem(null);
      return;
    }

    const { x, y } = getSVGCoords(e);
    let newItem: CustomItem;

    if (activeTool === 'add-room') {
      newItem = {
        id: `room-${Date.now()}`,
        type: 'room',
        name: `New Room ${items.filter((i) => i.type === 'room').length + 1}`,
        x: Math.max(10, Math.min(680, x - 55)),
        y: Math.max(10, Math.min(460, y - 40)),
        w: 120,
        h: 80,
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
        x: Math.max(10, Math.min(650, x)),
        y,
        w: 140,
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

  const handleItemPointerDown = (
    e: React.PointerEvent,
    item: CustomItem,
    isResizing: boolean = false
  ) => {
    e.stopPropagation();
    onSelectItem(item.id);

    const { x, y } = getSVGCoords(e);
    setWasDragged(false);
    setDragState({
      id: item.id,
      isResizing,
      startMouseX: x,
      startMouseY: y,
      startItemX: item.x,
      startItemY: item.y,
      startItemW: item.w || 120,
      startItemH: item.h || 80,
    });
  };

  return (
    <div className="relative w-full h-[540px] bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl blueprint-grid overflow-hidden flex flex-col justify-between select-none">
      {/* Helper Tool Banner */}
      <div className="absolute top-4 left-4 z-10 px-3.5 py-2 rounded-xl glass-card text-xs text-slate-300 flex items-center gap-2.5 shadow-lg border border-slate-700/60 pointer-events-none">
        <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
        <div>
          Active Tool: <strong className="text-blue-400 capitalize">{activeTool.replace('-', ' ')}</strong>
          <span className="text-slate-400 ml-1.5 hidden sm:inline">
            {activeTool === 'select'
              ? '— Click any element to select, drag to reposition, or use arrow keys'
              : '— Click anywhere on map canvas to place new element'}
          </span>
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox="0 0 800 540"
        className={`w-full h-full ${
          activeTool === 'select'
            ? dragState
              ? 'cursor-grabbing'
              : 'cursor-default'
            : 'cursor-crosshair'
        }`}
        onClick={handleCanvasClick}
      >
        {/* Render Blueprint Image Background if uploaded */}
        {blueprintUrl && (
          <image
            href={blueprintUrl}
            x="0"
            y="0"
            width="800"
            height="540"
            preserveAspectRatio="xMidYMid slice"
            opacity={blueprintOpacity}
          />
        )}

        {/* Base Grid Reference Lines */}
        <line x1="400" y1="0" x2="400" y2="540" stroke="#334155" strokeDasharray="4 4" opacity="0.5" />
        <line x1="0" y1="270" x2="800" y2="270" stroke="#334155" strokeDasharray="4 4" opacity="0.5" />

        {/* Outer Floor Perimeter (shown clearly if no custom blueprint) */}
        {!blueprintUrl && (
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
        )}

        {/* Placed Interactive Layout Items */}
        {items.map((item) => {
          const isSelected = item.id === selectedItemId;

          if (item.type === 'room') {
            const w = item.w || 120;
            const h = item.h || 80;

            return (
              <g
                key={item.id}
                onPointerDown={(e) => handleItemPointerDown(e, item, false)}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectItem(item.id);
                }}
                className="cursor-move group"
              >
                {/* Selection Highlight Glow */}
                {isSelected && (
                  <rect
                    x={item.x - 4}
                    y={item.y - 4}
                    width={w + 8}
                    height={h + 8}
                    rx="12"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                    className="animate-pulse"
                  />
                )}

                {/* Room Fill Shape */}
                <rect
                  x={item.x}
                  y={item.y}
                  width={w}
                  height={h}
                  rx="8"
                  fill={isSelected ? '#1d4ed8' : '#1e293b'}
                  fillOpacity={isSelected ? '0.9' : '0.75'}
                  stroke={isSelected ? '#60a5fa' : '#3b82f6'}
                  strokeWidth={isSelected ? '2.5' : '1.5'}
                  className="transition-colors hover:stroke-blue-400"
                />

                {/* Room Label */}
                <text
                  x={item.x + w / 2}
                  y={item.y + h / 2 + 4}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="11"
                  fontWeight="600"
                  className="pointer-events-none select-none"
                >
                  {item.name}
                </text>

                {/* Dimension Badge for Selected Room */}
                {isSelected && (
                  <text
                    x={item.x + w / 2}
                    y={item.y + h - 8}
                    textAnchor="middle"
                    fill="#93c5fd"
                    fontSize="9"
                    fontFamily="monospace"
                    className="pointer-events-none select-none opacity-80"
                  >
                    {`${w}x${h}`}
                  </text>
                )}

                {/* Selected Room Resize Handle (Bottom-Right Corner) */}
                {isSelected && (
                  <g
                    onPointerDown={(e) => handleItemPointerDown(e, item, true)}
                    onClick={(e) => e.stopPropagation()}
                    className="cursor-nwse-resize"
                  >
                    <rect
                      x={item.x + w - 12}
                      y={item.y + h - 12}
                      width="16"
                      height="16"
                      rx="4"
                      fill="#3b82f6"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <path
                      d={`M ${item.x + w - 8} ${item.y + h - 4} L ${item.x + w - 4} ${item.y + h - 8}`}
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </g>
                )}
              </g>
            );
          }

          if (item.type === 'corridor') {
            const w = item.w || 140;
            return (
              <g
                key={item.id}
                onPointerDown={(e) => handleItemPointerDown(e, item, false)}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectItem(item.id);
                }}
                className="cursor-move group"
              >
                {isSelected && (
                  <line
                    x1={item.x - 4}
                    y1={item.y}
                    x2={item.x + w + 4}
                    y2={item.y}
                    stroke="#38bdf8"
                    strokeWidth="14"
                    opacity="0.3"
                    strokeLinecap="round"
                  />
                )}
                <line
                  x1={item.x}
                  y1={item.y}
                  x2={item.x + w}
                  y2={item.y}
                  stroke={isSelected ? '#38bdf8' : '#0284c7'}
                  strokeWidth="8"
                  strokeDasharray="6 3"
                />
                <circle cx={item.x} cy={item.y} r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
                <circle cx={item.x + w} cy={item.y} r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
                <text
                  x={item.x + w / 2}
                  y={item.y - 10}
                  textAnchor="middle"
                  fill="#7dd3fc"
                  fontSize="10"
                  fontWeight="bold"
                  className="pointer-events-none select-none"
                >
                  {item.name}
                </text>
              </g>
            );
          }

          if (item.type === 'door') {
            return (
              <g
                key={item.id}
                transform={`translate(${item.x}, ${item.y})`}
                onPointerDown={(e) => handleItemPointerDown(e, item, false)}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectItem(item.id);
                }}
                className="cursor-move group"
              >
                {isSelected && (
                  <circle
                    r="18"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                    className="animate-pulse"
                  />
                )}
                <rect
                  x="-12"
                  y="-12"
                  width="24"
                  height="24"
                  rx="6"
                  fill={isSelected ? '#f59e0b' : '#d97706'}
                  stroke="#ffffff"
                  strokeWidth={isSelected ? '2.5' : '1.5'}
                />
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="10"
                  fontWeight="bold"
                  className="pointer-events-none select-none"
                >
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
              onPointerDown={(e) => handleItemPointerDown(e, item, false)}
              onClick={(e) => {
                e.stopPropagation();
                onSelectItem(item.id);
              }}
              className="cursor-move group"
            >
              {isSelected && (
                <circle
                  r="16"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                  className="animate-pulse"
                />
              )}
              <circle
                r={isSelected ? '9' : '7'}
                fill={isSelected ? '#10b981' : '#059669'}
                stroke="#ffffff"
                strokeWidth={isSelected ? '2.5' : '1.5'}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};


