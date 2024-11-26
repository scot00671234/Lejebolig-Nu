import React, { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

interface DatePickerProps {
  selected?: Date;
  onSelect: (date: Date | undefined) => void;
  label: string;
  minDate?: Date;
}

export function DatePicker({ selected, onSelect, label, minDate }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('da-DK', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-3 py-2 text-left border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <CalendarIcon className="h-5 w-5 text-gray-400" />
        <span className="flex-1">
          {selected ? formatDate(selected) : 'Vælg dato'}
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-20"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-30 mt-1 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={selected?.toISOString().split('T')[0] || ''}
              min={minDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0]}
              onChange={(e) => {
                const date = new Date(e.target.value);
                onSelect(date);
                setIsOpen(false);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
