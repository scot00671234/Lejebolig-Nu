import React from 'react';
import { Search, MapPin, Home, DollarSign } from 'lucide-react';
import { SearchFilters } from '../types';

interface SearchBarProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
  onSortChange: (sort: 'price_asc' | 'price_desc' | null) => void;
}

export default function SearchBar({ filters, onFilterChange, onSortChange }: SearchBarProps) {
  const locations = ['København', 'Aarhus', 'Odense', 'Aalborg', 'Frederiksberg'];
  
  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Søg efter boliger..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={filters.query}
            onChange={(e) => onFilterChange({ ...filters, query: e.target.value })}
          />
        </div>

        <div className="relative">
          <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
          <select
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
            value={filters.location}
            onChange={(e) => onFilterChange({ ...filters, location: e.target.value })}
          >
            <option value="">Lokation</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <div className="relative">
          <Home className="absolute left-3 top-3 text-gray-400" size={20} />
          <select
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
            value={filters.bedrooms}
            onChange={(e) => onFilterChange({ ...filters, bedrooms: Number(e.target.value) })}
          >
            <option value="">Værelser</option>
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>{num}+ Værelser</option>
            ))}
          </select>
        </div>

        <div className="relative">
          <DollarSign className="absolute left-3 top-3 text-gray-400" size={20} />
          <select
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange({ ...filters, maxPrice: Number(e.target.value) })}
          >
            <option value="">Maks pris</option>
            {[5000, 10000, 15000, 20000, 25000].map((price) => (
              <option key={price} value={price}>Op til {price.toLocaleString('da-DK')} kr</option>
            ))}
            <option value="999999">25.000+ kr</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <select
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          onChange={(e) => onSortChange(e.target.value as 'price_asc' | 'price_desc' | null)}
          defaultValue=""
        >
          <option value="">Sortering</option>
          <option value="price_asc">Pris: Lav til høj</option>
          <option value="price_desc">Pris: Høj til lav</option>
        </select>
      </div>
    </div>
  );
}