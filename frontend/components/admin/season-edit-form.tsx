"use client"

import { updateSeason } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Save, Loader2 } from "lucide-react"
import { useTransition, useState } from "react"
import { Season, SocialPlatform } from "@/types"
import { toast } from "sonner"
import { SeasonEssentialInfo } from "./season/season-essential-info"
import { SeasonProductionCrew } from "./season/season-production-crew"
import { SeasonMetadata } from "./season/season-metadata"
import { SeasonVisuals } from "./season/season-visuals"

interface Props {
    season: Season;
    platforms: SocialPlatform[];
}

export function SeasonEditForm({ season, platforms }: Props) {
    const [isPending, startTransition] = useTransition();

    // Parse initial data
    const [directors, setDirectors] = useState<string[]>(season.directors ? season.directors.split(',').map(s => s.trim()) : []);
    const [writers, setWriters] = useState<string[]>(season.writers ? season.writers.split(',').map(s => s.trim()) : []);

    const handleSubmit = (formData: FormData) => {
        // Inject current list state into formData
        formData.set('directors', directors.join(', '));
        formData.set('writers', writers.join(', '));

        startTransition(async () => {
            await updateSeason(season.slug, formData);
            toast.success("Season updated successfully!");
        });
    };

    return (
        <form action={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <SeasonEssentialInfo season={season} />
                    <SeasonVisuals season={season} />
                </div>
                <div className="space-y-6">
                    <SeasonProductionCrew season={season} directors={directors} setDirectors={setDirectors} writers={writers} setWriters={setWriters} />
                    <SeasonMetadata season={season} platforms={platforms} />
                </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="sticky bottom-4 z-50 flex justify-end">
                <div className="bg-zinc-900/90 backdrop-blur border border-zinc-800 p-2 rounded-xl shadow-2xl flex gap-2">
                    <Button type="button" variant="ghost" onClick={() => window.history.back()}>Cancel</Button>
                    <Button type="submit" disabled={isPending} className="min-w-[150px]">
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        Save Changes
                    </Button>
                </div>
            </div>
        </form>
    )
}
