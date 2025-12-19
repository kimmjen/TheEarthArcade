import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PlatformManager } from "@/components/admin/asset/platform-manager";
import { getSocialPlatforms } from "@/lib/api";

export default async function AdminAssetsPage() {
    // Fetch platforms dynamically
    const platforms = await getSocialPlatforms();

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-white">Global Assets</h1>
                    <p className="text-zinc-400">Manage shared resources and configuration.</p>
                </div>
            </div>

            <div className="space-y-8">
                <PlatformManager platforms={platforms} />

                {/* Future global assets can go here */}
            </div>
        </div>
    )
}
