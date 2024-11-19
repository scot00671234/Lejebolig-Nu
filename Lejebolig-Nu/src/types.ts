export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  bedrooms: number;
  bathrooms: number;
  size: number;
  images: string[];
  amenities: string[];
  landlordId: string;
  available: boolean;
  createdAt: string;
}

export interface SearchFilters {
  query: string;
  location: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  minSize?: number;
}

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