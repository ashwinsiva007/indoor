'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  X,
  Navigation,
  Mic,
  MapPin,
  GraduationCap,
  FlaskConical,
  Building2,
  Utensils,
  Bed,
  Trophy,
  DoorOpen,
  Car,
  CornerDownRight,
  Compass,
} from 'lucide-react';
import { CampusLocation, CATEGORY_FILTERS } from '@/data/campusLocations';

interface SearchBarProps {
  locations: CampusLocation[];
  onSelectLocation: (loc: CampusLocation) => void;
  onOpenDirections: () => void;
  activeCategory: string;
  onSelectCategory: (catId: string) => void;
  selectedLocation: CampusLocation | null;
}

export default function SearchBar({
  locations,
  onSelectLocation,
  onOpenDirections,
  activeCategory,
  onSelectCategory,
  selectedLocation,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Sync query when selectedLocation changes externally
  useEffect(() => {
    if (selectedLocation) {
      setQuery(selectedLocation.name);
    }
  }, [selectedLocation]);

  // Click outside listener to close dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredLocations = locations.filter((loc) => {
    const matchesQuery =
      loc.name.toLowerCase().includes(query.toLowerCase()) ||
      loc.shortName.toLowerCase().includes(query.toLowerCase()) ||
      loc.categoryLabel.toLowerCase().includes(query.toLowerCase()) ||
      loc.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));

    const matchesCategory =
      activeCategory === 'all' || loc.category === activeCategory;

    return matchesQuery && matchesCategory;
  });

  const getCategoryIcon = (catId: string) => {
    switch (catId) {
      case 'academic':
        return <GraduationCap className="w-3.5 h-3.5" />;
      case 'lab':
        return <FlaskConical className="w-3.5 h-3.5" />;
      case 'facility':
        return <Building2 className="w-3.5 h-3.5" />;
      case 'food':
        return <Utensils className="w-3.5 h-3.5" />;
      case 'hostel':
        return <Bed className="w-3.5 h-3.5" />;
      case 'sports':
        return <Trophy className="w-3.5 h-3.5" />;
      case 'entry':
        return <DoorOpen className="w-3.5 h-3.5" />;
      case 'parking':
        return <Car className="w-3.5 h-3.5" />;
      default:
        return <MapPin className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div
      ref={searchContainerRef}
      className="absolute top-4 left-4 z-30 flex flex-col gap-2.5 max-w-[430px] w-[calc(100vw-32px)] sm:w-[430px]"
    >
      {/* Floating Google Maps Style Search Card */}
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden transition-all duration-200">
        <div className="flex items-center px-4 py-3 gap-3">
          {/* Logo / Search Icon */}
          <div className="text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Search className="w-5 h-5" />
          </div>

          {/* Search Input */}
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search Sri Shakthi Campus..."
            className="flex-1 bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none font-medium"
          />

          {/* Clear Button */}
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setIsOpen(true);
              }}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Divider */}
          <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700" />

          {/* Directions Blue Action Icon */}
          <button
            onClick={onOpenDirections}
            title="Get Directions"
            className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-md shadow-blue-500/30 transition-transform active:scale-95"
          >
            <Navigation className="w-4 h-4 fill-white" />
          </button>
        </div>

        {/* Autocomplete Dropdown */}
        {isOpen && (
          <div className="max-h-80 overflow-y-auto border-t border-slate-100 dark:border-slate-800/70 divide-y divide-slate-100 dark:divide-slate-800/50">
            {filteredLocations.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">
                No campus locations match &ldquo;{query}&rdquo;
              </div>
            ) : (
              filteredLocations.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => {
                    onSelectLocation(loc);
                    setQuery(loc.name);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue-50 group-hover:text-blue-600 dark:group-hover:bg-blue-900/40 dark:group-hover:text-blue-400 transition-colors">
                    {getCategoryIcon(loc.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {loc.name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
                      <span className="font-medium text-amber-500">★ {loc.rating}</span>
                      <span>·</span>
                      <span>{loc.categoryLabel}</span>
                    </div>
                  </div>
                  <CornerDownRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors shrink-0 mt-1.5" />
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Category Filter Pills (Scrollable Horizontal) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar max-w-full">
        {CATEGORY_FILTERS.map((cat) => {
          const isSelected = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shrink-0 shadow-md backdrop-blur-md transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-blue-500/25 scale-[1.02]'
                  : 'bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {getCategoryIcon(cat.id)}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
