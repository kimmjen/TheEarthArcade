import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSeasons, getSeasonCast, getMascot } from "@/lib/api";

export const revalidate = 60;

export default async function CastPage() {
  // Strategy: Show cast from the LATEST season as default display
  const seasons = await getSeasons();
  const latestSeason = seasons[0]; // Ordered by year desc

  const castMembers = latestSeason ? await getSeasonCast(latestSeason.id) : [];
  const torong = await getMascot('torong');
  // Torong images are in season_mascots, we might pick the latest one if available
  // For now, let's look at the structure returned by getMascot
  const mascotImage = torong?.season_mascots?.[0]?.image_url || "/assets/torong/origin.webp";
  const mascotDesc = torong?.season_mascots?.[0]?.description || "The Moon Rabbit";

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tighter text-white md:text-6xl drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
          AGENTS
        </h1>
        <p className="mt-4 text-muted-foreground">The Earth Warriors & The Target</p>
      </div>

      {/* Earth Warriors Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {castMembers.map((member) => (
          <Card key={member.cast_id} className="group overflow-hidden border-white/10 bg-white/5 transition-all duration-300 hover:border-primary/50 hover:bg-white/10">
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/20">
              {member.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={member.image_url}
                  alt={member.cast.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white/20 text-4xl font-black uppercase tracking-tighter">
                  {member.cast.name.split(' ')[0]}
                </div>
              )}
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
            </div>

            <CardHeader className="relative z-10 -mt-20">
              <Badge variant="neon" className="w-fit mb-2">{member.role}</Badge>
              <CardTitle className="text-2xl font-bold text-white uppercase">{member.cast.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[10px] text-white/60 mt-2 line-clamp-1 italic">&quot;{member.catchphrase.replace(/"/g, '&quot;')}&quot;</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Torong Section */}
      {torong && (
        <div className="mt-24">
          <h2 className="mb-8 text-center text-3xl font-bold text-primary">TARGET NO.1</h2>
          <Card className="mx-auto max-w-4xl overflow-hidden border-primary/20 bg-black/40">
            <div className="flex flex-col md:flex-row">
              <div className="relative aspect-square w-full md:w-1/3 bg-white/5">
                {mascotImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={mascotImage} alt="Torong" className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-primary/20 text-6xl font-black">
                    🐰
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center p-8 md:w-2/3">
                <div className="mb-4 flex items-center gap-2">
                  <Badge variant="destructive">WANTED</Badge>
                  <span className="text-sm text-muted-foreground uppercase">@{torong.slug}</span>
                </div>
                <h3 className="text-4xl font-bold text-white mb-4">{torong.name}</h3>
                <p className="text-lg text-white/80">{mascotDesc}</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
