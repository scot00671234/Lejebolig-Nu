import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Home as HomeIcon, Plus } from 'lucide-react';
import PropertyCard from './components/PropertyCard';
import SearchBar from './components/SearchBar';
import MessageModal from './components/messaging/MessageModal';
import UserMenu from './components/UserMenu';
import PropertyDetails from './components/PropertyDetails';
import SortingOptions from './components/SortingOptions';
import CreateListing from './pages/CreateListing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SignupConfirmation from './pages/SignupConfirmation';
import Messages from './pages/Messages';
import { SearchFilters, Property } from './types';
import { useAuthStore } from './store/authStore';
import { usePropertyStore } from './store/propertyStore';
import { useMessageStore } from './store/messageStore';

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
};

function Layout() {
  const navigate = useNavigate();
  const { user, profile } = useAuthStore();
  const { properties } = usePropertyStore();
  const { sendMessage } = useMessageStore();
  
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [sortOrder, setSortOrder] = useState<'price_asc' | 'price_desc' | 'date_asc' | 'date_desc' | null>(null);
  
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    location: '',
    minPrice: undefined,
    maxPrice: undefined,
    bedrooms: undefined,
    minSize: undefined,
  });

  const handleContactLandlord = (property: Property) => {
    if (!user) return;
    setSelectedProperty(property);
    setIsMessageModalOpen(true);
  };

  const handleSendMessage = async (content: string) => {
    if (!user || !selectedProperty) return;
    await sendMessage(content, selectedProperty.id, selectedProperty.landlordId);
  };

  const filterProperties = (property: Property) => {
    const searchQuery = filters.query.toLowerCase();
    const matchesSearch = 
      property.title.toLowerCase().includes(searchQuery) ||
      property.description.toLowerCase().includes(searchQuery) ||
      property.location.toLowerCase().includes(searchQuery);

    if (!matchesSearch) return false;
    if (filters.location && !property.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <HomeIcon className="text-blue-600" size={28} />
              <h1 className="text-2xl font-bold">
                Lejebolig<span className="text-blue-600">Nu</span>
              </h1>
            </div>
            <div className="flex items-center gap-4">
              {profile?.type === 'landlord' && (
                <button
                  onClick={() => navigate('/create-listing')}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus size={20} />
                  Lav boligopslag
                </button>
              )}
              <UserMenu />
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <SearchBar 
            filters={filters} 
            onFilterChange={setFilters}
          />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {filteredAndSortedProperties.length} {filteredAndSortedProperties.length === 1 ? 'bolig' : 'boliger'} til leje
              </h2>
            </div>
            <SortingOptions value={sortOrder} onChange={setSortOrder} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onContactLandlord={handleContactLandlord}
              />
            ))}
          </div>
        </div>
      </main>

      {selectedProperty && (
        <MessageModal
          isOpen={isMessageModalOpen}
          onClose={() => setIsMessageModalOpen(false)}
          property={selectedProperty}
          currentUser={user!}
          messages={[]}
          onSendMessage={handleSendMessage}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup-confirmation" element={<SignupConfirmation />} />
        <Route
          path="/create-listing"
          element={
            <ProtectedRoute>
              <CreateListing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
        />
        <Route path="/property/:id" element={<PropertyDetails />} />
      </Routes>
    </Router>
  );
}

export default App;