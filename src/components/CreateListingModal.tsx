import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Plus, Trash2, MapPin, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { usePropertyStore } from '../store/propertyStore';
import { useParams, useNavigate } from 'react-router-dom';

interface CreateListingModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  isEdit?: boolean;
}

export default function CreateListingModal({ isOpen: propIsOpen, onClose, isEdit }: CreateListingModalProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { createProperty, updateProperty, getProperty, error: storeError, uploadImage } = usePropertyStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newAmenity, setNewAmenity] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    address: '',
    latitude: 0,
    longitude: 0,
    bedrooms: '',
    bathrooms: '',
    size: '',
    images: [] as string[],
    amenities: [] as string[],
    available: true,
    propertyType: 'apartment' as 'apartment' | 'room' | 'house' | 'townhouse' | 'all'
  });

  // Hvis vi er i redigeringstilstand, hent det eksisterende opslag
  useEffect(() => {
    if (isEdit && id) {
      const fetchProperty = async () => {
        const property = await getProperty(id);
        if (property) {
          setFormData({
            ...property,
            price: property.price.toString(),
            bedrooms: property.bedrooms.toString(),
            bathrooms: property.bathrooms.toString(),
            size: property.size.toString(),
          });
        }
      };
      fetchProperty();
    }
  }, [isEdit, id, getProperty]);

  const locations = ['København', 'Aarhus', 'Odense', 'Aalborg', 'Frederiksberg', 'Esbjerg'];
  
  const propertyTypes = [
    { value: 'apartment', label: 'Lejlighed' },
    { value: 'room', label: 'Værelse' },
    { value: 'house', label: 'Hus' },
    { value: 'townhouse', label: 'Rækkehus' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Titel er påkrævet';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Beskrivelse er påkrævet';
    }
    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = 'Angiv en gyldig pris';
    }
    if (!formData.location) {
      newErrors.location = 'Vælg en by';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Adresse er påkrævet';
    }
    if (!formData.bedrooms || Number(formData.bedrooms) <= 0) {
      newErrors.bedrooms = 'Angiv antal værelser';
    }
    if (!formData.size || Number(formData.size) <= 0) {
      newErrors.size = 'Angiv boligens størrelse';
    }
    if (!formData.propertyType) {
      newErrors.propertyType = 'Vælg en boligtype';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    
    try {
      const propertyData = {
        ...formData,
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        size: Number(formData.size),
      };

      // Find de faktiske billedfiler
      const imageFiles = formData.images.map(imageUrl => 
        fetch(imageUrl).then(r => r.blob()).then(blob => 
          new File([blob], `property-image-${Math.random()}.jpg`, { type: 'image/jpeg' })
        )
      );

      const uploadedImageFiles = await Promise.all(imageFiles);

      if (isEdit && id) {
        await updateProperty(id, propertyData);
        navigate('/my-listings');
      } else {
        await createProperty(propertyData, uploadedImageFiles);
        onClose?.();
      }
    } catch (error) {
      console.error('Error saving property:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, newAmenity.trim()]
      });
      setNewAmenity('');
    }
  };

  const handleRemoveAmenity = (index: number) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.filter((_, i) => i !== index)
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const imageUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        try {
          const url = await uploadImage(file);
          imageUrls.push(url);
        } catch (uploadError: any) {
          // Vis fejlmeddelelse til brugeren
          alert(uploadError.message || 'Fejl ved upload af billede');
        }
      }

      if (imageUrls.length > 0) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...imageUrls]
        }));
      }
    } catch (error: any) {
      console.error('Error uploading images:', error);
      alert(error.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Hvis vi er i redigeringstilstand, vis altid komponenten
  const isOpen = isEdit ? true : propIsOpen;
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            {isEdit ? 'Rediger boligopslag' : 'Opret ny bolig'}
          </h2>
          <button 
            onClick={() => isEdit ? navigate('/my-listings') : onClose?.()} 
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {storeError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex gap-2 text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{storeError}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Boligtype*
              </label>
              <select
                className={`input ${errors.propertyType ? 'border-red-500' : ''}`}
                value={formData.propertyType}
                onChange={(e) => setFormData({ ...formData, propertyType: e.target.value as any })}
              >
                {propertyTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.propertyType && (
                <p className="mt-1 text-sm text-red-600">{errors.propertyType}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titel*
              </label>
              <input
                type="text"
                className={`input ${errors.title ? 'border-red-500' : ''}`}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="F.eks. Moderne 3-værelses lejlighed"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                By*
              </label>
              <select
                className={`input ${errors.location ? 'border-red-500' : ''}`}
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              >
                <option value="">Vælg by</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresse*
              </label>
              <div className="relative">
                <input
                  type="text"
                  className={`input pl-10 ${errors.address ? 'border-red-500' : ''}`}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Gade, nummer, postnummer"
                />
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Månedlig leje (kr)*
              </label>
              <input
                type="number"
                className={`input ${errors.price ? 'border-red-500' : ''}`}
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="F.eks. 8000"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Størrelse (m²)*
              </label>
              <input
                type="number"
                className={`input ${errors.size ? 'border-red-500' : ''}`}
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                placeholder="F.eks. 85"
              />
              {errors.size && (
                <p className="mt-1 text-sm text-red-600">{errors.size}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Antal værelser*
              </label>
              <input
                type="number"
                className={`input ${errors.bedrooms ? 'border-red-500' : ''}`}
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                placeholder="F.eks. 3"
              />
              {errors.bedrooms && (
                <p className="mt-1 text-sm text-red-600">{errors.bedrooms}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Antal badeværelser
              </label>
              <input
                type="number"
                className="input"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                placeholder="F.eks. 1"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Beskrivelse*
              </label>
              <textarea
                className={`input min-h-[100px] ${errors.description ? 'border-red-500' : ''}`}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Beskriv boligen, dens faciliteter og beliggenhed..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Faciliteter
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  className="input flex-1"
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  placeholder="F.eks. Altan, Vaskemaskine, Elevator..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAmenity())}
                />
                <button
                  type="button"
                  onClick={handleAddAmenity}
                  className="bg-primary hover:bg-primary-hover text-white p-2 rounded-lg"
                >
                  <Plus size={24} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    <span>{amenity}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAmenity(index)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Billeder
              </label>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    <Upload className="text-gray-400" size={20} />
                    <span className="text-gray-600">Upload billeder</span>
                  </button>
                  {uploading && (
                    <div className="flex items-center gap-2 text-gray-500">
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span>Uploader...</span>
                    </div>
                  )}
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {formData.images.map((url, index) => (
                      <div key={url} className="relative group aspect-video">
                        <img
                          src={url}
                          alt={`Property image ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {formData.images.length === 0 && (
                  <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                    <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
                    <p className="text-gray-500 text-center">
                      Ingen billeder uploadet endnu.<br />
                      Upload billeder for at vise din bolig frem.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={() => isEdit ? navigate('/my-listings') : onClose?.()}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Annuller
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Opretter...
                </>
              ) : (
                isEdit ? 'Gem ændringer' : 'Opret bolig'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}