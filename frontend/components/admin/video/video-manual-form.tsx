"use client"

import { useRef, useTransition } from "react"
import { addVideo } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Plus } from "lucide-react"
import { VIDEO_TYPES } from "@/types"
import { toast } from "sonner"

interface Props {
    seasonId: string;
}

export function VideoManualForm({ seasonId }: Props) {
    const [isPending, startTransition] = useTransition();
    const formRef = useRef<HTMLFormElement>(null);

    const handleAdd = (formData: FormData) => {
        startTransition(async () => {
            const result = await addVideo(seasonId, formData);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Video added successfully");
                formRef.current?.reset();
            }
        });
    };

    return (
        <form ref={formRef} action={handleAdd} className="space-y-4 border border-zinc-800 p-5 rounded-xl bg-zinc-950/50 opacity-60 hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Manual Add</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="space-y-1 md:col-span-2">
                    <Label className="text-xs font-bold text-zinc-500 uppercase">Title</Label>
                    <Input name="title" required placeholder="Video Title" className="bg-black/50 h-9" />
                </div>
                <div className="space-y-1">
                    <Label className="text-xs font-bold text-zinc-500 uppercase">YouTube URL</Label>
                    <Input name="url" required placeholder="https://youtu.be/..." className="bg-black/50 h-9" />
                </div>
                <div className="flex gap-2">
                    <select name="type" className="flex h-9 w-full rounded-md border border-input bg-black/50 px-3 py-1 text-sm shadow-sm transition-colors text-zinc-300 focus:border-primary focus:ring-1 focus:ring-primary">
                        {VIDEO_TYPES.map(t => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                    </select>
                    <Button type="submit" size="sm" disabled={isPending} className="h-9 px-4 bg-white/10 hover:bg-white/20 text-white">
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    </Button>
                </div>
            </div>
        </form>
    )
}
