-- Create waste_locations table
CREATE TABLE public.waste_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'process', 'complete')),
  volume TEXT NOT NULL DEFAULT 'medium' CHECK (volume IN ('small', 'medium', 'large')),
  region TEXT NOT NULL,
  google_maps_link TEXT,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.waste_locations ENABLE ROW LEVEL SECURITY;

-- Everyone can view waste locations (public data)
CREATE POLICY "Anyone can view waste locations"
ON public.waste_locations
FOR SELECT
USING (true);

-- Only admins can insert waste locations
CREATE POLICY "Admins can insert waste locations"
ON public.waste_locations
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can update waste locations
CREATE POLICY "Admins can update waste locations"
ON public.waste_locations
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete waste locations
CREATE POLICY "Admins can delete waste locations"
ON public.waste_locations
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Create function to update last_updated timestamp
CREATE OR REPLACE FUNCTION public.update_waste_location_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_waste_locations_timestamp
BEFORE UPDATE ON public.waste_locations
FOR EACH ROW
EXECUTE FUNCTION public.update_waste_location_timestamp();

-- Enable realtime for waste_locations table
ALTER PUBLICATION supabase_realtime ADD TABLE public.waste_locations;