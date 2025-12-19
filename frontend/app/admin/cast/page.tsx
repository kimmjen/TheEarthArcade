import { getAllAgents } from "@/lib/api";
import { AgentManager } from "@/components/admin/cast/agent-manager";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

export default async function AdminCastPage() {
    const agents = await getAllAgents(); // Returns any[] from supabase, need to cast or ensure type

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-white">Global Agents</h1>
                    <p className="text-zinc-400">Manage the master list of all cast members.</p>
                </div>
            </div>

            <AgentManager initialAgents={agents as any[]} />
        </div>
    )
}
