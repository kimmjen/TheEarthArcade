"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Lock } from "lucide-react"

export function Navbar() {
    const [showAdmin, setShowAdmin] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Check for Ctrl + Shift + Q (Case insensitive, supports Korean 'ㅂ')
            if (e.ctrlKey && e.shiftKey && (e.key.toLowerCase() === 'q' || e.key === 'ㅂ')) {
                e.preventDefault();
                setShowAdmin(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <nav className="fixed top-0 z-50 w-full border-b border-primary/20 bg-background/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo Area */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary animate-pulse" />
                    <span className="text-xl font-bold tracking-tighter text-foreground">
                        EARTH <span className="text-primary">ARCADE</span>
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-6">
                    <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
                        WORLDVIEW
                    </Link>
                    <Link href="/cast" className="text-sm font-medium hover:text-primary transition-colors">
                        AGENTS
                    </Link>
                    <Link href="/archive" className="text-sm font-medium hover:text-primary transition-colors">
                        ARCHIVE
                    </Link>
                    <Link href="/gallery" className="text-sm font-medium hover:text-primary transition-colors">
                        GALLERY
                    </Link>
                    {showAdmin && (
                        <Link href="/admin" className="text-sm font-bold text-red-500 hover:text-red-400 flex items-center gap-1 animate-in fade-in zoom-in">
                            <Lock className="w-3 h-3" /> ADMIN
                        </Link>
                    )}
                </div>

                {/* Action Button */}
                <div className="flex items-center gap-4">
                    <Button variant="neon" size="sm" className="hidden md:inline-flex">
                        PRESS START
                    </Button>
                    {/* Mobile Menu Trigger could go here */}
                </div>
            </div>
        </nav>
    )
}
