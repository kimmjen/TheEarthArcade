"use client"

import { useState } from "react"
import { SeasonImage } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, X, Trash2, Image as ImageIcon } from "lucide-react"
import { ImageUploader } from "@/components/ui/image-uploader"
import { addSeasonImage, deleteSeasonImage } from "@/lib/actions"
import { toast } from "sonner"

interface Props {
    seasonId: string;
    initialImages: SeasonImage[];
}

export function GalleryManager({ seasonId, initialImages = [] }: Props) {
    const [images, setImages] = useState<SeasonImage[]>(initialImages || []);
    const [newImageUrl, setNewImageUrl] = useState("");
    const [newCaption, setNewCaption] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    const handleAdd = async () => {
        if (!newImageUrl) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('url', newImageUrl);
        formData.append('caption', newCaption);

        try {
            await addSeasonImage(seasonId, formData);
            toast.success("Image added to gallery");
            // Optimistic update (real ID will come from refresh, but for now random)
            setImages([...images, {
                id: Math.random().toString(),
                season_id: seasonId,
                url: newImageUrl,
                caption: newCaption,
                sort_order: images.length
            }]);
            setNewImageUrl("");
            setNewCaption("");
        } catch (error) {
            toast.error("Failed to add image");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id: string, index: number) => {
        if (!confirm("Delete this image?")) return;

        try {
            await deleteSeasonImage(id);
            toast.success("Image deleted");
            setImages(images.filter((_, i) => i !== index));
        } catch (error) {
            toast.error("Failed to delete image");
        }
    };

    return (
        <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
                <CardTitle>Photo Gallery</CardTitle>
                <CardDescription>Manage behind-the-scenes and still cut images.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Add New */}
                <div className="flex gap-4 p-4 bg-black/30 rounded-lg border border-zinc-800">
                    <div className="w-32 h-32 flex-shrink-0">
                        <ImageUploader
                            value={newImageUrl}
                            onUpload={setNewImageUrl}
                            aspectRatio="square"
                        />
                    </div>
                    <div className="flex-1 space-y-4">
                        <div className="space-y-2">
                            <Label>Caption (Optional)</Label>
                            <Input
                                placeholder="e.g. Day 1 in Chiang Mai"
                                value={newCaption}
                                onChange={(e) => setNewCaption(e.target.value)}
                                className="bg-zinc-950 border-zinc-700"
                            />
                        </div>
                        <Button onClick={handleAdd} disabled={!newImageUrl || isUploading} className="w-full">
                            <Plus className="w-4 h-4 mr-2" />
                            {isUploading ? "Adding..." : "Add to Gallery"}
                        </Button>
                    </div>
                </div>

                {/* Grid */}
                {images.length === 0 ? (
                    <div className="text-center py-12 text-zinc-500 bg-zinc-950/50 rounded-lg border border-zinc-800 border-dashed">
                        <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No images in gallery yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {images.map((img, idx) => (
                            <div key={img.id || idx} className="group relative aspect-square rounded-lg overflow-hidden bg-black border border-zinc-800">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={img.url} alt={img.caption || "Gallery Image"} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleDelete(img.id, idx)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                    {/* Sort handlers could go here */}
                                </div>
                                {img.caption && (
                                    <div className="absolute bottom-0 inset-x-0 bg-black/60 p-2 text-xs truncate">
                                        {img.caption}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
