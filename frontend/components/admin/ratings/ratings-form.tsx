"use client"

import { addSeasonRating } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import { useTransition, useRef } from "react"

interface Props {
    seasonId: string;
}

export function RatingsForm({ seasonId }: Props) {
    const [isPending, startTransition] = useTransition();
    const formRef = useRef<HTMLFormElement>(null);

    const handleAdd = (formData: FormData) => {
        startTransition(async () => {
            await addSeasonRating(seasonId, formData);
            formRef.current?.reset();
        });
    };

    return (
        <form ref={formRef} action={handleAdd} className="p-2 grid grid-cols-12 items-center gap-2 border-b border-zinc-800 bg-primary/5">
            <div className="col-span-1"><Input name="episode_number" required placeholder="#" className="h-8 text-center bg-black/50" /></div>
            <div className="col-span-3"><Input name="air_date" required placeholder="YYYY-MM-DD" className="h-8 bg-black/50" /></div>
            <div className="col-span-2"><Input name="rating_value" required placeholder="0.0" className="h-8 text-center bg-black/50" /></div>
            <div className="col-span-5 flex gap-2">
                <Input name="note" placeholder="Remark" className="h-8 bg-black/50" />
                <Button type="submit" size="sm" className="h-8 w-8 px-0" disabled={isPending}>
                    <Plus className="w-4 h-4" />
                </Button>
            </div>
        </form>
    )
}
