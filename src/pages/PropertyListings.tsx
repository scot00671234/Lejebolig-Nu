import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { usePropertyStore } from '../store/propertyStore';
import { useAuthStore } from '../store/authStore';
import PropertyCard from '../components/PropertyCard';
import CreateListingModal from '../components/CreateListingModal';
import SearchBar from '../components/SearchBar';
import SortingOptions from '../components/SortingOptions';
import { SearchFilters } from '../types';
import { useMessageStore } from '../store/messageStore';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../components/auth/AuthModal';

// Define the image path
const HERO_IMAGE = new URL('../assets/3d-rendering-loft-scandinavian-living-room-with-working-table-bookshelf.jpg', import.meta.url).href;

export default function PropertyListings() {
  const navigate = useNavigate();
  const { properties, fetchProperties, loading } = usePropertyStore();
  const { profile } = useAuthStore();
  const { conversations, sendMessage } = useMessageStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    location: '',
    minPrice: undefined,
    maxPrice: undefined,
    bedrooms: undefined,
    minSize: undefined,
    propertyType: 'all'
  });
  const [sortOrder, setSortOrder] = useState<'price_asc' | 'price_desc' | 'date_asc' | 'date_desc' | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleContactClick = (property: any) => {
    setSelectedProperty(property);
    setShowMessageModal(true);
  };

  const filteredAndSortedProperties = properties.filter(property => {
    if (filters.query && !property.title.toLowerCase().includes(filters.query.toLowerCase()) &&
        !property.description.toLowerCase().includes(filters.query.toLowerCase()) &&
        !property.location.toLowerCase().includes(filters.query.toLowerCase())) {
      return false;
    }

    if (filters.location && property.location !== filters.location) {
      return false;
    }

    if (filters.minPrice && property.price < filters.minPrice) {
      return false;
    }

    if (filters.maxPrice && property.price > filters.maxPrice) {
      return false;
    }

    if (filters.bedrooms && property.bedrooms !== filters.bedrooms) {
      return false;
    }

    if (filters.minSize && property.size < filters.minSize) {
      return false;
    }

    if (filters.propertyType !== 'all' && property.propertyType !== filters.propertyType) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    switch (sortOrder) {
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'date_asc':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'date_desc':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  return (
    <main className="relative">
      <div className="relative">
        {/* Hero Section with Search */}
        <section 
          className="relative h-[500px] w-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/40">
            <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
                Find dit nye hjem
              </h1>
              <div className="w-full max-w-3xl">
                <SearchBar 
                  filters={filters} 
                  onFilterChange={setFilters}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Call to action section */}
        <section className="bg-gray-50 py-3 border-b border-gray-200">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-4">
              <p className="text-gray-700 text-lg">
                Lav et boligopslag eller søg lejebolig, nemt og gratis
              </p>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap"
              >
                Klik her
              </button>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">
                <span className="text-blue-600">{filteredAndSortedProperties.length}</span> Ledige boliger
              </h2>
              <SortingOptions sortOrder={sortOrder} onSortChange={setSortOrder} />
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Indlæser boliger...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedProperties.map((property) => (
                  <PropertyCard 
                    key={property.id} 
                    property={property}
                    onContact={() => handleContactClick(property)}
                  />
                ))}
                {filteredAndSortedProperties.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-600">Ingen boliger fundet med de valgte kriterier.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showCreateModal && (
        <CreateListingModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </main>
  );
}
