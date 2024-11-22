import React from 'react';
import { ArrowUpDown } from 'lucide-react';

interface SortingOptionsProps {
  sortOrder: 'price_asc' | 'price_desc' | 'date_asc' | 'date_desc' | null;
  onSortChange: (sort: 'price_asc' | 'price_desc' | 'date_asc' | 'date_desc' | null) => void;
}

export default function SortingOptions({ sortOrder, onSortChange }: SortingOptionsProps) {
  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center gap-2">
        <ArrowUpDown size={20} className="text-gray-400" />
        <span className="text-gray-700 font-medium">Sortering:</span>
      </div>
      <div className="flex gap-2">
        <select
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
          value={sortOrder || ''}
          onChange={(e) => onSortChange(e.target.value as typeof sortOrder)}
        >
          <option value="">Alle opslag</option>
          <optgroup label="Pris">
            <option value="price_asc">Laveste pris først</option>
            <option value="price_desc">Højeste pris først</option>
          </optgroup>
          <optgroup label="Dato">
            <option value="date_desc">Nyeste opslag først</option>
            <option value="date_asc">Ældste opslag først</option>
          </optgroup>
        </select>
      </div>
    </div>
  );
}