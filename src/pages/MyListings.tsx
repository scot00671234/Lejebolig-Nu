import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePropertyStore } from '../store/propertyStore';
import { useAuthStore } from '../store/authStore';
import { Property } from '../types';
import { Pencil, Trash2, AlertCircle } from 'lucide-react';

export default function MyListings() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { properties, loading, error, fetchProperties, deleteProperty } = usePropertyStore();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Hent kun brugerens egne opslag
  const myProperties = properties.filter(prop => prop.landlordId === user?.id);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleEdit = (propertyId: string) => {
    navigate(`/edit-listing/${propertyId}`);
  };

  const handleDelete = async (propertyId: string) => {
    if (window.confirm('Er du sikker på, at du vil slette dette boligopslag?')) {
      try {
        await deleteProperty(propertyId);
      } catch (error: any) {
        setDeleteError(error.message);
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mine boligopslag</h1>
        <button
          onClick={() => navigate('/create-listing')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Opret nyt opslag
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {deleteError && (
        <div className="mb-4 p-4 bg-red-50 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-sm text-red-700">{deleteError}</p>
          </div>
        </div>
      )}

      {myProperties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Du har ingen boligopslag endnu.</p>
          <button
            onClick={() => navigate('/create-listing')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Opret dit første opslag
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {myProperties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={property.images[0] || '/placeholder-property.jpg'}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {property.title}
                </h2>
                <p className="text-gray-500 mb-2">{property.location}</p>
                <p className="text-lg font-medium text-gray-900 mb-4">
                  {property.price.toLocaleString()} kr./md
                </p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleEdit(property.id)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Rediger
                  </button>
                  <button
                    onClick={() => handleDelete(property.id)}
                    className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Slet
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
