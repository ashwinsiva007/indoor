export interface MapPlace {
  id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  address: string;
  rating: number;
  reviewsCount: number;
  openStatus: string;
  imageUrl: string;
  phone?: string;
  website?: string;
}
