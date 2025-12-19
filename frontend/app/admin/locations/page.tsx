import { getAllLocations } from "@/lib/api";
import { EarthArcadeMap } from "@/components/ui/google-map";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const revalidate = 0;

export default async function GlobalMapPage() {
    const locations = await getAllLocations();

    // Transform DB locations to Map Markers
    const markers = locations.map((loc: any) => ({
        id: loc.id,
        lat: loc.latitude,
        lng: loc.longitude,
        title: loc.name,
        description: loc.description,
        season_slug: loc.season?.slug,
        seasonal_color: getSeasonColor(loc.season?.slug)
    }));

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
                            <span className="text-primary">Global Map</span>
                            <span className="text-base font-normal text-muted-foreground ml-2">({markers.length} Locations)</span>
                        </h1>
                        <p className="text-muted-foreground">Visualising all filming locations across seasons.</p>
                    </div>
                </div>
            </div>

            {/* Map Container */}
            <div className="w-full h-[80vh] bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 shadow-2xl">
                {markers.length > 0 ? (
                    <EarthArcadeMap
                        markers={markers}
                        zoom={3} // Zoomed out to see the world
                        center={{ lat: 20, lng: 100 }} // Centered roughly on Asia
                        className="w-full h-full"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500">
                        <p className="text-xl font-bold">No mapped locations found.</p>
                        <p className="text-sm mt-2">Add latitude/longitude to locations in Season Management tabs.</p>
                    </div>
                )}
            </div>

            {/* Legend */}
            <div className="mt-8 flex gap-4 justify-center">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span className="text-sm text-zinc-400">Season 1 (Thailand)</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span className="text-sm text-zinc-400">Season 2 (Finland & Bali)</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    <span className="text-sm text-zinc-400">Season 3 (Abu Dhabi & Portugal)</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                    <span className="text-sm text-zinc-400">Spin-off (Korea)</span>
                </div>
            </div>
        </div>
    );
}

function getSeasonColor(slug?: string) {
    if (!slug) return 'red';
    if (slug === 's1') return 'red';
    if (slug === 's2') return 'blue';
    if (slug === 's3') return 'green';
    return 'yellow'; // Spin-off or others
}
