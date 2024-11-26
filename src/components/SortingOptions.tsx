import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { SortOrder } from '../types';

interface SortingOptionsProps {
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
}

export default function SortingOptions({ sortOrder, onSortChange }: SortingOptionsProps) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-gray-600">Sortér efter:</span>
      <div className="group relative">
        <select
          value={sortOrder}
          onChange={(e) => onSortChange(e.target.value as SortOrder)}
          className="appearance-none flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white text-gray-900 hover:bg-gray-50 shadow-sm hover:shadow-md border border-gray-100 hover:border-gray-200 transition-all duration-200 cursor-pointer pr-10"
        >
          <option value="newest" className="text-gray-900">Dato (Nyeste først)</option>
          <option value="oldest" className="text-gray-900">Dato (Ældste først)</option>
          <option value="price_asc" className="text-gray-900">Pris (Lavest først)</option>
          <option value="price_desc" className="text-gray-900">Pris (Højest først)</option>
        </select>
        <ArrowUpDown 
          size={20} 
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 group-hover:scale-110 transition-all duration-200 pointer-events-none"
        />
      </div>
    </div>
  );
}