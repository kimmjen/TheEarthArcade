
-- Add episode_id to season_videos table
ALTER TABLE public.season_videos
ADD COLUMN episode_id uuid references public.episodes(id) on delete set null;

create index idx_season_videos_episode_id on public.season_videos(episode_id);
