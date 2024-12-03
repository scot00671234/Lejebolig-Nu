export interface Property {
  id: string;
  title: string;
  description: string;
  price: {
    monthlyRent: number;
    deposit: number;
    prepaidRent: number;
    utilities: number;
    totalMoveInCost: number;
  };
  location: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  size: number;
  images: string[];
  amenities: string[];
  landlordId: string;
  available: boolean;
  availableFrom: string; // ISO date string
  createdAt: string;
  updatedAt: string;
}

export enum PropertyType {
  APARTMENT = 'apartment',
  HOUSE = 'house',
  ROOM = 'room',
  TOWNHOUSE = 'townhouse',
  STUDIO = 'studio'
}

export interface SearchFilters {
  query?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  minSize?: number;
  propertyType?: 'all' | 'apartment' | 'house' | 'room' | 'townhouse';
  availability?: 'all' | 'now' | 'future';
  availableFrom?: string;
}

export type SortOrder = 'newest' | 'oldest' | 'price_asc' | 'price_desc';

export interface User {
  id: string;
  email: string;
  name: string;
  type: 'landlord' | 'tenant';
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  propertyId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  propertyId: string;
  landlordId: string;
  tenantId: string;
  lastMessageAt: string;
  messages: Message[];
}