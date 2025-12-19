"use client"

import { useState, useRef, useTransition } from "react"
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { uploadImage } from "@/lib/actions"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface ImageUploaderProps {
    value?: string;
    onUpload: (url: string) => void;
    className?: string;
    aspectRatio?: "square" | "video" | "portrait";
}

export function ImageUploader({ value, onUpload, className, aspectRatio = "square" }: ImageUploaderProps) {
    const [preview, setPreview] = useState(value || "");
    const [isDragging, setIsDragging] = useState(false);
    const [isPending, startTransition] = useTransition();
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file.");
            return;
        }

        // Optimistic preview (optional, but safer to wait for server url for consistency)
        // const objectUrl = URL.createObjectURL(file);
        // setPreview(objectUrl);

        const formData = new FormData();
        formData.append("file", file);

        startTransition(async () => {
            const result = await uploadImage(formData);
            if (result.error || !result.url) {
                toast.error("Upload failed.");
                return;
            }
            setPreview(result.url);
            onUpload(result.url);
            toast.success("Image uploaded!");
        });
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files?.[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const aspectClass = aspectRatio === "square" ? "aspect-square"
        : aspectRatio === "video" ? "aspect-video"
            : "aspect-[2/3]";

    return (
        <div
            className={cn(
                "relative rounded-lg border-2 border-dashed transition-all overflow-hidden group",
                isDragging ? "border-primary bg-primary/10" : "border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900",
                aspectClass,
                className
            )}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
        >
            <input
                type="file"
                ref={inputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />

            {isPending && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            )}

            {preview ? (
                <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => inputRef.current?.click()}
                        >
                            <Upload className="w-4 h-4 mr-2" /> Change
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="h-9 w-9"
                            onClick={(e) => {
                                e.stopPropagation();
                                setPreview("");
                                onUpload("");
                            }}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </>
            ) : (
                <div
                    className="flex flex-col items-center justify-center h-full w-full cursor-pointer p-4 text-center"
                    onClick={() => inputRef.current?.click()}
                >
                    <div className={cn("p-3 rounded-full bg-zinc-800 mb-3 group-hover:bg-zinc-700 transition-colors", isDragging && "bg-primary/20 text-primary")}>
                        <Upload className="w-6 h-6 text-zinc-400 group-hover:text-zinc-200" />
                    </div>
                    <p className="text-sm font-bold text-zinc-300">
                        {isDragging ? "Drop to upload" : "Click or Drag Image"}
                    </p>
                    <p className="text-[10px] text-zinc-500 mt-1">
                        Supports: JPG, PNG, WEBP
                    </p>
                </div>
            )}
        </div>
    );
}
