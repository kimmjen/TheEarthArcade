"use client"

import { useState } from "react"
import { CastMember } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, User, Eye } from "lucide-react"
import { deleteAgent } from "@/lib/actions"
import { toast } from "sonner"
import Link from "next/link"

interface Props {
    initialAgents: CastMember[];
}

export function AgentManager({ initialAgents }: Props) {
    const [agents, setAgents] = useState<CastMember[]>(initialAgents);

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.preventDefault(); // Prevent link navigation
        e.stopPropagation();
        if (!confirm("Delete this agent?")) return;
        try {
            await deleteAgent(id);
            toast.success("Agent deleted");
            setAgents(agents.filter(a => a.id !== id));
        } catch (error) {
            toast.error("Failed to delete agent");
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Cast Directory</h2>
                <Link href="/admin/cast/new">
                    <Button className="bg-primary hover:bg-primary/90 text-black font-bold">
                        <Plus className="w-4 h-4 mr-2" /> Add New Agent
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {agents.map((agent) => (
                    <Link key={agent.id} href={`/admin/cast/${agent.id}`}>
                        <Card className="bg-zinc-900 border-zinc-800 overflow-hidden group cursor-pointer hover:border-primary/50 transition-colors h-full">
                            <div className="aspect-[3/4] relative bg-zinc-950">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                {agent.image_url ? (
                                    <img src={agent.image_url} alt={agent.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-700">
                                        <User className="w-12 h-12" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-white font-bold flex items-center gap-2">
                                        <Eye className="w-4 h-4" /> View Profile
                                    </span>
                                </div>
                            </div>
                            <CardHeader className="p-4">
                                <CardTitle className="flex justify-between items-start">
                                    <div>
                                        <div className="font-bold text-white">{agent.name}</div>
                                        <div className="text-xs text-zinc-400 font-normal">{agent.english_name}</div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-500 hover:text-destructive -mr-2 -mt-1 z-10" onClick={(e) => handleDelete(agent.id, e)}>
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="text-sm text-primary mb-1">{agent.role}</div>
                                <div className="text-xs text-zinc-500 line-clamp-2">{agent.description || agent.agency || agent.group}</div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
