"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface RatingData {
    episode_number: number;
    rating: number;
    season: {
        id: string;
        slug: string;
        title: string;
        color_theme: string;
    }
}

interface Props {
    ratings: any[]; // Using any to avoid complex joined type issues for now, or define strict type
}

export function RatingsChart({ ratings }: Props) {
    // Transform data for Recharts
    // Structure: { episode: 1, s1: 2.5, s2: 3.8, ... }
    const { chartData, seasons } = useMemo(() => {
        const seasonMap = new Map<string, { slug: string, title: string, color: string }>();
        const episodeMap = new Map<number, any>();

        ratings.forEach((r: RatingData) => {
            // Extract Season Info
            if (!seasonMap.has(r.season.slug)) {
                // Extract color from Tailwind class (e.g., "from-pink-500 to-rose-500")
                // We'll take the first color, or map it to a hex code.
                // Simple mapping for now based on known slugs
                let color = "#8884d8";
                if (r.season.slug === 's1') color = "#ec4899"; // pink-500
                if (r.season.slug === 's2') color = "#06b6d4"; // cyan-500
                if (r.season.slug === 's3') color = "#8b5cf6"; // violet-500
                if (r.season.slug === 'spin-off') color = "#eab308"; // yellow-500

                seasonMap.set(r.season.slug, {
                    slug: r.season.slug,
                    title: r.season.title,
                    color
                });
            }

            // Group by Episode
            const ep = r.episode_number;
            const existing = episodeMap.get(ep) || { episode: ep };
            existing[r.season.slug] = r.rating;
            episodeMap.set(ep, existing);
        });

        const data = Array.from(episodeMap.values()).sort((a, b) => a.episode - b.episode);
        return { chartData: data, seasons: Array.from(seasonMap.values()) };
    }, [ratings]);

    return (
        <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
                <CardTitle className="text-white">Season View Ratings</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="episode" stroke="#888" />
                            <YAxis stroke="#888" domain={[0, 'auto']} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Legend />
                            {seasons.map((s) => (
                                <Line
                                    key={s.slug}
                                    type="monotone"
                                    dataKey={s.slug}
                                    name={s.title}
                                    stroke={s.color}
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
