import React, { useState, useEffect } from 'react';
import { Home as HomeIcon } from 'lucide-react';
import PropertyCard from './components/PropertyCard';
import SearchBar from './components/SearchBar';
import CreateListingModal from './components/CreateListingModal';
import AuthModal from './components/auth/AuthModal';
import MessageModal from './components/messaging/MessageModal';
import ConversationsList from './components/messaging/ConversationsList';
import UserMenu from './components/UserMenu';
import PropertyDetails from './components/PropertyDetails';
import SortingOptions from './components/SortingOptions';
import { SearchFilters, Property } from './types';
import { useAuthStore } from './store/authStore';
import { usePropertyStore } from './store/propertyStore';
import { useMessageStore } from './store/messageStore';

function App() {
  const { user, profile } = useAuthStore();
  const { properties, loading: propertiesLoading, fetchProperties } = usePropertyStore();
  const { conversations, fetchConversations, sendMessage } = useMessageStore();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showMessages, setShowMessages] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<any | null>(null);
  const [sortOrder, setSortOrder] = useState<'price_asc' | 'price_desc' | 'date_asc' | 'date_desc' | null>(null);
  
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    location: '',
    minPrice: undefined,
    maxPrice: undefined,
    bedrooms: undefined,
    minSize: undefined,
  });

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user, fetchConversations]);

  const handleContactLandlord = (property: Property) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    
    setSelectedProperty(property);
    setIsMessageModalOpen(true);
  };

  const handleSendMessage = async (content: string) => {
    if (!user || !selectedProperty) return;

    try {
      await sendMessage(content, selectedProperty.id, selectedProperty.landlordId);
      setIsMessageModalOpen(false);
      setSelectedProperty(null);
      setSelectedConversation(null);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const filterProperties = (property: Property) => {
    const searchQuery = filters.query.toLowerCase();
    const matchesSearch = 
      property.title.toLowerCase().includes(searchQuery) ||
      property.description.toLowerCase().includes(searchQuery) ||
      property.location.toLowerCase().includes(searchQuery) ||
      property.price.toString().includes(searchQuery) ||
      property.bedrooms.toString().includes(searchQuery) ||
      property.size.toString().includes(searchQuery) ||
      property.amenities.some(amenity => amenity.toLowerCase().includes(searchQuery));

    if (!matchesSearch) return false;
    if (filters.location && property.location !== filters.location) return false;
    if (filters.maxPrice && property.price > filters.maxPrice) return false;
    if (filters.bedrooms && property.bedrooms < filters.bedrooms) return false;
    if (filters.minSize && property.size < filters.minSize) return false;

    return true;
  };

  const sortProperties = (a: Property, b: Property) => {
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
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  };

  const filteredAndSortedProperties = properties
    .filter(filterProperties)
    .sort(sortProperties);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setShowMessages(false);
                setSelectedProperty(null);
              }}
              className="flex items-center gap-2 hover:text-indigo-600 transition-colors"
            >
              <HomeIcon className="text-indigo-600" size={24} />
              <h1 className="text-xl font-bold text-gray-900">Lejebolig Nu</h1>
            </button>
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  {profile?.type === 'landlord' && (
                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Opret Annonce
                    </button>
                  )}
                  <UserMenu
                    onViewMessages={() => setShowMessages(true)}
                    onViewListings={profile?.type === 'landlord' ? () => {} : undefined}
                  />
                </>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Log ind
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showMessages ? (
          <ConversationsList
            conversations={conversations}
            properties={properties}
            users={[]}
            currentUser={user!}
            onSelectConversation={(conversation) => {
              setSelectedConversation(conversation);
              setSelectedProperty(properties.find(p => p.id === conversation.propertyId)!);
              setIsMessageModalOpen(true);
            }}
          />
        ) : (
          <div className="space-y-6">
            <SearchBar 
              filters={filters} 
              onFilterChange={setFilters}
            />

            <SortingOptions
              sortOrder={sortOrder}
              onSortChange={setSortOrder}
            />

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                {filteredAndSortedProperties.length} Ledige Boliger
              </h2>
              {propertiesLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAndSortedProperties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      onClick={() => setSelectedProperty(property)}
                      onContact={() => handleContactLandlord(property)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {isCreateModalOpen && (
        <CreateListingModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}

      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}

      {isMessageModalOpen && selectedProperty && user && (
        <MessageModal
          isOpen={isMessageModalOpen}
          onClose={() => {
            setIsMessageModalOpen(false);
            setSelectedProperty(null);
            setSelectedConversation(null);
          }}
          property={selectedProperty}
          currentUser={user}
          messages={selectedConversation?.messages || []}
          onSendMessage={handleSendMessage}
        />
      )}

      {selectedProperty && (
        <PropertyDetails
          property={selectedProperty}
          isOpen={!!selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onContact={() => handleContactLandlord(selectedProperty)}
        />
      )}
    </div>
  );
}

export default App;