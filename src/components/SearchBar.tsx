import React, { useState } from 'react';
import * as Icons from 'lucide-react';

interface SearchBarProps {
  filters: any;
  onFilterChange: (filters: any) => void;
  onSearch?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ filters, onFilterChange, onSearch }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const locations = ['København', 'Aarhus', 'Odense', 'Aalborg', 'Frederiksberg', 'Esbjerg'];
  
  const propertyTypes = [
    { value: 'all', label: 'Alle boligtyper' },
    { value: 'apartment', label: 'Lejligheder' },
    { value: 'room', label: 'Værelser' },
    { value: 'house', label: 'Hus' },
    { value: 'townhouse', label: 'Rækkehus' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(filters.query);
  };

  const handleFilterChange = (key: string, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="space-y-4">
        {/* Main Search Row */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700">
              <Icons.Search size={24} strokeWidth={2} />
            </div>
            <input
              type="text"
              placeholder="Hvor vil du bo? (Ex: København)"
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              value={filters.query}
              onChange={(e) => handleFilterChange('query', e.target.value)}
            />
          </div>
          
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-3 rounded-lg border border-gray-300 hover:border-blue-500 hover:bg-blue-50"
          >
            <Icons.ChevronDown 
              size={24} 
              className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            />
          </button>

          <button 
            type="submit" 
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Icons.Search size={24} />
            <span>Søg</span>
          </button>
        </div>

        {/* Expandable Filters */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 transition-all duration-300 ${
          isExpanded ? 'opacity-100 max-h-[500px]' : 'opacity-0 max-h-0 overflow-hidden'
        }`}>
          {/* Property Type */}
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 group-hover:text-blue-500 transition-colors">
              <Icons.Building size={24} strokeWidth={2} />
            </div>
            <select
              className="w-full pl-12 pr-10 py-3 rounded-lg border border-gray-300 hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 appearance-none cursor-pointer"
              value={filters.propertyType || 'all'}
              onChange={(e) => handleFilterChange('propertyType', e.target.value)}
            >
              <option value="all">Boligtype</option>
              {propertyTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <Icons.ChevronDown size={20} />
            </div>
          </div>

          {/* Location */}
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 group-hover:text-blue-500 transition-colors">
              <Icons.MapPin size={24} strokeWidth={2} />
            </div>
            <select
              className="w-full pl-12 pr-10 py-3 rounded-lg border border-gray-300 hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 appearance-none cursor-pointer"
              value={filters.location || ''}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            >
              <option value="">Vælg lokation</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <Icons.ChevronDown size={20} />
            </div>
          </div>

          {/* Price */}
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 group-hover:text-blue-500 transition-colors">
              <Icons.DollarSign size={24} strokeWidth={2} />
            </div>
            <select
              className="w-full pl-12 pr-10 py-3 rounded-lg border border-gray-300 hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 appearance-none cursor-pointer"
              value={filters.maxPrice || ''}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : '')}
            >
              <option value="">Maks pris</option>
              {[5000, 10000, 15000, 20000, 25000].map(price => (
                <option key={price} value={price}>Op til {price.toLocaleString('da-DK')} kr</option>
              ))}
              <option value="999999">25.000+ kr</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <Icons.ChevronDown size={20} />
            </div>
          </div>

          {/* Size */}
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 group-hover:text-blue-500 transition-colors">
              <Icons.Square size={24} strokeWidth={2} />
            </div>
            <select
              className="w-full pl-12 pr-10 py-3 rounded-lg border border-gray-300 hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 appearance-none cursor-pointer"
              value={filters.minSize || ''}
              onChange={(e) => handleFilterChange('minSize', e.target.value ? Number(e.target.value) : '')}
            >
              <option value="">Min. størrelse</option>
              {[50, 75, 100, 125, 150].map(size => (
                <option key={size} value={size}>{size}+ m²</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <Icons.ChevronDown size={20} />
            </div>
          </div>

          {/* Rooms */}
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 group-hover:text-blue-500 transition-colors">
              <Icons.Home size={24} strokeWidth={2} />
            </div>
            <select
              className="w-full pl-12 pr-10 py-3 rounded-lg border border-gray-300 hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 appearance-none cursor-pointer"
              value={filters.bedrooms || ''}
              onChange={(e) => handleFilterChange('bedrooms', e.target.value ? Number(e.target.value) : '')}
            >
              <option value="">Antal værelser</option>
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num}+ Værelser</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <Icons.ChevronDown size={20} />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;