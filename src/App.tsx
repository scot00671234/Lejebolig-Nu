import React, { useState, useEffect } from 'react';
import { Home as HomeIcon, Plus, LogIn } from 'lucide-react';
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

// Define the image path
const HERO_IMAGE = new URL('./assets/3d-rendering-loft-scandinavian-living-room-with-working-table-bookshelf.jpg', import.meta.url).href;

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
    propertyType: 'all'
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

    if (filters.bedrooms && property.bedrooms < filters.bedrooms) {
      return false;
    }

    if (filters.minSize && property.size < filters.minSize) {
      return false;
    }

    if (filters.propertyType && filters.propertyType !== 'all' && property.propertyType !== filters.propertyType) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortOrder === 'price_asc') {
      return a.price - b.price;
    } else if (sortOrder === 'price_desc') {
      return b.price - a.price;
    } else if (sortOrder === 'date_asc') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortOrder === 'date_desc') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 relative">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="logo group">
              <HomeIcon className="logo-icon" />
              <span className="logo-text">Lejebolig Nu</span>
            </a>

            <div className="flex items-center gap-4">
              {user && (
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  <span>Lav boligopslag</span>
                </button>
              )}

              {user ? (
                <UserMenu 
                  user={user}
                  profile={profile}
                  onCreateListing={() => setIsCreateModalOpen(true)}
                  onShowMessages={() => setShowMessages(true)}
                />
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors"
                >
                  <LogIn className="h-5 w-5" />
                  <span>Log ind</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="relative">
        <div className="relative">
          {/* Hero Section with Search */}
          <section 
            className="relative h-[500px] w-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${HERO_IMAGE})` }}
          >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/50"></div>
            
            {/* Content */}
            <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-8">
                Find dit nye hjem
              </h1>
              <div className="w-full max-w-3xl bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg">
                <SearchBar 
                  filters={filters} 
                  onFilterChange={setFilters}
                />
              </div>
            </div>
          </section>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <SortingOptions
                  sortOrder={sortOrder}
                  onSortChange={setSortOrder}
                />

                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                    <span className="text-primary">{filteredAndSortedProperties.length}</span> Ledige boliger
                  </h2>
                  {propertiesLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
          </div>
        </div>
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