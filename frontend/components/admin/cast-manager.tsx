"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "lucide-react"
import { SeasonCast } from "@/types"
import { CastCard } from "./cast/cast-card"

interface Props {
    seasonCast: SeasonCast[];
}

export function CastManager({ seasonCast }: Props) {
    return (
        <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="border-b border-zinc-800 pb-4">
                <CardTitle>Agents (Cast)</CardTitle>
                <CardDescription>Manage the lineup and character details for this season.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
                {seasonCast.length === 0 ? (
                    <div className="text-center py-12 text-zinc-500 border-2 border-dashed border-zinc-800 rounded-xl">
                        <User className="w-8 h-8 mx-auto mb-2 opacity-20" />
                        No agents assigned to this season.
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {seasonCast.map((member) => (
                            <CastCard key={member.id} member={member} />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
