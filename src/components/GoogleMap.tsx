'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Navigation,
  Layers,
  Plus,
  Minus,
  LocateFixed,
  MapPin,
  Copy,
  Check,
} from 'lucide-react';
import {
  BOUNDARY_POINTS,
  BOUNDARY_POLYGON,
  MAP_CENTER,
} from '@/data/locations';

export default function GoogleMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const polygonLayerRef = useRef<any>(null);
  const clickMarkerRef = useRef<any>(null);

  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');
  const [clickedCoord, setClickedCoord] = useState<{ lat: number; lng: number } | null>(null);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize Map
  useEffect(() => {
    let isMounted = true;

    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      if (!mapInstanceRef.current) {
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });

        // Set maximum bounds around the blue polygon area
        const southWest = L.latLng(11.036000, 77.070500);
        const northEast = L.latLng(11.043500, 77.079000);
        const maxBounds = L.latLngBounds(southWest, northEast);

        const map = L.map(mapContainerRef.current, {
          center: [MAP_CENTER.lat, MAP_CENTER.lng],
          zoom: MAP_CENTER.zoom,
          zoomControl: false,
          attributionControl: false,
          minZoom: 15,
          maxZoom: 21,
          maxBounds: maxBounds,
          maxBoundsViscosity: 0.8,
        });

        mapInstanceRef.current = map;

        // Click listener to place pin & display coordinates
        map.on('click', (e: any) => {
          const lat = parseFloat(e.latlng.lat.toFixed(6));
          const lng = parseFloat(e.latlng.lng.toFixed(6));
          setClickedCoord({ lat, lng });

          // Update Click Marker
          if (clickMarkerRef.current) {
            map.removeLayer(clickMarkerRef.current);
          }

          const pinHtml = `
            <div class="flex flex-col items-center cursor-pointer transform -translate-y-2">
              <div class="w-7 h-7 rounded-full bg-[#ea4335] border-2 border-white shadow-lg flex items-center justify-center text-white">
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div class="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-[#ea4335] -mt-[1px]"></div>
            </div>
          `;

          const customIcon = L.divIcon({
            className: 'custom-dropped-pin',
            html: pinHtml,
            iconSize: [28, 38],
            iconAnchor: [14, 36],
          });

          const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
          clickMarkerRef.current = marker;
        });

        // Fit map smoothly into the designated blue boundary polygon
        const polygonBounds = L.latLngBounds(
          BOUNDARY_POLYGON.map(([lat, lng]) => L.latLng(lat, lng))
        );
        map.fitBounds(polygonBounds, {
          padding: [50, 50],
          maxZoom: 18,
        });
      }

      updateTiles(L);
      drawBoundaryPolygon(L);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Update Tile Layer with Clean High-Res Google Tiles (No Watermarks)
  const updateTiles = (L: any) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    // Google Maps Vector / Satellite Tiles without watermarks
    const url =
      mapType === 'satellite'
        ? 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
        : 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';

    const tiles = L.tileLayer(url, {
      maxZoom: 21,
      maxNativeZoom: 20,
    });

    tiles.addTo(map);
    tileLayerRef.current = tiles;
  };

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    import('leaflet').then((L) => {
      updateTiles(L);
    });
  }, [mapType]);

  // Draw ONLY the Blue Marked Line Polygon
  const drawBoundaryPolygon = (L: any) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (polygonLayerRef.current) {
      map.removeLayer(polygonLayerRef.current);
    }

    // Solid prominent blue line around the boundary
    const polygon = L.polygon(BOUNDARY_POLYGON, {
      color: '#1a73e8', // Pure Google Maps blue
      weight: 3.5,
      opacity: 0.95,
      fillColor: '#4285f4',
      fillOpacity: 0.12,
      lineCap: 'round',
      lineJoin: 'round',
    });

    polygon.addTo(map);
    polygonLayerRef.current = polygon;
  };

  const handleCopyCoord = () => {
    if (clickedCoord && navigator.clipboard) {
      navigator.clipboard.writeText(`${clickedCoord.lat}, ${clickedCoord.lng}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSearchCoord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    const parts = searchQuery.split(',').map((p) => parseFloat(p.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      const lat = parts[0];
      const lng = parts[1];
      setClickedCoord({ lat, lng });
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([lat, lng], 18, { animate: true });
      }
    }
  };

  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    import('leaflet').then((L) => {
      const bounds = L.latLngBounds(
        BOUNDARY_POLYGON.map(([lat, lng]) => L.latLng(lat, lng))
      );
      mapInstanceRef.current.fitBounds(bounds, {
        padding: [50, 50],
        animate: true,
      });
    });
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#e5e3df] select-none font-sans">
      {/* Search Bar (Google Maps style) */}
      <div className="absolute top-4 left-4 z-30 max-w-[390px] w-[calc(100vw-32px)]">
        <form
          onSubmit={handleSearchCoord}
          className="bg-white rounded-xl shadow-lg border border-slate-200/80 overflow-hidden flex items-center px-3.5 py-2.5 gap-2.5"
        >
          <Search className="w-5 h-5 text-slate-500 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search location (lat, lng)..."
            className="flex-1 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <div className="w-[1px] h-5 bg-slate-200" />
          <a
            href={
              clickedCoord
                ? `https://www.google.com/maps/dir/?api=1&destination=${clickedCoord.lat},${clickedCoord.lng}`
                : `https://maps.google.com/?q=${MAP_CENTER.lat},${MAP_CENTER.lng}`
            }
            target="_blank"
            rel="noreferrer"
            title="Get Directions"
            className="w-8 h-8 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white flex items-center justify-center shadow-md transition-colors shrink-0"
          >
            <Navigation className="w-4 h-4 fill-white" />
          </a>
        </form>
      </div>

      {/* Coordinate Details Card (When a point or location is clicked) */}
      {clickedCoord && (
        <div className="absolute bottom-6 left-4 z-30 w-[calc(100vw-32px)] sm:w-[350px] bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Selected Location</h3>
                  <div className="text-xs font-mono text-slate-600">
                    {clickedCoord.lat.toFixed(6)}, {clickedCoord.lng.toFixed(6)}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setClickedCoord(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${clickedCoord.lat},${clickedCoord.lng}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 px-3 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 fill-white" />
                <span>Directions</span>
              </a>

              <button
                onClick={handleCopyCoord}
                className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Bottom Left Layers Button (Map / Satellite) */}
      <div className="absolute bottom-6 left-4 sm:left-[370px] z-30">
        <button
          onClick={() => setMapType(mapType === 'roadmap' ? 'satellite' : 'roadmap')}
          className="bg-white rounded-xl shadow-lg border border-slate-200 px-3 py-2 flex items-center gap-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
        >
          <Layers className="w-4 h-4 text-[#1a73e8]" />
          <span>{mapType === 'roadmap' ? 'Satellite' : 'Map View'}</span>
        </button>
      </div>

      {/* Bottom Right Controls (Zoom +/-, Recenter) */}
      <div className="absolute bottom-6 right-4 z-30 flex flex-col gap-2">
        <button
          onClick={handleRecenter}
          title="Fit to Location Boundary"
          className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-lg flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <LocateFixed className="w-5 h-5 text-[#1a73e8]" />
        </button>

        <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden flex flex-col">
          <button
            onClick={() => mapInstanceRef.current?.zoomIn()}
            title="Zoom In"
            className="w-10 h-10 flex items-center justify-center text-slate-700 hover:bg-slate-50 border-b border-slate-100"
          >
            <Plus className="w-5 h-5" />
          </button>
          <button
            onClick={() => mapInstanceRef.current?.zoomOut()}
            title="Zoom Out"
            className="w-10 h-10 flex items-center justify-center text-slate-700 hover:bg-slate-50"
          >
            <Minus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
