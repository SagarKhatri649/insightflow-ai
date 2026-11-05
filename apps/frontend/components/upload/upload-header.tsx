
// components/UploadHeader.tsx
import { Play } from 'lucide-react';

export default function UploadHeader() {
  return (
    <header className="w-full border-b border-[#f1f3f5] bg-white">
      <div className="mx-auto flex min-h-[68px] max-w-7xl flex-col items-center justify-center gap-3 px-4 py-3 sm:h-[68px] sm:flex-row sm:justify-between sm:gap-0 sm:px-6 lg:px-12">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#064e3b] text-white shadow-sm">
            <Play className="h-4 w-4 fill-[#10b981] text-[#10b981]" />
          </div>
          <span className="font-bold tracking-tight text-[#064e3b]">InsightFlow</span>
        </div>
        <div className="flex items-center justify-center space-x-2" aria-label="Upload progress">
          <div className="flex items-center space-x-2 rounded-full bg-[#064e3b] px-3.5 py-1.5 text-white shadow-sm">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-[#064e3b]">1</span>
            <span className="whitespace-nowrap pr-1 text-sm font-medium">Upload</span>
          </div>
          <div className="h-px w-8 bg-[#dee1e6]" />
          <div className="flex items-center space-x-2 rounded-full border border-[#dee1e6] bg-white px-3.5 py-1.5 text-[#5f6368]">
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#dee1e6] text-xs font-medium">2</span>
            <span className="whitespace-nowrap pr-1 text-sm font-medium">Insights</span>
          </div>
        </div>
        <div className="hidden w-24 sm:block" aria-hidden="true" />
      </div>
    </header>
  );
}
