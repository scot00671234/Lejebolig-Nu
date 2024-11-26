import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePropertyStore } from '../store/propertyStore';
import { useAuthStore } from '../store/authStore';
import { useMessageStore } from '../store/messageStore';
import PropertyMap from '../components/PropertyMap';
import MessageModal from '../components/messaging/MessageModal';
import { Property } from '../types';
import { Building, Bath, BedDouble, Move, Calendar, MessageCircle } from 'lucide-react';
import { formatPrice } from '../utils/formatters';

export default function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const { getProperty } = usePropertyStore();
  const { user } = useAuthStore();
  const { sendMessage } = useMessageStore();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMessageModal, setShowMessageModal] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      if (id) {
        const data = await getProperty(id);
        setProperty(data);
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, getProperty]);

  const handleSendMessage = async (content: string) => {
    if (property && user) {
      try {
        await sendMessage(content, property.id, property.landlordId);
        setShowMessageModal(false);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Bolig ikke fundet</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Billeder */}
        <div className="aspect-w-16 aspect-h-9 bg-gray-200">
          {property.images && property.images.length > 0 ? (
            <img
              src={property.images[0]}
              alt={property.title}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Building size={64} className="text-gray-400" />
            </div>
          )}
        </div>

        {/* Detaljer */}
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{property.title}</h1>
          <p className="text-xl text-blue-600 font-semibold mb-6">{formatPrice(property.price)} kr. pr. måned</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <BedDouble className="text-gray-500" />
              <span>{property.bedrooms} værelser</span>
            </div>
            <div className="flex items-center gap-2">
              <Bath className="text-gray-500" />
              <span>{property.bathrooms} badeværelse</span>
            </div>
            <div className="flex items-center gap-2">
              <Move className="text-gray-500" />
              <span>{property.size} m²</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="text-gray-500" />
              <span>Ledig nu</span>
            </div>
          </div>

          <div className="prose max-w-none mb-8">
            <h2 className="text-xl font-semibold mb-2">Beskrivelse</h2>
            <p className="text-gray-600">{property.description}</p>
          </div>

          {/* Faciliteter */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2">Faciliteter</h2>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Kort */}
          {property.latitude && property.longitude && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2">Beliggenhed</h2>
              <div className="rounded-lg overflow-hidden">
                <PropertyMap
                  latitude={property.latitude}
                  longitude={property.longitude}
                  address={property.address || property.location}
                />
              </div>
            </div>
          )}

          {/* Kontakt udlejer knap */}
          <div className="mt-8">
            <button
              onClick={() => setShowMessageModal(true)}
              className="w-fit mx-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-base font-semibold"
            >
              <MessageCircle size={20} />
              <span>Kontakt udlejer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <MessageModal
          isOpen={showMessageModal}
          onClose={() => setShowMessageModal(false)}
          property={property}
          currentUser={user}
          onSendMessage={handleSendMessage}
        />
      )}
    </div>
  );
}
