
-- Add missing columns to games table
ALTER TABLE public.games
ADD COLUMN category text,
ADD COLUMN result text,
ADD COLUMN round_number integer;

COMMENT ON COLUMN public.games.category IS 'Type of game (e.g. Music, Quiz, Action)';
COMMENT ON COLUMN public.games.result IS 'Outcome of the game (Success/Fail)';
