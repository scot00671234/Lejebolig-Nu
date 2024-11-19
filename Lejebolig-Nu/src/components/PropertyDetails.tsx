import React from 'react';
import { X, Bed, Bath, Square, MapPin, Crown } from 'lucide-react';
import { Property } from '../types';

interface PropertyDetailsProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
  onContact: () => void;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property, isOpen, onClose, onContact }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-semibold text-gray-900">{property.title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              {property.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${property.title} - Billede ${index + 1}`}
                  className="w-full rounded-lg"
                />
              ))}
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin size={20} />
                <span className="text-lg">{property.location}</span>
              </div>

              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <Bed size={20} className="text-gray-400" />
                  <span>{property.bedrooms} værelser</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath size={20} className="text-gray-400" />
                  <span>{property.bathrooms} bad</span>
                </div>
                <div className="flex items-center gap-2">
                  <Square size={20} className="text-gray-400" />
                  <span>{property.size}m²</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Crown size={24} className="text-amber-500" />
                <span className="text-3xl font-bold text-gray-900">
                  {property.price.toLocaleString('da-DK')} kr
                </span>
                <span className="text-gray-500">/md</span>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Beskrivelse</h3>
                <p className="text-gray-600 whitespace-pre-line">{property.description}</p>
              </div>

              {property.amenities.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-2">Faciliteter</h3>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={onContact}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors text-lg font-medium"
              >
                Kontakt Udlejer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;