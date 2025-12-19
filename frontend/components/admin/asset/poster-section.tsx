"use client"

import { updateSeason } from "@/lib/actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUploader } from "@/components/ui/image-uploader"
import { useTransition } from "react"
import { Season } from "@/types"
import { toast } from "sonner"

export function PosterSection({ season, type, label, icon: Icon }: { season: Season, type: 'main' | 'horizontal', label: string, icon: any }) {
    const [isPending, startTransition] = useTransition();
    const currentUrl = type === 'main' ? season.main_poster_url : season.horizontal_poster_url;
    const aspectRatio = type === 'main' ? 'portrait' : 'video';

    const handleUpload = (url: string) => {
        startTransition(async () => {
            const formData = new FormData();
            // Append ALL existing fields to safeguard against null overwrites
            formData.append('title', season.title);
            formData.append('subtitle', season.subtitle || '');
            formData.append('description', season.description || '');
            formData.append('directors', season.directors || '');
            formData.append('writers', season.writers || '');
            formData.append('genre', season.genre || '');
            formData.append('location', season.location || '');
            formData.append('air_date_start', season.air_date_start || '');
            formData.append('air_date_end', season.air_date_end || '');
            formData.append('production_cost', season.production_cost || '');
            formData.append('view_rating', season.view_rating || '');
            formData.append('streaming', season.streaming || '');
            formData.append('color_theme', season.color_theme || '');

            // Posters
            if (type === 'main') {
                formData.append('main_poster_url', url);
                formData.append('horizontal_poster_url', season.horizontal_poster_url || '');
            } else {
                formData.append('main_poster_url', season.main_poster_url || '');
                formData.append('horizontal_poster_url', url);
            }

            await updateSeason(season.slug, formData);
            toast.success(`${label} updated!`);
        });
    };

    return (
        <Card className="bg-zinc-900 border-zinc-800 h-full">
            <CardHeader className="py-4 border-b border-zinc-800">
                <CardTitle className="text-sm flex items-center gap-2">
                    <Icon className="w-4 h-4 text-zinc-400" />
                    {label}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                <ImageUploader
                    value={currentUrl}
                    onUpload={handleUpload}
                    aspectRatio={aspectRatio}
                />
            </CardContent>
        </Card>
    );
}
