/**
 * planConverter.ts
 * ────────────────────────────────────────────────────────
 * Converts Editor-saved CustomItem[] (rooms, corridors,
 * junctions, doors) into the MapNode[], MapEdge[], and
 * RoomZone[] shapes expected by the Live Route Visualizer.
 *
 * Corridor-Aware Topology Strategy:
 *  - Each room/door/junction → a MapNode at its centre
 *  - Each corridor → THREE nodes: left endpoint (_L), midpoint, right endpoint (_R)
 *    with internal edges L→mid and mid→R (path stays on corridor line)
 *  - Corridor endpoints on the same side connect vertically (simulating the
 *    side-wall walkway — e.g. left side of building, right side of building)
 *  - Room nodes connect ONLY to their nearest corridor endpoint(s) within
 *    ROOM_CORRIDOR_SNAP px (no cross-floor-plan direct connections)
 *  - This prevents diagonal shortcuts — all routes stay inside corridors
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

// ─── Tuning constants ────────────────────────────────────────────────────────

/** Max distance (px) from a room/junction centre to a corridor endpoint to auto-connect.
 *  Should be a bit larger than half of a typical room width. */
const ROOM_CORRIDOR_SNAP = 150;

/** Two corridor endpoints are considered a shared junction if they are within this distance. */
const JUNCTION_SNAP = 55;

/** Two corridor endpoints are "on the same side wall" if their X coords differ by less than
 *  this amount (regardless of Y). They get a vertical side-wall edge. */
const SAME_SIDE_X_GAP = 160;

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

/** Rotate a point (px, py) around pivot (ox, oy) by angleDeg degrees */
function rotatePoint(
  px: number, py: number,
  ox: number, oy: number,
  angleDeg: number,
): { x: number; y: number } {
  const rad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const dx = px - ox;
  const dy = py - oy;
  return {
    x: Math.round(ox + dx * cos - dy * sin),
    y: Math.round(oy + dx * sin + dy * cos),
  };
}

interface CorridorGeometry {
  itemId: string;
  /** Actual left/top endpoint after rotation */
  L: { x: number; y: number };
  /** Midpoint (rotation pivot) */
  mid: { x: number; y: number };
  /** Actual right/bottom endpoint after rotation */
  R: { x: number; y: number };
}

/** Compute real-world endpoint coordinates for a corridor item (handles rotation). */
function getCorridorGeometry(item: CustomItem): CorridorGeometry {
  const w    = item.w ?? 140;
  const rot  = item.rotation ?? 0;
  // The corridor is a horizontal line from (item.x, item.y) to (item.x+w, item.y).
  // The rotation pivot used in EditorCanvas is the midpoint (item.x+w/2, item.y).
  const pivotX = item.x + w / 2;
  const pivotY = item.y;
  const L   = rotatePoint(item.x,     item.y, pivotX, pivotY, rot);
  const R   = rotatePoint(item.x + w, item.y, pivotX, pivotY, rot);
  const mid = { x: pivotX, y: pivotY }; // pivot never moves
  return { itemId: item.id, L, R, mid };
}

// ─── Main converter ───────────────────────────────────────────────────────────

