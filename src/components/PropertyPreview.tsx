import React from 'react';
import { PropertyFormData } from '../utils/validation';

interface PropertyPreviewProps {
  data: PropertyFormData;
  images: string[];
  onEdit: () => void;
  onSubmit: () => void;
  loading?: boolean;
  uploadProgress?: number;
}

export default function PropertyPreview({
  data,
  images,
  onEdit,
  onSubmit,
  loading = false,
  uploadProgress = 0,
}: PropertyPreviewProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {loading && uploadProgress > 0 && (
        <div className="p-4 bg-blue-50">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Uploader billeder... {Math.round(uploadProgress)}%
          </p>
        </div>
      )}

      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">{data.title}</h2>
          
          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Pris pr. måned</h3>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {Number(data.price).toLocaleString('da-DK')} kr.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Depositum</h3>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {Number(data.deposit).toLocaleString('da-DK')} kr.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Størrelse</h3>
              <p className="mt-1 text-lg font-semibold text-gray-900">{data.size} m²</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Værelser</h3>
              <p className="mt-1 text-lg font-semibold text-gray-900">{data.bedrooms}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Badeværelser</h3>
              <p className="mt-1 text-lg font-semibold text-gray-900">{data.bathrooms}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Ledig fra</h3>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {new Date(data.availableFrom).toLocaleDateString('da-DK')}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Adresse</h3>
            <p className="mt-1 text-lg font-semibold text-gray-900">{data.location}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Beskrivelse</h3>
            <p className="mt-1 text-gray-700 whitespace-pre-wrap">{data.description}</p>
          </div>

          <div className="flex gap-4">
            {data.petsAllowed && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Husdyr tilladt
              </span>
            )}
            {data.furnished && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                Møbleret
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <button
            type="button"
            onClick={onEdit}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Rediger
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Opretter...' : 'Opret boligannonce'}
          </button>
        </div>
      </div>
    </div>
  );
}
