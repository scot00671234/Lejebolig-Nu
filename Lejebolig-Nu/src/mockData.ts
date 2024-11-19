import { Property } from './types';

export const mockProperty: Property = {
  id: '1',
  title: 'Moderne 3-værelses lejlighed med altan',
  description: `Lys og rummelig 3-værelses lejlighed beliggende i hjertet af København. 
  Lejligheden er nyligt renoveret med moderne køkken og badeværelse. 
  Fra den vestvendte altan er der en fantastisk udsigt over byen.
  
  Lejligheden indeholder:
  - Stort, lyst køkken/alrum
  - Rummelig stue med udgang til altan
  - To gode værelser
  - Lækkert badeværelse med gulvvarme
  - Entré med god skabsplads
  - Vaskemaskine og tørretumbler i lejligheden
  
  Området byder på:
  - 5 min. gang til metro
  - Supermarkeder lige om hjørnet
  - Hyggelige cafeer og restauranter
  - Grønne områder i nærheden`,
  price: 14500,
  location: 'København K',
  address: 'Gothersgade 123, 3. th',
  latitude: 55.6828,
  longitude: 12.5825,
  bedrooms: 3,
  bathrooms: 1,
  size: 85,
  images: [
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800',
    'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=800',
    'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=800'
  ],
  amenities: [
    'Altan',
    'Elevator',
    'Vaskemaskine',
    'Tørretumbler',
    'Opvaskemaskine',
    'Internet',
    'Kabel TV',
    'Cykelkælder',
    'Dørtelefon'
  ],
  landlordId: 'landlord-123',
  available: true,
  createdAt: new Date().toISOString()
};

export const mockUser = {
  id: 'tenant-456',
  email: 'test@example.com',
  name: 'Test Bruger',
  type: 'tenant',
  createdAt: new Date().toISOString()
} as const;
