-- Create enum for property types
CREATE TYPE property_type AS ENUM (
  'apartment',
  'house',
  'room',
  'townhouse',
  'studio'
);

-- Create properties table
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL CHECK (price > 0),
  location TEXT NOT NULL,
  address TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  property_type property_type NOT NULL,
  size INTEGER NOT NULL CHECK (size > 0),
  bedrooms INTEGER NOT NULL CHECK (bedrooms >= 0),
  bathrooms INTEGER NOT NULL CHECK (bathrooms >= 0),
  deposit INTEGER CHECK (deposit >= 0),
  available_from DATE,
  pets_allowed BOOLEAN DEFAULT false,
  furnished BOOLEAN DEFAULT false,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  amenities TEXT[] DEFAULT ARRAY[]::TEXT[],
  landlord_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for location-based searches
CREATE INDEX IF NOT EXISTS properties_location_idx ON public.properties USING GIN (to_tsvector('danish', location));

-- Create index for price range searches
CREATE INDEX IF NOT EXISTS properties_price_idx ON public.properties (price);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_properties_updated_at
    BEFORE UPDATE ON public.properties
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Set up Row Level Security (RLS)
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing properties (anyone can view)
CREATE POLICY "Anyone can view properties"
  ON public.properties
  FOR SELECT
  USING (true);

-- Create policy for creating properties (only authenticated users)
CREATE POLICY "Authenticated users can create properties"
  ON public.properties
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Create policy for updating properties (only owner can update)
CREATE POLICY "Users can update their own properties"
  ON public.properties
  FOR UPDATE
  USING (auth.uid() = landlord_id)
  WITH CHECK (auth.uid() = landlord_id);

-- Create policy for deleting properties (only owner can delete)
CREATE POLICY "Users can delete their own properties"
  ON public.properties
  FOR DELETE
  USING (auth.uid() = landlord_id);
