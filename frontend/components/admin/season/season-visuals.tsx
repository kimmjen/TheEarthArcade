"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Season } from "@/types"

interface Props {
    season: Season;
}

export function SeasonVisuals({ season }: Props) {
    return (
        <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
                <CardTitle>Visual Identity</CardTitle>
                <CardDescription>Brand colors and poster images.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Theme Color</Label>
                    <div className="flex gap-2">
                        <div className="w-10 h-10 rounded border border-zinc-700 shadow-inner" style={{ backgroundColor: season.color_theme || '#000' }}></div>
                        <Input name="color_theme" defaultValue={season.color_theme || ''} className="bg-black/50 border-zinc-700 font-mono" placeholder="#RRGGBB" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Main Poster URL</Label>
                        <Input name="main_poster_url" defaultValue={season.main_poster_url || ''} className="bg-black/50 border-zinc-700 font-mono text-xs" />
                    </div>
                    <div className="space-y-2">
                        <Label>Horizontal Poster URL</Label>
                        <Input name="horizontal_poster_url" defaultValue={season.horizontal_poster_url || ''} className="bg-black/50 border-zinc-700 font-mono text-xs" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
