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
      
      const uploadedImageUrls: string[] = [];
      if (imageFiles && imageFiles.length > 0) {
        for (const file of imageFiles) {
          const imageUrl = await get().uploadImage(file);
          uploadedImageUrls.push(imageUrl);
        }
      }

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
          available: true
        }])
        .select()
        .single();

      if (error) throw error;

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
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('property-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }
}));