'use client';

import React from 'react';
import { RouteResult } from '@/types';
import { Footprints, Clock, Navigation, CheckCircle2, CornerDownLeft, CornerDownRight, ArrowUp } from 'lucide-react';

interface TurnByTurnDrawerProps {
  routeResult: RouteResult | null;
}

export const TurnByTurnDrawer: React.FC<TurnByTurnDrawerProps> = ({ routeResult }) => {
  if (!routeResult) {
    return (
      <div className="glass-card rounded-2xl p-6 border border-slate-800/80 text-center space-y-3">
        <Navigation className="w-10 h-10 text-slate-600 mx-auto" />
        <h4 className="text-sm font-semibold text-slate-300">No Active Route</h4>
        <p className="text-xs text-slate-500">
          Select a starting location and destination above, then click &quot;Find Route&quot; to calculate turn-by-turn directions.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800/80 space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Footprints className="w-4 h-4 text-emerald-400" />
            Turn-by-Turn Guidance
          </h3>
          <p className="text-xs text-slate-400">Ground Floor Optimized Route</p>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Footprints className="w-3.5 h-3.5" />
            <span>{routeResult.totalDistanceMeters} meters</span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Clock className="w-3.5 h-3.5" />
            <span>~{routeResult.estimatedWalkTimeMinutes} min walk</span>
          </div>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
        {routeResult.instructions.map((inst, index) => {
          const isFirst = index === 0;
          const isLast = index === routeResult.instructions.length - 1;

          return (
            <div
              key={`step-${inst.step}`}
              className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 transition-colors hover:border-slate-700"
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                  isFirst
                    ? 'bg-blue-600 text-white'
                    : isLast
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}
              >
                {inst.step}
              </div>

              <div className="flex-1">
                <p className="text-xs font-medium text-slate-200">{inst.text}</p>
                {inst.distanceMeters > 0 && (
                  <span className="text-[11px] text-slate-500 mt-0.5 block">
                    Straight for ~{inst.distanceMeters}m
                  </span>
                )}
              </div>

              {isLast && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 my-auto" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};
