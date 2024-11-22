import React from 'react';
import { Property } from '../types';
import { Bed, Bath, Square, MapPin, Crown } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

interface PropertyCardProps {
  property: Property;
  onClick: () => void;
  onContact: () => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick, onContact }) => {
  const { user } = useAuthStore();

  return (
    <div 
      className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-xl"
    >
      <div 
        onClick={onClick}
        className="cursor-pointer"
      >
        <div className="relative h-48 overflow-hidden">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3">
            {property.available ? (
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Ledig
              </span>
            ) : (
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Udlejet
              </span>
            )}
          </div>
        </div>
        
        <div className="p-5">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
            <MapPin size={16} />
            <span>{property.location}</span>
          </div>
          
          <h3 className="text-xl font-semibold mb-2 text-gray-800">{property.title}</h3>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1 text-gray-600">
              <Bed size={18} />
              <span>{property.bedrooms} vær</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <Bath size={18} />
              <span>{property.bathrooms} bad</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <Square size={18} />
              <span>{property.size}m²</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-5 pb-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <Crown className="text-amber-500" size={20} />
            <span className="text-2xl font-bold text-gray-900">
              {property.price.toLocaleString('da-DK')} kr
            </span>
            <span className="text-gray-500">/md</span>
          </div>
          {user && user.id !== property.landlordId && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onContact();
              }}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Kontakt
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;