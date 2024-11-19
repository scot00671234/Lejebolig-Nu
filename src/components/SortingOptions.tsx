import React from 'react';
import { ArrowUpDown } from 'lucide-react';

interface SortingOptionsProps {
  sortOrder: 'price_asc' | 'price_desc' | 'date_asc' | 'date_desc' | null;
  onSortChange: (sort: 'price_asc' | 'price_desc' | 'date_asc' | 'date_desc' | null) => void;
}

export default function SortingOptions({ sortOrder, onSortChange }: SortingOptionsProps) {
  return (
    <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm px-6 py-4 rounded-xl shadow-sm ring-1 ring-gray-200">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-blue-50 transition-colors">
          <ArrowUpDown size={20} className="text-gray-400 group-hover:text-blue-500" />
        </div>
        <span className="text-gray-700 font-medium tracking-wide">Sortering</span>
      </div>
      <div className="flex gap-2">
        <select
          className="px-5 py-2.5 appearance-none bg-gray-50 border border-gray-200 rounded-xl 
                     text-gray-700 font-medium tracking-wide
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     hover:bg-gray-100 transition-all duration-200
                     bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] 
                     bg-[length:20px] bg-[right_16px_center] bg-no-repeat pr-12"
          value={sortOrder || ''}
          onChange={(e) => onSortChange(e.target.value as typeof sortOrder)}
        >
          <option value="" className="text-gray-700 font-medium">Alle opslag</option>
          <optgroup label="Pris" className="font-medium text-gray-900">
            <option value="price_asc" className="text-gray-700 py-2">Laveste pris først</option>
            <option value="price_desc" className="text-gray-700 py-2">Højeste pris først</option>
          </optgroup>
          <optgroup label="Dato" className="font-medium text-gray-900">
            <option value="date_desc" className="text-gray-700 py-2">Nyeste opslag først</option>
            <option value="date_asc" className="text-gray-700 py-2">Ældste opslag først</option>
          </optgroup>
        </select>
      </div>
    </div>
  );
}