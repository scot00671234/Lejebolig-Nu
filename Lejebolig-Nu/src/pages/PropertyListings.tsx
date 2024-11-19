import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { usePropertyStore } from '../store/propertyStore';
import { useAuthStore } from '../store/authStore';
import PropertyCard from '../components/PropertyCard';
import CreateListingModal from '../components/CreateListingModal';
import SearchBar from '../components/SearchBar';
import SortingOptions from '../components/SortingOptions';

export default function PropertyListings() {
  const { properties, fetchProperties, loading } = usePropertyStore();
  const { profile } = useAuthStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    minRooms: '',
    maxRooms: '',
    minSize: '',
    maxSize: '',
  });

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const filteredProperties = properties.filter((property) => {
    if (filters.location && property.location !== filters.location) return false;
    if (filters.minPrice && property.price < Number(filters.minPrice)) return false;
    if (filters.maxPrice && property.price > Number(filters.maxPrice)) return false;
    if (filters.minRooms && property.bedrooms < Number(filters.minRooms)) return false;
    if (filters.maxRooms && property.bedrooms > Number(filters.maxRooms)) return false;
    if (filters.minSize && property.size < Number(filters.minSize)) return false;
    if (filters.maxSize && property.size > Number(filters.maxSize)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Boliger til leje</h1>
          {profile?.type === 'landlord' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              <span>Opret ny bolig</span>
            </button>
          )}
        </div>

        <div className="space-y-6">
          <SearchBar onFilterChange={setFilters} />
          <SortingOptions />

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Indlæser boliger...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
              {filteredProperties.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-600">Ingen boliger fundet med de valgte kriterier.</p>
                </div>
              )}
            </div>
          )}
        </div>

        <CreateListingModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      </div>
    </div>
  );
}
