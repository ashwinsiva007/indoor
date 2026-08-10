import { MapNode, MapEdge, RouteResult, RouteInstruction } from '@/types';

export function findRoute(
  startNodeId: string,
  endNodeId: string,
  nodes: MapNode[],
  edges: MapEdge[],
  accessibleOnly: boolean = false
): RouteResult | null {
  const nodeMap = new Map<string, MapNode>();
  nodes.forEach(n => nodeMap.set(n.id, n));

  const startNode = nodeMap.get(startNodeId);
  const endNode = nodeMap.get(endNodeId);

  if (!startNode || !endNode) return null;

  // Build adjacency list
  const adj = new Map<string, Array<{ targetId: string; distance: number; edge: MapEdge }>>();
  nodes.forEach(n => adj.set(n.id, []));

  edges.forEach(edge => {
    if (accessibleOnly && !edge.accessible) return;
    
    if (adj.has(edge.sourceId)) {
      adj.get(edge.sourceId)!.push({ targetId: edge.targetId, distance: edge.distance, edge });
    }
    if (adj.has(edge.targetId)) {
      adj.get(edge.targetId)!.push({ targetId: edge.sourceId, distance: edge.distance, edge });
    }
  });

  // Dijkstra's algorithm
  const distances = new Map<string, number>();
  const previous = new Map<string, string>();
  const unvisited = new Set<string>();

  nodes.forEach(node => {
    distances.set(node.id, Infinity);
    unvisited.add(node.id);
  });

  distances.set(startNodeId, 0);

  while (unvisited.size > 0) {
    // Find node with min distance
    let currentId: string | null = null;
    let minDist = Infinity;

    unvisited.forEach(nodeId => {
      const dist = distances.get(nodeId)!;
      if (dist < minDist) {
        minDist = dist;
        currentId = nodeId;
      }
    });

    if (!currentId || minDist === Infinity) break;
    if (currentId === endNodeId) break;

    unvisited.delete(currentId);

    const neighbors = adj.get(currentId) || [];
    for (const neighbor of neighbors) {
      if (!unvisited.has(neighbor.targetId)) continue;
      const alt = distances.get(currentId)! + neighbor.distance;
      if (alt < distances.get(neighbor.targetId)!) {
        distances.set(neighbor.targetId, alt);
        previous.set(neighbor.targetId, currentId);
      }
    }
  }

  // Reconstruct path
  const pathNodeIds: string[] = [];
  let curr: string | undefined = endNodeId;

  if (distances.get(endNodeId) === Infinity) {
    // No reachable path — return null so the map shows nothing instead of a
    // misleading diagonal straight line.
    return null;
  }

  while (curr) {
    pathNodeIds.unshift(curr);
    curr = previous.get(curr);
  }

  // Guard: if path reconstruction failed (shouldn't happen) return null
  if (pathNodeIds.length < 2) return null;

  const pathNodes = pathNodeIds.map(id => nodeMap.get(id)!).filter(Boolean);

  // Calculate path edges
  const pathEdges: MapEdge[] = [];
  let totalDistanceMeters = 0;

  for (let i = 0; i < pathNodes.length - 1; i++) {
    const u = pathNodes[i].id;
    const v = pathNodes[i + 1].id;

    const matchedEdge = edges.find(
      e => (e.sourceId === u && e.targetId === v) || (e.sourceId === v && e.targetId === u)
    );

    if (matchedEdge) {
      pathEdges.push(matchedEdge);
      totalDistanceMeters += matchedEdge.distance;
    } else {
      // Calculate euclidean distance fallback
      const dx = pathNodes[i + 1].x - pathNodes[i].x;
      const dy = pathNodes[i + 1].y - pathNodes[i].y;
      const dist = Math.round(Math.sqrt(dx * dx + dy * dy) * 0.4);
      totalDistanceMeters += dist;
    }
  }

  const estimatedWalkTimeMinutes = Math.max(1, Math.round(totalDistanceMeters / 60)); // ~1m/s walking speed

  // Generate step-by-step instructions
  const instructions: RouteInstruction[] = [];
  instructions.push({
    step: 1,
    text: `Start at ${startNode.name}`,
    distanceMeters: 0,
    icon: 'walk',
  });

  for (let i = 1; i < pathNodes.length - 1; i++) {
    const node = pathNodes[i];
    let icon: RouteInstruction['icon'] = 'walk';
    
    if (node.type === 'stairs') icon = 'stairs';
    else if (node.type === 'elevator') icon = 'elevator';
    else if (node.x > pathNodes[i - 1].x) icon = 'turn-right';
    else icon = 'turn-left';

    instructions.push({
      step: i + 1,
      text: `Pass by ${node.name}`,
      distanceMeters: Math.round(totalDistanceMeters / (pathNodes.length - 1)),
      icon,
    });
  }

  instructions.push({
    step: pathNodes.length,
    text: `Arrive at your destination: ${endNode.name}`,
    distanceMeters: 0,
    icon: 'destination',
  });

  return {
    pathNodes,
    edges: pathEdges,
    totalDistanceMeters,
    estimatedWalkTimeMinutes,
    instructions,
  };
}
