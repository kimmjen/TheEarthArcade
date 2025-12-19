"use client"

import { useState, useTransition } from "react"
import { CastMember } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUploader } from "@/components/ui/image-uploader"
import { Loader2, Save, ArrowLeft, Plus, Trash2 } from "lucide-react"
import { addAgent, updateAgent } from "@/lib/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Props {
    agent?: CastMember; // If undefined, it's new mode
}

export function AgentEditor({ agent }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [imageUrl, setImageUrl] = useState(agent?.image_url || "");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        // Ensure image_url is in formData if not handled by input
        if (imageUrl) formData.set('image_url', imageUrl);

        startTransition(async () => {
            try {
                if (agent) {
                    await updateAgent(agent.id, formData);
                    toast.success("Profile updated");
                } else {
                    await addAgent(formData);
                    toast.success("New agent created");
                    router.push('/admin/cast'); // Redirect after create
                }
            } catch (error) {
                console.error(error);
                toast.error("Failed to save profile");
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/cast">
                        <Button variant="ghost" size="icon" type="button">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1">{agent ? `Edit: ${agent.name}` : "Create New Agent"}</h1>
                        <p className="text-zinc-400 text-sm">Manage detailed profile information.</p>
                    </div>
                </div>
                <Button type="submit" disabled={isPending} className="bg-primary text-black font-bold">
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    {agent ? "Save Changes" : "Create Agent"}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
                {/* Left Column: Image & Key Info */}
                <div className="space-y-6">
                    <div className="aspect-[3/4] bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
                        <ImageUploader
                            value={imageUrl}
                            onUpload={setImageUrl}
                            aspectRatio="portrait"
                            className="w-full h-full"
                        />
                    </div>
                </div>

                {/* Right Column: Form Fields */}
                <div className="space-y-8">
                    {/* Basic Info */}
                    {/* Basic Info (Korean) */}
                    <section className="space-y-4 bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">🇰🇷 Korean Profile</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Korean Name</Label>
                                <Input name="name" defaultValue={agent?.name} className="bg-zinc-950" placeholder="e.g. 안유진" />
                            </div>
                            <div className="space-y-2">
                                <Label>Role / Occupation</Label>
                                <Input name="role" defaultValue={agent?.role} className="bg-zinc-950" placeholder="e.g. 아이돌, 예능인" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>One-line Description</Label>
                            <Input name="description" defaultValue={agent?.description} className="bg-zinc-950" placeholder="간단한 설명" />
                        </div>
                        <div className="space-y-2">
                            <Label>Motto</Label>
                            <Input name="motto" defaultValue={agent?.motto} className="bg-zinc-950" placeholder="좌우명" />
                        </div>
                    </section>

                    {/* Basic Info (English) */}
                    <section className="space-y-4 bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">🇺🇸 English Profile</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>English Name</Label>
                                <Input name="english_name" defaultValue={agent?.english_name} className="bg-zinc-950" placeholder="e.g. AN YU JIN" />
                            </div>
                            <div className="space-y-2">
                                <Label>English Role</Label>
                                <Input name="english_role" defaultValue={agent?.english_role} className="bg-zinc-950" placeholder="e.g. Idol, Comedian" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>English Description</Label>
                            <Input name="english_description" defaultValue={agent?.english_description} className="bg-zinc-950" placeholder="Brief summary in English" />
                        </div>
                        <div className="space-y-2">
                            <Label>English Motto</Label>
                            <Input name="english_motto" defaultValue={agent?.english_motto} className="bg-zinc-950" placeholder="Motto in English" />
                        </div>
                    </section>

                    {/* Common Info */}
                    <section className="space-y-4 bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
                        <h2 className="text-lg font-semibold text-white">Common Info</h2>
                        <div className="space-y-2">
                            <Label>Instagram URL</Label>
                            <Input name="instagram" defaultValue={agent?.instagram} className="bg-zinc-950" placeholder="https://instagram.com/..." />
                        </div>
                    </section>

                    {/* Detailed Stats */}
                    <section className="space-y-4 bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
                        <h2 className="text-lg font-semibold text-white">Profile Stats</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label>Birth Date</Label>
                                <Input name="birth_date" defaultValue={agent?.birth_date} className="bg-zinc-950" placeholder="YYYY-MM-DD" />
                            </div>
                            <div className="space-y-2">
                                <Label>Birthplace</Label>
                                <Input name="birthplace" defaultValue={agent?.birthplace} className="bg-zinc-950" placeholder="e.g. Daejeon" />
                            </div>
                            <div className="space-y-2">
                                <Label>Height</Label>
                                <Input name="height" defaultValue={agent?.height} className="bg-zinc-950" placeholder="173cm" />
                            </div>
                            <div className="space-y-2">
                                <Label>Blood Type</Label>
                                <Input name="blood_type" defaultValue={agent?.blood_type} className="bg-zinc-950" placeholder="A" />
                            </div>
                            <div className="space-y-2">
                                <Label>MBTI</Label>
                                <Input name="mbti" defaultValue={agent?.mbti} className="bg-zinc-950" placeholder="ISTP" />
                            </div>
                            <div className="space-y-2">
                                <Label>Agency</Label>
                                <Input name="agency" defaultValue={agent?.agency} className="bg-zinc-950" placeholder="Starship" />
                            </div>
                            <div className="space-y-2">
                                <Label>Group</Label>
                                <Input name="group" defaultValue={agent?.group} className="bg-zinc-950" placeholder="IVE" />
                            </div>
                            <div className="space-y-2">
                                <Label>Debut Date</Label>
                                <Input name="debut_date" defaultValue={agent?.debut_date} className="bg-zinc-950" placeholder="2018-10-29" />
                            </div>
                        </div>

                    </section>

                    {/* Wiki Content */}
                    <section className="space-y-4 bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
                        <h2 className="text-lg font-semibold text-white">Wiki Content (Markdown)</h2>
                        <Textarea
                            name="detail_content"
                            defaultValue={agent?.detail_content}
                            className="bg-zinc-950 font-mono min-h-[500px]"
                            placeholder="# Detailed Biography..."
                        />
                    </section>

                    {/* Image Gallery */}
                    {agent && (
                        <section className="space-y-4 bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
                            <h2 className="text-lg font-semibold text-white">Profile Gallery</h2>
                            <CastGalleryManager castId={agent.id} images={agent.images || []} />
                        </section>
                    )}
                </div>
            </div>
        </form>
    )
}

function CastGalleryManager({ castId, images }: { castId: string, images: any[] }) {
    const [localImages, setLocalImages] = useState(images);
    const [newImage, setNewImage] = useState("");
    const [caption, setCaption] = useState("");
    const [year, setYear] = useState("");
    const [isUploading, startUpload] = useTransition();

    const handleAdd = async () => {
        if (!newImage) return;
        const formData = new FormData();
        formData.append('image_url', newImage);
        formData.append('caption', caption);
        formData.append('year', year);

        startUpload(async () => {
            try {
                await import("@/lib/actions").then(mod => mod.addCastImage(castId, formData));
                toast.success("Image added");
                setNewImage("");
                setCaption("");
                setYear("");
                // Optimistic update or refresh needed. For now simple reload or we rely on revalidatePath
                window.location.reload();
            } catch (e) {
                toast.error("Failed to add image");
            }
        });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Remove image?")) return;
        try {
            await import("@/lib/actions").then(mod => mod.deleteCastImage(id));
            toast.success("Image removed");
            setLocalImages(localImages.filter(img => img.id !== id));
        } catch (e) {
            toast.error("Failed to remove image");
        }
    }

    return (
        <div className="space-y-6">
            {/* List */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {localImages.map((img) => (
                    <div key={img.id} className="relative group aspect-square bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800">
                        <img src={img.image_url} alt={img.caption} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center">
                            <span className="text-xs font-bold text-white">{img.year}</span>
                            <span className="text-xs text-zinc-300 line-clamp-2">{img.caption}</span>
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="h-6 w-6 mt-2"
                                onClick={() => handleDelete(img.id)}
                            >
                                <Trash2 className="w-3 h-3" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Form */}
            <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 space-y-4">
                <h4 className="text-sm font-semibold text-zinc-400">Add New Photo</h4>
                <div className="flex gap-4 items-start">
                    <div className="w-24">
                        <ImageUploader value={newImage} onUpload={setNewImage} aspectRatio="square" className="h-24" />
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                            <Input
                                placeholder="Year (e.g. 2021)"
                                value={year}
                                onChange={e => setYear(e.target.value)}
                                className="bg-zinc-900 border-zinc-800 h-8 text-sm"
                            />
                            <Input
                                placeholder="Caption (e.g. IZ*ONE)"
                                value={caption}
                                onChange={e => setCaption(e.target.value)}
                                className="bg-zinc-900 border-zinc-800 h-8 text-sm"
                            />
                        </div>
                        <Button
                            type="button"
                            onClick={handleAdd}
                            disabled={!newImage || isUploading}
                            className="w-full h-8 text-xs bg-zinc-800 hover:bg-zinc-700"
                        >
                            {isUploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3 mr-1" />}
                            Add Photo
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function PlusIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
    )
}
