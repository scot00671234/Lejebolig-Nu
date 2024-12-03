import React from 'react';
import { Property } from '../types';
import { MapPin, Calendar, Home, Bed, Bath, Square } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const navigate = useNavigate();

  // Format date in a simple way (e.g., "1. januar 2024")
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('da-DK', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => navigate(`/property/${property.id}`)}
    >
      <div className="relative aspect-[16/9]">
        {console.log('Property images:', property.images)}
        <img
          src={property.images[0] || '/placeholder-property.jpg'}
          alt={property.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error('Image failed to load:', property.images[0]);
            e.currentTarget.src = '/placeholder-property.jpg';
          }}
        />
      </div>
      
      <div className="p-4 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{property.title}</h3>
          <div className="flex items-center gap-1 text-gray-600 mt-1">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{property.location}</span>
          </div>
        </div>

        <div className="space-y-2">
          {/* Monthly Rent */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Månedlig leje</span>
            <span className="font-medium text-gray-900">{property.price} kr.</span>
          </div>

          {/* Deposit */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Depositum</span>
            <span className="font-medium text-gray-900">{property.deposit} kr.</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-2 border-t">
          <div className="flex items-center gap-1 text-gray-600">
            <Home className="h-4 w-4" />
            <span className="text-sm">{property.size} m²</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Bed className="h-4 w-4" />
            <span className="text-sm">{property.bedrooms} vær</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Bath className="h-4 w-4" />
            <span className="text-sm">{property.bathrooms} bad</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-gray-600 pt-2 border-t">
          <Calendar className="h-4 w-4" />
          <span className="text-sm">
            Ledig fra {formatDate(property.availableFrom)}
          </span>
        </div>
      </div>
    </div>
  );
}