import { getSeasonBySlug, getSeasonRatings, getSeasonVideos, getSeasonCast, getSeasonImages, getSocialPlatforms, getSeasonMascot, getSeasonEpisodes, getSeasonLocations } from "@/lib/api";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { SeasonEditForm } from "@/components/admin/season-edit-form";
import { RatingsManager } from "@/components/admin/ratings-manager";
import { VideoManager } from "@/components/admin/video-manager";
import { AssetManager } from "@/components/admin/asset-manager";
import { CastManager } from "@/components/admin/cast-manager";
import { MascotManager } from "@/components/admin/asset/mascot-manager";
import { EpisodeManager } from "@/components/admin/content/episode-manager";
import { LocationManager } from "@/components/admin/content/location-manager";

interface PageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ view?: string }>;
}

export const revalidate = 0; // Always fresh for admin

export default async function AdminSeasonEditPage({ params, searchParams }: PageProps) {
    const { slug } = await params;
    const { view } = await searchParams;
    const activeView = view || 'general';

    const season = await getSeasonBySlug(slug);

    if (!season) {
        notFound();
    }

    const [ratings, videos, cast, images, platforms, mascot, episodes, locations] = await Promise.all([
        getSeasonRatings(season.id),
        getSeasonVideos(season.id),
        getSeasonCast(season.id),
        getSeasonImages(season.id),
        getSocialPlatforms(),
        getSeasonMascot(season.id),
        getSeasonEpisodes(season.id),
        getSeasonLocations(season.id)
    ]);

    const navItems = [
        { id: 'general', label: 'General Info', icon: null },
        { id: 'cast', label: 'Agents (Cast)', icon: null },
        { id: 'content', label: 'Content (Ep & Games)', icon: null },
        { id: 'locations', label: 'Locations', icon: null }, // New Tab
        { id: 'ratings', label: 'Ratings', icon: null },
        { id: 'assets', label: 'Assets', icon: null },
        { id: 'mascot', label: 'Mascot (Torong)', icon: null },
        { id: 'videos', label: 'Videos', icon: null },
    ];

    return (
        <div className="container mx-auto px-4 pt-8 pb-24 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                            <span className="text-primary">EDIT:</span> {season.title}
                        </h1>
                        <p className="text-muted-foreground">Manage all data for {season.slug}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link href={`/season/${season.slug}`} target="_blank">
                        <Button variant="outline">PREVIEW PAGE</Button>
                    </Link>
                </div>
            </div>

            {/* Main Tabs Layout */}
            <Tabs defaultValue={activeView} className="w-full">
                <TabsList className="bg-zinc-900 border border-zinc-800 p-2 mb-8 w-full justify-start overflow-x-auto">
                    {navItems.map((item) => (
                        <Link key={item.id} href={`?view=${item.id}`}>
                            <TabsTrigger
                                value={item.id}
                                className={`px-6 data-[state=active]:bg-zinc-800 data-[state=active]:text-white ${activeView === item.id ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400'}`}
                            >
                                {item.label}
                            </TabsTrigger>
                        </Link>
                    ))}
                </TabsList>

                <div className="bg-zinc-950/50 rounded-xl border border-zinc-800/50 p-6 min-h-[600px]">
                    {activeView === 'general' && <SeasonEditForm season={season} platforms={platforms} />}
                    {activeView === 'cast' && <CastManager seasonCast={cast} />}
                    {activeView === 'content' && <EpisodeManager seasonId={season.id} initialEpisodes={episodes} />}
                    {activeView === 'locations' && <LocationManager seasonId={season.id} initialLocations={locations} />}
                    {activeView === 'ratings' && <RatingsManager seasonId={season.id} ratings={ratings} />}
                    {activeView === 'assets' && <AssetManager season={season} cast={cast} images={images} />}
                    {activeView === 'mascot' && <MascotManager seasonId={season.id} initialMascot={mascot} />}
                    {activeView === 'videos' && <VideoManager seasonId={season.id} videos={videos} />}
                </div>
            </Tabs>
        </div>
    );
}
