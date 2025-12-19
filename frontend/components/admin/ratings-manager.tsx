"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Rating } from "@/types"
import { RatingsForm } from "./ratings/ratings-form"
import { RatingsList } from "./ratings/ratings-list"

interface Props {
    seasonId: string;
    ratings: Rating[];
}

export function RatingsManager({ seasonId, ratings }: Props) {
    return (
        <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-zinc-800">
                <div className="space-y-1">
                    <CardTitle className="text-xl">Episode Ratings</CardTitle>
                    <CardDescription>Manage daily viewer ratings per episode.</CardDescription>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-500 bg-zinc-950 px-3 py-1 rounded-full border border-zinc-800">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Live Data
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="rounded-md border border-zinc-800 overflow-hidden">
                    <div className="bg-zinc-950 p-3 grid grid-cols-12 text-xs font-bold text-zinc-400 uppercase gap-2">
                        <div className="col-span-1 text-center">EP</div>
                        <div className="col-span-3">Date</div>
                        <div className="col-span-2 text-center">Rating (%)</div>
                        <div className="col-span-5">Note</div>
                        <div className="col-span-1 text-center">Act</div>
                    </div>
                    <RatingsForm seasonId={seasonId} />
                    <RatingsList ratings={ratings} />
                </div>
            </CardContent>
        </Card>
    )
}
