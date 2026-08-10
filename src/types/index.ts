export type NodeType = 'room' | 'door' | 'corridor' | 'junction' | 'elevator' | 'stairs' | 'entrance';

export interface MapNode {
  id: string;
  name: string;
  type: NodeType;
  x: number; // percentage or canvas offset
  y: number;
  floorId: string;
  roomCode?: string;
  accessible?: boolean;
  /** If true, this node is an internal routing waypoint (e.g. corridor endpoint)
   *  and should not appear in user-facing location dropdowns. */
  isInternal?: boolean;
}

export interface MapEdge {
  id: string;
  sourceId: string;
  targetId: string;
  distance: number; // in meters
  accessible: boolean;
}

export interface RoomZone {
  id: string;
  code: string;
  name: string;
  category: 'classroom' | 'lab' | 'office' | 'facility' | 'hall' | 'restroom';
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  floorId: string;
}

export interface FloorPlan {
  id: string;
  buildingId: string;
  floorNumber: number;
  name: string;
  levelLabel: string; // e.g. "Ground Floor (GF)"
  roomsCount: number;
  nodesCount: number;
  updatedAt: string;
  svgBlueprint?: string;
}

export interface Building {
  id: string;
  name: string;
  tagline: string;
  address: string;
  floorsCount: number;
  totalRooms: number;
  totalNodes: number;
  status: 'Active' | 'Draft' | 'Maintenance';
  thumbnail: string;
  floors: FloorPlan[];
}

export interface RouteInstruction {
  step: number;
  text: string;
  distanceMeters: number;
  icon: 'walk' | 'turn-left' | 'turn-right' | 'stairs' | 'elevator' | 'destination';
}

export interface RouteResult {
  pathNodes: MapNode[];
  edges: MapEdge[];
  totalDistanceMeters: number;
  estimatedWalkTimeMinutes: number;
  instructions: RouteInstruction[];
}
