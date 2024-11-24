-- Create properties table
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    location TEXT NOT NULL,
    address TEXT,
    size DECIMAL(10, 2),
    rooms INTEGER,
    floor INTEGER,
    images TEXT[] DEFAULT '{}',
    amenities TEXT[] DEFAULT '{}',
    available BOOLEAN DEFAULT true,
    property_type TEXT NOT NULL,
    landlord_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public properties are viewable by everyone"
    ON public.properties FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own properties"
    ON public.properties FOR INSERT
    WITH CHECK (auth.uid() = landlord_id);

CREATE POLICY "Users can update their own properties"
    ON public.properties FOR UPDATE
    USING (auth.uid() = landlord_id)
    WITH CHECK (auth.uid() = landlord_id);

CREATE POLICY "Users can delete their own properties"
    ON public.properties FOR DELETE
    USING (auth.uid() = landlord_id);

-- Create storage bucket for property images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable public access to property images bucket
CREATE POLICY "Property images are publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'property-images');

-- Allow authenticated users to upload images
CREATE POLICY "Users can upload property images"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'property-images' 
        AND auth.role() = 'authenticated'
    );

-- Allow users to delete their own images
CREATE POLICY "Users can delete their own property images"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'property-images'
        AND auth.uid() = owner
    );

-- Create function to automatically set updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.properties
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
