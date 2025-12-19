"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Layers, Settings, Image as ImageIcon, Users, ChevronDown, ChevronRight, Hash, BarChart3, Database, PlaySquare, Rabbit, MapPin } from "lucide-react"
import { Season } from "@/types"

interface Props {
    seasons: Season[];
}

export function AdminSideNav({ seasons }: Props) {
    const pathname = usePathname();
    const [isSeasonsOpen, setIsSeasonsOpen] = useState(true);

    const navItems = [
        { label: 'Dashboard', href: '/admin', icon: Home },
        { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
        { label: 'Database', href: '/admin/tables', icon: Database },
        { label: 'Videos', href: '/admin/videos', icon: PlaySquare },
        { label: 'Mascots', href: '/admin/mascots', icon: Rabbit }, // Use Rabbit icon
        { label: 'Common Assets', href: '/admin/assets', icon: ImageIcon },
        { label: 'Global Cast', href: '/admin/cast', icon: Users },
        { label: 'Global Map', href: '/admin/locations', icon: MapPin },
        { label: 'Settings', href: '/admin/settings', icon: Settings },
    ];

    return (
        <aside className="w-64 border-r border-zinc-800 bg-zinc-900/30 hidden md:block flex-col overflow-y-auto">
            <nav className="p-4 space-y-6">

                {/* Main Navigation */}
                <div className="space-y-1">
                    <div className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Platform</div>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? "bg-zinc-800 text-white"
                                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                                    }`}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </Link>
                        )
                    })}
                </div>

                {/* Seasons Group */}
                <div className="space-y-1">
                    <div className="px-3 flex items-center justify-between text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 cursor-pointer hover:text-zinc-300" onClick={() => setIsSeasonsOpen(!isSeasonsOpen)}>
                        <span>Seasons Management</span>
                        {isSeasonsOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    </div>

                    {isSeasonsOpen && (
                        <div className="space-y-1">
                            {seasons.map((season) => {
                                const isActive = pathname.includes(`/admin/season/${season.slug}`);
                                return (
                                    <Link
                                        key={season.id}
                                        href={`/admin/season/${season.slug}`}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ml-2 transition-colors ${isActive
                                            ? "bg-zinc-800/50 text-primary border-r-2 border-primary"
                                            : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                                            }`}
                                    >
                                        <div className="w-4 h-4 flex items-center justify-center">
                                            <Hash className="w-3 h-3 opacity-50" />
                                        </div>
                                        {season.title}
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </div>

            </nav>
        </aside>
    )
}
