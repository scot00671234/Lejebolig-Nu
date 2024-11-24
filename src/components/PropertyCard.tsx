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
      className="card animate-fade-in group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-52 overflow-hidden rounded-t-xl">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3">
          {property.available ? (
            <span className="bg-green-500/90 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-sm">
              Ledig
            </span>
          ) : (
            <span className="bg-red-500/90 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-sm">
              Udlejet
            </span>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
          <MapPin size={16} className="text-primary" />
          <span className="font-medium">{property.location}</span>
        </div>
        
        <h3 className="text-xl font-semibold mb-3 text-gray-800 group-hover:text-primary transition-colors">
          {property.title}
        </h3>
        
        <div className="flex items-center gap-6 mb-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Bed size={18} className="text-secondary" />
            <span>{property.bedrooms} vær</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Bath size={18} className="text-secondary" />
            <span>{property.bathrooms} bad</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Square size={18} className="text-secondary" />
            <span>{property.size}m²</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <Crown className="text-amber-500" size={22} />
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-gray-900">
                {property.price.toLocaleString('da-DK')} kr
              </span>
              <span className="text-gray-500 text-sm">/md</span>
            </div>
          </div>
          {user && user.id !== property.landlordId && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onContact();
              }}
              className="btn-primary"
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