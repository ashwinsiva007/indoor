'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowUpDown,
  Car,
  Bike,
  Footprints,
  Bus,
  CornerUpRight,
  CornerUpLeft,
  ArrowUp,
  CheckCircle2,
  Navigation2,
  Clock,
  Milestone,
  Play,
  RotateCcw,
} from 'lucide-react';
import {
  CampusLocation,
  calculateCampusRoute,
  CAMPUS_LOCATIONS,
} from '@/data/campusLocations';

interface DirectionsPanelProps {
  origin: CampusLocation | { name: string; lat: number; lng: number } | null;
  destination: CampusLocation | { name: string; lat: number; lng: number } | null;
  locations: CampusLocation[];
  onSelectOrigin: (loc: CampusLocation) => void;
  onSelectDestination: (loc: CampusLocation) => void;
  onSwapLocations: () => void;
  onClose: () => void;
  onRouteCalculated: (route: {
    points: [number, number][];
    distanceMeters: number;
    durationMinutes: number;
  }) => void;
}

export default function DirectionsPanel({
  origin,
  destination,
  locations,
  onSelectOrigin,
  onSelectDestination,
  onSwapLocations,
  onClose,
  onRouteCalculated,
}: DirectionsPanelProps) {
  const [travelMode, setTravelMode] = useState<'walk' | 'bike' | 'drive' | 'transit'>('walk');
  const [isNavigating, setIsNavigating] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  // Compute route when origin or destination changes
  const [routeData, setRouteData] = useState<{
    points: [number, number][];
    distanceMeters: number;
    durationMinutes: number;
    instructions: { text: string; distance: number; icon: string }[];
  } | null>(null);

  useEffect(() => {
    if (origin && destination) {
      const res = calculateCampusRoute(
        origin.lat,
        origin.lng,
        destination.lat,
        destination.lng
      );

      // Adjust duration based on travel mode
      let adjustedDuration = res.durationMinutes;
      if (travelMode === 'drive' || travelMode === 'bike') {
        adjustedDuration = Math.max(1, Math.round(res.durationMinutes * 0.3));
      } else if (travelMode === 'transit') {
        adjustedDuration = Math.max(2, Math.round(res.durationMinutes * 0.6));
      }

      const finalRoute = {
        ...res,
        durationMinutes: adjustedDuration,
      };

      setRouteData(finalRoute);
      onRouteCalculated({
        points: finalRoute.points,
        distanceMeters: finalRoute.distanceMeters,
        durationMinutes: finalRoute.durationMinutes,
      });
    } else {
      setRouteData(null);
    }
  }, [origin, destination, travelMode]);

  const getStepIcon = (iconType: string) => {
    switch (iconType) {
      case 'turn-left':
        return <CornerUpLeft className="w-4 h-4 text-blue-500" />;
      case 'turn-right':
        return <CornerUpRight className="w-4 h-4 text-blue-500" />;
      case 'arrive':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'straight':
      default:
        return <ArrowUp className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="absolute top-4 left-4 z-40 w-[calc(100vw-32px)] sm:w-[420px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[calc(100vh-32px)] animate-in fade-in slide-in-from-left duration-300">
      {/* Header with Close and Mode Selector */}
      <div className="p-4 bg-slate-900 text-white flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <Navigation2 className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-sm font-bold tracking-wide">Campus Directions</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Travel Mode Icons (Google Maps style) */}
        <div className="flex items-center justify-around bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
          <button
            onClick={() => setTravelMode('walk')}
            className={`flex-1 py-1.5 flex flex-col items-center gap-0.5 rounded-lg text-[10px] font-semibold transition-all ${
              travelMode === 'walk'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Footprints className="w-4 h-4" />
            <span>Walk</span>
          </button>

          <button
            onClick={() => setTravelMode('bike')}
            className={`flex-1 py-1.5 flex flex-col items-center gap-0.5 rounded-lg text-[10px] font-semibold transition-all ${
              travelMode === 'bike'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bike className="w-4 h-4" />
            <span>Two-Wheeler</span>
          </button>

          <button
            onClick={() => setTravelMode('drive')}
            className={`flex-1 py-1.5 flex flex-col items-center gap-0.5 rounded-lg text-[10px] font-semibold transition-all ${
              travelMode === 'drive'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Drive</span>
          </button>

          <button
            onClick={() => setTravelMode('transit')}
            className={`flex-1 py-1.5 flex flex-col items-center gap-0.5 rounded-lg text-[10px] font-semibold transition-all ${
              travelMode === 'transit'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bus className="w-4 h-4" />
            <span>Bus Bay</span>
          </button>
        </div>
      </div>

      {/* Input Fields (Origin & Destination) */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
        {/* Connection Line with Dots */}
        <div className="flex flex-col items-center justify-between h-16 py-1">
          <div className="w-3 h-3 rounded-full border-2 border-emerald-500 bg-white dark:bg-slate-900" />
          <div className="w-0.5 h-6 border-l border-dashed border-slate-400" />
          <div className="w-3 h-3 rounded-full bg-red-600" />
        </div>

        {/* Dropdowns / Selectors */}
        <div className="flex-1 space-y-2">
          {/* Origin Select */}
          <select
            value={origin ? (origin as any).id || 'custom' : ''}
            onChange={(e) => {
              const loc = locations.find((l) => l.id === e.target.value);
              if (loc) onSelectOrigin(loc);
            }}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Choose Starting Point...
            </option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>

          {/* Destination Select */}
          <select
            value={destination ? (destination as any).id || 'custom' : ''}
            onChange={(e) => {
              const loc = locations.find((l) => l.id === e.target.value);
              if (loc) onSelectDestination(loc);
            }}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Choose Destination...
            </option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <button
          onClick={onSwapLocations}
          title="Reverse starting point and destination"
          className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-transform active:rotate-180"
        >
          <ArrowUpDown className="w-4 h-4" />
        </button>
      </div>

      {/* Route Summary & Steps */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {routeData ? (
          <>
            {/* Quick Metrics Bar */}
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 p-3.5 rounded-2xl flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-black text-emerald-700 dark:text-emerald-400">
                    {routeData.durationMinutes} min
                  </span>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    ({routeData.distanceMeters} meters)
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  via Campus Internal Avenue · Fastest direct route
                </div>
              </div>

              {/* Start Simulation Navigation */}
              <button
                onClick={() => setIsNavigating(!isNavigating)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
                  isNavigating
                    ? 'bg-amber-600 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
                }`}
              >
                {isNavigating ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Start</span>
                  </>
                )}
              </button>
            </div>

            {/* Turn-by-turn Step List */}
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                <Milestone className="w-3.5 h-3.5 text-blue-500" />
                <span>Turn-by-Turn Waypoints</span>
              </h4>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
                {routeData.instructions.map((inst, index) => (
                  <div
                    key={index}
                    onClick={() => setActiveStep(index)}
                    className={`p-3 flex items-start gap-3 text-xs transition-colors cursor-pointer ${
                      activeStep === index
                        ? 'bg-blue-50/80 dark:bg-blue-900/30 font-semibold'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                      {getStepIcon(inst.icon)}
                    </div>
                    <div className="flex-1">
                      <div className="text-slate-800 dark:text-slate-100">
                        {inst.text}
                      </div>
                      {inst.distance > 0 && (
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {inst.distance} meters
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-xs text-slate-400">
            Select an origin and destination to preview the route across Sri Shakthi campus.
          </div>
        )}
      </div>
    </div>
  );
}
