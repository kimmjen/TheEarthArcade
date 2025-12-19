"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, Check } from "lucide-react"
import { syncAllVideos } from "@/lib/actions/video"
import { useRouter } from "next/navigation"

export function BulkSyncButton({ seasonId }: { seasonId?: string }) {
    const [isSyncing, setIsSyncing] = useState(false)
    const [count, setCount] = useState<number | null>(null)
    const router = useRouter()

    const handleSync = async () => {
        setIsSyncing(true)
        try {
            const result = await syncAllVideos(seasonId)
            if (result.success) {
                setCount(result.count || 0)
                router.refresh()
                setTimeout(() => setCount(null), 3000)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsSyncing(false)
        }
    }

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleSync}
            disabled={isSyncing}
            className="gap-2"
        >
            {isSyncing ? (
                <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Syncing...
                </>
            ) : count !== null ? (
                <>
                    <Check className="w-4 h-4 text-green-500" />
                    Updated {count}
                </>
            ) : (
                <>
                    <RefreshCw className="w-4 h-4" />
                    Sync Batch (20)
                </>
            )}
        </Button>
    )
}
