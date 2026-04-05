"use client";

import dynamic from 'next/dynamic';

const HSKApp = dynamic(() => import('@/hsk/App').then(mod => ({ default: mod.default })), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#006c4a] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#3c4a42] font-medium">Loading HSK Academy...</p>
      </div>
    </div>
  ),
});

export default function HSKPage() {
  return <HSKApp />;
}
