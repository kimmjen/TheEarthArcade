'use client'

import { useState } from "react"
import { Episode, Game, SeasonVideo } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Plus, Save, Trash2, Gamepad2, PlaySquare, ExternalLink, Link as LinkIcon } from "lucide-react"
import { upsertEpisode, deleteEpisode, upsertGame, deleteGame } from "@/lib/actions/content"
import { toast } from "sonner"
import Image from "next/image"
import { VideoSelectorDialog } from "./video-selector-dialog"

interface EpisodeWithDetails extends Episode {
    games?: Game[];
    videos?: SeasonVideo[];
}

interface EpisodeManagerProps {
    seasonId: string;
    initialEpisodes: EpisodeWithDetails[];
}

export function EpisodeManager({ seasonId, initialEpisodes }: EpisodeManagerProps) {
    // We rely on optimistic updates or server revalidation. 
    // For simplicity, we just use the props but for better UX we might want local state or useOptimistic.
    // Given the simplicity, let's just trigger updates and wait for revalidation.

    const [isCreating, setIsCreating] = useState(false);

    // Tiny form state for new episode
    const [newEpNum, setNewEpNum] = useState("");

    const handleCreateEpisode = async () => {
        if (!newEpNum) return;
        try {
            await upsertEpisode({
                season_id: seasonId,
                episode_number: parseInt(newEpNum),
                title: `Episode ${newEpNum}`,
                description: '',
                rating: 0
            });
            toast.success("Episode created");
            setNewEpNum("");
            setIsCreating(false);
        } catch (e: any) {
            toast.error("Error creating episode: " + e.message);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Episodes & Games</h3>
                <div className="flex gap-2">
                    {isCreating ? (
                        <div className="flex items-center gap-2">
                            <Input
                                type="number"
                                placeholder="Ep #"
                                className="w-20 h-8 bg-zinc-900 border-zinc-700"
                                value={newEpNum}
                                onChange={(e) => setNewEpNum(e.target.value)}
                            />
                            <Button size="sm" onClick={handleCreateEpisode}>Save</Button>
                            <Button size="sm" variant="ghost" onClick={() => setIsCreating(false)}>Cancel</Button>
                        </div>
                    ) : (
                        <Button onClick={() => setIsCreating(true)} size="sm">
                            <Plus className="w-4 h-4 mr-2" /> Add Episode
                        </Button>
                    )}
                </div>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-2">
                {initialEpisodes.length === 0 && (
                    <div className="text-zinc-500 text-center py-8 bg-zinc-900/50 rounded-lg">
                        No episodes found. Add one to start tracking games.
                    </div>
                )}

                {initialEpisodes.map((ep) => (
                    <AccordionItem key={ep.id} value={ep.id} className="border border-zinc-800 rounded-lg px-4 bg-zinc-900/30">
                        <AccordionTrigger className="hover:no-underline py-3">
                            <div className="flex items-center gap-4 text-left">
                                <span className="bg-primary/20 text-primary px-2 py-1 rounded text-xs font-bold font-mono">
                                    EP {ep.episode_number}
                                </span>
                                <span className="text-sm font-medium text-zinc-200">
                                    {ep.title || 'Untitled'}
                                </span>
                                {ep.rating > 0 && (
                                    <span className="text-xs text-zinc-500">Rating: {ep.rating}%</span>
                                )}
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 pb-4 space-y-6">
                            {/* Episode Form */}
                            <EpisodeForm episode={ep} />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Games List */}
                                <GameList episodeId={ep.id} games={ep.games || []} />

                                {/* Videos List */}
                                <VideoList
                                    seasonId={seasonId}
                                    episodeId={ep.id}
                                    videos={ep.videos || []}
                                />
                            </div>

                            <div className="flex justify-end pt-4 border-t border-zinc-800">
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={async () => {
                                        if (confirm("Delete episode?")) {
                                            await deleteEpisode(ep.id);
                                            toast.success("Episode deleted");
                                        }
                                    }}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" /> Delete Episode
                                </Button>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}

function EpisodeForm({ episode }: { episode: Episode }) {
    const [data, setData] = useState({ ...episode });
    const [isDirty, setIsDirty] = useState(false);

    const handleChange = (field: keyof Episode, value: any) => {
        setData(prev => ({ ...prev, [field]: value }));
        setIsDirty(true);
    };

    const handleSave = async () => {
        try {
            await upsertEpisode(data);
            toast.success("Episode updated");
            setIsDirty(false);
        } catch (e: any) {
            toast.error("Update failed: " + e.message);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-xs text-zinc-500">Title</label>
                <Input
                    value={data.title || ''}
                    onChange={e => handleChange('title', e.target.value)}
                    className="bg-zinc-950 border-zinc-800"
                />
            </div>
            <div className="space-y-2">
                <label className="text-xs text-zinc-500">Air Date</label>
                <Input
                    type="date"
                    value={data.air_date || ''}
                    onChange={e => handleChange('air_date', e.target.value)}
                    className="bg-zinc-950 border-zinc-800"
                />
            </div>
            <div className="space-y-2">
                <label className="text-xs text-zinc-500">Rating (%)</label>
                <Input
                    type="number"
                    step="0.1"
                    value={data.rating || 0}
                    onChange={e => handleChange('rating', parseFloat(e.target.value))}
                    className="bg-zinc-950 border-zinc-800"
                />
            </div>
            <div className="space-y-2 md:col-span-2">
                <label className="text-xs text-zinc-500">Description</label>
                <Textarea
                    value={data.description || ''}
                    onChange={e => handleChange('description', e.target.value)}
                    className="bg-zinc-950 border-zinc-800 h-20"
                />
            </div>

            {isDirty && (
                <div className="md:col-span-2 flex justify-end">
                    <Button onClick={handleSave} size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Save className="w-4 h-4 mr-2" /> Save Changes
                    </Button>
                </div>
            )}
        </div>
    )
}

function GameList({ episodeId, games }: { episodeId: string, games: Game[] }) {
    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState("");

    const handleAddGame = async () => {
        if (!newName) return;
        try {
            await upsertGame({
                episode_id: episodeId,
                name: newName,
                type: 'Team',
                description: '',
                winner: '',
                result: ''
            });
            toast.success("Game added");
            setNewName("");
            setIsAdding(false);
        } catch (e: any) {
            toast.error("Failed to add game");
        }
    };

    return (
        <div className="bg-zinc-950/50 rounded p-4 border border-zinc-800/50">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-zinc-400 flex items-center gap-2">
                    <Gamepad2 className="w-4 h-4" /> Games Played
                </h4>
                <div className="flex gap-2">
                    {isAdding ? (
                        <div className="flex items-center gap-2">
                            <Input
                                placeholder="Game Name"
                                className="w-32 h-7 text-xs bg-zinc-900 border-zinc-700"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                            <Button size="sm" className="h-7 text-xs" onClick={handleAddGame}>Add</Button>
                            <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setIsAdding(false)}>X</Button>
                        </div>
                    ) : (
                        <Button variant="outline" size="sm" className="h-7 text-xs border-zinc-700" onClick={() => setIsAdding(true)}>
                            <Plus className="w-3 h-3 mr-1" /> Add Game
                        </Button>
                    )}
                </div>
            </div>

            <div className="space-y-3">
                {games.length === 0 && (
                    <p className="text-xs text-zinc-600 italic">No games recorded for this episode.</p>
                )}
                {games.map(game => (
                    <GameItem key={game.id} game={game} />
                ))}
            </div>
        </div>
    )
}

function GameItem({ game }: { game: Game }) {
    const [data, setData] = useState({ ...game });
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = async () => {
        try {
            await upsertGame(data);
            toast.success("Game saved");
            setIsEditing(false);
        } catch (e) {
            toast.error("Failed to save game");
        }
    };

    const handleDelete = async () => {
        if (!confirm("Delete game?")) return;
        try {
            await deleteGame(game.id);
            toast.success("Game deleted");
        } catch (e) {
            toast.error("Failed to delete game");
        }
    };

    if (!isEditing) {
        return (
            <div className="group flex items-center justify-between text-sm p-2 bg-zinc-900 rounded border border-zinc-800 hover:border-zinc-700">
                <div className="flex items-center gap-3">
                    <span className="font-medium text-zinc-300">{game.name}</span>
                    {game.winner && (
                        <span className="text-xs bg-yellow-500/10 text-yellow-500 px-1.5 py-0.5 rounded">
                            🏆 {game.winner}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setIsEditing(true)}>✎</Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-500 hover:text-red-400" onClick={handleDelete}><Trash2 className="w-3 h-3" /></Button>
                </div>
            </div>
        )
    }

    return (
        <div className="p-3 bg-zinc-900 rounded border border-zinc-700 space-y-2">
            <div className="grid grid-cols-2 gap-2">
                <Input
                    value={data.name}
                    onChange={e => setData({ ...data, name: e.target.value })}
                    placeholder="Game Name"
                    className="h-8 text-xs bg-zinc-950"
                />
                <Input
                    value={data.winner || ''}
                    onChange={e => setData({ ...data, winner: e.target.value })}
                    placeholder="Winner"
                    className="h-8 text-xs bg-zinc-950"
                />
                <Input
                    value={data.result || ''}
                    onChange={e => setData({ ...data, result: e.target.value })}
                    placeholder="Result / Prize"
                    className="h-8 text-xs bg-zinc-950 col-span-2"
                />
            </div>
            <div className="flex justify-end gap-2">
                <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)} className="h-7 text-xs">Cancel</Button>
                <Button size="sm" onClick={handleSave} className="h-7 text-xs">Save</Button>
            </div>
        </div>
    )
}
function VideoList({ seasonId, episodeId, videos }: { seasonId: string, episodeId: string, videos: SeasonVideo[] }) {
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);

    return (
        <div className="bg-zinc-950/50 rounded p-4 border border-zinc-800/50">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-zinc-400 flex items-center gap-2">
                    <PlaySquare className="w-4 h-4" /> Highlight Videos
                </h4>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs border-zinc-700 hover:bg-zinc-800"
                    onClick={() => setIsSelectorOpen(true)}
                >
                    <LinkIcon className="w-3 h-3 mr-1" /> Link Videos
                </Button>
            </div>

            <div className="space-y-3">
                {videos.length === 0 && (
                    <p className="text-xs text-zinc-600 italic">No highlight videos linked.</p>
                )}
                <div className="grid grid-cols-1 gap-2">
                    {videos.map(video => (
                        <div key={video.id} className="group flex items-center gap-3 p-2 bg-zinc-900 rounded border border-zinc-800 hover:border-zinc-700 transition-colors">
                            <div className="relative w-16 h-10 bg-zinc-800 rounded overflow-hidden flex-shrink-0">
                                {video.thumbnail_url ? (
                                    <Image
                                        src={video.thumbnail_url}
                                        alt={video.title}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <PlaySquare className="w-4 h-4 m-auto text-zinc-600" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-zinc-200 truncate" title={video.title}>
                                    {video.title}
                                </p>
                                <a
                                    href={video.youtube_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10px] text-zinc-500 hover:text-primary flex items-center gap-1 mt-0.5"
                                >
                                    YouTube <ExternalLink className="w-2 h-2" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <VideoSelectorDialog
                isOpen={isSelectorOpen}
                onClose={() => setIsSelectorOpen(false)}
                seasonId={seasonId}
                episodeId={episodeId}
                initialSelectedIds={videos.map(v => v.id)}
            />
        </div>
    )
}
