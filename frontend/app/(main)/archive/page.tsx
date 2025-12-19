import Link from "next/link";
import { getSeasons } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function ArchivePage() {
    const seasons = await getSeasons();

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold tracking-tighter text-white md:text-6xl drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                    ARCHIVE
                </h1>
                <p className="mt-4 text-muted-foreground">The Complete History of Earth Arcade</p>
            </div>

            <div className="flex flex-col gap-12 max-w-5xl mx-auto">
                {seasons.map((season, index) => (
                    <div key={season.id} className="group relative flex flex-col md:flex-row gap-6 items-center">
                        {/* Timeline Line (Visual Only) */}
                        {index !== seasons.length - 1 && (
                            <div className="absolute left-8 top-20 bottom-[-48px] w-0.5 bg-white/10 hidden md:block" />
                        )}

                        {/* Number/Year */}
                        <div className="hidden md:flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-primary/20 bg-background text-xl font-bold text-primary group-hover:border-primary group-hover:shadow-[0_0_15px_rgba(217,70,239,0.5)] transition-all">
                            {season.year}
                        </div>

                        {/* Content Card */}
                        <Card className="w-full transition-all duration-300 hover:border-primary/50 hover:bg-white/5">
                            <div className="flex flex-col md:flex-row">
                                {/* Image Section */}
                                <div className="relative h-48 w-full md:h-auto md:w-1/3 bg-black/40 overflow-hidden rounded-t-xl md:rounded-l-xl md:rounded-tr-none">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${season.color_theme} opacity-20`} />
                                    {season.main_poster_url ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={season.main_poster_url} alt={season.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-4xl">🌍</span>
                                        </div>
                                    )}
                                </div>

                                {/* Info Section */}
                                <div className="flex flex-col p-6 md:w-2/3">
                                    <div className="flex items-center justify-between mb-2">
                                        <Badge variant="outline" className="border-primary/30 text-primary">{season.slug.toUpperCase()}</Badge>
                                        <span className="text-xs text-muted-foreground">{season.air_date_start} ~ {season.air_date_end}</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-1 group-hover:text-primary transition-colors">{season.title}</h2>
                                    <p className="text-sm font-medium text-white/60 mb-4">{season.subtitle}</p>
                                    <p className="text-sm text-muted-foreground mb-6 line-clamp-2">{season.description}</p>

                                    <div className="mt-auto">
                                        <Link href={`/season/${season.slug}`}>
                                            <Button variant="secondary" size="sm" className="w-full md:w-auto">
                                                ACCESS DATA
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
}
