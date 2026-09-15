import React from 'react';
import { Hexagon } from 'lucide-react';

interface SensoryScaleProps {
  label: string;
  value: number; // 1 to 5
  max?: number;
}

export function SensoryScale({ label, value, max = 5 }: SensoryScaleProps) {
  return (
    <div className="flex items-center justify-between gap-4 w-full">
      <span className="text-sm text-[#A69784] font-medium min-w-[100px]">{label}</span>
      <div className="flex items-center gap-1">
        {Array.from({ length: max }).map((_, i) => (
          <div key={i} className="relative w-4 h-4">
            {/* Tło (pusty sześcian) */}
            <Hexagon 
              className={`absolute inset-0 w-4 h-4 stroke-[1.5px] transition-colors duration-300 ${
                i < value ? 'text-[#E5983A] fill-[#E5983A]' : 'text-[#C4B7A5]/30 fill-transparent'
              }`} 
            />
          </div>
        ))}
      </div>
    </div>
  );
}
