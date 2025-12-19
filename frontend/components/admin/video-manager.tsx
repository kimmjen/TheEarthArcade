"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Video } from "lucide-react"
import { SeasonVideo } from "@/types"
import { VideoImport } from "./video/video-import"
import { VideoManualForm } from "./video/video-manual-form"
import { VideoList } from "./video/video-list"

interface Props {
    seasonId: string;
    videos: SeasonVideo[]; // Initial videos (first page)
}

export function VideoManager({ seasonId, videos: initialVideos }: Props) {
    return (
        <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-red-500" />
                    YouTube Videos
                </CardTitle>
                <CardDescription>Manage official highlights, teasers, and full episodes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <VideoImport seasonId={seasonId} />
                <div className="relative mb-8">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800"></div></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-zinc-900 px-2 text-zinc-500">Or Add Manually</span></div>
                </div>
                <VideoManualForm seasonId={seasonId} />
                <VideoList seasonId={seasonId} initialVideos={initialVideos} />
            </CardContent >
        </Card >
    )
}