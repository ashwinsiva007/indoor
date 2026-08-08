'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_BUILDINGS } from '@/data/mockData';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Building2, Layers, MapPin, Upload, Compass, Edit3, CheckCircle2, Clock } from 'lucide-react';

export default function BuildingsPage() {
  const [selectedBuilding] = useState(MOCK_BUILDINGS[0]); // College Main Block
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleSimulateUpload = () => {
    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setIsUploadOpen(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Building & Floor Plan Management
          </h1>
          <p className="text-sm text-slate-400">
            Manage floor blueprints, active node graphs, and room registries
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsUploadOpen(true)}
          icon={<Upload className="w-4 h-4" />}
          className="shadow-blue-600/20"
        >
          Upload New Building / Floor
        </Button>
      </div>

      {/* Featured Spotlight Building: College Main Block */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800/80 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shrink-0">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{selectedBuilding.name}</h2>
                <Badge variant="success">{selectedBuilding.status}</Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{selectedBuilding.address}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
              <span className="text-slate-500 uppercase text-[10px] font-bold">Total Floors</span>
              <p className="text-base font-bold text-white">{selectedBuilding.floorsCount} Floors</p>
            </div>
            <div className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
              <span className="text-slate-500 uppercase text-[10px] font-bold">Total POIs</span>
              <p className="text-base font-bold text-white">{selectedBuilding.totalRooms} Rooms</p>
            </div>
            <div className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
              <span className="text-slate-500 uppercase text-[10px] font-bold">Graph Nodes</span>
              <p className="text-base font-bold text-white">{selectedBuilding.totalNodes} Nodes</p>
            </div>
          </div>
        </div>

        {/* Floor Plans Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              Uploaded Floor Plans ({selectedBuilding.floors.length})
            </h3>
            <span className="text-xs text-slate-500 font-mono">Vector SVG Mesh Sync Active</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {selectedBuilding.floors.map((floor) => (
              <Card key={floor.id} className="group relative border-slate-800 flex flex-col justify-between hover:border-slate-700">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-xs">
                      L{floor.floorNumber}
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {floor.updatedAt}
                    </span>
                  </div>

                  <CardHeader className="p-0">
                    <CardTitle className="text-base group-hover:text-blue-400 transition-colors">
                      {floor.name}
                    </CardTitle>
                    <CardDescription className="text-xs">{floor.levelLabel}</CardDescription>
                  </CardHeader>

                  <div className="space-y-1 text-xs text-slate-400 font-mono pt-2 border-t border-slate-800/80">
                    <div className="flex justify-between">
                      <span>Rooms:</span>
                      <span className="text-slate-200 font-semibold">{floor.roomsCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Waypoints:</span>
                      <span className="text-slate-200 font-semibold">{floor.nodesCount}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 mt-4 border-t border-slate-800">
                  <Link href="/dashboard/navigation" className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full text-xs" icon={<Compass className="w-3.5 h-3.5" />}>
                      Test Route
                    </Button>
                  </Link>
                  <Link href="/dashboard/editor">
                    <Button variant="outline" size="sm" className="px-2.5 text-xs" icon={<Edit3 className="w-3.5 h-3.5" />} title="Edit Blueprint" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Upload Building UI */}
      <Modal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} title="Upload Building Floor Plan">
        <div className="space-y-4">
          <p className="text-xs text-slate-400">
            Upload CAD (DXF, DWG), SVG, or PNG image of your building floor plan.
          </p>

          <div className="border-2 border-dashed border-slate-700/80 rounded-2xl p-8 text-center space-y-3 bg-slate-900/50 hover:border-blue-500/50 transition-colors">
            {uploadSuccess ? (
              <div className="space-y-2 py-4 animate-in zoom-in-95">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="text-sm font-bold text-white">Floor Plan Uploaded & Parsed!</h4>
                <p className="text-xs text-slate-400">Vector node mesh automatically generated.</p>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mx-auto text-blue-400">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">Drag & Drop blueprint image here</p>
                  <p className="text-xs text-slate-500 mt-1">Supports SVG, PNG, PDF, CAD (Max 25MB)</p>
                </div>
                <Button variant="secondary" size="sm" onClick={handleSimulateUpload} className="mt-2">
                  Choose File
                </Button>
              </>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
