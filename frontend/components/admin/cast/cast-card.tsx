"use client"

import { updateSeasonCast, deleteSeasonCast } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Save, Loader2 } from "lucide-react"
import { useTransition, useState } from "react"
import { SeasonCast } from "@/types"
import { toast } from "sonner"
import { ImageUploader } from "@/components/ui/image-uploader"

export function CastCard({ member }: { member: SeasonCast }) {
    const [isPending, startTransition] = useTransition();
    const [imageUrl, setImageUrl] = useState(member.image_url || "");

    const handleUpdate = (formData: FormData) => {
        formData.set('image_url', imageUrl);

        startTransition(async () => {
            await updateSeasonCast(member.id, formData);
            toast.success("Cast member updated successfully!");
        });
    };

    const handleDelete = () => {
        toast.custom((t) => (
            <div className="bg-red-950 border border-red-900 text-red-200 p-4 rounded-lg shadow-xl flex flex-col gap-3">
                <p className="font-bold">Remove {member.cast.name}?</p>
                <div className="flex gap-2 justify-end">
                    <Button size="sm" variant="ghost" onClick={() => toast.dismiss(t)} className="text-red-200 hover:text-white hover:bg-red-900">Cancel</Button>
                    <Button size="sm" variant="destructive" onClick={async () => {
                        toast.dismiss(t);
                        await deleteSeasonCast(member.id);
                        toast.success("Member removed.");
                    }}>Delete</Button>
                </div>
            </div>
        ));
    };

    return (
        <form action={handleUpdate} className="group flex flex-col sm:flex-row gap-6 p-6 rounded-xl bg-zinc-950 border border-zinc-800/50 hover:border-zinc-700 transition-all">
            {/* Image Preview & Input */}
            <div className="flex-shrink-0 flex flex-col gap-3 items-center sm:items-start w-32">
                <div className="w-32 h-40 rounded-lg overflow-hidden bg-zinc-900 border-none shadow-md">
                    <ImageUploader
                        value={imageUrl}
                        onUpload={setImageUrl}
                        aspectRatio="portrait"
                        className="w-full h-full border-0"
                    />
                </div>
            </div>

            {/* Inputs */}
            <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-lg font-bold text-white">{member.cast.name}</h4>
                        <p className="text-xs text-zinc-500 font-mono">ID: {member.id.substring(0, 8)}...</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold ml-1">Role / Character</label>
                        <Input
                            name="role"
                            defaultValue={member.role}
                            placeholder="e.g. Earth Warrior"
                            className="bg-zinc-900/50 border-zinc-700 focus:border-zinc-500 transition-colors"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold ml-1">Catchphrase</label>
                        <Input
                            name="catchphrase"
                            defaultValue={member.catchphrase}
                            placeholder="e.g. 'Torong!'"
                            className="bg-zinc-900/50 border-zinc-700 focus:border-zinc-500 transition-colors"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="ghost" size="sm" onClick={handleDelete} disabled={isPending} className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10">
                        <Trash2 className="w-4 h-4 mr-2" /> Remove
                    </Button>
                    <Button type="submit" size="sm" disabled={isPending} className="bg-zinc-100 text-black hover:bg-white min-w-[100px]">
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        Save
                    </Button>
                </div>
            </div>
        </form>
    )
}
