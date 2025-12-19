
'use client'

import { CastMember } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    User,
    ArrowLeft,
    Pencil,
    Instagram,
    Calendar,
    MapPin,
    Ruler,
    Droplets,
    Zap,
    Building2,
    Users,
    Sparkles
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Props {
    agent: CastMember;
}

export function AgentPreview({ agent }: Props) {
    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Header / Actions */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/cast">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1">{agent.name}</h1>
                        <p className="text-zinc-400 text-sm">Profile Preview</p>
                    </div>
                </div>
                <Link href={`/admin/cast/${agent.id}/edit`}>
                    <Button className="bg-primary hover:bg-primary/90 text-black font-bold">
                        <Pencil className="w-4 h-4 mr-2" /> Edit Profile
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
                {/* Left: Main Photo & Quick Info */}
                <div className="space-y-6">
                    <div className="aspect-[3/4] relative bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
                        {agent.image_url ? (
                            <Image
                                src={agent.image_url}
                                alt={agent.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-800">
                                <User className="w-20 h-20" />
                            </div>
                        )}
                    </div>

                    <Card className="bg-zinc-900/50 border-zinc-800">
                        <CardContent className="p-4 space-y-4">
                            {agent.instagram && (
                                <a
                                    href={agent.instagram.startsWith('http') ? agent.instagram : `https://instagram.com/${agent.instagram.replace('@', '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 text-zinc-300 hover:text-primary transition-colors group/link"
                                >
                                    <Instagram className="w-4 h-4 group-hover/link:scale-110 transition-transform" />
                                    <span className="text-sm truncate">
                                        {agent.instagram.split('/').filter(Boolean).pop()}
                                    </span>
                                </a>
                            )}
                            <div className="flex items-center gap-3 text-zinc-300">
                                <Building2 className="w-4 h-4" />
                                <span className="text-sm">{agent.agency || 'No Agency'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-zinc-300">
                                <Users className="w-4 h-4" />
                                <span className="text-sm">{agent.group || 'Solo'}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right: Detailed Info */}
                <div className="space-y-8">
                    {/* Intro Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
                                {agent.role || 'Member'}
                            </span>
                            <span className="text-zinc-500">•</span>
                            <span className="text-zinc-300 font-medium">{agent.english_name}</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white leading-tight">
                            {agent.description || "The Earth Arcade's brilliant agent."}
                        </h2>
                        {agent.motto && (
                            <p className="text-xl text-primary/80 italic font-serif">
                                "{agent.motto}"
                            </p>
                        )}
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatItem label="Birth" value={agent.birth_date} icon={<Calendar className="w-4 h-4 text-pink-500" />} />
                        <StatItem label="Birthplace" value={agent.birthplace} icon={<MapPin className="w-4 h-4 text-blue-500" />} />
                        <StatItem label="Height" value={agent.height} icon={<Ruler className="w-4 h-4 text-green-500" />} />
                        <StatItem label="Blood Type" value={agent.blood_type} icon={<Droplets className="w-4 h-4 text-red-500" />} />
                        <StatItem label="MBTI" value={agent.mbti} icon={<Zap className="w-4 h-4 text-yellow-500" />} />
                        <StatItem label="Debut" value={agent.debut_date} icon={<Sparkles className="w-4 h-4 text-purple-500" />} />
                    </div>

                    {/* Wiki/Detailed Content */}
                    <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-8 space-y-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <span className="w-2 h-2 bg-primary rounded-full" />
                            Detailed Profile (Bio)
                        </h3>
                        {agent.detail_content ? (
                            <div className="prose prose-invert max-w-none text-zinc-400 whitespace-pre-wrap font-sans leading-relaxed">
                                {agent.detail_content}
                            </div>
                        ) : (
                            <p className="text-zinc-600 italic">No detailed content available.</p>
                        )}
                    </div>

                    {/* Gallery Preview */}
                    {agent.images && agent.images.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-white">Profile Gallery</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {agent.images.map((img) => (
                                    <div key={img.id} className="aspect-square relative rounded-xl overflow-hidden border border-zinc-800 group">
                                        <Image
                                            src={img.image_url}
                                            alt={img.caption || ''}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        {img.year && (
                                            <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded text-[10px] text-white">
                                                {img.year}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function StatItem({ label, value, icon }: { label: string, value?: string, icon: React.ReactNode }) {
    if (!value) return null;
    return (
        <Card className="bg-zinc-900/50 border-zinc-800 shadow-sm">
            <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-zinc-500">
                    {icon}
                    <span className="text-[10px] uppercase font-bold tracking-tighter">{label}</span>
                </div>
                <div className="text-sm font-semibold text-zinc-100">{value}</div>
            </CardContent>
        </Card>
    )
}
