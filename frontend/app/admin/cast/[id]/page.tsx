import { AgentPreview } from "@/components/admin/cast/agent-preview";
import { getAgentById } from "@/lib/api";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function AdminCastProfilePage({ params }: PageProps) {
    const { id } = await params;
    const agent = await getAgentById(id);

    if (!agent) notFound();

    return (
        <div className="container mx-auto px-6 py-12">
            <AgentPreview agent={agent} />
        </div>
    )
}
