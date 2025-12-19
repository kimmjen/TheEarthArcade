import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSeasons } from "@/lib/api";

export const revalidate = 60;

export default async function Home() {
    const seasons = await getSeasons();

    return (
        <main className="flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black pb-20">
            {/* Hero Section */}
            <section className="relative flex h-[90vh] w-full flex-col items-center justify-center text-center">
                {/* Background Effects */}
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black to-transparent z-10" />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent z-10" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-black to-black opacity-50 animate-pulse-slow" />

                {/* Main Title Badge */}
                <div className="mb-8 animate-fade-in-up">
                    <Badge variant="neon" className="bg-primary/20 text-primary border-primary/50 text-md px-4 py-1">
                        OFFICIAL ARCHIVE
                    </Badge>
                </div>

                {/* Title */}
                <h1 className="relative z-20 mx-auto max-w-5xl text-6xl font-black tracking-tighter text-white sm:text-8xl lg:text-9xl animate-glitch">
                    THE EARTH <br /> ARCADE
                </h1>

                <p className="mt-6 max-w-2xl text-lg text-white/60 sm:text-xl px-4 animate-fade-in-up delay-100">
                    Welcome to the Multiverse Action Adventure. <br />
                    Archive of the warriors who crossed time and space to catch Torong.
                </p>

                <div className="mt-12 flex gap-6 animate-fade-in-up delay-200">
                    <Link href="/archive">
                        <Button variant="neon" size="lg" className="text-xl px-12 h-14">
                            PRESS START
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Quick Access Grid */}
            <section className="container mx-auto px-4 py-20 z-10">
                <h2 className="text-2xl font-bold text-white mb-8 border-l-4 border-primary pl-4 uppercase tracking-widest">
                    Select Season
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {seasons.slice(0, 3).map((season) => (
                        <Link key={season.id} href={`/season/${season.slug}`} className="group">
                            <Card className="h-full border-white/10 bg-white/5 transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(217,70,239,0.3)]">
                                <div className="relative h-48 w-full overflow-hidden rounded-t-xl">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${season.color_theme} opacity-30`} />
                                    {season.main_poster_url ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={season.main_poster_url} alt={season.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-4xl">🌍</div>
                                    )}
                                </div>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <Badge variant="outline" className="text-xs">{season.year}</Badge>
                                        <span className="text-xs text-muted-foreground uppercase">{season.location}</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">{season.title.replace('EARTH ARCADE ', '')}</h3>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
}
