import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Property } from '../types';

interface PropertyState {
  properties: Property[];
  loading: boolean;
  error: string | null;
  fetchProperties: () => Promise<Property[]>;
  getProperty: (id: string) => Promise<Property | null>;
  createProperty: (property: Omit<Property, 'id' | 'landlordId' | 'createdAt'>, imageFiles?: File[]) => Promise<Property>;
  updateProperty: (id: string, updates: Partial<Property>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  uploadImage: (file: File) => Promise<string>;
}

export const usePropertyStore = create<PropertyState>((set, get) => ({
  properties: [],
  loading: false,
  error: null,

  fetchProperties: async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Detailed properties fetch error:', error);
        throw error;
      }

      console.log('Fetched properties raw data:', data);

      const properties = data.map(property => ({
        id: property.id,
        title: property.title,
        description: property.description,
        price: property.price,
        location: property.location,
        propertyType: property.property_type,
        size: property.size,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        deposit: property.deposit,
        availableFrom: property.available_from,
        petsAllowed: property.pets_allowed,
        furnished: property.furnished,
        images: property.images || [], // Sikrer altid et array
        firstImage: property.images && property.images.length > 0 
          ? property.images[0] 
          : 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1000&q=80',
        landlordId: property.landlord_id,
        createdAt: property.created_at,
        available: property.available
      }));

      console.log('Processed properties:', properties);

      set({ properties, error: null });
      return properties;
    } catch (error: any) {
      console.error('Error fetching properties:', error);
      set({ error: error.message });
      return [];
    }
  },

  getProperty: async (id) => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        title: data.title,
        description: data.description,
        price: data.price,
        location: data.location,
        propertyType: data.property_type,
        size: data.size,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        deposit: data.deposit,
        availableFrom: data.available_from,
        petsAllowed: data.pets_allowed,
        furnished: data.furnished,
        images: data.images || [],
        landlordId: data.landlord_id,
        createdAt: data.created_at,
        available: data.available
      };
    } catch (error: any) {
      console.error('Error fetching property:', error);
      set({ error: error.message });
      return null;
    }
  },

  createProperty: async (property, imageFiles?: File[]) => {
    try {
      set({ loading: true });
      
      // Log alt input data
      console.log('Creating property with data:', {
        property,
        imageFiles: imageFiles?.map(f => ({
          name: f.name,
          size: f.size,
          type: f.type
        }))
      });
      
      // Get current user's ID
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('Du skal være logget ind for at oprette et boligopslag');
      
      const uploadedImageUrls: string[] = [];
      if (imageFiles && imageFiles.length > 0) {
        console.log('Uploading images:', imageFiles);
        for (const file of imageFiles) {
          try {
            const imageUrl = await get().uploadImage(file);
            console.log('Uploaded image URL:', imageUrl);
            uploadedImageUrls.push(imageUrl);
          } catch (uploadError) {
            console.error('Failed to upload individual image:', uploadError);
          }
        }
      }
      console.log('Final uploaded image URLs:', uploadedImageUrls);

      // Tilføj fallback billede hvis ingen billeder er uploadet
      const finalImageUrls = uploadedImageUrls.length > 0 
        ? uploadedImageUrls 
        : ['https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1000&q=80'];

      const { data, error } = await supabase
        .from('properties')
        .insert([{
          title: property.title,
          description: property.description,
          price: property.price,
          location: property.location,
          property_type: property.propertyType,
          size: property.size,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          deposit: property.deposit,
          available_from: property.availableFrom,
          pets_allowed: property.petsAllowed,
          furnished: property.furnished,
          images: finalImageUrls,  // Sikrer at billeder bliver gemt
          landlord_id: user.id,
          available: true
        }])
        .select()
        .single();

      // Log database insert resultat
      console.log('Database insert result:', { data, error });
      if (error) {
        console.error('Detailed database insert error:', error);
        throw error;
      }

      const newProperty = {
        id: data.id,
        title: data.title,
        description: data.description,
        price: data.price,
        location: data.location,
        propertyType: data.property_type,
        size: data.size,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        deposit: data.deposit,
        availableFrom: data.available_from,
        petsAllowed: data.pets_allowed,
        furnished: data.furnished,
        images: data.images || finalImageUrls,  // Sikrer billeder
        firstImage: data.images && data.images.length > 0 
          ? data.images[0] 
          : 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1000&q=80',
        landlordId: data.landlord_id,
        createdAt: data.created_at,
        available: data.available
      };

      // Log den nye ejendom
      console.log('New property created:', newProperty);

      set(state => ({ 
        properties: [newProperty, ...state.properties],
        error: null
      }));

      return newProperty;
    } catch (error: any) {
      console.error('Comprehensive error creating property:', {
        message: error.message,
        fullError: error
      });
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateProperty: async (id, updates) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({
          title: updates.title,
          description: updates.description,
          price: updates.price,
          location: updates.location,
          property_type: updates.propertyType,
          size: updates.size,
          bedrooms: updates.bedrooms,
          bathrooms: updates.bathrooms,
          deposit: updates.deposit,
          available_from: updates.availableFrom,
          pets_allowed: updates.petsAllowed,
          furnished: updates.furnished,
          images: updates.images,
          available: updates.available
        })
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        properties: state.properties.map(p =>
          p.id === id ? { ...p, ...updates } : p
        ),
        error: null
      }));
    } catch (error: any) {
      console.error('Error updating property:', error);
      set({ error: error.message });
      throw error;
    }
  },

  deleteProperty: async (id) => {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        properties: state.properties.filter(p => p.id !== id),
        error: null
      }));
    } catch (error: any) {
      console.error('Error deleting property:', error);
      set({ error: error.message });
      throw error;
    }
  },

  uploadImage: async (file: File) => {
    try {
      // Validerings-checks
      if (!file) {
        console.error('No file provided');
        throw new Error('No file provided');
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        console.error('Invalid file type', file.type);
        throw new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB maks
        console.error('File too large', file.size);
        throw new Error('File is too large. Maximum size is 5MB.');
      }

      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `property-images/${fileName}`;

      console.log('Uploading file:', {
        fileName,
        filePath,
        fileSize: file.size,
        fileType: file.type
      });

      // Direkte upload via Supabase Storage
      const { data, error } = await supabase.storage
        .from('property-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Supabase storage upload error:', error);
        throw error;
      }

      // Hent public URL
      const { data: urlData } = supabase.storage
        .from('property-images')
        .getPublicUrl(filePath);

      console.log('Generated public URL:', urlData.publicUrl);

      return urlData.publicUrl;
    } catch (error: any) {
      console.error('Comprehensive image upload error:', {
        message: error.message,
        fullError: error
      });
      throw error;
    }
  },
}));