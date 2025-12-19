-- Add latitude and longitude columns to the locations table
ALTER TABLE public.locations
ADD COLUMN latitude double precision,
ADD COLUMN longitude double precision;

-- Add a comment to explain the columns
COMMENT ON COLUMN public.locations.latitude IS 'Latitude coordinate for map visualization';
COMMENT ON COLUMN public.locations.longitude IS 'Longitude coordinate for map visualization';
