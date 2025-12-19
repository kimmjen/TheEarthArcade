"use client"

import { useState, useEffect, useRef, useCallback, useTransition } from "react"
import { deleteSeasonVideo, fetchMoreVideos, updateSeasonVideo } from "@/lib/actions"
import { Video, Trash2, Loader2, Play, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SeasonVideo, VIDEO_TYPES } from "@/types"
import { toast } from "sonner"

interface Props {
    seasonId: string;
    initialVideos: SeasonVideo[];
}

function getYoutubeId(url: string) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

const TYPE_COLORS: Record<string, string> = {
    full: 'bg-green-500/10 text-green-500',
    teaser: 'bg-purple-500/10 text-purple-500',
    highlight: 'bg-blue-500/10 text-blue-500',
    live: 'bg-red-500/10 text-red-500',
    shorts: 'bg-yellow-500/10 text-yellow-500',
    making: 'bg-yellow-500/10 text-yellow-500',
    interview: 'bg-orange-500/10 text-orange-500',
};

export function VideoList({ seasonId, initialVideos }: Props) {
    const [isPending, startTransition] = useTransition();
    const [videoList, setVideoList] = useState<SeasonVideo[]>(initialVideos);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const observerTarget = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setVideoList(initialVideos);
        setPage(1);
        setHasMore(true);
    }, [initialVideos]);

    const loadMore = useCallback(async () => {
        if (isLoadingMore || !hasMore) return;
        setIsLoadingMore(true);

        const nextPage = page + 1;
        const result = await fetchMoreVideos(seasonId, nextPage, 20);

        if (result.data && result.data.length > 0) {
            setVideoList(prev => [...prev, ...result.data]);
            setPage(nextPage);
            if (result.data.length < 20) setHasMore(false);
        } else {
            setHasMore(false);
        }

        setIsLoadingMore(false);
    }, [page, hasMore, isLoadingMore, seasonId]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    loadMore();
                }
            },
            { threshold: 0.5 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [loadMore]);

    const handleDelete = (videoId: string) => {
        toast.custom((t) => (
            <div className="bg-red-950 border border-red-900 text-red-200 p-4 rounded-lg shadow-xl flex flex-col gap-3">
                <p className="font-bold">Delete this video?</p>
                <div className="flex gap-2 justify-end">
                    <Button size="sm" variant="ghost" onClick={() => toast.dismiss(t)} className="text-red-200 hover:text-white hover:bg-red-900">Cancel</Button>
                    <Button size="sm" variant="destructive" onClick={async () => {
                        toast.dismiss(t);
                        startTransition(async () => {
                            await deleteSeasonVideo(videoId);
                            toast.success('Video deleted');
                        });
                    }}>Delete</Button>
                </div>
            </div>
        ));
    };

    const handleTypeUpdate = (videoId: string, newType: string, index: number) => {
        const updated = [...videoList];
        updated[index].type = newType;
        setVideoList(updated);

        startTransition(async () => {
            await updateSeasonVideo(videoId, newType);
        });
    };

    return (
        <>
            <div className="flex justify-end text-sm font-normal text-zinc-500 mb-2">
                Showing {videoList.length} Videos
            </div>

            <div className="grid grid-cols-1 gap-3">
                {videoList.length === 0 ? (
                    <div className="text-center py-12 text-zinc-500 border-2 border-dashed border-zinc-800 rounded-xl">
                        <Video className="w-8 h-8 mx-auto mb-2 opacity-20" />
                        No videos added yet.
                    </div>
                ) : (
                    videoList.map((vid, idx) => {
                        const ytid = getYoutubeId(vid.youtube_url);
                        const thumbUrl = ytid ? `https://img.youtube.com/vi/${ytid}/mqdefault.jpg` : null;
                        const typeColor = TYPE_COLORS[vid.type] || 'bg-zinc-800 text-zinc-400';

                        return (
                            <div key={vid.id} className="group flex items-start sm:items-center gap-4 p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50 transition-all">
                                {/* Thumbnail Preview */}
                                <div className="relative w-32 h-20 rounded-lg overflow-hidden bg-black flex-shrink-0 border border-zinc-800">
                                    {thumbUrl ? (
                                        <>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={thumbUrl} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center backdrop-blur-sm">
                                                    <Play className="w-3 h-3 text-white fill-white ml-0.5" />
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-700">
                                            <Video className="w-8 h-8" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0 py-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <select
                                            value={vid.type}
                                            onChange={(e) => handleTypeUpdate(vid.id, e.target.value, idx)}
                                            disabled={isPending}
                                            className={`h-6 text-[10px] font-bold px-1.5 py-0 rounded uppercase tracking-wider border-none focus:ring-0 cursor-pointer ${typeColor}`}
                                        >
                                            {VIDEO_TYPES.map(t => (
                                                <option key={t.value} value={t.value}>{t.label}</option>
                                            ))}
                                        </select>

                                        <a href={vid.youtube_url} target="_blank" rel="noreferrer" className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1">
                                            YouTube <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                    <h3 className="font-bold text-zinc-200 truncate pr-4">{vid.title}</h3>
                                    <p className="text-xs text-zinc-500 truncate font-mono mt-1">{vid.youtube_url}</p>
                                </div>

                                <div className="self-center pr-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(vid.id)}
                                        disabled={isPending}
                                        className="h-8 w-8 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        )
                    })
                )}
                {/* Infinite Scroll Trigger */}
                {
                    hasMore && (
                        <div ref={observerTarget} className="py-8 flex justify-center">
                            {isLoadingMore ? <Loader2 className="w-6 h-6 animate-spin text-zinc-500" /> : <div className="h-1" />}
                        </div>
                    )
                }
            </div >
        </>
    )
}
