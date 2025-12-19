import { AdminSideNav } from "@/components/admin/admin-nav";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { getSeasons } from "@/lib/api";

export const revalidate = 0;

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const seasons = await getSeasons();

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
            {/* Shared Admin Header */}
            <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur sticky top-0 z-50 h-16 flex-shrink-0">
                <div className="w-full px-6 h-full flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/admin" className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                <span className="text-black font-bold text-lg">E</span>
                            </div>
                            <h1 className="text-lg font-bold tracking-tight text-white">
                                EARTH ARCADE <span className="text-zinc-500 font-medium ml-1">ADMIN</span>
                            </h1>
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-zinc-500 uppercase font-mono">v1.2.0-beta</span>
                        <div className="h-4 w-[1px] bg-zinc-800"></div>
                        <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                            <LogOut className="w-4 h-4 mr-2" /> Logout
                        </Button>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden w-full" suppressHydrationWarning>
                <AdminSideNav seasons={seasons} />
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}
