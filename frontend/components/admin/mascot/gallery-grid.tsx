'use client'

import Image from "next/image"
import { MascotGalleryImage } from "@/types"
import { ImageUploader } from "@/components/ui/image-uploader"
import { uploadMascotGalleryImage, deleteMascotGalleryImage } from "@/lib/actions/mascot-gallery"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"

interface GalleryGridProps {
    images: MascotGalleryImage[];
}

export function GalleryGrid({ images }: GalleryGridProps) {
    const handleUpload = async (url: string) => {
        try {
            await uploadMascotGalleryImage(url);
            toast.success("Image uploaded to gallery");
        } catch (e: any) {
            toast.error("Failed to upload image: " + e.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this image?")) return;
        try {
            await deleteMascotGalleryImage(id);
            toast.success("Image deleted from gallery");
        } catch (e: any) {
            toast.error("Failed to delete image: " + e.message);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-lg font-bold text-white">Asset Library</h2>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <ImageUploader
                    onUpload={handleUpload}
                    aspectRatio="square"
                    bucketName="earth-arcade-assets"
                    folderPath="mascots/gallery"
                />
                <p className="text-xs text-zinc-500 mt-2 text-center">
                    Upload new gallery images here. They will appear below.
                </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((img) => (
                    <div key={img.id} className="group relative aspect-square bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
                        <Image
                            src={img.image_url}
                            alt="Mascot Gallery Image"
                            fill
                            sizes="(max-width: 768px) 50vw, 33vw"
                            className="object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center gap-2">
                            <button
                                onClick={() => handleDelete(img.id)}
                                className="bg-red-500/10 hover:bg-red-500/20 text-red-500 p-2 rounded-full transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="bg-zinc-800/80 px-2 py-1 rounded text-[10px] text-zinc-400 break-all max-w-[90%] truncate">
                                {img.image_url.split('/').pop()}
                            </div>
                        </div>
                    </div>
                ))}
                {images.length === 0 && (
                    <div className="col-span-full py-10 text-center text-zinc-500 text-sm">
                        No images found in gallery.
                    </div>
                )}
            </div>
        </div>
    )
}
