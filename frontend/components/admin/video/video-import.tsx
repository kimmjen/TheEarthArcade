"use client"

import { useState, useTransition } from "react"
import { addVideo, fetchYoutubeInfo } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Plus, RefreshCw, ListVideo, Video, ExternalLink } from "lucide-react"
import { VIDEO_TYPES } from "@/types"
import { toast } from "sonner"

interface Props {
    seasonId: string;
}

export function VideoImport({ seasonId }: Props) {
    const [isPending, startTransition] = useTransition();
    const [isFetching, setIsFetching] = useState(false);
    const [fetchUrl, setFetchUrl] = useState("");
    const [fetchedVideos, setFetchedVideos] = useState<{ title: string, url: string, thumbnailUrl: string, type: string }[]>([]);

    const handleFetch = async () => {
        if (!fetchUrl) return;
        setIsFetching(true);
        try {
            const isPlaylist = fetchUrl.includes('list=');
            const result = await fetchYoutubeInfo(fetchUrl, isPlaylist ? 'playlist' : 'video');

            if (result.error) {
                toast.error(result.error);
            } else if (result.data) {
                // Auto-categorize
                const processed = result.data.map((vid: any) => {
                    const lowerTitle = vid.title.toLowerCase();
                    let type = 'highlight'; // default

                    if (lowerTitle.includes('shorts') || lowerTitle.includes('쇼츠') || lowerTitle.includes('#shorts')) {
                        type = 'shorts';
                    } else if (lowerTitle.includes('full') || lowerTitle.includes('풀버전') || lowerTitle.includes('다시보기') || lowerTitle.includes('ep.')) {
                        type = 'full';
                    } else if (lowerTitle.includes('teaser') || lowerTitle.includes('티저') || lowerTitle.includes('예고') || lowerTitle.includes('trailer')) {
                        type = 'teaser';
                    } else if (lowerTitle.includes('live') || lowerTitle.includes('라이브')) {
                        type = 'live';
                    } else if (lowerTitle.includes('making') || lowerTitle.includes('메이킹') || lowerTitle.includes('behind') || lowerTitle.includes('비하인드')) {
                        type = 'making';
                    } else if (lowerTitle.includes('interview') || lowerTitle.includes('인터뷰')) {
                        type = 'interview';
                    } else if (lowerTitle.includes('fancam') || lowerTitle.includes('직캠')) {
                        type = 'fancam';
                    }

                    return { ...vid, type };
                });

                setFetchedVideos(processed);
                toast.success(`Found ${processed.length} videos`);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch videos");
        } finally {
            setIsFetching(false);
        }
    };

    const handleFetchedTypeChange = (index: number, newType: string) => {
        const updated = [...fetchedVideos];
        updated[index].type = newType;
        setFetchedVideos(updated);
    };

    const handleAddFetched = () => {
        if (fetchedVideos.length === 0) return;

        startTransition(async () => {
            // Bulk add
            for (const vid of fetchedVideos) {
                const formData = new FormData();
                formData.append('title', vid.title);
                formData.append('url', vid.url);
                formData.append('type', vid.type);
                await addVideo(seasonId, formData);
            }
            setFetchedVideos([]);
            setFetchUrl("");
            toast.success("Videos imported successfully");
        });
    }

    return (
        <div className="border border-zinc-800 p-5 rounded-xl bg-zinc-950/30 space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                    <ListVideo className="w-4 h-4 text-red-500" />
                    Import from YouTube
                </h4>
                {fetchedVideos.length > 0 && (
                    <Button size="sm" onClick={handleAddFetched} disabled={isPending} className="bg-red-600 hover:bg-red-700 text-white">
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                        Add {fetchedVideos.length} Videos
                    </Button>
                )}
            </div>

            <div className="flex gap-2">
                <Input
                    placeholder="Paste Video URL or Playlist URL..."
                    value={fetchUrl}
                    onChange={(e) => setFetchUrl(e.target.value)}
                    className="bg-black/50 border-zinc-700"
                />
                <Button variant="secondary" onClick={handleFetch} disabled={isFetching || !fetchUrl}>
                    {isFetching ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                </Button>
            </div>

            {/* Preview Area */}
            {fetchedVideos.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto p-2 bg-black/40 rounded border border-zinc-800/50">
                    {fetchedVideos.map((vid, idx) => (
                        <div key={idx} className="flex gap-2 items-center p-2 rounded bg-zinc-900/80">
                            <div className="w-16 h-10 bg-zinc-800 rounded overflow-hidden flex-shrink-0 flex items-center justify-center">
                                {vid.thumbnailUrl ? (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img src={vid.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <Video className="w-4 h-4 text-zinc-600" />
                                )}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs text-zinc-300 truncate font-medium">{vid.title}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <select
                                        value={vid.type}
                                        onChange={(e) => handleFetchedTypeChange(idx, e.target.value)}
                                        className="h-5 text-[10px] bg-zinc-800 border-none rounded text-zinc-300 focus:ring-0 cursor-pointer"
                                    >
                                        {VIDEO_TYPES.map(t => (
                                            <option key={t.value} value={t.value}>{t.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
