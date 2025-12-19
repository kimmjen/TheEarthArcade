"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select } from "@/components/ui/select"
import { updateSeasonMascot } from "@/lib/actions/mascot"
import { toast } from "sonner"
import { Loader2, Save, Rabbit } from "lucide-react"
import Image from "next/image"
import { ImageUploader } from "@/components/ui/image-uploader"

interface MascotData {
    id?: string;
    status: string;
    description: string;
    image_url: string;
}

interface Props {
    seasonId: string;
    // Fix: AssetManager passes 'initialMascot' but some versions might pass 'initialData'. 
    // Adapting to what AssetManager seemingly uses or enforcing this prop name.
    // AssetManager passes: <MascotManager seasonId={season.id} initialMascot={mascot} />
    initialMascot: MascotData | null;
}

export function MascotManager({ seasonId, initialMascot }: Props) {
    const [isPending, startTransition] = useTransition();

    // Default Torong Image
    const DEFAULT_TORONG = "https://gzrehbcwsykaaftovrbl.supabase.co/storage/v1/object/public/earth-arcade-assets/mascots/torong_default.png";

    const [status, setStatus] = useState(initialMascot?.status || 'Escaped');
    const [description, setDescription] = useState(initialMascot?.description || '');
    const [imageUrl, setImageUrl] = useState(initialMascot?.image_url || '');

    const handleSave = () => {
        startTransition(async () => {
            try {
                await updateSeasonMascot(seasonId, status, description, imageUrl);
                toast.success("Mascot status updated!");
            } catch (e: any) {
                toast.error(e.message || "Failed to update mascot");
            }
        });
    };

    return (
        <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Rabbit className="w-6 h-6 text-primary" />
                    <CardTitle>Torong Status</CardTitle>
                </div>
                <CardDescription>
                    Manage Torong's status and appearance for this season.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Visual Preview & Upload */}
                    <div className="w-full md:w-1/3 space-y-4">
                        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                            <Label className="mb-2 block">Season Mascot Image</Label>
                            <ImageUploader
                                value={imageUrl}
                                onUpload={(url) => setImageUrl(url)}
                                aspectRatio="portrait"
                            />
                            <p className="text-xs text-zinc-500 mt-2">
                                Upload a custom image (e.g. Wanted Poster, Costume). If empty, the default Torong image will be used.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label>Image URL (Direct Input)</Label>
                            <Input
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="https://..."
                                className="bg-zinc-950 border-zinc-800 font-mono text-xs"
                            />
                        </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex-1 space-y-6">
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="bg-zinc-950 border-zinc-800"
                            >
                                <option value="Escaped">🐰 Escaped (도주 중)</option>
                                <option value="Caught">🚔 Caught (검거 완료)</option>
                                <option value="Unknown">❓ Unknown (행방불명)</option>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Active Description</Label>
                            <Textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe Torong's activities this season..."
                                className="h-32 bg-zinc-950 border-zinc-800 resize-none"
                            />
                            <p className="text-xs text-zinc-500">
                                This text will be displayed on the Season Detail page.
                            </p>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button onClick={handleSave} disabled={isPending}>
                                {isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Update Status
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
