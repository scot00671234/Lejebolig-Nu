export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          type: 'landlord' | 'tenant'
          created_at: string
        }
        Insert: {
          id: string
          name: string
          type: 'landlord' | 'tenant'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'landlord' | 'tenant'
          created_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          title: string
          description: string
          price: number
          location: string
          address?: string
          latitude?: number
          longitude?: number
          bedrooms: number
          bathrooms: number
          size: number
          images: string[]
          amenities: string[]
          landlord_id: string
          available: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          price: number
          location: string
          address?: string
          latitude?: number
          longitude?: number
          bedrooms: number
          bathrooms: number
          size: number
          images: string[]
          amenities: string[]
          landlord_id: string
          available?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          price?: number
          location?: string
          address?: string
          latitude?: number
          longitude?: number
          bedrooms?: number
          bathrooms?: number
          size?: number
          images?: string[]
          amenities?: string[]
          landlord_id?: string
          available?: boolean
          created_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          property_id: string
          landlord_id: string
          tenant_id: string
          last_message_at: string
        }
        Insert: {
          id?: string
          property_id: string
          landlord_id: string
          tenant_id: string
          last_message_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          landlord_id?: string
          tenant_id?: string
          last_message_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          content: string
          created_at: string
          read: boolean
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          content: string
          created_at?: string
          read?: boolean
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          content?: string
          created_at?: string
          read?: boolean
        }
      }
    }
  }
}