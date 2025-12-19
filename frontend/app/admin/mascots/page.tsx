import { getSeasons, getAllSeasonMascots, getMascotGallery } from "@/lib/api";
import { Rabbit, Copy } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MascotStatusRow } from "@/components/admin/mascot/mascot-status-row";
import { GalleryGrid } from "@/components/admin/mascot/gallery-grid";

export const revalidate = 0;

export default async function MascotPage() {
    const seasons = await getSeasons();
    const seasonMascots = await getAllSeasonMascots();
    const galleryImages = await getMascotGallery();

    // Merge data
    const dashboardData = seasons.map(season => {
        const mascotData = seasonMascots?.find(m => m.season_id === season.id);
        return {
            season,
            mascot: mascotData || null
        };
    });

    return (
        <div className="h-full bg-zinc-950 text-zinc-100 flex flex-col p-6 overflow-y-auto">
            <div className="mb-8 flex items-center gap-3">
                <Rabbit className="w-8 h-8 text-primary" />
                <div>
                    <h1 className="text-2xl font-bold text-white">Mascot Management: Torong</h1>
                    <p className="text-zinc-400 text-sm">Manage Torong's status across all seasons.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Season Statuses */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-lg font-bold text-white">Season Status</h2>
                    <div className="grid gap-4">
                        {dashboardData.map(({ season, mascot }) => (
                            <MascotStatusRow key={season.id} season={season} mascot={mascot} />
                        ))}
                    </div>
                </div>

                {/* Right: Asset Library */}
                <GalleryGrid images={galleryImages} />
            </div>
        </div>
    );
}
