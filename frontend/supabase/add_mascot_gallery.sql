
-- 10. MASCOT_GALLERY Table
-- General gallery for mascots (not season specific)
create table public.mascot_gallery (
  id uuid primary key default uuid_generate_v4(),
  mascot_id uuid references public.mascots(id) on delete cascade,
  image_url text not null,
  created_at timestamptz default now()
);

alter table public.mascot_gallery enable row level security;
create policy "Public Read All Mascot Gallery" on public.mascot_gallery for select using (true);
create policy "Service Role Full Access Gallery" on public.mascot_gallery for all using (true);
