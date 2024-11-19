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
      className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden ring-1 ring-gray-200"
    >
      <div 
        onClick={onClick}
        className="cursor-pointer"
      >
        <div className="relative h-56 overflow-hidden">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-4 right-4">
            {property.available ? (
              <span className="bg-green-500/90 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-lg">
                Ledig
              </span>
            ) : (
              <span className="bg-red-500/90 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-lg">
                Udlejet
              </span>
            )}
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full">
              <MapPin size={14} />
              <span className="font-medium">{property.location}</span>
            </div>
          </div>
          
          <h3 className="text-xl font-semibold mb-4 text-gray-900 group-hover:text-blue-600 line-clamp-2 transition-colors">
            {property.title}
          </h3>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-50 group-hover:bg-blue-50 transition-colors">
              <Bed size={20} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
              <span className="text-sm font-medium text-gray-600">{property.bedrooms} vær</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-50 group-hover:bg-blue-50 transition-colors">
              <Bath size={20} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
              <span className="text-sm font-medium text-gray-600">{property.bathrooms} bad</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-50 group-hover:bg-blue-50 transition-colors">
              <Square size={20} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
              <span className="text-sm font-medium text-gray-600">{property.size}m²</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-6 pb-6 border-t border-gray-100 pt-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-amber-50">
              <Crown className="text-amber-500" size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900">
                {property.price.toLocaleString('da-DK')} kr
              </span>
              <span className="text-sm text-gray-500">per måned</span>
            </div>
          </div>
          {user && user.id !== property.landlordId && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onContact();
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium
                         transition-all duration-300 hover:shadow-lg hover:shadow-blue-100
                         active:transform active:scale-95"
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