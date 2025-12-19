"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageUploader } from "@/components/ui/image-uploader"
import { Plus, X, Tv } from "lucide-react"
import { StreamingPlatform } from "@/types"

function generateId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

interface Props {
    platforms: StreamingPlatform[];
    onChange: (platforms: StreamingPlatform[]) => void;
}

export function StreamingPlatformManager({ platforms, onChange }: Props) {
    const [newName, setNewName] = useState("");
    const [newUrl, setNewUrl] = useState("");
    const [newIconUrl, setNewIconUrl] = useState("");

    const handleAdd = () => {
        if (!newName || !newIconUrl) return;
        const newItem: StreamingPlatform = {
            id: generateId(),
            name: newName,
            icon_url: newIconUrl,
            url: newUrl
        };
        onChange([...platforms, newItem]);
        setNewName("");
        setNewUrl("");
        setNewIconUrl("");
    };

    const handleRemove = (id: string) => {
        onChange(platforms.filter(p => p.id !== id));
    };

    return (
        <div className="space-y-4 pt-4 border-t border-zinc-800">
            <Label className="text-base text-white">Streaming Platforms (OTT)</Label>

            {/* List */}
            <div className="grid grid-cols-2 gap-3">
                {platforms.map((p) => (
                    <div key={p.id} className="relative flex items-center gap-3 bg-zinc-950 p-2 pr-8 rounded-md border border-zinc-800/50">
                        <div className="w-8 h-8 rounded bg-zinc-900 overflow-hidden flex-shrink-0 border border-zinc-800">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p.icon_url} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-zinc-300">{p.name}</p>
                            <a href={p.url} target="_blank" rel="noreferrer" className="text-[10px] text-zinc-500 truncate hover:text-zinc-300 block">
                                {p.url || 'No URL'}
                            </a>
                        </div>
                        <button type="button" onClick={() => handleRemove(p.id)} className="absolute top-2 right-2 hover:text-red-400 text-zinc-500 transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
            {platforms.length === 0 && <p className="text-xs text-zinc-500 italic">No platforms added.</p>}

            {/* Add New */}
            <div className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-800 space-y-3">
                <div className="flex gap-4">
                    <div className="w-20 flex-shrink-0">
                        <Label className="text-[10px] uppercase text-zinc-500 mb-1 block">Logo</Label>
                        <div className="w-20 h-20">
                            <ImageUploader
                                value={newIconUrl}
                                onUpload={setNewIconUrl}
                                aspectRatio="square"
                                className="w-full h-full"
                            />
                        </div>
                    </div>
                    <div className="flex-1 space-y-2">
                        <div>
                            <Label className="text-[10px] uppercase text-zinc-500">Service Name</Label>
                            <Input
                                placeholder="e.g. TVING"
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                className="h-8 bg-zinc-950 border-zinc-700 text-xs"
                            />
                        </div>
                        <div>
                            <Label className="text-[10px] uppercase text-zinc-500">Link URL</Label>
                            <Input
                                placeholder="https://..."
                                value={newUrl}
                                onChange={e => setNewUrl(e.target.value)}
                                className="h-8 bg-zinc-950 border-zinc-700 text-xs"
                            />
                        </div>
                        <Button type="button" size="sm" onClick={handleAdd} disabled={!newName || !newIconUrl} className="w-full h-8 mt-1">
                            <Plus className="w-4 h-4 mr-2" /> Add Platform
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
