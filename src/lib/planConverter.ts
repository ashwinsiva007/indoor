/**
 * planConverter.ts
 * ────────────────────────────────────────────────────────
 * Converts Editor-saved CustomItem[] (rooms, corridors,
 * junctions, doors) into the MapNode[], MapEdge[], and
 * RoomZone[] shapes expected by the Live Route Visualizer.
 *
 * Strategy:
 *  - Each room/door/junction → a MapNode at its centre
 *  - Each corridor → a MapNode at its midpoint
 *  - Nearby nodes (within CONNECTION_RADIUS px) get edges
 *    automatically (Euclidean distance as weight)
 *  - Rooms also produce a RoomZone for SVG rendering
 */

import { MapNode, MapEdge, RoomZone, NodeType } from '@/types';

export interface CustomItem {
  id: string;
  type: 'room' | 'door' | 'corridor' | 'junction';
  name: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
  rotation?: number;
}

export interface SavedPlan {
  id: string;
  name: string;
  createdAt: string;
  items: CustomItem[];
}

/** Maximum distance (px) within which two nodes are auto-connected */
const CONNECTION_RADIUS = 260;

/** Maps editor item type → MapNode type */
function toNodeType(type: CustomItem['type']): NodeType {
  switch (type) {
    case 'room':     return 'room';
    case 'door':     return 'door';
    case 'junction': return 'junction';
    case 'corridor': return 'corridor';
    default:         return 'room';
  }
}

/** Centre x of an editor item */
function cx(item: CustomItem): number {
  return item.x + (item.w ?? 20) / 2;
}

/** Centre y of an editor item */
function cy(item: CustomItem): number {
  return item.y + (item.h ?? 20) / 2;
}

/** Euclidean distance between two items */
function dist(a: CustomItem, b: CustomItem): number {
  return Math.sqrt((cx(a) - cx(b)) ** 2 + (cy(a) - cy(b)) ** 2);
}

export function convertPlanToNavData(items: CustomItem[]): {
  nodes: MapNode[];
  edges: MapEdge[];
  rooms: RoomZone[];
} {
  // ── Nodes ──────────────────────────────────────────────
  const nodes: MapNode[] = items.map((item) => ({
    id: item.id,
    name: item.name,
    type: toNodeType(item.type),
    x: Math.round(cx(item)),
    y: Math.round(cy(item)),
    floorId: 'custom-plan',
    accessible: true,
  }));

  // ── Edges (proximity-based) ────────────────────────────
  const edges: MapEdge[] = [];
  let edgeIdx = 0;

  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const d = dist(items[i], items[j]);
      if (d <= CONNECTION_RADIUS) {
        edges.push({
          id: `ce_${edgeIdx++}`,
          sourceId: items[i].id,
          targetId: items[j].id,
          distance: Math.round(d * 0.12), // scale px → notional metres
          accessible: true,
        });
      }
    }
  }

  // ── RoomZones (only for 'room' items) ─────────────────
  const CATEGORY_MAP: Record<string, RoomZone['category']> = {
    lab:        'lab',
    office:     'office',
    hall:       'hall',
    restroom:   'restroom',
    classroom:  'classroom',
    facility:   'facility',
  };

  const ROOM_COLORS = [
    '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b',
    '#10b981', '#06b6d4', '#6366f1', '#14b8a6',
  ];

  const rooms: RoomZone[] = items
    .filter((item) => item.type === 'room')
    .map((item, idx) => {
      // Guess category from name keywords
      const lower = item.name.toLowerCase();
      let category: RoomZone['category'] = 'facility';
      for (const [keyword, cat] of Object.entries(CATEGORY_MAP)) {
        if (lower.includes(keyword)) { category = cat; break; }
      }

      return {
        id: `rz_${item.id}`,
        code: item.name.slice(0, 6).toUpperCase().replace(/\s+/g, '-'),
        name: item.name,
        category,
        x: item.x,
        y: item.y,
        width:  item.w ?? 120,
        height: item.h ?? 80,
        color:  ROOM_COLORS[idx % ROOM_COLORS.length],
        floorId: 'custom-plan',
      };
    });

  return { nodes, edges, rooms };
}

/** Load all saved plans from localStorage (safe for SSR) */
export function loadSavedPlans(): SavedPlan[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('indoor_saved_plans');
    return raw ? (JSON.parse(raw) as SavedPlan[]) : [];
  } catch {
    return [];
  }
}
