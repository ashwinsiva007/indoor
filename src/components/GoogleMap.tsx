'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Navigation,
  Layers,
  LocateFixed,
  MapPin,
  Copy,
  Check,
  Navigation2,
  AlertCircle,
} from 'lucide-react';
import {
  BOUNDARY_POLYGON,
  MAP_CENTER,
} from '@/data/locations';

export default function GoogleMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const clickMarkerRef = useRef<any>(null);
  const userGpsMarkerRef = useRef<any>(null);
  const userGpsCircleRef = useRef<any>(null);
  const watchIdRef = useRef<number | null>(null);

  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');
  const [clickedCoord, setClickedCoord] = useState<{ lat: number; lng: number } | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
    accuracy: number;
  } | null>(null);
  const [isGpsActive, setIsGpsActive] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize Map Edge-to-Edge with No Outside Mask
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

        // Set bounds around the target area
        const southWest = L.latLng(11.034000, 77.068000);
        const northEast = L.latLng(11.045000, 77.081000);
        const maxBounds = L.latLngBounds(southWest, northEast);

        const map = L.map(mapContainerRef.current, {
          center: [MAP_CENTER.lat, MAP_CENTER.lng],
          zoom: MAP_CENTER.zoom,
          zoomControl: false,
          attributionControl: false,
          minZoom: 15,
          maxZoom: 21,
          maxBounds: maxBounds,
          maxBoundsViscosity: 0.7,
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

        // Fit map onto the location polygon area
        const polygonBounds = L.latLngBounds(
          BOUNDARY_POLYGON.map(([lat, lng]) => L.latLng(lat, lng))
        );
        map.fitBounds(polygonBounds, {
          padding: [20, 20],
          maxZoom: 18,
        });
      }

      updateTiles(L);
    });

    return () => {
      isMounted = false;
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // Update Tile Layer using No-Label Map Layers (Zero Text / Zero Names)
  const updateTiles = (L: any) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    // Pure no-label map tiles (no text, no place names)
    const url =
      mapType === 'satellite'
        ? 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}' // Pure satellite with NO text labels
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png'; // Clean map with NO text labels

    const tiles = L.tileLayer(url, {
      maxZoom: 21,
      maxNativeZoom: 20,
      subdomains: 'abcd',
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

  // Live GPS User Location Tracker
  const handleToggleGps = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      setTimeout(() => setGpsError(null), 3500);
      return;
    }

    if (isGpsActive) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setIsGpsActive(false);
      setUserLocation(null);
      if (mapInstanceRef.current) {
        if (userGpsMarkerRef.current) {
          mapInstanceRef.current.removeLayer(userGpsMarkerRef.current);
          userGpsMarkerRef.current = null;
        }
        if (userGpsCircleRef.current) {
          mapInstanceRef.current.removeLayer(userGpsCircleRef.current);
          userGpsCircleRef.current = null;
        }
      }
      return;
    }

    setIsGpsActive(true);
    setGpsError(null);

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(6));
        const lng = parseFloat(pos.coords.longitude.toFixed(6));
        const accuracy = Math.round(pos.coords.accuracy || 10);

        setUserLocation({ lat, lng, accuracy });

        import('leaflet').then((L) => {
          const map = mapInstanceRef.current;
          if (!map) return;

          if (userGpsMarkerRef.current) map.removeLayer(userGpsMarkerRef.current);
          if (userGpsCircleRef.current) map.removeLayer(userGpsCircleRef.current);

          const accuracyCircle = L.circle([lat, lng], {
            radius: Math.max(5, accuracy),
            color: '#4285f4',
            weight: 1,
            fillColor: '#4285f4',
            fillOpacity: 0.15,
          }).addTo(map);
          userGpsCircleRef.current = accuracyCircle;

          const gpsIconHtml = `
            <div class="relative flex items-center justify-center w-6 h-6">
              <div class="absolute w-6 h-6 rounded-full bg-blue-500/40 animate-ping"></div>
              <div class="relative w-4 h-4 rounded-full bg-[#1a73e8] border-2 border-white shadow-lg flex items-center justify-center">
                <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
              </div>
            </div>
          `;

          const gpsIcon = L.divIcon({
            className: 'custom-gps-user-dot',
            html: gpsIconHtml,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          });

          const userMarker = L.marker([lat, lng], { icon: gpsIcon }).addTo(map);
          userGpsMarkerRef.current = userMarker;

          map.flyTo([lat, lng], Math.max(18, map.getZoom()), {
            animate: true,
            duration: 1,
          });
        });
      },
      (err) => {
        setIsGpsActive(false);
        setGpsError(
          err.code === 1
            ? 'Please allow location permission in your browser.'
            : 'Unable to retrieve GPS location.'
        );
        setTimeout(() => setGpsError(null), 4000);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    watchIdRef.current = watchId;
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
        padding: [20, 20],
        animate: true,
      });
    });
  };

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-slate-100 select-none font-sans">
      {/* Mobile-Friendly Search Bar */}
      <div className="absolute top-3 inset-x-3 sm:inset-x-auto sm:left-4 sm:w-[380px] z-30">
        <form
          onSubmit={handleSearchCoord}
          className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/90 overflow-hidden flex items-center px-3.5 py-2.5 gap-2.5"
        >
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search coordinates (lat, lng)..."
            className="flex-1 text-sm bg-transparent text-slate-800 placeholder:text-slate-400 focus:outline-none"
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
            className="w-8 h-8 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white flex items-center justify-center shadow-md transition-transform active:scale-95 shrink-0"
          >
            <Navigation className="w-4 h-4 fill-white" />
          </a>
        </form>
      </div>

      {/* GPS Error Notification Toast */}
      {gpsError && (
        <div className="absolute top-16 inset-x-4 sm:inset-x-auto sm:left-4 sm:w-[380px] z-40 bg-red-600 text-white px-3.5 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-medium animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="flex-1">{gpsError}</span>
        </div>
      )}

      {/* Live GPS Active Status Bar on Mobile */}
      {isGpsActive && userLocation && (
        <div className="absolute top-16 left-3 sm:left-4 z-30 bg-[#1a73e8] text-white px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 text-[11px] font-semibold animate-pulse">
          <Navigation2 className="w-3.5 h-3.5 fill-white" />
          <span>
            GPS Active ({userLocation.lat.toFixed(5)}, {userLocation.lng.toFixed(5)}) · ±{userLocation.accuracy}m
          </span>
        </div>
      )}

      {/* Coordinate Details Bottom Sheet */}
      {clickedCoord && (
        <div className="absolute bottom-4 inset-x-3 sm:inset-x-auto sm:left-4 sm:w-[340px] z-30 bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="p-3.5 space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Location</h3>
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

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${clickedCoord.lat},${clickedCoord.lng}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 px-3 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform"
              >
                <Navigation className="w-3.5 h-3.5 fill-white" />
                <span>Directions</span>
              </a>

              <button
                onClick={handleCopyCoord}
                className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edge-to-Edge Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Bottom Floating Layer Button */}
      <div className="absolute bottom-4 left-3 sm:left-4 z-20">
        <button
          onClick={() => setMapType(mapType === 'roadmap' ? 'satellite' : 'roadmap')}
          className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/90 px-3.5 py-2.5 flex items-center gap-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 active:scale-95 transition-all"
        >
          <Layers className="w-4 h-4 text-[#1a73e8]" />
          <span>{mapType === 'roadmap' ? 'Satellite' : 'Roadmap'}</span>
        </button>
      </div>

      {/* Bottom Floating GPS & Recenter Controls (No +- buttons) */}
      <div className="absolute bottom-4 right-3 sm:right-4 z-20 flex flex-col gap-2">
        {/* GPS Live My Location Button */}
        <button
          onClick={handleToggleGps}
          title={isGpsActive ? 'Stop GPS Tracking' : 'Track My GPS Location'}
          className={`w-11 h-11 rounded-2xl backdrop-blur-md border shadow-xl flex items-center justify-center active:scale-95 transition-all ${
            isGpsActive
              ? 'bg-[#1a73e8] border-[#1a73e8] text-white shadow-blue-500/40 ring-4 ring-blue-500/20'
              : 'bg-white/95 border-slate-200/90 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <LocateFixed className={`w-5 h-5 ${isGpsActive ? 'text-white animate-spin-slow' : 'text-[#1a73e8]'}`} />
        </button>

        {/* Fit / Recenter Button */}
        <button
          onClick={handleRecenter}
          title="Recenter Map"
          className="w-11 h-11 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl flex items-center justify-center text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
        >
          <MapPin className="w-4 h-4 text-slate-600" />
        </button>
      </div>
    </div>
  );
}
