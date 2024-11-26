import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env file
config({ path: resolve(__dirname, '../.env') });

import { supabase } from '../src/lib/supabase.js';

const createTestProperty = async () => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    console.error('Please log in first');
    return;
  }

  const testPropertyData = {
    title: 'Moderne 3-værelses lejlighed med havudsigt',
    description: `Velkommen til denne fantastiske 3-værelses lejlighed i hjertet af København!

Lejligheden byder på:
- Stort, lyst køkken-alrum med alle moderne hvidevarer
- 2 rummelige soveværelser med indbyggede skabe
- Lækkert badeværelse med gulvvarme og regnbruser
- Stor stue med panoramavinduer og havudsigt
- Sydvendt altan på 8m²
- Vaskemaskine og tørretumbler i lejligheden
- Elevator i ejendommen
- Cykelkælder og depotrum

Området er roligt og familievenligt med kort afstand til:
- Indkøb (Netto, Irma)
- Offentlig transport (5 min. til metro)
- Amager Strandpark (10 min. på cykel)
- Diverse skoler og institutioner

Lejligheden er nyistandsat og klar til indflytning.`,
    price: 14500,
    location: 'København',
    address: 'Ørestads Boulevard 55, 2300 København S',
    latitude: 55.6596,
    longitude: 12.5999,
    size: 89,
    bedrooms: 3,
    bathrooms: 1,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80'
    ],
    amenities: [
      'Elevator',
      'Altan',
      'Havudsigt',
      'Vaskemaskine',
      'Tørretumbler',
      'Opvaskemaskine',
      'Gulvvarme',
      'Cykelkælder',
      'Depotrum'
    ],
    landlord_id: userData.user.id,
    available: true,
    created_at: new Date().toISOString()
  };

  try {
    const { data, error } = await supabase
      .from('properties')
      .insert([testPropertyData])
      .select()
      .single();

    if (error) throw error;
    console.log('Test property created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error creating test property:', error);
    throw error;
  }
};

createTestProperty();
