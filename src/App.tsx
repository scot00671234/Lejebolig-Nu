import React, { useState } from 'react';
import { Home as HomeIcon } from 'lucide-react';
import PropertyCard from './components/PropertyCard';
import SearchBar from './components/SearchBar';
import CreateListingModal from './components/CreateListingModal';
import AuthModal from './components/auth/AuthModal';
import MessageModal from './components/messaging/MessageModal';
import ConversationsList from './components/messaging/ConversationsList';
import UserMenu from './components/UserMenu';
import PropertyDetails from './components/PropertyDetails';
import { Property, SearchFilters, User, Conversation, Message } from './types';

// Mock data for demonstration
const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Moderne Lejlighed i Københavns Centrum',
    description: 'Smuk lejlighed med udsigt over byen',
    price: 12000,
    location: 'København',
    bedrooms: 2,
    bathrooms: 1,
    size: 85,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: ['Parkering', 'Elevator', 'Altan'],
    landlordId: 'l1',
    available: true,
    createdAt: new Date().toISOString(),
  },
  // ... other properties
];

function App() {
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showMessages, setShowMessages] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [sortOrder, setSortOrder] = useState<'price_asc' | 'price_desc' | null>(null);
  
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    location: '',
    minPrice: undefined,
    maxPrice: undefined,
    bedrooms: undefined,
    minSize: undefined,
  });

  const handleAuth = (credentials: { email: string; password: string; name?: string; type: 'landlord' | 'tenant' }) => {
    const user: User = {
      id: Math.random().toString(),
      email: credentials.email,
      name: credentials.name || credentials.email.split('@')[0],
      type: credentials.type,
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(user);
    setIsAuthModalOpen(false);
  };

  const handleCreateListing = (newProperty: Omit<Property, 'id' | 'landlordId' | 'createdAt'>) => {
    if (!currentUser || currentUser.type !== 'landlord') return;
    
    const property: Property = {
      ...newProperty,
      id: (properties.length + 1).toString(),
      landlordId: currentUser.id,
      createdAt: new Date().toISOString(),
    };
    setProperties([property, ...properties]);
  };

  const handleContactLandlord = (property: Property) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    
    setSelectedProperty(property);
    setIsMessageModalOpen(true);
  };

  const handleSendMessage = (content: string) => {
    if (!currentUser || !selectedProperty) return;

    const newMessage: Message = {
      id: Math.random().toString(),
      senderId: currentUser.id,
      receiverId: selectedProperty.landlordId,
      propertyId: selectedProperty.id,
      content,
      createdAt: new Date().toISOString(),
      read: false,
    };

    let conversation = conversations.find(
      (c) => c.propertyId === selectedProperty.id &&
      ((c.landlordId === currentUser.id && c.tenantId === selectedProperty.landlordId) ||
       (c.landlordId === selectedProperty.landlordId && c.tenantId === currentUser.id))
    );

    if (!conversation) {
      conversation = {
        id: Math.random().toString(),
        propertyId: selectedProperty.id,
        landlordId: selectedProperty.landlordId,
        tenantId: currentUser.id,
        lastMessageAt: newMessage.createdAt,
        messages: [],
      };
      setConversations([...conversations, conversation]);
    }

    const updatedConversations = conversations.map((c) =>
      c.id === conversation!.id
        ? { ...c, messages: [...c.messages, newMessage], lastMessageAt: newMessage.createdAt }
        : c
    );

    setConversations(updatedConversations);
  };

  const filteredAndSortedProperties = properties
    .filter((property) => {
      if (filters.query && !property.title.toLowerCase().includes(filters.query.toLowerCase())) {
        return false;
      }
      if (filters.location && property.location !== filters.location) {
        return false;
      }
      if (filters.maxPrice && property.price > filters.maxPrice) {
        return false;
      }
      if (filters.bedrooms && property.bedrooms < filters.bedrooms) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === 'price_asc') {
        return a.price - b.price;
      } else if (sortOrder === 'price_desc') {
        return b.price - a.price;
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HomeIcon className="text-indigo-600" size={24} />
              <h1 className="text-xl font-bold text-gray-900">Lejebolig Nu</h1>
            </div>
            <div className="flex items-center gap-4">
              {currentUser ? (
                <>
                  {currentUser.type === 'landlord' && (
                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Opret Annonce
                    </button>
                  )}
                  <UserMenu
                    user={currentUser}
                    onLogout={() => setCurrentUser(null)}
                    onViewMessages={() => setShowMessages(true)}
                    onViewListings={currentUser.type === 'landlord' ? () => {} : undefined}
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
            users={[]} // In a real app, this would be populated
            currentUser={currentUser!}
            onSelectConversation={(conversation) => {
              setSelectedConversation(conversation);
              setSelectedProperty(properties.find(p => p.id === conversation.propertyId)!);
              setIsMessageModalOpen(true);
            }}
          />
        ) : (
          <div className="space-y-8">
            <SearchBar 
              filters={filters} 
              onFilterChange={setFilters}
              onSortChange={setSortOrder}
            />

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                {filteredAndSortedProperties.length} Ledige Boliger
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onClick={() => setSelectedProperty(property)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {isCreateModalOpen && (
        <CreateListingModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateListing}
        />
      )}

      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onAuth={handleAuth}
        />
      )}

      {isMessageModalOpen && selectedProperty && currentUser && (
        <MessageModal
          isOpen={isMessageModalOpen}
          onClose={() => {
            setIsMessageModalOpen(false);
            setSelectedProperty(null);
            setSelectedConversation(null);
          }}
          property={selectedProperty}
          currentUser={currentUser}
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