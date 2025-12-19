import { getSeasons, getDashboardStats } from "@/lib/api";
import { AdminStats } from "@/components/admin/dashboard/admin-stats";
import { SeasonGrid } from "@/components/admin/dashboard/season-grid";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import Link from "next/link";

export const revalidate = 0; // Always fresh for admin

export default async function AdminDashboard() {
    const seasons = await getSeasons();
    const stats = await getDashboardStats();

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100">


            <main className="container mx-auto px-6 py-12 space-y-12">
                {/* Stats */}
                <AdminStats
                    seasonCount={seasons.length}
                    videoCount={stats.videoCount}
                    castCount={stats.castCount}
                    galleryCount={stats.galleryCount}
                />

                {/* Seasons */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-1">Season Management</h2>
                            <p className="text-zinc-400 text-sm">Manage content for each season.</p>
                        </div>
                    </div>
                    <SeasonGrid seasons={seasons} />
                </section>

                {/* Global Assets & Pages */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-1">Global & Page Management</h2>
                            <p className="text-zinc-400 text-sm">Common assets and standalone pages.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Analytics Card */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
                            <h3 className="font-bold text-white mb-2">Analytics</h3>
                            <p className="text-sm text-zinc-400 mb-4">View detailed ratings and performance metrics.</p>
                            <Link href="/admin/analytics">
                                <Button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white">View Analytics</Button>
                            </Link>
                        </div>

                        {/* Common Assets Card */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
                            <h3 className="font-bold text-white mb-2">Common Assets</h3>
                            <p className="text-sm text-zinc-400 mb-4">Manage shared logos (TVING, Youtube) and icons.</p>
                            <div className="flex gap-2">
                                <div className="px-2 py-1 bg-zinc-950 rounded text-xs text-zinc-500 border border-zinc-800">tving.svg</div>
                                <div className="px-2 py-1 bg-zinc-950 rounded text-xs text-zinc-500 border border-zinc-800">youtube.svg</div>
                            </div>
                        </div>

                        {/* Main Page Card */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
                            <h3 className="font-bold text-white mb-2">Main Page</h3>
                            <p className="text-sm text-zinc-400 mb-4">Configure banners, intro text, and active season highlight.</p>
                            <Button variant="outline" size="sm" className="w-full" disabled>Coming Soon</Button>
                        </div>

                        {/* Mascot Page Card */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
                            <h3 className="font-bold text-white mb-2">Torong's Page</h3>
                            <p className="text-sm text-zinc-400 mb-4">Manage Torong's profile and catch history.</p>
                            <Button variant="outline" size="sm" className="w-full" disabled>Coming Soon</Button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
