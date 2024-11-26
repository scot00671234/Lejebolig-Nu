import React, { useState } from 'react';
import { DatePicker } from './DatePicker';
import { Property, PropertyType } from '../types';
import { useAuthStore } from '../store/authStore';

interface CreatePropertyFormProps {
  onSubmit: (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt' | 'images'>) => Promise<void>;
}

export function CreatePropertyForm({ onSubmit }: CreatePropertyFormProps) {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    zipCode: '',
    price: {
      monthlyRent: 0,
      deposit: 0,
      prepaidRent: 0,
      utilities: 0,
      totalMoveInCost: 0,
    },
    size: 0,
    rooms: 0,
    type: 'apartment' as PropertyType,
    availableFrom: new Date().toISOString(),
    status: 'available' as const,
    features: [] as string[],
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('price.')) {
      const priceField = name.split('.')[1];
      const numValue = Number(value);
      setFormData(prev => {
        const newPrice = {
          ...prev.price,
          [priceField]: numValue,
        };
        // Calculate total move-in cost
        newPrice.totalMoveInCost = newPrice.deposit + newPrice.prepaidRent + newPrice.monthlyRent;
        return {
          ...prev,
          price: newPrice,
        };
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit({
        ...formData,
        userId: user?.id || '',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Titel</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Beskrivelse</label>
          <textarea
            name="description"
            required
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Adresse</label>
            <input
              type="text"
              name="address"
              required
              value={formData.address}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">By</label>
            <input
              type="text"
              name="city"
              required
              value={formData.city}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Postnummer</label>
            <input
              type="text"
              name="zipCode"
              required
              value={formData.zipCode}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Månedlig leje (kr)</label>
            <input
              type="number"
              name="price.monthlyRent"
              required
              min="0"
              value={formData.price.monthlyRent}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Depositum (kr)</label>
            <input
              type="number"
              name="price.deposit"
              required
              min="0"
              value={formData.price.deposit}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Forudbetalt leje (kr)</label>
            <input
              type="number"
              name="price.prepaidRent"
              required
              min="0"
              value={formData.price.prepaidRent}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Aconto forbrug (kr/md)</label>
            <input
              type="number"
              name="price.utilities"
              required
              min="0"
              value={formData.price.utilities}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="font-medium text-gray-900">Samlet indflytningspris</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">
            {formData.price.totalMoveInCost} kr.
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Depositum + Forudbetalt leje + Første måneds leje
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Størrelse (m²)</label>
            <input
              type="number"
              name="size"
              required
              min="0"
              value={formData.size}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Antal værelser</label>
            <input
              type="number"
              name="rooms"
              required
              min="1"
              value={formData.rooms}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Boligtype</label>
            <select
              name="type"
              required
              value={formData.type}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="apartment">Lejlighed</option>
              <option value="house">Hus</option>
              <option value="room">Værelse</option>
              <option value="townhouse">Rækkehus</option>
            </select>
          </div>
        </div>

        <div>
          <DatePicker
            selected={new Date(formData.availableFrom)}
            onSelect={(date) => setFormData(prev => ({
              ...prev,
              availableFrom: (date || new Date()).toISOString()
            }))}
            label="Ledig fra"
            minDate={new Date()}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
            isLoading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Opretter...' : 'Opret bolig'}
        </button>
      </div>
    </form>
  );
}
