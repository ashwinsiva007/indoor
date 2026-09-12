'use client';

import React, { useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import SearchBar from '@/components/map/SearchBar';
import PlaceDetailDrawer from '@/components/map/PlaceDetailDrawer';
import DirectionsPanel from '@/components/map/DirectionsPanel';
import LayerSwitcher from '@/components/map/LayerSwitcher';
import MapControls from '@/components/map/MapControls';
import StreetViewModal from '@/components/map/StreetViewModal';
import BottomStatusBar from '@/components/map/BottomStatusBar';
import {
  CAMPUS_LOCATIONS,
  CampusLocation,
  SRI_SHAKTHI_CENTER,
} from '@/data/campusLocations';
import { MapLayerType } from '@/components/map/GoogleMapView';

// Dynamically import Leaflet Map Component with SSR disabled
const GoogleMapView = dynamic(
  () => import('@/components/map/GoogleMapView'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-[#f1f3f4] dark:bg-[#1f242d] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-500">
            Loading Sri Shakthi Campus Map...
          </span>
        </div>
      </div>
    ),
  }
);

export default function CampusGoogleMapPage() {
  const [locations] = useState<CampusLocation[]>(CAMPUS_LOCATIONS);
  const [selectedLocation, setSelectedLocation] = useState<CampusLocation | null>(
    CAMPUS_LOCATIONS[0] // Pre-select Sri Shakthi Main Admin Block for an instant rich view
  );
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeLayer, setActiveLayer] = useState<MapLayerType>('streets');
  const [showBoundary, setShowBoundary] = useState<boolean>(true);
  const [is3DTilt, setIs3DTilt] = useState<boolean>(false);
  const [measureMode, setMeasureMode] = useState<boolean>(false);
  const [measuredDist, setMeasuredDist] = useState<number | null>(null);
  const [droppedPin, setDroppedPin] = useState<{ lat: number; lng: number } | null>(null);

  // Directions state
  const [directionsOpen, setDirectionsOpen] = useState<boolean>(false);
  const [originLocation, setOriginLocation] = useState<CampusLocation | null>(
    CAMPUS_LOCATIONS.find((l) => l.id === 'main-gate') || CAMPUS_LOCATIONS[0]
  );
  const [destLocation, setDestLocation] = useState<CampusLocation | null>(
    CAMPUS_LOCATIONS[0]
  );
  const [routePoints, setRoutePoints] = useState<[number, number][] | null>(null);

  // 360 Street View Modal
  const [streetViewOpen, setStreetViewOpen] = useState<boolean>(false);

  // Select a location
  const handleSelectLocation = useCallback((loc: CampusLocation) => {
    setSelectedLocation(loc);
    setDroppedPin(null);
    // If directions is open, set destination
    if (directionsOpen) {
      setDestLocation(loc);
    }
  }, [directionsOpen]);

  // Open Directions for a place
  const handleOpenDirectionsForPlace = useCallback((loc: CampusLocation) => {
    setSelectedLocation(null);
    setDestLocation(loc);
    if (!originLocation) {
      const gate = CAMPUS_LOCATIONS.find((l) => l.id === 'main-gate') || CAMPUS_LOCATIONS[0];
      setOriginLocation(gate);
    }
    setDirectionsOpen(true);
  }, [originLocation]);

  // Explore nearby places around a location
  const handleExploreNearby = useCallback((loc: CampusLocation) => {
    setActiveCategory('all');
  }, []);

  // Drop pin handler
  const handleDropPin = useCallback((coords: { lat: number; lng: number } | null) => {
    setDroppedPin(coords);
    if (coords) {
      // Find nearest location if any
      let nearestLoc: CampusLocation | null = null;
      let minD = Infinity;
      locations.forEach((l) => {
        const d = Math.hypot(l.lat - coords.lat, l.lng - coords.lng);
        if (d < minD && d < 0.0004) {
          minD = d;
          nearestLoc = l;
        }
      });
      if (nearestLoc) {
        setSelectedLocation(nearestLoc);
      }
    }
  }, [locations]);

  // Swap route locations
  const handleSwapRoute = useCallback(() => {
    const temp = originLocation;
    setOriginLocation(destLocation);
    setDestLocation(temp);
  }, [originLocation, destLocation]);

  // Zoom / Pan helpers
  const handleZoomIn = () => {
    const map = (window as any)._leaflet_map;
    if (map) map.zoomIn();
  };

  const handleZoomOut = () => {
    const map = (window as any)._leaflet_map;
    if (map) map.zoomOut();
  };

  const handleRecenterCampus = () => {
    const map = (window as any)._leaflet_map;
    if (map) {
      map.flyTo([SRI_SHAKTHI_CENTER.lat, SRI_SHAKTHI_CENTER.lng], SRI_SHAKTHI_CENTER.zoom, {
        animate: true,
      });
    }
  };

  const handleLocateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const map = (window as any)._leaflet_map;
          if (map) {
            map.flyTo([pos.coords.latitude, pos.coords.longitude], 18, { animate: true });
          }
        },
        () => {
          handleRecenterCampus();
        }
      );
    } else {
      handleRecenterCampus();
    }
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950 select-none">
      {/* Search Bar (Google Maps Floating Search) */}
      {!directionsOpen && (
        <SearchBar
          locations={locations}
          onSelectLocation={handleSelectLocation}
          onOpenDirections={() => setDirectionsOpen(true)}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          selectedLocation={selectedLocation}
        />
      )}

      {/* Place Details Sidebar (Google Maps place drawer) */}
      {selectedLocation && !directionsOpen && (
        <PlaceDetailDrawer
          location={selectedLocation}
          onClose={() => setSelectedLocation(null)}
          onGetDirections={handleOpenDirectionsForPlace}
          onExploreNearby={handleExploreNearby}
        />
      )}

      {/* Directions Routing Panel */}
      {directionsOpen && (
        <DirectionsPanel
          origin={originLocation}
          destination={destLocation}
          locations={locations}
          onSelectOrigin={setOriginLocation}
          onSelectDestination={setDestLocation}
          onSwapLocations={handleSwapRoute}
          onClose={() => {
            setDirectionsOpen(false);
            setRoutePoints(null);
          }}
          onRouteCalculated={(route) => {
            setRoutePoints(route.points);
          }}
        />
      )}

      {/* Interactive Map View */}
      <div className="w-full h-full">
        <GoogleMapView
          locations={locations}
          selectedLocation={selectedLocation}
          onSelectLocation={handleSelectLocation}
          activeLayer={activeLayer}
          showCampusBoundary={showBoundary}
          routePoints={routePoints}
          droppedPin={droppedPin}
          onDropPin={handleDropPin}
          is3DTilt={is3DTilt}
          measureMode={measureMode}
          onMeasureDistance={setMeasuredDist}
        />
      </div>

      {/* Layer Switcher (Bottom Left) */}
      <LayerSwitcher
        activeLayer={activeLayer}
        onChangeLayer={setActiveLayer}
        showBoundary={showBoundary}
        onToggleBoundary={() => setShowBoundary(!showBoundary)}
      />

      {/* Floating Map Controls (Bottom Right) */}
      <MapControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onRecenterCampus={handleRecenterCampus}
        onLocateUser={handleLocateUser}
        is3DTilt={is3DTilt}
        onToggle3DTilt={() => setIs3DTilt(!is3DTilt)}
        measureMode={measureMode}
        onToggleMeasure={() => setMeasureMode(!measureMode)}
        measuredDist={measuredDist}
        onOpenStreetView={() => setStreetViewOpen(true)}
      />

      {/* Bottom Status Bar (Scale, Coordinates, Weather, Google Maps Link) */}
      <BottomStatusBar
        currentCoordinates={
          selectedLocation
            ? { lat: selectedLocation.lat, lng: selectedLocation.lng }
            : droppedPin || SRI_SHAKTHI_CENTER
        }
      />

      {/* 360 Campus Street View Modal */}
      <StreetViewModal
        isOpen={streetViewOpen}
        onClose={() => setStreetViewOpen(false)}
      />
    </main>
  );
}
