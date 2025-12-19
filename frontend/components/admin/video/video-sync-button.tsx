"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, Check, AlertCircle } from "lucide-react"
import { syncVideoStats } from "@/lib/actions/video"
import { useRouter } from "next/navigation"

export function VideoSyncButton({ videoId }: { videoId: string }) {
    const [isSyncing, setIsSyncing] = useState(false)
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const router = useRouter()

    const handleSync = async () => {
        setIsSyncing(true)
        setStatus('idle')
        try {
            const result = await syncVideoStats(videoId)
            if (result.error) {
                setStatus('error')
            } else {
                setStatus('success')
                router.refresh()
                setTimeout(() => setStatus('idle'), 2000)
            }
        } catch (e) {
            setStatus('error')
        } finally {
            setIsSyncing(false)
        }
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleSync}
            disabled={isSyncing}
            className={`w-8 h-8 p-0 ${status === 'success' ? 'text-green-500' : status === 'error' ? 'text-red-500' : 'text-zinc-400 hover:text-white'}`}
            title="Sync stats from YouTube"
        >
            {isSyncing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
            ) : status === 'success' ? (
                <Check className="w-4 h-4" />
            ) : status === 'error' ? (
                <AlertCircle className="w-4 h-4" />
            ) : (
                <RefreshCw className="w-4 h-4" />
            )}
        </Button>
    )
}
