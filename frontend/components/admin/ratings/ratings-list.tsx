"use client"

import { deleteSeasonRating } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { Rating } from "@/types"
import { toast } from "sonner"
import { useTransition } from "react"

interface Props {
    ratings: Rating[];
}

export function RatingsList({ ratings }: Props) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = (ratingId: string) => {
        toast.custom((t) => (
            <div className="bg-red-950 border border-red-900 text-red-200 p-4 rounded-lg shadow-xl flex flex-col gap-3">
                <p className="font-bold">Delete this rating?</p>
                <div className="flex gap-2 justify-end">
                    <Button size="sm" variant="ghost" onClick={() => toast.dismiss(t)} className="text-red-200 hover:text-white hover:bg-red-900">Cancel</Button>
                    <Button size="sm" variant="destructive" onClick={async () => {
                        toast.dismiss(t);
                        startTransition(async () => {
                            await deleteSeasonRating(ratingId);
                            toast.success('Rating deleted');
                        });
                    }}>Delete</Button>
                </div>
            </div>
        ));
    };

    return (
        <div className="max-h-[400px] overflow-y-auto">
            {ratings.sort((a, b) => a.episode_number - b.episode_number).map((r) => (
                <div key={r.id} className="p-3 grid grid-cols-12 items-center gap-2 border-t border-zinc-800 text-sm hover:bg-white/5">
                    <div className="col-span-1 text-center font-bold text-white">{r.episode_number}</div>
                    <div className="col-span-3 text-zinc-400">{r.air_date}</div>
                    <div className="col-span-2 text-center font-mono text-green-400 font-bold">{r.rating}%</div>
                    <div className="col-span-5 text-zinc-500 truncate">{r.note}</div>
                    <div className="col-span-1 text-center">
                        <button onClick={() => handleDelete(r.id)} disabled={isPending} className="text-red-500 hover:text-red-400 transition-colors disabled:opacity-50">
                            <Trash2 className="w-4 h-4 mx-auto" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}
