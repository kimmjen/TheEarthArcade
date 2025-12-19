"use client"

import { Season } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Rabbit } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Props {
    season: Season;
    mascot: any; // SeasonMascot type
}

export function MascotStatusRow({ season, mascot }: Props) {
    const statusColor =
        mascot?.status === 'Caught' ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' :
            mascot?.status === 'Escaped' ? 'bg-red-500/20 text-red-400 border-red-500/50' :
                'bg-zinc-800 text-zinc-400';

    return (
        <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
            <CardContent className="p-0 flex items-center">
                {/* Image Preview */}
                <div className="w-24 h-24 relative bg-zinc-950 border-r border-zinc-800 flex-shrink-0">
                    {mascot?.image_url ? (
                        <Image src={mascot.image_url} alt="Mascot" fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-700">
                            <Rabbit className="w-8 h-8 opacity-20" />
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-white text-lg">{season.title}</h3>
                        <Badge variant="outline" className={statusColor}>
                            {mascot?.status || 'Unknown'}
                        </Badge>
                    </div>
                    <p className="text-sm text-zinc-400 line-clamp-2">
                        {mascot?.description || "No description provided."}
                    </p>
                </div>

                {/* Action */}
                <div className="p-4 border-l border-zinc-800">
                    <Link href={`/admin/season/${season.slug}?view=assets`}>
                        <Button variant="ghost" size="sm" className="gap-2">
                            Manage
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}
