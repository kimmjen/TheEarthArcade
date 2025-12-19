-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Storage Bucket Setup (Idempotent)
insert into storage.buckets (id, name, public) 
values ('earth-arcade-assets', 'earth-arcade-assets', true)
on conflict (id) do nothing;

create policy "Public Access" on storage.objects for select using ( bucket_id = 'earth-arcade-assets' );
create policy "Service Role Upload" on storage.objects for insert with check ( bucket_id = 'earth-arcade-assets' );
create policy "Service Role Update" on storage.objects for update using ( bucket_id = 'earth-arcade-assets' );

-- 1. SEASONS Table
-- Core container for each season or spin-off
create table public.seasons (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique, -- 's1', 's2', 's3', 'spin-off-torong'
  title text not null,       -- 'Earth Arcade Season 1'
  subtitle text,             -- 'Catcher of the Moon Jade'
  year integer not null,
  location text not null,    -- 'Thailand'
  description text,          -- Synopsis
  channel text,              -- 'tvN'
  
  -- Visuals
  main_poster_url text, 
  horizontal_poster_url text, 
  color_theme text,          -- '#FF00A3'
  
  -- Info
  production_cost text,      -- Optional fun fact
  air_date_start date,
  air_date_end date,
  type text default 'regular', -- 'regular', 'spin-off'
  
  -- Metadata
  genre text,                -- 'Variety', 'Adventure'
  directors text,            -- 'Na Young-seok', 'Park Hyun-yong'
  writers text,              -- 'Lee Woo-jung'
  view_rating text,          -- '15+', 'All'
  streaming text,            -- 'TVING'
  
  created_at timestamptz default now()
);

create index idx_seasons_slug on public.seasons(slug);

-- 2. CAST MEMBERS Table
-- Static personal info that doesn't change between seasons
create table public.cast_members (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,   -- 'Lee Eun-ji'
  english_name text,           -- 'Lee Eun-ji'
  instagram text,
  birth_date date,
  mbti text,                   -- 'ESTJ'
  created_at timestamptz default now()
);

-- 3. SEASON_CAST Table
-- Contextual info for a cast member in a specific season
create table public.season_cast (
  id uuid primary key default uuid_generate_v4(),
  season_id uuid references public.seasons(id) on delete cascade,
  cast_id uuid references public.cast_members(id) on delete cascade,
  
  role text,          -- 'Leader', 'Oldest Unnie'
  catchphrase text,   -- 'Do you know Korean traditional game?'
  image_url text,     -- Specific look for this season
  
  created_at timestamptz default now(),
  unique(season_id, cast_id)
);

create index idx_season_cast_season_id on public.season_cast(season_id);

-- 4. EPISODES Table
-- Replaces 'ratings' to hold full episode metadata
create table public.episodes (
  id uuid primary key default uuid_generate_v4(),
  season_id uuid references public.seasons(id) on delete cascade,
  
  episode_number integer not null,
  title text,                  -- 'Arrival in Thailand'
  air_date date,
  rating numeric(4,2),         -- 12.55 (Allow up to 99.99)
  description text,            -- 'The members arrive and...'
  
  created_at timestamptz default now()
);

create index idx_episodes_season_id on public.episodes(season_id);

-- 5. GAMES Table
-- Games played within episodes (Critical Earth Arcade data!)
create table public.games (
  id uuid primary key default uuid_generate_v4(),
  episode_id uuid references public.episodes(id) on delete cascade,
  
  name text not null,          -- 'Music Quiz', 'Zombie Game'
  type text,                   -- 'Individual', 'Team'
  description text,            -- 'Guess the song from Y2K era'
  winner text,                 -- 'Mimi', 'Torong' (Can be JSONB if complex)
  result text,                 -- 'Prize won', 'Failed to eat dinner'
  
  created_at timestamptz default now()
);

-- 6. LOCATIONS Table
-- Specific spots visited during a season
create table public.locations (
  id uuid primary key default uuid_generate_v4(),
  season_id uuid references public.seasons(id) on delete cascade,
  name text not null,          -- 'Khao Yai National Park'
  description text,
  category text,               -- 'Restaurant', 'Lodging', 'Attraction'
  address text,
  created_at timestamptz default now()
);

-- 7. SEASON_VIDEOS Table
-- Official clips, highlights, teasers
create table public.season_videos (
  id uuid primary key default uuid_generate_v4(),
  season_id uuid references public.seasons(id) on delete cascade,
  
  title text not null,
  youtube_url text not null,
  thumbnail_url text,
  view_count bigint,           -- BigInt for 2,000,000 view sorting
  duration interval,           -- '00:15:30'
  type text,                   -- 'highlight', 'full', 'teaser', 'bonus'
  
  created_at timestamptz default now()
);

-- 8. MASCOTS Table
-- Static mascot data
create table public.mascots (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,   -- 'Torong'
  slug text not null unique    -- 'torong'
);

-- 9. SEASON_MASCOTS Table
-- Mascot status per season (Caught, fled, etc)
create table public.season_mascots (
  id uuid primary key default uuid_generate_v4(),
  season_id uuid references public.seasons(id) on delete cascade,
  mascot_id uuid references public.mascots(id) on delete cascade,
  
  status text,                 -- 'Caught', 'Escaped'
  description text,            -- 'Escaped to Bali with the gem'
  image_url text,              -- Costume for this season
  
  created_at timestamptz default now(),
  unique(season_id, mascot_id)
);


-- RLS Policies
alter table public.seasons enable row level security;
alter table public.cast_members enable row level security;
alter table public.season_cast enable row level security;
alter table public.episodes enable row level security;
alter table public.games enable row level security;
alter table public.locations enable row level security;
alter table public.season_videos enable row level security;
alter table public.mascots enable row level security;
alter table public.season_mascots enable row level security;

create policy "Public Read All Seasons" on public.seasons for select using (true);
create policy "Public Read All Cast" on public.cast_members for select using (true);
create policy "Public Read All SeasonCast" on public.season_cast for select using (true);
create policy "Public Read All Episodes" on public.episodes for select using (true);
create policy "Public Read All Games" on public.games for select using (true);
create policy "Public Read All Locations" on public.locations for select using (true);
create policy "Public Read All Videos" on public.season_videos for select using (true);
create policy "Public Read All Mascots" on public.mascots for select using (true);
create policy "Public Read All SeasonMascots" on public.season_mascots for select using (true);
