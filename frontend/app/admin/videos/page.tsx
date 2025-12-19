
import { getAllVideos } from "@/lib/actions/video";
import { getSeasons } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { PlaySquare, ExternalLink } from "lucide-react"; // Removed RefreshCw unused import if needed
import Image from "next/image";
import Link from "next/link";
import { VideoSyncButton } from "@/components/admin/video/video-sync-button";
import { BulkSyncButton } from "@/components/admin/video/bulk-sync-button";
import { VideoDeleteButton } from "@/components/admin/video/video-delete-button";

export const revalidate = 0;

export default async function VideoManagerPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; season?: string }>;
}) {
    const params = await searchParams;
    const page = Number(params?.page) || 1;
    const seasonFilter = params?.season || 'all';
    const pageSize = 50;

    const seasons = await getSeasons();
    const { data: videos, count, error } = await getAllVideos(page, pageSize, seasonFilter);
    const totalPages = count ? Math.ceil(count / pageSize) : 1;

    return (
        <div className="h-full bg-zinc-950 text-zinc-100 flex flex-col overflow-hidden p-6">
            <div className="mb-6 flex flex-col gap-4 flex-shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <PlaySquare className="w-8 h-8 text-primary" />
                        <div>
                            <h1 className="text-2xl font-bold text-white">Video Manager</h1>
                            <p className="text-zinc-400 text-sm">
                                Manage and sync {count || 0} videos from YouTube.
                            </p>
                        </div>
                    </div>
                    <BulkSyncButton seasonId={seasonFilter} />
                </div>

                {/* Season Filter */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-zinc-900 rounded-lg p-1 border border-zinc-800">
                        <Link href={`/admin/videos?page=1&season=all`}>
                            <Button size="sm" variant={seasonFilter === 'all' ? 'secondary' : 'ghost'} className="h-7 text-xs">All</Button>
                        </Link>
                        {seasons.map(s => (
                            <Link key={s.id} href={`/admin/videos?page=1&season=${s.id}`}>
                                <Button size="sm" variant={seasonFilter === s.id ? 'secondary' : 'ghost'} className="h-7 text-xs">{s.title}</Button>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-2 rounded mb-4">
                    Error loading videos: {error instanceof Error ? error.message : JSON.stringify(error)}
                </div>
            )}
            <div className="flex-1 border border-zinc-800 rounded-lg bg-zinc-900/50 overflow-hidden flex flex-col min-h-0">
                <div className="flex-1 overflow-auto">
                    <table className="min-w-full divide-y divide-zinc-800">
                        <thead className="bg-zinc-900 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider bg-zinc-900">Video</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider bg-zinc-900">Season</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider bg-zinc-900">Stats</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider bg-zinc-900">Published</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider bg-zinc-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800 bg-zinc-950/50">
                            {videos?.map((video: any) => (
                                <tr key={video.id} className="hover:bg-zinc-900/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-24 h-14 bg-zinc-900 rounded overflow-hidden flex-shrink-0 border border-zinc-800">
                                                {video.thumbnail_url ? (
                                                    <Image
                                                        src={video.thumbnail_url}
                                                        alt={video.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-zinc-700">
                                                        <PlaySquare className="w-6 h-6" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-sm font-medium text-white truncate max-w-[300px]" title={video.title}>
                                                    {video.title}
                                                </div>
                                                <a
                                                    href={video.youtube_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-zinc-500 hover:text-primary flex items-center gap-1 mt-1"
                                                >
                                                    View on YouTube <ExternalLink className="w-3 h-3" />
                                                </a>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {video.seasons ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
                                                {video.seasons.title}
                                            </span>
                                        ) : (
                                            <span className="text-zinc-600 text-xs">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-zinc-300">
                                            {Number(video.view_count).toLocaleString()} views
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                                        {video.published_at ? new Date(video.published_at).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex items-center justify-end gap-2">
                                        <VideoSyncButton videoId={video.id} />
                                        <VideoDeleteButton videoId={video.id} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between flex-shrink-0">
                <div className="text-sm text-zinc-500">
                    Page {page} of {totalPages}
                </div>
                <div className="flex gap-2">
                    <Link href={`/admin/videos?page=${page > 1 ? page - 1 : 1}&season=${seasonFilter}`}>
                        <Button variant="outline" size="sm" disabled={page <= 1}>Previous</Button>
                    </Link>
                    <Link href={`/admin/videos?page=${page < totalPages ? page + 1 : totalPages}&season=${seasonFilter}`}>
                        <Button variant="outline" size="sm" disabled={page >= totalPages}>Next</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
