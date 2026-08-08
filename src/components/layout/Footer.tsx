import React from 'react';
import { Map, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/80 py-12 px-6">
      <div className="max-w-7xl mx-mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Map className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-white tracking-wide">NaviWay</span>
            <p className="text-xs text-slate-500">Next-Generation Indoor Positioning & Navigation MVP</p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-400">
          <span>Documentation</span>
          <span>API Reference</span>
          <span>Security</span>
          <span>Status</span>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-1">
          <span>Designed for Weekend Review Showcase</span>
          <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
        </div>
      </div>
    </footer>
  );
};
