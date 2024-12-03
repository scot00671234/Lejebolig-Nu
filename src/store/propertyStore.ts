import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Property } from '../types';

interface PropertyState {
  properties: Property[];
  loading: boolean;
  error: string | null;
  fetchProperties: () => Promise<void>;
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
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
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
        images: property.images || [],
        landlordId: property.landlord_id,
        createdAt: property.created_at,
        available: property.available
      }));

      set({ properties, error: null });
    } catch (error: any) {
      console.error('Error fetching properties:', error);
      set({ error: error.message });
    } finally {
      set({ loading: false });
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
      
      // Get current user's ID
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('Du skal være logget ind for at oprette et boligopslag');
      
      const uploadedImageUrls: string[] = [];
      if (imageFiles && imageFiles.length > 0) {
        console.log('Uploading images:', imageFiles);
        for (const file of imageFiles) {
          const imageUrl = await get().uploadImage(file);
          console.log('Uploaded image URL:', imageUrl);
          uploadedImageUrls.push(imageUrl);
        }
      }
      console.log('Final uploaded image URLs:', uploadedImageUrls);

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
          images: uploadedImageUrls,
          landlord_id: user.id,
          available: true
        }])
        .select()
        .single();

      if (error) throw error;

      console.log('Saved property with images:', data.images);

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
        images: data.images || [],
        landlordId: data.landlord_id,
        createdAt: data.created_at,
        available: data.available
      };

      set(state => ({ 
        properties: [newProperty, ...state.properties],
        error: null
      }));

      return newProperty;
    } catch (error: any) {
      console.error('Error creating property:', error);
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

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `property-images/${fileName}`;

      console.log('Uploading file:', {
        fileName,
        filePath,
        fileSize: file.size,
        fileType: file.type
      });

      const { error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('property-images')
        .getPublicUrl(filePath);

      console.log('Generated public URL:', data.publicUrl);

      return data.publicUrl;
    } catch (error: any) {
      console.error('Detailed upload error:', error);
      throw error;
    }
  }
}));