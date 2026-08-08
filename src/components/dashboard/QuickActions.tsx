'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Upload, Plus, Sparkles, Map, CheckCircle2 } from 'lucide-react';

export const QuickActions: React.FC = () => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  const handleSimulateUpload = () => {
    setIsUploaded(true);
    setTimeout(() => {
      setIsUploaded(false);
      setIsUploadOpen(false);
    }, 1500);
  };

  return (
    <>
      <div className="glass-card rounded-2xl p-5 border border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Quick Blueprint Upload</h3>
            <p className="text-xs text-slate-400">Upload CAD or PNG floor plans to generate instant vector graph wayfinding</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsUploadOpen(true)}
            icon={<Upload className="w-4 h-4" />}
            className="w-full md:w-auto"
          >
            Upload Building Plan
          </Button>
        </div>
      </div>

      {/* Upload Modal */}
      <Modal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} title="Upload Building Floor Plan">
        <div className="space-y-4">
          <p className="text-xs text-slate-400">
            Select a floor plan image (PNG, SVG, DXF, or PDF blueprint) to parse rooms and node paths.
          </p>

          <div className="border-2 border-dashed border-slate-700/80 rounded-2xl p-8 text-center space-y-3 bg-slate-900/50 hover:border-blue-500/50 transition-colors">
            {isUploaded ? (
              <div className="space-y-2 py-4 animate-in zoom-in-95">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="text-sm font-bold text-white">Floor Plan Parsed Successfully!</h4>
                <p className="text-xs text-slate-400">Generating indoor navigation graph mesh...</p>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mx-auto text-blue-400">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">Drag & Drop floor plan here</p>
                  <p className="text-xs text-slate-500 mt-1">Supports SVG, PNG, JPG, CAD (Max 25MB)</p>
                </div>
                <Button variant="secondary" size="sm" onClick={handleSimulateUpload} className="mt-2">
                  Select Blueprint File
                </Button>
              </>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">Building Target</label>
            <select className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl px-3 py-2">
              <option>College Main Block</option>
              <option>Tech Park Tower A</option>
              <option>City Hospital Main</option>
            </select>
          </div>
        </div>
      </Modal>
    </>
  );
};
