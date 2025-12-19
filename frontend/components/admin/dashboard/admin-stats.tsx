import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Folder, Video, Users, Image as ImageIcon } from "lucide-react";

interface Props {
    seasonCount: number;
    videoCount: number;
    castCount: number;
    galleryCount: number;
}

export function AdminStats({ seasonCount, videoCount, castCount, galleryCount }: Props) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400">Total Seasons</CardTitle>
                    <Folder className="h-4 w-4 text-zinc-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-white">{seasonCount}</div>
                </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400">Total Videos</CardTitle>
                    <Video className="h-4 w-4 text-zinc-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-white">{videoCount}</div>
                </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400">Total Agents</CardTitle>
                    <Users className="h-4 w-4 text-zinc-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-white">{castCount}</div>
                </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400">Gallery Assets</CardTitle>
                    <ImageIcon className="h-4 w-4 text-zinc-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-white">{galleryCount}</div>
                    <p className="text-xs text-zinc-500">Torong Gallery Images</p>
                </CardContent>
            </Card>
        </div>
    )
}
