"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Season } from "@/types"

interface Props {
    season: Season;
}

export function SeasonEssentialInfo({ season }: Props) {
    return (
        <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
                <CardTitle>Essential Info</CardTitle>
                <CardDescription>The core identity of the season.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Title</Label>
                        <Input name="title" defaultValue={season.title} className="bg-black/50 border-zinc-700" />
                    </div>
                    <div className="space-y-2">
                        <Label>Subtitle</Label>
                        <Input name="subtitle" defaultValue={season.subtitle} className="bg-black/50 border-zinc-700" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Description (Synopsis)</Label>
                    <Textarea
                        name="description"
                        className="flex min-h-[100px] w-full rounded-md border border-zinc-700 bg-black/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        defaultValue={season.description}
                    />
                </div>
            </CardContent>
        </Card>
    )
}
