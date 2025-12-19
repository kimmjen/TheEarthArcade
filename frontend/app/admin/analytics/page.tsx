import { getDashboardStats } from "@/lib/api";
import { RatingsChart } from "@/components/admin/dashboard/ratings-chart";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

export default async function AnalyticsPage() {
    const stats = await getDashboardStats();

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
            <main className="container mx-auto px-6 py-12 space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/admin">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-5 h-5 text-zinc-400" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Analytics</h1>
                        <p className="text-zinc-400">Deep dive into content performance.</p>
                    </div>
                </div>

                {/* Ratings Section */}
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-white">View Ratings Analysis</h2>
                    <RatingsChart ratings={stats.ratings} />
                </section>
            </main>
        </div>
    );
}
