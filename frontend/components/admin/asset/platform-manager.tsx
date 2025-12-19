"use client"

import { useState } from "react"
import { SocialPlatform } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, X, Trash2, Globe } from "lucide-react"
import { ImageUploader } from "@/components/ui/image-uploader"
import { addSocialPlatform, deleteSocialPlatform } from "@/lib/actions"
import { toast } from "sonner"

interface Props {
    platforms: SocialPlatform[];
}

export function PlatformManager({ platforms }: Props) {
    const [isPending, setIsPending] = useState(false);

    // New Platform State
    const [key, setKey] = useState("");
    const [label, setLabel] = useState("");
    const [iconUrl, setIconUrl] = useState("");

    const handleAdd = async () => {
        if (!key || !label) {
            toast.error("Key and Label are required");
            return;
        }

        setIsPending(true);
        const formData = new FormData();
        formData.append('key', key.toLowerCase().replace(/\s+/g, '_')); // Ensure key is safe
        formData.append('label', label);
        if (iconUrl) formData.append('icon_url', iconUrl);

        try {
            const result = await addSocialPlatform(formData);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Platform added successfully");
                setKey("");
                setLabel("");
                setIconUrl("");
            }
        } catch (error) {
            toast.error("Failed to add platform");
        } finally {
            setIsPending(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete platform "${name}"? Links using this might break visually.`)) return;

        try {
            await deleteSocialPlatform(id);
            toast.success("Platform deleted");
        } catch (error) {
            toast.error("Failed to delete platform");
        }
    };

    return (
        <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
                <CardTitle>Social Platforms</CardTitle>
                <CardDescription>Manage available platforms for social links.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Add New */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-black/30 rounded-lg border border-zinc-800 items-end">
                    <div className="space-y-2">
                        <Label>Key (ID)</Label>
                        <Input
                            value={key}
                            onChange={e => setKey(e.target.value)}
                            placeholder="e.g. threads"
                            className="bg-zinc-950 border-zinc-700 font-mono text-xs"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Label (Name)</Label>
                        <Input
                            value={label}
                            onChange={e => setLabel(e.target.value)}
                            placeholder="e.g. Threads"
                            className="bg-zinc-950 border-zinc-700"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Icon (Optional)</Label>
                        <div className="h-10">
                            {/* Simplified uploader for small icon */}
                            <ImageUploader
                                value={iconUrl}
                                onUpload={setIconUrl}
                                aspectRatio="square"
                                className="h-10 w-10 min-h-0"
                            />
                        </div>
                    </div>
                    <Button onClick={handleAdd} disabled={isPending} className="w-full">
                        <Plus className="w-4 h-4 mr-2" /> Add
                    </Button>
                </div>

                {/* List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {platforms.map((p) => (
                        <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg bg-zinc-950/50 border border-zinc-800 hover:border-zinc-700 transition-colors group">
                            <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 overflow-hidden">
                                {p.icon_url ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={p.icon_url} alt={p.label} className="w-full h-full object-cover" />
                                ) : (
                                    <Globe className="w-4 h-4 text-zinc-500" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm text-zinc-200">{p.label}</p>
                                <p className="text-xs text-zinc-500 font-mono">{p.key}</p>
                            </div>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDelete(p.id, p.label)}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                    {platforms.length === 0 && (
                        <div className="col-span-full py-8 text-center text-zinc-500 italic">
                            No platforms defined. Add one above.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
