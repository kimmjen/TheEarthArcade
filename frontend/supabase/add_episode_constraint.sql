
-- Add unique constraint for upsert functionality
ALTER TABLE public.episodes
ADD CONSTRAINT episodes_season_id_episode_number_key UNIQUE (season_id, episode_number);
