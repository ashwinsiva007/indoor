'use client';

import React, { useEffect, useRef } from 'react';
import {
  CampusLocation,
  SRI_SHAKTHI_CENTER,
  CAMPUS_BOUNDARY,
} from '@/data/campusLocations';

export type MapLayerType = 'streets' | 'satellite' | 'dark' | 'terrain';

interface GoogleMapViewProps {
  locations: CampusLocation[];
  selectedLocation: CampusLocation | null;
  onSelectLocation: (loc: CampusLocation) => void;
  activeLayer: MapLayerType;
  showCampusBoundary: boolean;
  routePoints: [number, number][] | null;
  droppedPin: { lat: number; lng: number } | null;
  onDropPin: (latlng: { lat: number; lng: number } | null) => void;
  is3DTilt: boolean;
  measureMode: boolean;
  onMeasureDistance?: (distMeters: number | null) => void;
}

export default function GoogleMapView({
  locations,
  selectedLocation,
  onSelectLocation,
  activeLayer,
  showCampusBoundary,
  routePoints,
  droppedPin,
  onDropPin,
  is3DTilt,
  measureMode,
  onMeasureDistance,
}: GoogleMapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const boundaryLayerRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);
  const routeLayerRef = useRef<any>(null);
  const droppedPinMarkerRef = useRef<any>(null);
  const measureLineRef = useRef<any>(null);
  const measurePointsRef = useRef<[number, number][]>([]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    let isMounted = true;

    // Dynamically import Leaflet to ensure client-only execution
    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      if (!mapInstanceRef.current) {
        // Fix Leaflet's default icon URLs
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });

        const map = L.map(mapContainerRef.current, {
          center: [SRI_SHAKTHI_CENTER.lat, SRI_SHAKTHI_CENTER.lng],
          zoom: SRI_SHAKTHI_CENTER.zoom,
          zoomControl: false, // We use custom Google Maps styled zoom buttons
          attributionControl: false,
          maxZoom: 21,
          minZoom: 12,
        });

        mapInstanceRef.current = map;
        if (typeof window !== 'undefined') {
          (window as any)._leaflet_map = map;
        }

        // Click listener for dropped pin or measurement
        map.on('click', (e: any) => {
          if (measureMode) {
            measurePointsRef.current.push([e.latlng.lat, e.latlng.lng]);
            updateMeasureLine(L);
          } else {
            onDropPin({ lat: e.latlng.lat, lng: e.latlng.lng });
          }
        });
      }

      // Update Tile Layer
      updateTileLayer(L);
      // Update Campus Boundary
      updateBoundary(L);
      // Update Markers
      updateMarkers(L);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Update tile layer when activeLayer changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    import('leaflet').then((L) => {
      updateTileLayer(L);
    });
  }, [activeLayer]);

  const updateTileLayer = (L: any) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let url = '';
    let attribution = '';
    let maxNativeZoom = 19;

    switch (activeLayer) {
      case 'satellite':
        // High-res Esri World Imagery with labels
        url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        maxNativeZoom = 19;
        attribution = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
        break;
      case 'dark':
        url = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
        attribution = '&copy; <a href="https://carto.com/">CARTO</a>';
        break;
      case 'terrain':
        url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        attribution = '&copy; OpenStreetMap contributors';
        break;
      case 'streets':
      default:
        // Google Maps styled clean vector tiles (CartoDB Positron / Voyager)
        url = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
        attribution = '&copy; Google-Style OpenStreetMap & CARTO';
        break;
    }

    const newTileLayer = L.tileLayer(url, {
      maxZoom: 21,
      maxNativeZoom,
      subdomains: 'abcd',
      attribution,
    });

    newTileLayer.addTo(map);
    tileLayerRef.current = newTileLayer;
  };

  // Update campus boundary
  const updateBoundary = (L: any) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (boundaryLayerRef.current) {
      map.removeLayer(boundaryLayerRef.current);
      boundaryLayerRef.current = null;
    }

    if (showCampusBoundary) {
      const polygon = L.polygon(CAMPUS_BOUNDARY, {
        color: '#1a73e8',
        weight: 2.5,
        dashArray: '6, 6',
        fillColor: '#4285f4',
        fillOpacity: 0.08,
      });

      polygon.addTo(map);
      boundaryLayerRef.current = polygon;
    }
  };

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    import('leaflet').then((L) => {
      updateBoundary(L);
    });
  }, [showCampusBoundary]);

  // Update markers
  const updateMarkers = (L: any) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (markersGroupRef.current) {
      map.removeLayer(markersGroupRef.current);
    }

    const markersGroup = L.layerGroup();

    locations.forEach((loc) => {
      const isSelected = selectedLocation?.id === loc.id;

      // Determine category color and icon
      let badgeBg = '#ea4335'; // default Google Maps red
      let iconSvg = '';

      if (loc.category === 'academic') {
        badgeBg = '#1a73e8'; // Google Blue
        iconSvg = '🎓';
      } else if (loc.category === 'admin') {
        badgeBg = '#d93025'; // Google Red
        iconSvg = '🏛️';
      } else if (loc.category === 'lab') {
        badgeBg = '#9334e8'; // Purple
        iconSvg = '🔬';
      } else if (loc.category === 'food') {
        badgeBg = '#e37400'; // Orange
        iconSvg = '🍔';
      } else if (loc.category === 'facility') {
        badgeBg = '#188038'; // Green
        iconSvg = '📚';
      } else if (loc.category === 'sports') {
        badgeBg = '#0d904f'; // Green sports
        iconSvg = '⚽';
      } else if (loc.category === 'hostel') {
        badgeBg = '#129eaf'; // Teal
        iconSvg = '🛏️';
      } else if (loc.category === 'parking') {
        badgeBg = '#5f6368'; // Grey
        iconSvg = '🅿️';
      } else if (loc.category === 'entry') {
        badgeBg = '#e8710a'; // Amber
        iconSvg = '🚪';
      }

      const customHtml = `
        <div class="gmap-marker-wrapper ${isSelected ? 'gmap-marker-active' : ''}">
          <div class="gmap-marker-bubble" style="background-color: ${badgeBg};">
            <span class="gmap-marker-icon">${iconSvg}</span>
          </div>
          <div class="gmap-marker-pin" style="border-top-color: ${badgeBg};"></div>
          <div class="gmap-marker-label">${loc.shortName}</div>
          ${isSelected ? '<div class="gmap-marker-pulse"></div>' : ''}
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'gmap-custom-div-icon',
        html: customHtml,
        iconSize: [36, 46],
        iconAnchor: [18, 44],
        popupAnchor: [0, -44],
      });

      const marker = L.marker([loc.lat, loc.lng], { icon: customIcon });

      marker.on('click', (e: any) => {
        L.DomEvent.stopPropagation(e);
        onSelectLocation(loc);
      });

      markersGroup.addLayer(marker);
    });

    markersGroup.addTo(map);
    markersGroupRef.current = markersGroup;
  };

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    import('leaflet').then((L) => {
      updateMarkers(L);
    });
  }, [locations, selectedLocation]);

  // Pan to selected location
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedLocation) return;
    const map = mapInstanceRef.current;
    map.flyTo([selectedLocation.lat, selectedLocation.lng], 19, {
      animate: true,
      duration: 1.2,
    });
  }, [selectedLocation]);

  // Handle route plotting
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    import('leaflet').then((L) => {
      const map = mapInstanceRef.current;

      if (routeLayerRef.current) {
        map.removeLayer(routeLayerRef.current);
        routeLayerRef.current = null;
      }

      if (routePoints && routePoints.length > 1) {
        const routeGroup = L.layerGroup();

        // Glowing outer route line
        const glowPolyline = L.polyline(routePoints, {
          color: '#1a73e8',
          weight: 8,
          opacity: 0.4,
          lineCap: 'round',
          lineJoin: 'round',
        });
        routeGroup.addLayer(glowPolyline);

        // Core blue route line
        const corePolyline = L.polyline(routePoints, {
          color: '#4285f4',
          weight: 5,
          opacity: 0.95,
          lineCap: 'round',
          lineJoin: 'round',
          dashArray: '10, 8',
        });
        routeGroup.addLayer(corePolyline);

        // Start Pin (Green)
        const startPoint = routePoints[0];
        const startIcon = L.divIcon({
          className: 'gmap-route-start-icon',
          html: `<div class="w-6 h-6 rounded-full bg-emerald-500 border-2 border-white shadow-lg flex items-center justify-center text-[10px] font-bold text-white">A</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });
        const startMarker = L.marker(startPoint, { icon: startIcon });
        routeGroup.addLayer(startMarker);

        // End Pin (Red Google Pin)
        const endPoint = routePoints[routePoints.length - 1];
        const endIcon = L.divIcon({
          className: 'gmap-route-end-icon',
          html: `<div class="w-7 h-7 rounded-full bg-red-600 border-2 border-white shadow-lg flex items-center justify-center text-[11px] font-bold text-white">B</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });
        const endMarker = L.marker(endPoint, { icon: endIcon });
        routeGroup.addLayer(endMarker);

        routeGroup.addTo(map);
        routeLayerRef.current = routeGroup;

        // Fit map bounds to fit route
        map.fitBounds(glowPolyline.getBounds(), {
          padding: [80, 80],
          maxZoom: 19,
          animate: true,
        });
      }
    });
  }, [routePoints]);

  // Handle dropped pin
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    import('leaflet').then((L) => {
      const map = mapInstanceRef.current;

      if (droppedPinMarkerRef.current) {
        map.removeLayer(droppedPinMarkerRef.current);
        droppedPinMarkerRef.current = null;
      }

      if (droppedPin) {
        const droppedIcon = L.divIcon({
          className: 'gmap-dropped-pin-icon',
          html: `
            <div class="dropped-pin-wrapper">
              <div class="dropped-pin-head"></div>
              <div class="dropped-pin-pulse"></div>
            </div>
          `,
          iconSize: [32, 42],
          iconAnchor: [16, 40],
        });

        const marker = L.marker([droppedPin.lat, droppedPin.lng], {
          icon: droppedIcon,
        });

        marker.addTo(map);
        droppedPinMarkerRef.current = marker;
      }
    });
  }, [droppedPin]);

  // Handle measure distance
  const updateMeasureLine = (L: any) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (measureLineRef.current) {
      map.removeLayer(measureLineRef.current);
      measureLineRef.current = null;
    }

    const pts = measurePointsRef.current;
    if (pts.length >= 2) {
      const line = L.polyline(pts, {
        color: '#ea4335',
        weight: 3,
        dashArray: '5, 5',
      });
      line.addTo(map);
      measureLineRef.current = line;

      // Calculate distance
      let totalDist = 0;
      for (let i = 0; i < pts.length - 1; i++) {
        const p1 = L.latLng(pts[i][0], pts[i][1]);
        const p2 = L.latLng(pts[i + 1][0], pts[i + 1][1]);
        totalDist += p1.distanceTo(p2);
      }
      onMeasureDistance?.(Math.round(totalDist));
    }
  };

  useEffect(() => {
    if (!measureMode) {
      measurePointsRef.current = [];
      if (measureLineRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(measureLineRef.current);
        measureLineRef.current = null;
      }
      onMeasureDistance?.(null);
    }
  }, [measureMode]);

  return (
    <div
      className={`w-full h-full relative transition-transform duration-700 ease-out ${
        is3DTilt ? 'perspective-tilt' : ''
      }`}
    >
      <div ref={mapContainerRef} className="w-full h-full z-0" />
    </div>
  );
}
