"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Season, SocialLink, StreamingPlatform, SocialPlatform } from "@/types"
import { useState } from "react"
import { SocialLinkEditor } from "./social-link-editor"
import { StreamingPlatformManager } from "./season-platform-manager"

interface Props {
    season: Season;
    platforms: SocialPlatform[]; // Available social platform types
}

export function SeasonMetadata({ season, platforms: availablePlatforms }: Props) {
    // Ensure links/platforms are arrays, handling potential legacy or null data
    const initialLinks: SocialLink[] = Array.isArray(season.links) ? season.links : [];
    const initialPlatforms: StreamingPlatform[] = Array.isArray(season.platforms) ? season.platforms : [];

    const [links, setLinks] = useState<SocialLink[]>(initialLinks);
    const [platformsData, setPlatformsData] = useState<StreamingPlatform[]>(initialPlatforms);

    return (
        <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
                <CardTitle>Metadata & Settings</CardTitle>
                <CardDescription>Technical details, broadcast info, and external links.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* ... (Basic Metadata fields unchanged) ... */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Season Title (Korean)</Label>
                        <Input name="title" defaultValue={season.title} className="bg-black/50 border-zinc-700" />
                    </div>
                    <div className="space-y-2">
                        <Label>English Title (Global)</Label>
                        <Input name="title_en" defaultValue={season.title_en || ''} className="bg-black/50 border-zinc-700" placeholder="e.g. Earth Arcade" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Genre</Label>
                        <Input name="genre" defaultValue={season.genre || ''} className="bg-black/50 border-zinc-700" />
                    </div>
                    <div className="space-y-2">
                        <Label>Location</Label>
                        <Input name="location" defaultValue={season.location || ''} className="bg-black/50 border-zinc-700" placeholder="e.g. 태국" />
                    </div>
                    <div className="space-y-2">
                        <Label>Air Date (Start - End)</Label>
                        <div className="flex gap-2">
                            <Input name="air_date_start" defaultValue={season.air_date_start} className="bg-black/50 border-zinc-700" placeholder="Start" />
                            <Input name="air_date_end" defaultValue={season.air_date_end} className="bg-black/50 border-zinc-700" placeholder="End" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>View Rating</Label>
                        <Input name="view_rating" defaultValue={season.view_rating || ''} className="bg-black/50 border-zinc-700" placeholder="e.g. 15+" />
                    </div>
                    <div className="space-y-2">
                        <Label>Broadcast Time (방송 시간)</Label>
                        <Input name="broadcast_time" defaultValue={season.broadcast_time || ''} className="bg-black/50 border-zinc-700" placeholder="e.g. 금 / 오후 08:40 ~" />
                    </div>
                    <div className="space-y-2">
                        <Label>Episode Count (방송 횟수)</Label>
                        <Input name="episode_count" defaultValue={season.episode_count || ''} className="bg-black/50 border-zinc-700" placeholder="e.g. 11부작" />
                    </div>
                    <div className="space-y-2">
                        <Label>Production Company (제작사)</Label>
                        <Input name="production_company" defaultValue={season.production_company || ''} className="bg-black/50 border-zinc-700" placeholder="e.g. 에그이즈커밍" />
                    </div>
                    <div className="space-y-2">
                        <Label>Channel (방송사)</Label>
                        <Input name="channel" defaultValue={season.channel || ''} className="bg-black/50 border-zinc-700" placeholder="e.g. tvN" />
                    </div>
                </div>

                {/* Hidden Inputs for Form Submission */}
                <input type="hidden" name="links" value={JSON.stringify(links)} />
                <input type="hidden" name="platforms" value={JSON.stringify(platformsData)} />

                {/* Dynamic Editors */}
                <div className="space-y-8 pt-4 border-t border-zinc-800">
                    <SocialLinkEditor links={links} onChange={setLinks} availablePlatforms={availablePlatforms} />
                    <StreamingPlatformManager platforms={platformsData} onChange={setPlatformsData} />
                </div>
            </CardContent>
        </Card>
    )
}
