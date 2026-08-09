'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { GROUND_FLOOR_NODES, GROUND_FLOOR_EDGES, GROUND_FLOOR_ROOMS } from '@/data/mockData';
import { MapNode, MapEdge, RoomZone, RouteResult } from '@/types';
import { findRoute } from '@/lib/pathfinder';
import { loadSavedPlans, convertPlanToNavData, SavedPlan } from '@/lib/planConverter';
import { FloorMapVisualizer } from '@/components/navigation/FloorMapVisualizer';
import { NavigationControls } from '@/components/navigation/NavigationControls';
import { TurnByTurnDrawer } from '@/components/navigation/TurnByTurnDrawer';
import {
  Navigation, Sparkles, Layers, ChevronDown,
  MapPin, FolderOpen, Database, CheckCircle2,
} from 'lucide-react';

// ── Default (built-in) plan ──────────────────────────────────────────────────
const DEFAULT_PLAN_ID = '__builtin__';
const DEFAULT_LABEL   = 'College Main Block — Ground Floor (Demo)';

export default function NavigationPage() {
  // Plan selector state
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [activePlanId, setActivePlanId] = useState<string>(DEFAULT_PLAN_ID);
  const [showPlanPicker, setShowPlanPicker] = useState(false);

  // Active nav graph
  const [nodes, setNodes] = useState<MapNode[]>(GROUND_FLOOR_NODES);
  const [edges, setEdges] = useState<MapEdge[]>(GROUND_FLOOR_EDGES);
  const [rooms, setRooms] = useState<RoomZone[]>(GROUND_FLOOR_ROOMS);
  const [planLabel, setPlanLabel] = useState(DEFAULT_LABEL);

  // Route state
  const [sourceId, setSourceId] = useState<string>('');
  const [destId,   setDestId]   = useState<string>('');
  const [accessibleOnly, setAccessibleOnly] = useState(false);
  const [routeResult,   setRouteResult]     = useState<RouteResult | null>(null);

  // ── Load saved plans on mount ──────────────────────────────────────────────
  useEffect(() => {
    setSavedPlans(loadSavedPlans());
  }, []);

  // ── Switch plan ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (activePlanId === DEFAULT_PLAN_ID) {
      setNodes(GROUND_FLOOR_NODES);
      setEdges(GROUND_FLOOR_EDGES);
      setRooms(GROUND_FLOOR_ROOMS);
      setPlanLabel(DEFAULT_LABEL);
      setSourceId(GROUND_FLOOR_NODES[0]?.id ?? '');
      setDestId(GROUND_FLOOR_NODES[1]?.id ?? '');
      setRouteResult(null);
      return;
    }

    const plan = savedPlans.find((p) => p.id === activePlanId);
    if (!plan || plan.items.length === 0) return;

    const { nodes: n, edges: e, rooms: r } = convertPlanToNavData(plan.items);
    setNodes(n);
    setEdges(e);
    setRooms(r);
    setPlanLabel(`${plan.name} (Custom Plan)`);
    setSourceId(n[0]?.id ?? '');
    setDestId(n[n.length - 1]?.id ?? '');
    setRouteResult(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePlanId, savedPlans]);

  // ── Route handlers ─────────────────────────────────────────────────────────
  const handleFindRoute = () => {
    if (!sourceId || !destId) return;
    setRouteResult(findRoute(sourceId, destId, nodes, edges, accessibleOnly));
  };

  const handleSwapLocations = () => {
    setSourceId(destId);
    setDestId(sourceId);
  };

  const handleSelectNodeFromMap = (nodeId: string) => {
    if (nodeId === sourceId) return;
    setDestId(nodeId);
    setRouteResult(findRoute(sourceId, nodeId, nodes, edges, accessibleOnly));
  };

  // ── Reload saved plans (user may have just saved one) ─────────────────────
  const handleRefreshPlans = () => {
    setSavedPlans(loadSavedPlans());
  };

  const activePlan = savedPlans.find((p) => p.id === activePlanId);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* ── Top Banner ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Navigation className="w-7 h-7 text-blue-500" />
            Interactive 2D Route Visualizer
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">{planLabel}</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Live Dijkstra Path Finder</span>
          </div>

          {/* ── Plan Picker Dropdown ─────────────────────────────────────── */}
          <div className="relative">
            <button
              onClick={() => { handleRefreshPlans(); setShowPlanPicker((v) => !v); }}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 hover:border-blue-500/40 text-slate-200 text-xs font-semibold transition-all"
            >
              <Layers className="w-4 h-4 text-blue-400" />
              <span className="max-w-[140px] truncate">
                {activePlanId === DEFAULT_PLAN_ID ? 'Demo Plan' : (activePlan?.name ?? 'Select Plan')}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showPlanPicker && (
              <div className="absolute right-0 top-full mt-2 w-72 z-50 glass-card border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-3 border-b border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <FolderOpen className="w-3.5 h-3.5 text-blue-400" />
                    Select Floor Plan
                  </span>
                  <button
                    onClick={() => setShowPlanPicker(false)}
                    className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    Close
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto">
                  {/* Built-in demo */}
                  <button
                    onClick={() => { setActivePlanId(DEFAULT_PLAN_ID); setShowPlanPicker(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all hover:bg-slate-800/60 border-b border-slate-800/50 ${
                      activePlanId === DEFAULT_PLAN_ID ? 'bg-blue-600/10' : ''
                    }`}
                  >
                    <Database className="w-4 h-4 text-blue-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-100 truncate">College Main Block (Demo)</p>
                      <p className="text-xs text-slate-500">Built-in sample plan</p>
                    </div>
                    {activePlanId === DEFAULT_PLAN_ID && (
                      <CheckCircle2 className="w-4 h-4 text-blue-400 ml-auto shrink-0" />
                    )}
                  </button>

                  {/* Saved custom plans */}
                  {savedPlans.length === 0 ? (
                    <div className="px-4 py-6 text-center">
                      <MapPin className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                      <p className="text-xs text-slate-500">No custom plans saved yet.</p>
                      <p className="text-xs text-slate-600 mt-1">
                        Go to <strong className="text-slate-400">Floor Layout Editor</strong> to design and save one.
                      </p>
                    </div>
                  ) : (
                    savedPlans.map((plan) => (
                      <button
                        key={plan.id}
                        onClick={() => { setActivePlanId(plan.id); setShowPlanPicker(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all hover:bg-slate-800/60 border-b border-slate-800/50 last:border-0 ${
                          activePlanId === plan.id ? 'bg-blue-600/10' : ''
                        }`}
                      >
                        <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-100 truncate">{plan.name}</p>
                          <p className="text-xs text-slate-500">
                            {plan.items.length} items · Saved {plan.createdAt}
                          </p>
                        </div>
                        {activePlanId === plan.id && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-auto shrink-0" />
                        )}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Grid ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left Column: Route Controls & Turn-by-Turn */}
        <div className="lg:col-span-4 space-y-6">
          {nodes.length > 0 ? (
            <>
              <NavigationControls
                nodes={nodes}
                sourceId={sourceId}
                destId={destId}
                accessibleOnly={accessibleOnly}
                onSourceChange={setSourceId}
                onDestChange={setDestId}
                onAccessibleChange={setAccessibleOnly}
                onFindRoute={handleFindRoute}
                onSwapLocations={handleSwapLocations}
              />
              <TurnByTurnDrawer routeResult={routeResult} />
            </>
          ) : (
            <div className="glass-card rounded-2xl p-6 border border-slate-800/80 text-center">
              <MapPin className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-slate-400">
                This plan has no items yet. Add rooms and junctions in the Floor Layout Editor first.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Interactive SVG Floor Map */}
        <div className="lg:col-span-8">
          <FloorMapVisualizer
            routeResult={routeResult}
            selectedSourceId={sourceId}
            selectedDestId={destId}
            onSelectNode={handleSelectNodeFromMap}
            rooms={rooms}
            nodes={nodes}
            planLabel={planLabel}
          />
        </div>
      </div>

      {/* Click-outside overlay to close picker */}
      {showPlanPicker && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowPlanPicker(false)}
        />
      )}
    </div>
  );
}
