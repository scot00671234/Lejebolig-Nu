import React, { useState } from 'react';
import { usePropertyStore } from '../store/propertyStore';

export const AvailabilityFilter: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const { properties, filterAvailableProperties } = usePropertyStore();

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setSelectedDate(date);
    
    // Filtrer boliger baseret på den valgte dato
    const filteredProperties = filterAvailableProperties(date);
    
    // Opdater properties i store
    usePropertyStore.setState({ properties: filteredProperties });
  };

  const resetFilter = () => {
    setSelectedDate('');
    // Genindlæs alle properties
    usePropertyStore.getState().fetchProperties();
  };

  return (
    <div className="flex items-center space-x-4 mb-4">
      <div className="flex-grow">
        <label htmlFor="availabilityFilter" className="block text-sm font-medium text-gray-700">
          Vis boliger ledige fra
        </label>
        <input
          type="date"
          id="availabilityFilter"
          value={selectedDate}
          onChange={handleDateChange}
          min={new Date().toISOString().split('T')[0]} // Forhindrer valg af tidligere datoer
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      {selectedDate && (
        <button 
          onClick={resetFilter}
          className="mt-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
        >
          Nulstil filter
        </button>
      )}
    </div>
  );
};
