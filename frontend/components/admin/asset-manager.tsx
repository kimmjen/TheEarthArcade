"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ImageIcon, RefreshCw, Maximize2, Images } from "lucide-react"
import { Season, SeasonCast, SeasonImage, SeasonMascot } from "@/types"
import { PosterSection } from "./asset/poster-section"
import { CastImageCard } from "./asset/cast-image-card"
import { GalleryManager } from "./asset/gallery-manager"

interface Props {
    season: Season;
    cast: SeasonCast[];
    images: SeasonImage[];
}

export function AssetManager({ season, cast, images }: Props) {
    return (
        <div className="space-y-12">
            {/* 1. Posters Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                    <ImageIcon className="w-5 h-5 text-zinc-400" />
                    <h3 className="text-lg font-bold text-white tracking-tight">Promotional Posters</h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <PosterSection season={season} type="main" label="Main Poster (Vertical)" icon={ImageIcon} />
                    </div>
                    <div className="lg:col-span-2">
                        <PosterSection season={season} type="horizontal" label="Horizon Poster (Landscape)" icon={Maximize2} />
                    </div>
                </div>
            </div>

            {/* 3. Gallery Section */}
            <div className="space-y-4">
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                    <div className="bg-zinc-950 p-4 border-b border-zinc-800 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-white tracking-tight">Photo Gallery</h3>
                    </div>
                    <GalleryManager seasonId={season.id} initialImages={images} />
                </div>
            </div>

            {/* 4. Cast Images Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 px-1 opacity-50">
                    <RefreshCw className="w-5 h-5 text-zinc-400" />
                    <h3 className="text-lg font-bold text-white tracking-tight">Cast Profiles (Managed in Agents tab)</h3>
                </div>
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {cast.map((member) => (
                                <CastImageCard key={member.id} member={member} />
                            ))}

                            {cast.length === 0 && (
                                <div className="col-span-full py-12 text-center text-zinc-500 border-2 border-dashed border-zinc-800 rounded-xl">
                                    No cast members to display.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
