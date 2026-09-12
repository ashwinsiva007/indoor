export interface BoundaryPoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export const BOUNDARY_POINTS: BoundaryPoint[] = [
  { id: 'A', name: 'Point A', lat: 11.041370, lng: 77.072844 },
  { id: 'B', name: 'Point B', lat: 11.041649, lng: 77.076879 },
  { id: 'C', name: 'Point C', lat: 11.040850, lng: 77.076797 },
  { id: 'D', name: 'Point D', lat: 11.040819, lng: 77.076257 },
  { id: 'E', name: 'Point E', lat: 11.038112, lng: 77.076091 },
  { id: 'F', name: 'Point F', lat: 11.038146, lng: 77.073014 },
];

export const BOUNDARY_POLYGON: [number, number][] = [
  [11.041370, 77.072844], // A
  [11.041649, 77.076879], // B
  [11.040850, 77.076797], // C
  [11.040819, 77.076257], // D
  [11.038112, 77.076091], // E
  [11.038146, 77.073014], // F
];

export const MAP_CENTER = {
  lat: 11.03988,
  lng: 77.07486,
  zoom: 17,
};
