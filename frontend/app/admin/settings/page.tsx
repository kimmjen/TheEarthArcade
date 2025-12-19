import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminSettingsPage() {
    return (
        <div className="container mx-auto px-6 py-12">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold text-white">System Settings</h1>
            </div>

            <div className="p-12 text-center border border-zinc-800 rounded-lg bg-zinc-900/50 text-zinc-500">
                System configuration settings will be implemented here.
            </div>
        </div>
    )
}
