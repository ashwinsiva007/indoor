'use client';

import React, { useState } from 'react';
import {
  X,
  Navigation,
  Bookmark,
  Share2,
  Phone,
  Globe,
  Clock,
  MapPin,
  Star,
  CheckCircle2,
  Sparkles,
  Layers,
  ChevronRight,
  ExternalLink,
  Building,
  Info,
} from 'lucide-react';
import { CampusLocation } from '@/data/campusLocations';

interface PlaceDetailDrawerProps {
  location: CampusLocation;
  onClose: () => void;
  onGetDirections: (location: CampusLocation) => void;
  onExploreNearby: (location: CampusLocation) => void;
}

export default function PlaceDetailDrawer({
  location,
  onClose,
  onGetDirections,
  onExploreNearby,
}: PlaceDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'about' | 'reviews' | 'photos'>('overview');
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `https://maps.google.com/?q=${location.lat},${location.lng} (${encodeURIComponent(location.name)})`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="absolute top-4 left-4 bottom-4 z-40 w-[calc(100vw-32px)] sm:w-[420px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col animate-in fade-in slide-in-from-left duration-300">
      {/* Header Image with Gradient Overlay */}
      <div className="relative h-48 w-full shrink-0 bg-slate-900 overflow-hidden">
        <img
          src={location.imageUrl}
          alt={location.name}
          className="w-full h-full object-cover brightness-90 hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Category Pill on Image */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-blue-600/90 backdrop-blur-md text-white text-[11px] font-bold tracking-wide flex items-center gap-1 shadow-lg">
          <Sparkles className="w-3 h-3" />
          <span>{location.categoryLabel}</span>
        </div>

        {/* Title over image bottom */}
        <div className="absolute bottom-3 left-4 right-4">
          <h2 className="text-lg font-bold text-white leading-tight drop-shadow-md">
            {location.name}
          </h2>
          <div className="flex items-center gap-2 mt-1 text-slate-200 text-xs">
            <span className="font-semibold text-amber-400 flex items-center gap-0.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {location.rating}
            </span>
            <span>·</span>
            <span>({location.reviewCount} Google reviews)</span>
          </div>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="grid grid-cols-4 gap-1 p-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-center shrink-0">
        <button
          onClick={() => onGetDirections(location)}
          className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition-colors group"
        >
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/30 group-hover:scale-105 transition-transform">
            <Navigation className="w-4 h-4 fill-white" />
          </div>
          <span className="text-[11px] font-bold">Directions</span>
        </button>

        <button
          onClick={() => setIsSaved(!isSaved)}
          className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300 transition-colors"
        >
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              isSaved
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
          </div>
          <span className="text-[11px] font-medium">{isSaved ? 'Saved' : 'Save'}</span>
        </button>

        <button
          onClick={() => onExploreNearby(location)}
          className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300 transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-medium">Nearby</span>
        </button>

        <button
          onClick={handleShare}
          className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300 transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center">
            <Share2 className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-medium">{copied ? 'Copied!' : 'Share'}</span>
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 px-4 shrink-0">
        {(['overview', 'about', 'reviews', 'photos'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-xs font-semibold capitalize border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Scrollable Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'overview' && (
          <>
            {/* Description Card */}
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {location.description}
            </p>

            {/* Key Information List */}
            <div className="space-y-3 pt-2">
              {/* Address */}
              <div className="flex items-start gap-3 text-xs text-slate-700 dark:text-slate-200">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-medium">{location.address}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-3 text-xs text-slate-700 dark:text-slate-200">
                <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {location.openHours}
                  </div>
                  <div className="text-[11px] text-slate-400">Sri Shakthi Working Hours</div>
                </div>
              </div>

              {/* Floor Level */}
              {location.floorInfo && (
                <div className="flex items-start gap-3 text-xs text-slate-700 dark:text-slate-200">
                  <Building className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium">{location.floorInfo}</div>
                    <div className="text-[11px] text-slate-400">Elevator & Ramp Accessible</div>
                  </div>
                </div>
              )}

              {/* Phone */}
              {location.phone && (
                <div className="flex items-center gap-3 text-xs text-slate-700 dark:text-slate-200">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <a
                    href={`tel:${location.phone}`}
                    className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {location.phone}
                  </a>
                </div>
              )}

              {/* Website */}
              {location.website && (
                <div className="flex items-center gap-3 text-xs text-slate-700 dark:text-slate-200">
                  <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                  <a
                    href={location.website}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <span>Visit Official Web Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Popular Amenities & Features */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 mb-2">
                Campus Highlights & Facilities
              </h3>
              <div className="grid grid-cols-1 gap-1.5">
                {location.popularFeatures.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'about' && (
          <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
            <div className="bg-blue-50 dark:bg-blue-950/40 p-3 rounded-xl border border-blue-100 dark:border-blue-900/50">
              <div className="font-semibold text-blue-900 dark:text-blue-200 flex items-center gap-1.5 mb-1">
                <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Sri Shakthi Institute of Engg & Tech</span>
              </div>
              <p className="text-[11px] text-blue-700 dark:text-blue-300 leading-relaxed">
                Autonomous institution approved by AICTE, accredited by NAAC with &lsquo;A&rsquo; Grade, and affiliated to Anna University, Chennai.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1.5">Search Keywords & Tags</h4>
              <div className="flex flex-wrap gap-1.5">
                {location.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300 font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl">
              <div>
                <div className="text-2xl font-black text-slate-800 dark:text-slate-100">
                  {location.rating}
                </div>
                <div className="flex text-amber-400 text-xs">★★★★★</div>
              </div>
              <div className="text-right text-xs text-slate-500">
                <div>Based on</div>
                <div className="font-bold text-slate-700 dark:text-slate-200">
                  {location.reviewCount} student ratings
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {(location.reviews || [
                {
                  author: 'Campus Visitor',
                  rating: 5,
                  date: '1 month ago',
                  text: 'Clean campus with excellent directional signages and pleasant greenery.',
                },
              ]).map((rev, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{rev.author}</span>
                    <span className="text-slate-400 text-[10px]">{rev.date}</span>
                  </div>
                  <div className="text-amber-400 text-[10px]">
                    {'★'.repeat(rev.rating)}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{rev.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'photos' && (
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl overflow-hidden aspect-video bg-slate-800">
              <img
                src={location.imageUrl}
                alt={location.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>
            <div className="rounded-xl overflow-hidden aspect-video bg-slate-800">
              <img
                src="https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80"
                alt="Campus View"
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>
            <div className="rounded-xl overflow-hidden aspect-video bg-slate-800">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80"
                alt="Students & Labs"
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>
            <div className="rounded-xl overflow-hidden aspect-video bg-slate-800">
              <img
                src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80"
                alt="Tech Infrastructure"
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer / Quick Route Action */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
        <div className="text-[11px] text-slate-500">
          Sri Shakthi Campus Wayfinding
        </div>
        <button
          onClick={() => onGetDirections(location)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/25 flex items-center gap-1.5 transition-transform active:scale-95"
        >
          <Navigation className="w-3.5 h-3.5 fill-white" />
          <span>Get Directions</span>
        </button>
      </div>
    </div>
  );
}
