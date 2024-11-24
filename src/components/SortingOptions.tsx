import React from 'react';
import { ArrowUpDown } from 'lucide-react';

interface SortingOptionsProps {
  sortOrder: 'price_asc' | 'price_desc' | 'date_asc' | 'date_desc' | null;
  onSortChange: (order: 'price_asc' | 'price_desc' | 'date_asc' | 'date_desc' | null) => void;
}

export default function SortingOptions({ sortOrder, onSortChange }: SortingOptionsProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="group relative">
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white hover:bg-gray-50 shadow-sm hover:shadow-md border border-gray-100 hover:border-gray-200 transition-all duration-200 cursor-pointer">
          <ArrowUpDown 
            size={20} 
            className="text-gray-400 group-hover:text-blue-500 group-hover:scale-110 transition-all duration-200"
            strokeWidth={2}
          />
          <select
            className="appearance-none bg-transparent w-full text-gray-600 font-medium group-hover:text-blue-500 cursor-pointer focus:outline-none focus:ring-0 transition-colors duration-200 pr-8 [&>optgroup]:text-sm [&>optgroup]:font-semibold [&>optgroup]:text-gray-400 [&>optgroup]:bg-white [&>optgroup>option]:text-gray-600 [&>optgroup>option]:font-normal [&>optgroup>option]:py-2 [&>optgroup>option]:px-4 [&>optgroup>option]:bg-white [&>optgroup>option:hover]:bg-blue-50 [&>optgroup>option:hover]:text-blue-600"
            value={sortOrder || ''}
            onChange={(e) => onSortChange(e.target.value as typeof sortOrder)}
          >
            <optgroup label="Pris" className="!pt-2 !pb-1 !px-3 !border-gray-100">
              <option value="price_asc" className="!my-1">Laveste pris først</option>
              <option value="price_desc" className="!my-1">Højeste pris først</option>
            </optgroup>
            <optgroup label="Dato" className="!pt-2 !pb-1 !px-3 !border-t !border-gray-100">
              <option value="date_desc" className="!my-1">Nyeste opslag først</option>
              <option value="date_asc" className="!my-1">Ældste opslag først</option>
            </optgroup>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}