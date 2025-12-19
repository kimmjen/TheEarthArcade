import { getSeasonBySlug, getSeasonCast, getSeasonVideos, getSeasonImages } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Play, Tv, Calendar, Globe, MonitorPlay, Film, Clapperboard } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export default async function SeasonDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const season = await getSeasonBySlug(slug);

  if (!season) {
    notFound();
  }

  const castMembers = await getSeasonCast(season.id);
  const videos = await getSeasonVideos(season.id);
  const images = await getSeasonImages(season.id);

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Header */}
      <div className="relative h-[50vh] w-full overflow-hidden bg-black/90">
        <div className={`absolute inset-0 bg-gradient-to-br ${season.color_theme} opacity-30`} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

        {/* Background Poster Blur Effect */}
        {season.main_poster_url && (
          <div className="absolute inset-0 opacity-20 blur-3xl scale-110" style={{ backgroundImage: `url(${season.main_poster_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        )}

        <div className="container relative mx-auto flex h-full flex-col justify-end px-4 pb-12">
          <Link href="/archive" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-white transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> BACK TO ARCHIVE
          </Link>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <Badge variant="neon" className="text-lg px-4 py-1">{season.year}</Badge>
            <span className="text-xl text-white/60 font-light tracking-widest uppercase">{season.location}</span>
            {season.genre && <Badge variant="outline" className="text-xs border-white/20 text-white/70">{season.genre}</Badge>}
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase drop-shadow-lg mb-2">
            {season.title}
          </h1>
          <p className="text-xl md:text-2xl text-white/80 font-light tracking-wide">{season.subtitle}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Stats (Sidebar) - Spans 4 columns */}
        <div className="lg:col-span-4 space-y-8">
          {/* Main Poster Card */}
          <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-500">
            {season.main_poster_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={season.main_poster_url} alt="Poster" className="w-full h-auto object-cover" />
            ) : (
              <div className="h-[500px] w-full bg-neutral-800 flex items-center justify-center">No Poster</div>
            )}
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center"><Tv className="w-4 h-4 mr-2 text-primary" /> PRODUCTION INFO</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground uppercase mb-1">Channel</div>
                  <div className="text-sm font-medium text-white">{season.channel || 'tvN'}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase mb-1">Episodes</div>
                  <div className="text-sm font-medium text-white">{season.episode_count || '-'}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground uppercase mb-1">Planning</div>
                  <div className="text-sm font-medium text-white">{season.planning || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase mb-1">Production</div>
                  <div className="text-sm font-medium text-white">{season.production_company || '-'}</div>
                </div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground uppercase mb-1">Director (PD)</div>
                <div className="text-base text-white">{season.directors || '나영석'}</div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground uppercase mb-1">Writer</div>
                <div className="text-base text-white">{season.writers || '이우정'}</div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="text-xs text-muted-foreground uppercase mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Broadcast Period</div>
                <div className="text-sm text-white/80">{season.air_date_start} ~ {season.air_date_end}</div>
                {season.broadcast_time && <div className="text-xs text-white/50 mt-1">{season.broadcast_time}</div>}
              </div>
            </div>
          </div>

          {/* Platforms */}
          {season.platforms && season.platforms.length > 0 && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center"><MonitorPlay className="w-4 h-4 mr-2 text-primary" /> AVAILABLE ON</h3>
              <div className="flex flex-wrap gap-3">
                {season.platforms.map((p: any, idx: number) => (
                  <Link key={idx} href={p.url || '#'} target="_blank" className="flex items-center gap-2 px-3 py-2 bg-black/40 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
                    {p.icon_url ? (
                      <img src={p.icon_url} alt={p.name} className="w-6 h-6 object-contain rounded-sm" />
                    ) : (
                      <span className="text-xs font-bold px-1">{p.name.substring(0, 2)}</span>
                    )}
                    <span className="text-sm font-medium text-white">{p.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Social Links */}
          {season.links && season.links.length > 0 && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center"><Globe className="w-4 h-4 mr-2 text-primary" /> OFFICIAL LINKS</h3>
              <div className="space-y-2">
                {season.links.map((link: any, idx: number) => (
                  <Link key={idx} href={link.url} target="_blank" className="block text-sm text-zinc-400 hover:text-primary transition-colors hover:underline">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Content - Spans 8 columns */}
        <div className="lg:col-span-8 space-y-16">
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" /> SYNOPSIS
            </h2>
            <div className="prose prose-invert max-w-none text-lg text-muted-foreground leading-relaxed">
              <p>{season.description}</p>
            </div>
          </section>

          {/* Cast Section */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-secondary" /> CAST & CREW
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {castMembers.map((member) => (
                <div key={member.cast_id} className="group relative overflow-hidden rounded-xl border border-white/10 bg-black/40 hover:border-primary/50 transition-all duration-300">
                  <div className="aspect-[3/4] bg-neutral-900 relative">
                    {member.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={member.image_url} alt={member.cast.name} className="object-cover w-full h-full opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-4xl">👤</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="font-bold text-white text-base mb-0.5">{member.cast.name}</p>
                      <p className="text-xs text-primary font-medium tracking-wide uppercase">{member.role}</p>
                      <p className="text-[10px] text-white/60 mt-2 line-clamp-1 italic">&quot;{member.catchphrase?.replace(/"/g, '&quot;')}&quot;</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Videos Section */}
          {videos && videos.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500" /> VIDEOS
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {videos.map((vid) => (
                  <Link href={vid.youtube_url} key={vid.id} target="_blank" className="group block">
                    <div className="relative aspect-video rounded-xl bg-neutral-800 overflow-hidden border border-white/10 group-hover:border-primary/50 transition-all">
                      {/* Thumbnail Placeholder or Actual if available */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all">
                        <div className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="fill-white text-white w-6 h-6 ml-1" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs font-mono text-white">
                        {vid.type === 'full' ? 'FULL' : 'CLIP'}
                      </div>
                    </div>
                    <h3 className="mt-3 text-white font-medium group-hover:text-primary transition-colors line-clamp-2">{vid.title}</h3>
                    <p className="text-xs text-muted-foreground">{vid.view_count || 'YouTube'}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-secondary" /> KEY LOCATIONS
            </h2>
            <div className="flex flex-wrap gap-2">
              {season.location.split(',').map((loc, i) => (
                <Badge key={i} variant="outline" className="px-4 py-2 text-sm border-white/10 hover:border-white/30 transition-colors">
                  📍 {loc.trim()}
                </Badge>
              ))}
              {/* If we had more structured location data from joins, we would show descriptions here */}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
