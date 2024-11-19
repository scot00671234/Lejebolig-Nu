import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Property } from '../types';

interface PropertyState {
  properties: Property[];
  loading: boolean;
  error: string | null;
  uploadProgress: number;
  fetchProperties: () => Promise<void>;
  createProperty: (property: Omit<Property, 'id' | 'landlordId' | 'createdAt'>, images: File[]) => Promise<void>;
  updateProperty: (id: string, updates: Partial<Property>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
}

export const usePropertyStore = create<PropertyState>((set, get) => ({
  properties: [],
  loading: false,
  error: null,
  uploadProgress: 0,

  fetchProperties: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ properties: data || [], error: null });
    } catch (error: any) {
      set({ error: error.message });
      console.error('Error fetching properties:', error);
    } finally {
      set({ loading: false });
    }
  },

  createProperty: async (property, images) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('User not authenticated');

    set({ loading: true, uploadProgress: 0 });
    try {
      // 1. Upload images to Supabase Storage
      const imageUrls: string[] = [];
      let uploadedCount = 0;

      for (const image of images) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${userData.user.id}/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('property-images')
          .upload(filePath, image, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(filePath);

        imageUrls.push(publicUrl);
        uploadedCount++;
        set({ uploadProgress: (uploadedCount / images.length) * 100 });
      }

      // 2. Create property record with image URLs
      const { data, error } = await supabase
        .from('properties')
        .insert([
          {
            ...property,
            images: imageUrls,
            landlord_id: userData.user.id,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      
      const { properties } = get();
      set({ 
        properties: [data, ...properties],
        error: null,
        uploadProgress: 0
      });

      return data;
    } catch (error: any) {
      set({ error: error.message });
      console.error('Error creating property:', error);
    } finally {
      set({ loading: false });
    }
  },

  updateProperty: async (id, updates) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('properties')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const { properties } = get();
      set({
        properties: properties.map(p => p.id === id ? data : p),
        error: null
      });
    } catch (error: any) {
      set({ error: error.message });
      console.error('Error updating property:', error);
    } finally {
      set({ loading: false });
    }
  },

  deleteProperty: async (id) => {
    set({ loading: true });
    try {
      // First, get the property to get image URLs
      const { data: property } = await supabase
        .from('properties')
        .select('images')
        .eq('id', id)
        .single();

      if (property?.images) {
        // Delete images from storage
        for (const imageUrl of property.images) {
          const path = imageUrl.split('/').pop();
          if (path) {
            await supabase.storage
              .from('property-images')
              .remove([path]);
          }
        }
      }

      // Then delete the property record
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;

      const { properties } = get();
      set({
        properties: properties.filter(p => p.id !== id),
        error: null
      });
    } catch (error: any) {
      set({ error: error.message });
      console.error('Error deleting property:', error);
    } finally {
      set({ loading: false });
    }
  },
}));