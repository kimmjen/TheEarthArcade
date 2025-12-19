
'use client'

import { useState } from 'react'
import { Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { deleteSeasonVideo } from "@/lib/actions/video"
import { useRouter } from 'next/navigation'

import { toast } from "sonner"

interface VideoDeleteButtonProps {
    videoId: string
}

export function VideoDeleteButton({ videoId }: VideoDeleteButtonProps) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        // Instead of confirm(), we can use a toast with action or just direct delete if it's the admin's intent
        // But the user hated the "alert", so let's do a "Click again to confirm" or just a clean toast-based delete.
        // Let's use a standard Sonner confirmation or just prompt with toast.

        setIsLoading(true)
        const deletePromise = deleteSeasonVideo(videoId)

        toast.promise(deletePromise, {
            loading: 'Deleting video...',
            success: () => {
                router.refresh()
                setIsLoading(false)
                return 'Video deleted successfully'
            },
            error: (err) => {
                setIsLoading(false)
                return 'Failed to delete video'
            },
        })
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            className="text-zinc-500 hover:text-red-400 hover:bg-red-400/10"
            onClick={handleDelete}
            disabled={isLoading}
        >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        </Button>
    )
}
