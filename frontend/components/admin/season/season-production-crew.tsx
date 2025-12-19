"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, X } from "lucide-react"
import { Season } from "@/types"

interface Props {
    season: Season;
    directors: string[];
    setDirectors: (items: string[]) => void;
    writers: string[];
    setWriters: (items: string[]) => void;
}

// Helper Component for List Management
function ListInput({
    label,
    items,
    onChange
}: {
    label: string,
    items: string[],
    onChange: (items: string[]) => void
}) {
    const [newItem, setNewItem] = useState("");

    const handleAdd = () => {
        if (!newItem.trim()) return;

        // Split by comma, trim each, and filter out empty strings
        const newItems = newItem.split(',').map(s => s.trim()).filter(s => s.length > 0);

        if (newItems.length > 0) {
            // Add only unique items that are not already in the list
            const uniqueNewItems = newItems.filter(item => !items.includes(item));
            if (uniqueNewItems.length > 0) {
                onChange([...items, ...uniqueNewItems]);
            }
        }
        setNewItem("");
    };

    const handleRemove = (index: number) => {
        onChange(items.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <div className="flex flex-wrap gap-2 mb-2 p-3 bg-black/20 rounded-md min-h-[40px] border border-zinc-800">
                {items.length === 0 && <span className="text-sm text-zinc-600 italic">No {label.toLowerCase()} added.</span>}
                {items.map((item, idx) => (
                    <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-200 border border-zinc-700">
                        {item}
                        <button type="button" onClick={() => handleRemove(idx)} className="ml-1.5 text-zinc-400 hover:text-red-400">
                            <X className="w-3 h-3" />
                        </button>
                    </span>
                ))}
            </div>
            <div className="flex gap-2">
                <Input
                    placeholder={`Add ${label} name...`}
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAdd();
                        }
                    }}
                    className="bg-black/50 border-zinc-700 h-9"
                />
                <Button type="button" onClick={handleAdd} size="sm" variant="outline" className="h-9 border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800">
                    <Plus className="w-4 h-4 mr-2" /> ADD
                </Button>
            </div>
        </div>
    );
}

export function SeasonProductionCrew({ season, directors, setDirectors, writers, setWriters }: Props) {
    return (
        <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
                <CardTitle>Production & Crew</CardTitle>
                <CardDescription>Key people and production details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <ListInput label="Directors (PD)" items={directors} onChange={setDirectors} />
                <ListInput label="Writers" items={writers} onChange={setWriters} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                        <Label>Planning (기획)</Label>
                        <Input name="planning" defaultValue={season.planning || ''} className="bg-black/50 border-zinc-700" placeholder="e.g. CJ ENM STUDIOS" />
                    </div>
                    <div className="space-y-2">
                        <Label>Production Company (제작사)</Label>
                        <Input name="production_company" defaultValue={season.production_company || ''} className="bg-black/50 border-zinc-700" placeholder="e.g. 에그이즈커밍" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                        <Label>Channel (Main)</Label>
                        <Input name="channel" defaultValue={season.channel || ''} className="bg-black/50 border-zinc-700" placeholder="e.g. tvN" />
                    </div>
                    <div className="space-y-2">
                        <Label>Additional Channels</Label>
                        <Input name="additional_channels" defaultValue={season.additional_channels || ''} className="bg-black/50 border-zinc-700" placeholder="e.g. tvN SHOW" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                        <Label>Production Cost</Label>
                        <Input name="production_cost" defaultValue={season.production_cost || ''} className="bg-black/50 border-zinc-700" placeholder="e.g. 150억" />
                    </div>
                    <div className="space-y-2">
                        <Label>Streaming Platform</Label>
                        <Input name="streaming" defaultValue={season.streaming || ''} className="bg-black/50 border-zinc-700" placeholder="e.g. TVING" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
