import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePropertyStore } from '../store/propertyStore';
import { Property, PropertyType } from '../types';
import { Upload, AlertCircle } from 'lucide-react';
import { validatePropertyForm, ValidationError, PropertyFormData } from '../utils/validation';
import PropertyPreview from '../components/PropertyPreview';

export default function CreateListing() {
  const navigate = useNavigate();
  const { createProperty, loading, error, uploadProgress } = usePropertyStore();
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    description: '',
    price: '',
    location: '',
    propertyType: PropertyType.APARTMENT,
    size: '',
    bedrooms: '',
    bathrooms: '',
    deposit: '',
    availableFrom: '',
    petsAllowed: false,
    furnished: false,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate file size and type
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      alert('Nogle billeder blev ikke tilføjet. Billeder skal være JPG eller PNG og under 10MB.');
    }

    setImages(prev => [...prev, ...validFiles]);

    // Create preview URLs
    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const errors = validatePropertyForm(formData);
    setValidationErrors(errors);

    if (errors.length > 0) {
      // Scroll to first error
      const firstErrorField = document.getElementById(errors[0].field);
      firstErrorField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }

    if (images.length === 0) {
      setValidationErrors([{ field: 'images', message: 'Tilføj mindst ét billede' }]);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const propertyData = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        location: formData.location,
        propertyType: formData.propertyType,
        size: Number(formData.size),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        deposit: Number(formData.deposit),
        availableFrom: formData.availableFrom,
        petsAllowed: formData.petsAllowed,
        furnished: formData.furnished,
        images: [] // Will be handled by createProperty
      };

      await createProperty(propertyData, images);
      navigate('/my-listings');
    } catch (err: any) {
      console.error('Error creating property:', err);
      setValidationErrors(prev => [...prev, { field: 'submit', message: err.message }]);
    }
  };

  const getFieldError = (fieldName: string): string | undefined => {
    return validationErrors.find(error => error.field === fieldName)?.message;
  };

  const renderField = (
    fieldName: keyof PropertyFormData,
    label: string,
    type: string = 'text',
    placeholder: string = ''
  ) => {
    const error = getFieldError(fieldName);
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="mt-1">
          <input
            id={fieldName}
            type={type}
            value={formData[fieldName]}
            onChange={e => {
              setFormData(prev => ({ ...prev, [fieldName]: e.target.value }));
              setValidationErrors(prev => prev.filter(error => error.field !== fieldName));
            }}
            className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm
              ${error ? 'border-red-300' : 'border-gray-300'}`}
            placeholder={placeholder}
          />
          {error && (
            <div className="mt-1 flex items-center gap-1 text-sm text-red-600">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (showPreview) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Forhåndsvisning</h1>
        <PropertyPreview
          data={formData}
          images={previewUrls}
          onEdit={() => setShowPreview(false)}
          onSubmit={handleSubmit}
          loading={loading}
          uploadProgress={uploadProgress}
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Opret ny boligannonce</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {renderField('title', 'Titel', 'text', 'F.eks. "Moderne 3-værelses lejlighed i centrum"')}
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Boligtype</label>
            <div className="mt-1">
              <select
                id="propertyType"
                value={formData.propertyType}
                onChange={e => setFormData(prev => ({ ...prev, propertyType: e.target.value as PropertyType }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value={PropertyType.APARTMENT}>Lejlighed</option>
                <option value={PropertyType.HOUSE}>Hus</option>
                <option value={PropertyType.ROOM}>Værelse</option>
                <option value={PropertyType.TOWNHOUSE}>Rækkehus</option>
                <option value={PropertyType.STUDIO}>Studio</option>
              </select>
              {getFieldError('propertyType') && (
                <div className="mt-1 flex items-center gap-1 text-sm text-red-600">
                  <AlertCircle size={16} />
                  <span>{getFieldError('propertyType')}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Beskrivelse</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={e => {
                setFormData(prev => ({ ...prev, description: e.target.value }));
                setValidationErrors(prev => prev.filter(error => error.field !== 'description'));
              }}
              rows={4}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                ${getFieldError('description') ? 'border-red-300' : 'border-gray-300'}`}
              placeholder="Beskriv boligen, området og særlige forhold"
            />
            {getFieldError('description') && (
              <div className="mt-1 flex items-center gap-1 text-sm text-red-600">
                <AlertCircle size={16} />
                <span>{getFieldError('description')}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderField('price', 'Pris pr. måned', 'number', '5000')}
            {renderField('deposit', 'Depositum', 'number', '15000')}
            {renderField('size', 'Størrelse (m²)', 'number', '85')}
            {renderField('bedrooms', 'Antal værelser', 'number', '3')}
            {renderField('bathrooms', 'Antal badeværelser', 'number', '1')}
            {renderField('availableFrom', 'Ledig fra', 'date')}
          </div>

          {renderField('location', 'Adresse', 'text', 'Gade, nummer, postnummer og by')}

          <div className="flex gap-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.petsAllowed}
                onChange={e => setFormData(prev => ({ ...prev, petsAllowed: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Husdyr tilladt</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.furnished}
                onChange={e => setFormData(prev => ({ ...prev, furnished: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Møbleret</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Billeder</label>
            <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md
              ${getFieldError('images') ? 'border-red-300' : ''}`}>
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="images" className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                    <span>Upload billeder</span>
                    <input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG op til 10MB</p>
              </div>
            </div>
            {getFieldError('images') && (
              <div className="mt-1 flex items-center gap-1 text-sm text-red-600">
                <AlertCircle size={16} />
                <span>{getFieldError('images')}</span>
              </div>
            )}
            {previewUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="h-24 w-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                    >
                      <span className="text-white font-medium">Fjern</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm mt-2 flex items-center gap-1">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Annuller
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Forhåndsvis
          </button>
        </div>
      </form>
    </div>
  );
}
