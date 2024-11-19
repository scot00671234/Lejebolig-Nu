import React from 'react';
import { Search, MapPin, Home, DollarSign, Square } from 'lucide-react';
import { SearchFilters } from '../types';

interface SearchBarProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
}

export default function SearchBar({ filters, onFilterChange }: SearchBarProps) {
  const locations = ['København', 'Aarhus', 'Odense', 'Aalborg', 'Frederiksberg', 'Esbjerg'];
  
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-blue-400/5 transform -skew-y-2 rounded-3xl" />
      <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 ring-1 ring-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="relative md:col-span-2 group">
            <label className="inline-block text-sm font-semibold text-gray-700 mb-2 ml-1 tracking-wide transform transition-all duration-300 group-hover:text-blue-600">
              Søg efter bolig
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Indtast søgeord..."
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50/80 border border-gray-200 rounded-xl
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all duration-300 placeholder-gray-400
                         hover:bg-white hover:border-blue-200 hover:shadow-md"
                value={filters.query}
                onChange={(e) => onFilterChange({ ...filters, query: e.target.value })}
              />
            </div>
          </div>

          <div className="relative group">
            <label className="inline-block text-sm font-semibold text-gray-700 mb-2 ml-1 tracking-wide transform transition-all duration-300 group-hover:text-blue-600">
              Lokation
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 group-hover:text-blue-500 transition-colors" size={20} />
              <select
                className="w-full pl-11 pr-10 py-3.5 bg-gray-50/80 border border-gray-200 rounded-xl
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all duration-300 appearance-none cursor-pointer
                         hover:bg-white hover:border-blue-200 hover:shadow-md
                         font-medium text-gray-600"
                value={filters.location}
                onChange={(e) => onFilterChange({ ...filters, location: e.target.value })}
              >
                <option value="" className="text-gray-500 font-medium">Vælg by</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc} className="text-gray-700 font-medium py-2">{loc}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-hover:translate-y-[-45%]">
                <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="relative group">
            <label className="inline-block text-sm font-semibold text-gray-700 mb-2 ml-1 tracking-wide transform transition-all duration-300 group-hover:text-blue-600">
              Værelser
            </label>
            <div className="relative">
              <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 group-hover:text-blue-500 transition-colors" size={20} />
              <select
                className="w-full pl-11 pr-10 py-3.5 bg-gray-50/80 border border-gray-200 rounded-xl
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all duration-300 appearance-none cursor-pointer
                         hover:bg-white hover:border-blue-200 hover:shadow-md
                         font-medium text-gray-600"
                value={filters.bedrooms}
                onChange={(e) => onFilterChange({ ...filters, bedrooms: Number(e.target.value) })}
              >
                <option value="" className="text-gray-500 font-medium">Antal værelser</option>
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num} className="text-gray-700 font-medium py-2">{num}+ Værelser</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-hover:translate-y-[-45%]">
                <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="relative group">
            <label className="inline-block text-sm font-semibold text-gray-700 mb-2 ml-1 tracking-wide transform transition-all duration-300 group-hover:text-blue-600">
              Maksimal pris
            </label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 group-hover:text-blue-500 transition-colors" size={20} />
              <select
                className="w-full pl-11 pr-10 py-3.5 bg-gray-50/80 border border-gray-200 rounded-xl
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all duration-300 appearance-none cursor-pointer
                         hover:bg-white hover:border-blue-200 hover:shadow-md
                         font-medium text-gray-600"
                value={filters.maxPrice}
                onChange={(e) => onFilterChange({ ...filters, maxPrice: Number(e.target.value) })}
              >
                <option value="" className="text-gray-500 font-medium">Vælg maksimal pris</option>
                {[5000, 7500, 10000, 12500, 15000, 20000].map((price) => (
                  <option key={price} value={price} className="text-gray-700 font-medium py-2">
                    {price.toLocaleString('da-DK')} kr
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-hover:translate-y-[-45%]">
                <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="relative group">
            <label className="inline-block text-sm font-semibold text-gray-700 mb-2 ml-1 tracking-wide transform transition-all duration-300 group-hover:text-blue-600">
              Minimum størrelse
            </label>
            <div className="relative">
              <Square className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 group-hover:text-blue-500 transition-colors" size={20} />
              <select
                className="w-full pl-11 pr-10 py-3.5 bg-gray-50/80 border border-gray-200 rounded-xl
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all duration-300 appearance-none cursor-pointer
                         hover:bg-white hover:border-blue-200 hover:shadow-md
                         font-medium text-gray-600"
                value={filters.minSize}
                onChange={(e) => onFilterChange({ ...filters, minSize: Number(e.target.value) })}
              >
                <option value="" className="text-gray-500 font-medium">Vælg min. størrelse</option>
                <option value="1" className="text-gray-700 font-medium py-2">1+ m²</option>
                {[50, 75, 100, 125, 150].map((size) => (
                  <option key={size} value={size} className="text-gray-700 font-medium py-2">{size}+ m²</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-hover:translate-y-[-45%]">
                <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}