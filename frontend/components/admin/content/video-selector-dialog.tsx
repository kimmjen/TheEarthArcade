
'use client'

import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { SeasonVideo } from "@/types"
import { getSeasonVideos } from "@/lib/api"
import { linkVideosToEpisode } from "@/lib/actions/content"
import { toast } from "sonner"
import Image from "next/image"
import { PlaySquare, Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"

interface VideoSelectorDialogProps {
    isOpen: boolean;
    onClose: () => void;
    seasonId: string;
    episodeId: string;
    initialSelectedIds: string[];
}

export function VideoSelectorDialog({
    isOpen,
    onClose,
    seasonId,
    episodeId,
    initialSelectedIds
}: VideoSelectorDialogProps) {
    const [allVideos, setAllVideos] = useState<SeasonVideo[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadVideos();
            setSelectedIds(initialSelectedIds);
        }
    }, [isOpen]);

    const loadVideos = async () => {
        setLoading(true);
        try {
            // Fetch more than the default limit to show everything available for the season
            const data = await getSeasonVideos(seasonId, 200);
            setAllVideos(data);
        } catch (e) {
            toast.error("Failed to load videos");
        } finally {
            setLoading(false);
        }
    }

    const toggleVideo = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    }

    const handleSave = async () => {
        setSaving(true);
        try {
            await linkVideosToEpisode(selectedIds, episodeId);
            toast.success("Highlight videos updated");
            onClose();
        } catch (e: any) {
            toast.error("Failed to save: " + e.message);
        } finally {
            setSaving(false);
        }
    }

    const filtered = allVideos.filter(v =>
        v.title.toLowerCase().includes(search.toLowerCase()) ||
        v.youtube_url.includes(search)
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl bg-zinc-950 border-zinc-800 text-zinc-100">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <PlaySquare className="w-5 h-5 text-primary" />
                        Select highlight videos for this episode
                    </DialogTitle>
                </DialogHeader>

                <div className="relative my-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <Input
                        placeholder="Search by title or URL..."
                        className="pl-10 bg-zinc-900 border-zinc-800 focus:ring-primary"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2">
                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center text-zinc-500 gap-2">
                            <Loader2 className="w-8 h-8 animate-spin" />
                            <p>Loading season videos...</p>
                        </div>
                    ) : (
                        filtered.map(video => (
                            <div
                                key={video.id}
                                className={`flex items-center gap-4 p-3 rounded-lg border transition-all cursor-pointer ${selectedIds.includes(video.id)
                                        ? 'bg-primary/10 border-primary/50'
                                        : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                                    }`}
                                onClick={() => toggleVideo(video.id)}
                            >
                                <Checkbox
                                    checked={selectedIds.includes(video.id)}
                                    onCheckedChange={() => toggleVideo(video.id)}
                                    className="border-zinc-700 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                />
                                <div className="relative w-20 h-12 bg-zinc-800 rounded overflow-hidden flex-shrink-0">
                                    {video.thumbnail_url ? (
                                        <Image src={video.thumbnail_url} alt="" fill className="object-cover" />
                                    ) : (
                                        <PlaySquare className="w-5 h-5 m-auto text-zinc-600" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-zinc-100 truncate">{video.title}</p>
                                    <p className="text-xs text-zinc-500 truncate">{video.youtube_url}</p>
                                    {video.episode_id && video.episode_id !== episodeId && (
                                        <p className="text-[10px] text-yellow-500/70 font-medium">Already linked to another episode</p>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                    {!loading && filtered.length === 0 && (
                        <div className="py-10 text-center text-zinc-500 italic">No videos found.</div>
                    )}
                </div>

                <DialogFooter className="mt-6">
                    <Button variant="ghost" onClick={onClose} disabled={saving}>Cancel</Button>
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-primary hover:bg-primary/90 text-white font-bold"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Link {selectedIds.length} Videos
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
