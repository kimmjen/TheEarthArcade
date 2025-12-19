import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Video, TrendingUp, Image as ImageIcon, Plus } from "lucide-react";
import { Season } from "@/types";

interface Props {
    seasons: Season[];
}

export function SeasonGrid({ seasons }: Props) {
    if (!seasons) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {seasons.map((season) => (
                <div key={season.id} className="group relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all hover:shadow-2xl hover:shadow-black/50">
                    {/* Card Header with Background Tint */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-900/90 pointer-events-none"></div>

                    <div className="p-6 relative z-0">
                        <div className="flex justify-between items-start mb-4">
                            <Badge variant="outline" className="bg-zinc-950/50 backdrop-blur border-zinc-700 text-zinc-300 font-mono tracking-wider">
                                {season.slug.toUpperCase()}
                            </Badge>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                            {season.title}
                        </h3>
                        <p className="text-sm text-zinc-400 line-clamp-2 h-10 mb-6">
                            {season.subtitle || "No subtitle provided."}
                        </p>

                        <div className="grid grid-cols-3 gap-2 border-t border-zinc-800 pt-4 mb-6">
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1.5 text-zinc-500 mb-1">
                                    <Video className="w-3.5 h-3.5" />
                                </div>
                                <span className="block text-lg font-bold text-white">{season.video_count || 0}</span>
                                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Videos</span>
                            </div>
                            <div className="text-center border-l border-zinc-800">
                                <div className="flex items-center justify-center gap-1.5 text-zinc-500 mb-1">
                                    <TrendingUp className="w-3.5 h-3.5" />
                                </div>
                                <span className="block text-lg font-bold text-white">{season.rating_avg || 0}%</span>
                                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Ratings</span>
                            </div>
                            <div className="text-center border-l border-zinc-800">
                                <div className="flex items-center justify-center gap-1.5 text-zinc-500 mb-1">
                                    <ImageIcon className="w-3.5 h-3.5" />
                                </div>
                                <span className="block text-lg font-bold text-white">{typeof season.episode_count !== 'undefined' ? season.episode_count : '-'}</span>
                                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Episodes</span>
                            </div>
                        </div>

                        <Link href={`/admin/season/${season.slug}`} className="block">
                            <Button className="w-full bg-zinc-100 text-black hover:bg-white transition-colors font-bold">
                                <Edit className="w-4 h-4 mr-2" />
                                MANAGE CONTENT
                            </Button>
                        </Link>
                    </div>
                </div>
            ))}

            {/* Add New Placeholder */}
            <div className="border border-zinc-800 border-dashed rounded-xl flex flex-col items-center justify-center p-6 text-zinc-600 hover:text-zinc-500 hover:border-zinc-700 hover:bg-zinc-900/30 transition-all cursor-not-allowed min-h-[250px] group">
                <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Plus className="w-5 h-5" />
                </div>
                <p className="text-sm font-medium">Add New Season</p>
                <p className="text-xs mt-1 opacity-50 text-center px-4">Creating new seasons is currently disabled in beta.</p>
            </div>
        </div>
    )
}
