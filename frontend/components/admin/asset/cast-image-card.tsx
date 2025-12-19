"use client"

import { updateSeasonCast } from "@/lib/actions"
import { ImageUploader } from "@/components/ui/image-uploader"
import { useTransition } from "react"
import { SeasonCast } from "@/types"
import { toast } from "sonner"

export function CastImageCard({ member }: { member: SeasonCast }) {
    const [isPending, startTransition] = useTransition();

    const handleUpload = (url: string) => {
        startTransition(async () => {
            const formData = new FormData();
            formData.append('role', member.role || '');
            formData.append('catchphrase', member.catchphrase || '');
            formData.append('image_url', url);

            await updateSeasonCast(member.id, formData);
            toast.success(`${member.cast.name} image updated!`);
        });
    };

    return (
        <div className="relative group bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800 transition-all hover:border-zinc-600">
            <div className="border-b border-zinc-800">
                <ImageUploader
                    value={member.image_url}
                    onUpload={handleUpload}
                    aspectRatio="portrait"
                    className="border-0 rounded-none bg-zinc-900"
                />
            </div>

            <div className="p-3 text-center">
                <h4 className="text-sm font-bold text-white truncate">{member.cast.name}</h4>
                <p className="text-[10px] text-zinc-500 truncate">{member.role || 'No Role'}</p>
            </div>
        </div>
    )
}