export function convertPlanToNavData(items: CustomItem[]): {
  nodes: MapNode[];
  edges: MapEdge[];
  rooms: RoomZone[];
} {
  const corridors    = items.filter((i) => i.type === 'corridor');
  const nonCorridors = items.filter((i) => i.type !== 'corridor');

  const corridorGeos = corridors.map(getCorridorGeometry);

  const nodes: MapNode[] = [];
  const edges: MapEdge[] = [];
  let edgeIdx = 0;

  // ── Step 1: Non-corridor nodes (room, junction, door) ─────────────────────
  for (const item of nonCorridors) {
    nodes.push({
      id:         item.id,
      name:       item.name,
      type:       toNodeType(item.type),
      x:          Math.round(cx(item)),
      y:          Math.round(cy(item)),
      floorId:    'custom-plan',
      accessible: true,
    });
  }

  // ── Step 2: Corridor nodes (3 per corridor: _L, mid, _R) ──────────────────
  for (const geo of corridorGeos) {
    const item    = corridors.find((c) => c.id === geo.itemId)!;
    const halfW   = (item.w ?? 140) / 2;
    const halfDist = Math.max(1, Math.round(halfW * 0.12));

    // Left endpoint — internal routing node
    nodes.push({
      id:         `${item.id}_L`,
      name:       `${item.name} (entry)`,
      type:       'corridor',
      x:          geo.L.x,
      y:          geo.L.y,
      floorId:    'custom-plan',
      accessible: true,
      isInternal: true,
    });

    // Midpoint — display node (carries the label)
    nodes.push({
      id:         item.id,
      name:       item.name,
      type:       'corridor',
      x:          geo.mid.x,
      y:          geo.mid.y,
      floorId:    'custom-plan',
      accessible: true,
      isInternal: true,
    });

    // Right endpoint — internal routing node
    nodes.push({
      id:         `${item.id}_R`,
      name:       `${item.name} (exit)`,
      type:       'corridor',
      x:          geo.R.x,
      y:          geo.R.y,
      floorId:    'custom-plan',
      accessible: true,
      isInternal: true,
    });

    // Internal corridor edges: L ↔ mid ↔ R
    edges.push({ id: `ce_${edgeIdx++}`, sourceId: `${item.id}_L`, targetId: item.id,       distance: halfDist, accessible: true });
    edges.push({ id: `ce_${edgeIdx++}`, sourceId: item.id,         targetId: `${item.id}_R`, distance: halfDist, accessible: true });
  }

  // ── Step 3: Collect all corridor endpoint positions ────────────────────────
  const allEndpoints = corridorGeos.flatMap((geo) => [
    { id: `${geo.itemId}_L`, x: geo.L.x,   y: geo.L.y   },
    { id: `${geo.itemId}_R`, x: geo.R.x,   y: geo.R.y   },
  ]);

  // ── Step 4: Corridor junction edges (two endpoints co-located = shared T/X junction) ──
  for (let i = 0; i < allEndpoints.length; i++) {
    for (let j = i + 1; j < allEndpoints.length; j++) {
      const a = allEndpoints[i];
      const b = allEndpoints[j];
      const d = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
      if (d <= JUNCTION_SNAP) {
        edges.push({
          id:         `ce_${edgeIdx++}`,
          sourceId:   a.id,
          targetId:   b.id,
          distance:   Math.max(1, Math.round(d * 0.12)),
          accessible: true,
        });
      }
    }
  }

  // ── Step 5: Same-side vertical wall connections ────────────────────────────
  // Corridor endpoints with similar X coordinates are on the same building side
  // (left wall or right wall). Connect them vertically so users can walk along
  // the wall from one corridor row to another.
  for (let i = 0; i < allEndpoints.length; i++) {
    for (let j = i + 1; j < allEndpoints.length; j++) {
      const a = allEndpoints[i];
      const b = allEndpoints[j];
      const dx = Math.abs(a.x - b.x);
      const dy = Math.abs(a.y - b.y);
      const d  = Math.sqrt(dx ** 2 + dy ** 2);

      // Same side (similar X) but NOT already handled by junction snap
      if (dx <= SAME_SIDE_X_GAP && dy > JUNCTION_SNAP) {
        edges.push({
          id:         `ce_${edgeIdx++}`,
          sourceId:   a.id,
          targetId:   b.id,
          distance:   Math.max(1, Math.round(d * 0.12)),
          accessible: true,
        });
      }
    }
  }

  // ── Step 6: Room/junction/door → nearest corridor endpoint(s) ─────────────
  // Each non-corridor item connects to every corridor endpoint within
  // ROOM_CORRIDOR_SNAP px.  This snaps rooms to the corridors that border them,
  // preventing diagonal cross-floor connections.
  for (const item of nonCorridors) {
    const rx = Math.round(cx(item));
    const ry = Math.round(cy(item));

    for (const ep of allEndpoints) {
      const d = Math.sqrt((rx - ep.x) ** 2 + (ry - ep.y) ** 2);
      if (d <= ROOM_CORRIDOR_SNAP) {
        edges.push({
          id:         `ce_${edgeIdx++}`,
          sourceId:   item.id,
          targetId:   ep.id,
          distance:   Math.max(1, Math.round(d * 0.12)),
          accessible: true,
        });
      }
    }
  }

  // ── Step 7: Same-side room connections ────────────────────────────────────
  // Rooms/junctions on the same wall (similar X) can also connect vertically
  // to each other (walking along the side corridor/lobby).
  for (let i = 0; i < nonCorridors.length; i++) {
    for (let j = i + 1; j < nonCorridors.length; j++) {
      const a  = nonCorridors[i];
      const b  = nonCorridors[j];
      const ax = Math.round(cx(a)), ay = Math.round(cy(a));
      const bx = Math.round(cx(b)), by = Math.round(cy(b));
      const dx = Math.abs(ax - bx);
      const dy = Math.abs(ay - by);
      const d  = Math.sqrt(dx ** 2 + dy ** 2);

      if (dx <= SAME_SIDE_X_GAP && dy > 10) {
        edges.push({
          id:         `ce_${edgeIdx++}`,
          sourceId:   a.id,
          targetId:   b.id,
          distance:   Math.max(1, Math.round(d * 0.12)),
          accessible: true,
        });
      }
    }
  }

  // ── Fallback: If no corridors exist, fall back to old proximity-based edges ─
  if (corridors.length === 0) {
    const FALLBACK_RADIUS = 260;
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const ax = Math.round(cx(items[i])), ay = Math.round(cy(items[i]));
        const bx = Math.round(cx(items[j])), by = Math.round(cy(items[j]));
        const d  = Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
        if (d <= FALLBACK_RADIUS) {
          edges.push({
            id:         `ce_${edgeIdx++}`,
            sourceId:   items[i].id,
            targetId:   items[j].id,
            distance:   Math.max(1, Math.round(d * 0.12)),
            accessible: true,
          });
        }
      }
    }
  }

  // ── RoomZones (only for 'room' items — SVG visual layer) ──────────────────
  const CATEGORY_MAP: Record<string, RoomZone['category']> = {
    lab:       'lab',
    office:    'office',
    hall:      'hall',
    restroom:  'restroom',
    classroom: 'classroom',
    facility:  'facility',
  };

  const ROOM_COLORS = [
    '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b',
    '#10b981', '#06b6d4', '#6366f1', '#14b8a6',
  ];

  const rooms: RoomZone[] = items
    .filter((item) => item.type === 'room')
    .map((item, idx) => {
      const lower = item.name.toLowerCase();
      let category: RoomZone['category'] = 'facility';
      for (const [keyword, cat] of Object.entries(CATEGORY_MAP)) {
        if (lower.includes(keyword)) { category = cat; break; }
      }
      return {
        id:       `rz_${item.id}`,
        code:     item.name.slice(0, 6).toUpperCase().replace(/\s+/g, '-'),
        name:     item.name,
        category,
        x:        item.x,
        y:        item.y,
        width:    item.w ?? 120,
        height:   item.h ?? 80,
        color:    ROOM_COLORS[idx % ROOM_COLORS.length],
        floorId:  'custom-plan',
      };
    });

  return { nodes, edges, rooms };
}

// ── Load saved plans from localStorage ────────────────────────────────────────
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
