import React from 'react';
import { DatePicker } from './DatePicker';
import { PropertyType } from '../types';
import { Slider } from './ui/Slider';

interface PropertyFiltersProps {
  filters: {
    priceRange: [number, number];
    moveInDate?: Date;
    propertyType?: PropertyType;
  };
  onFilterChange: (filters: any) => void;
}

export function PropertyFilters({ filters, onFilterChange }: PropertyFiltersProps) {
  const handlePriceChange = (value: [number, number]) => {
    onFilterChange({ ...filters, priceRange: value });
  };

  const handleDateChange = (date: Date | undefined) => {
    onFilterChange({ ...filters, moveInDate: date });
  };

  const handleTypeChange = (type: PropertyType) => {
    onFilterChange({ ...filters, propertyType: type });
  };

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Filtre</h3>
        
        <div className="space-y-4">
          {/* Price Range Slider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Månedlig leje
            </label>
            <Slider
              min={0}
              max={30000}
              step={500}
              value={filters.priceRange}
              onChange={handlePriceChange}
            />
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>{filters.priceRange[0]} kr.</span>
              <span>{filters.priceRange[1]} kr.</span>
            </div>
          </div>

          {/* Move-in Date Picker */}
          <DatePicker
            selected={filters.moveInDate}
            onSelect={handleDateChange}
            label="Indflytningsdato"
            minDate={new Date()}
          />

          {/* Property Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Boligtype
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(PropertyType).map((type) => (
                <button
                  key={type}
                  onClick={() => handleTypeChange(type)}
                  className={`px-4 py-2 text-sm rounded-lg border ${
                    filters.propertyType === type
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 text-gray-700 hover:border-blue-500'
                  }`}
                >
                  {type === 'apartment' && 'Lejlighed'}
                  {type === 'house' && 'Hus'}
                  {type === 'room' && 'Værelse'}
                  {type === 'townhouse' && 'Rækkehus'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
