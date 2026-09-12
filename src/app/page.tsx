'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const GoogleMap = dynamic(() => import('@/components/GoogleMap'), {
  ssr: false,
  loading: () => (
    <div className="w-screen h-screen bg-[#e5e3df] flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-3 border-[#1a73e8] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-medium text-slate-600">Loading Google Map...</span>
      </div>
    </div>
  ),
});

export default function Page() {
  return (
    <main className="w-screen h-screen overflow-hidden">
      <GoogleMap />
    </main>
  );
}
