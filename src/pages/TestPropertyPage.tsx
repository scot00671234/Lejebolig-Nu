import React, { useState } from 'react';
import { mockProperty, mockUser } from '../mockData';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MessageButton from '../components/messaging/MessageButton';

export default function TestPropertyPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === mockProperty.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? mockProperty.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Image Gallery */}
        <div className="relative h-[400px]">
          <img
            src={mockProperty.images[currentImageIndex]}
            alt={`Property image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-between p-4">
            <button
              onClick={prevImage}
              className="p-2 rounded-full bg-white/80 hover:bg-white text-gray-800 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextImage}
              className="p-2 rounded-full bg-white/80 hover:bg-white text-gray-800 transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>
          <div className="absolute bottom-4 right-4 bg-white/80 px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {mockProperty.images.length}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {mockProperty.title}
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                {mockProperty.address}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900">
                {mockProperty.price.toLocaleString('da-DK')} kr
              </p>
              <p className="text-gray-500">per måned</p>
            </div>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-3 gap-4 my-6">
            <div className="bg-gray-50 p-4 rounded-xl text-center">
              <p className="text-gray-500">Størrelse</p>
              <p className="text-lg font-semibold">{mockProperty.size} m²</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl text-center">
              <p className="text-gray-500">Værelser</p>
              <p className="text-lg font-semibold">{mockProperty.bedrooms}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl text-center">
              <p className="text-gray-500">Badeværelser</p>
              <p className="text-lg font-semibold">{mockProperty.bathrooms}</p>
            </div>
          </div>

          {/* Description */}
          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mb-4">Beskrivelse</h2>
            <p className="whitespace-pre-line text-gray-600">
              {mockProperty.description}
            </p>
          </div>

          {/* Amenities */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Faciliteter</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {mockProperty.amenities.map((amenity) => (
                <div
                  key={amenity}
                  className="bg-gray-50 px-4 py-3 rounded-lg text-gray-700"
                >
                  {amenity}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Button */}
          <div className="mt-8 flex justify-end">
            <MessageButton
              property={mockProperty}
              currentUser={mockUser}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
