'use client'

import { useState } from "react"
import { Location } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Save, Trash2, MapPin } from "lucide-react"
import { upsertLocation, deleteLocation } from "@/lib/actions/location"
import { toast } from "sonner"

interface LocationManagerProps {
    seasonId: string;
    initialLocations: Location[];
}

export function LocationManager({ seasonId, initialLocations }: LocationManagerProps) {
    const [isCreating, setIsCreating] = useState(false);
    const [newName, setNewName] = useState("");

    const handleCreate = async () => {
        if (!newName) return;
        try {
            await upsertLocation({
                season_id: seasonId,
                name: newName,
                description: '',
                category: 'Attraction',
                address: ''
            });
            toast.success("Location added");
            setNewName("");
            setIsCreating(false);
        } catch (e: any) {
            toast.error("Failed to add location: " + e.message);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" /> Locations
                </h3>
                <div className="flex gap-2">
                    {isCreating ? (
                        <div className="flex items-center gap-2">
                            <Input
                                placeholder="Location Name"
                                className="w-40 h-9 bg-zinc-900 border-zinc-700"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                            <Button size="sm" onClick={handleCreate}>Add</Button>
                            <Button size="sm" variant="ghost" onClick={() => setIsCreating(false)}>Cancel</Button>
                        </div>
                    ) : (
                        <Button onClick={() => setIsCreating(true)} size="sm">
                            <Plus className="w-4 h-4 mr-2" /> Add Location
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {initialLocations.length === 0 && (
                    <div className="col-span-full text-zinc-500 text-center py-8 bg-zinc-900/50 rounded-lg">
                        No locations added yet.
                    </div>
                )}
                {initialLocations.map(loc => (
                    <LocationCard key={loc.id} location={loc} />
                ))}
            </div>
        </div>
    )
}

function LocationCard({ location }: { location: Location }) {
    const [data, setData] = useState({ ...location });
    const [isEditing, setIsEditing] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    const handleChange = (field: keyof Location, value: string) => {
        setData(prev => ({ ...prev, [field]: value }));
        setIsDirty(true);
    };

    const handleSave = async () => {
        try {
            await upsertLocation(data);
            toast.success("Location saved");
            setIsEditing(false);
            setIsDirty(false);
        } catch (e: any) {
            toast.error("Failed to save: " + e.message);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Delete location?")) return;
        try {
            await deleteLocation(location.id);
            toast.success("Location deleted");
        } catch (e: any) {
            toast.error("Failed to delete: " + e.message);
        }
    };

    if (!isEditing) {
        return (
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-2 group hover:border-zinc-700 transition-colors">
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="font-bold text-zinc-200">{location.name}</h4>
                        <span className="text-xs bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">
                            {location.category}
                        </span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsEditing(true)}>✎</Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:text-red-400" onClick={handleDelete}><Trash2 className="w-3 h-3" /></Button>
                    </div>
                </div>
                {location.address && (
                    <p className="text-xs text-zinc-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {location.address}
                    </p>
                )}
                {location.description && (
                    <p className="text-xs text-zinc-400 line-clamp-2">{location.description}</p>
                )}
            </div>
        )
    }

    return (
        <div className="bg-zinc-900 border border-primary/50 rounded-lg p-4 space-y-3">
            <Input
                value={data.name}
                onChange={e => handleChange('name', e.target.value)}
                placeholder="Name"
                className="h-8 bg-zinc-950"
            />
            <div className="flex gap-2">
                <Input
                    value={data.category || ''}
                    onChange={e => handleChange('category', e.target.value)}
                    placeholder="Category (e.g. Restaurant)"
                    className="h-8 bg-zinc-950 flex-1"
                />
            </div>
            <Input
                value={data.address || ''}
                onChange={e => handleChange('address', e.target.value)}
                placeholder="Address"
                className="h-8 bg-zinc-950"
            />
            <Textarea
                value={data.description || ''}
                onChange={e => handleChange('description', e.target.value)}
                placeholder="Description..."
                className="bg-zinc-950 h-20 text-xs"
            />

            <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 uppercase font-semibold">Latitude</label>
                    <Input
                        type="number"
                        step="0.000001"
                        value={data.latitude || ''}
                        onChange={e => handleChange('latitude', e.target.value as any)}
                        placeholder="37.5665"
                        className="h-8 bg-zinc-950 font-mono text-xs"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 uppercase font-semibold">Longitude</label>
                    <Input
                        type="number"
                        step="0.000001"
                        value={data.longitude || ''}
                        onChange={e => handleChange('longitude', e.target.value as any)}
                        placeholder="126.9780"
                        className="h-8 bg-zinc-950 font-mono text-xs"
                    />
                </div>
            </div>

            <div className="flex justify-end gap-2">
                <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button size="sm" onClick={handleSave}>Save</Button>
            </div>
        </div>
    )
}
