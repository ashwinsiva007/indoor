'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Navigation,
  Star,
  MapPin,
  Phone,
  Globe,
  Clock,
  Layers,
  Plus,
  Minus,
  LocateFixed,
  Share2,
  Bookmark,
  ExternalLink,
} from 'lucide-react';
import { SRI_SHAKTHI_LOCATION, PLACES_IN_AREA } from '@/data/locations';
import { MapPlace } from '@/types';

export default function GoogleMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);

  const [query, setQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<MapPlace | null>(PLACES_IN_AREA[0]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

        const map = L.map(mapContainerRef.current, {
          center: [SRI_SHAKTHI_LOCATION.lat, SRI_SHAKTHI_LOCATION.lng],
          zoom: SRI_SHAKTHI_LOCATION.zoom,
          zoomControl: false,
          attributionControl: false,
          maxZoom: 20,
          minZoom: 12,
        });

        mapInstanceRef.current = map;

        map.on('click', () => {
          setIsDropdownOpen(false);
        });
      }

      updateTiles(L);
      updateMarkers(L);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Update Tile Layer
  const updateTiles = (L: any) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const url =
      mapType === 'satellite'
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    const tiles = L.tileLayer(url, {
      maxZoom: 20,
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

  // Update Markers
  const updateMarkers = (L: any) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (markersGroupRef.current) {
      map.removeLayer(markersGroupRef.current);
    }

    const group = L.layerGroup();

    PLACES_IN_AREA.forEach((place) => {
      const isSelected = selectedPlace?.id === place.id;

      // Google Maps Red Pin HTML
      const pinHtml = `
        <div class="cursor-pointer flex flex-col items-center group transition-transform ${
          isSelected ? 'scale-125 z-50' : 'hover:scale-110'
        }">
          <div class="w-8 h-8 rounded-full ${
            isSelected ? 'bg-red-600' : 'bg-[#ea4335]'
          } border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <div class="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-[#ea4335] -mt-[1px]"></div>
          <div class="bg-white/95 text-slate-900 text-[11px] font-semibold px-2 py-0.5 rounded-md shadow-md mt-1 border border-slate-200 whitespace-nowrap">
            ${place.name.split(' ')[0]} ${place.name.split(' ')[1] || ''}
          </div>
        </div>
      `;

      const icon = L.divIcon({
        className: 'custom-google-pin',
        html: pinHtml,
        iconSize: [36, 48],
        iconAnchor: [18, 38],
      });

      const marker = L.marker([place.lat, place.lng], { icon });
      marker.on('click', (e: any) => {
        L.DomEvent.stopPropagation(e);
        setSelectedPlace(place);
        setIsDropdownOpen(false);
      });

      group.addLayer(marker);
    });

    group.addTo(map);
    markersGroupRef.current = group;
  };

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    import('leaflet').then((L) => {
      updateMarkers(L);
    });
  }, [selectedPlace]);

  // Pan to selected place
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedPlace) return;
    mapInstanceRef.current.flyTo([selectedPlace.lat, selectedPlace.lng], 18, {
      animate: true,
      duration: 1,
    });
  }, [selectedPlace]);

  const filteredPlaces = PLACES_IN_AREA.filter((p) => {
    const matchesQuery =
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase());
    const matchesCategory =
      activeCategory === 'All' || p.category.toLowerCase().includes(activeCategory.toLowerCase());
    return matchesQuery && matchesCategory;
  });

  const handleShare = () => {
    if (navigator.clipboard && selectedPlace) {
      navigator.clipboard.writeText(
        `https://maps.google.com/?q=${selectedPlace.lat},${selectedPlace.lng}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-100 select-none">
      {/* Search Bar (Google Maps style) */}
      <div className="absolute top-4 left-4 z-30 flex flex-col gap-2 max-w-[400px] w-[calc(100vw-32px)]">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200/80 overflow-hidden flex items-center px-3 py-2.5 gap-2.5">
          {/* Google Maps Multi-color pin or search icon */}
          <div className="text-[#4285f4] flex items-center justify-center">
            <Search className="w-5 h-5 text-slate-500" />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            placeholder="Search Sri Shakthi Institute..."
            className="flex-1 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none font-normal"
          />

          {query && (
            <button
              onClick={() => {
                setQuery('');
                setIsDropdownOpen(false);
              }}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="w-[1px] h-5 bg-slate-200" />

          {/* Directions Blue Button */}
          <a
            href={
              selectedPlace
                ? `https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.lat},${selectedPlace.lng}`
                : `https://maps.app.goo.gl/3a39i7AbYPSL5FPg8?g_st=sa`
            }
            target="_blank"
            rel="noreferrer"
            title="Get Directions"
            className="w-8 h-8 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white flex items-center justify-center shadow-md transition-colors shrink-0"
          >
            <Navigation className="w-4 h-4 fill-white" />
          </a>
        </div>

        {/* Suggestions Dropdown */}
        {isDropdownOpen && (
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden max-h-60 overflow-y-auto divide-y divide-slate-100">
            {filteredPlaces.map((place) => (
              <button
                key={place.id}
                onClick={() => {
                  setSelectedPlace(place);
                  setQuery(place.name);
                  setIsDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 transition-colors"
              >
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-800 truncate">
                    {place.name}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {place.category} · ★ {place.rating}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {['All', 'Department', 'Library', 'Food', 'Sports', 'Hostel'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 shadow-sm border transition-all ${
                activeCategory === cat
                  ? 'bg-[#1a73e8] text-white border-[#1a73e8]'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Place Detail Card (Google Maps Sidebar / Bottom Card) */}
      {selectedPlace && (
        <div className="absolute bottom-6 left-4 z-30 w-[calc(100vw-32px)] sm:w-[380px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="relative h-40 w-full bg-slate-800">
            <img
              src={selectedPlace.imageUrl}
              alt={selectedPlace.name}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => setSelectedPlace(null)}
              className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-snug">
                {selectedPlace.name}
              </h2>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-600">
                <span className="font-semibold text-amber-500 flex items-center gap-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  {selectedPlace.rating}
                </span>
                <span>({selectedPlace.reviewsCount} reviews)</span>
                <span>·</span>
                <span className="text-slate-500">{selectedPlace.category}</span>
              </div>
            </div>

            {/* Quick Actions Row */}
            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.lat},${selectedPlace.lng}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-semibold shadow-md transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 fill-white" />
                <span>Directions</span>
              </a>

              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-semibold transition-colors ${
                  isSaved
                    ? 'bg-amber-50 border-amber-300 text-amber-700'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-600' : ''}`} />
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied' : 'Share'}</span>
              </button>
            </div>

            {/* Address & Status info */}
            <div className="space-y-2 pt-1 text-xs text-slate-600 border-t border-slate-100">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{selectedPlace.address}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-medium text-emerald-600">{selectedPlace.openStatus}</span>
              </div>

              {selectedPlace.phone && (
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <a href={`tel:${selectedPlace.phone}`} className="text-[#1a73e8] hover:underline">
                    {selectedPlace.phone}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Bottom Left Layers Button (Map / Satellite) */}
      <div className="absolute bottom-6 left-4 sm:left-[410px] z-30">
        <button
          onClick={() => setMapType(mapType === 'roadmap' ? 'satellite' : 'roadmap')}
          className="bg-white rounded-xl shadow-lg border border-slate-200 p-2 flex items-center gap-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
        >
          <Layers className="w-4 h-4 text-[#1a73e8]" />
          <span>{mapType === 'roadmap' ? 'Satellite' : 'Map View'}</span>
        </button>
      </div>

      {/* Bottom Right Controls (Zoom +/-, My Location) */}
      <div className="absolute bottom-6 right-4 z-30 flex flex-col gap-2">
        <button
          onClick={() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.flyTo(
                [SRI_SHAKTHI_LOCATION.lat, SRI_SHAKTHI_LOCATION.lng],
                SRI_SHAKTHI_LOCATION.zoom
              );
            }
          }}
          title="Center on Sri Shakthi Institute"
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
