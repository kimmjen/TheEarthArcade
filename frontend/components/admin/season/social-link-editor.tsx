"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Globe } from "lucide-react"
import { SocialLink, SocialPlatform } from "@/types"
import { generateId } from "@/lib/utils"

interface Props {
    links: SocialLink[];
    onChange: (links: SocialLink[]) => void;
    availablePlatforms: SocialPlatform[];
}

export function SocialLinkEditor({ links, onChange, availablePlatforms }: Props) {
    // If no platforms are defined yet, show empty message or fallback?
    // User can add them in Admin > Assets

    const handleToggle = (key: string, enabled: boolean, label: string) => {
        if (enabled) {
            // Add if not exists
            if (!links.find(l => l.type === key)) {
                onChange([...links, {
                    id: generateId(),
                    type: key,
                    label: label,
                    url: ''
                }]);
            }
        } else {
            // Remove
            onChange(links.filter(l => l.type !== key));
        }
    };

    const handleUrlChange = (type: string, url: string) => {
        onChange(links.map(l => l.type === type ? { ...l, url } : l));
    };

    if (!availablePlatforms || availablePlatforms.length === 0) {
        return (
            <div className="space-y-4">
                <Label className="text-base text-white">Social & Official Links</Label>
                <div className="p-4 border border-zinc-800 rounded-lg text-sm text-zinc-500 bg-zinc-950/50">
                    No social platforms configured. Go to <strong>Assets &gt; Global Assets</strong> to add them.
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <Label className="text-base text-white">Social & Official Links</Label>
            <div className="grid grid-cols-1 gap-4">
                {availablePlatforms.map((platform) => {
                    const existingLink = links.find(l => l.type === platform.key);
                    const isEnabled = !!existingLink;

                    return (
                        <div key={platform.id} className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${isEnabled ? 'bg-zinc-900/50 border-zinc-700' : 'bg-zinc-900/20 border-zinc-800 opacity-70'}`}>
                            <div className="mt-1">
                                <Switch
                                    checked={isEnabled}
                                    onCheckedChange={(checked) => handleToggle(platform.key, checked, platform.label)}
                                />
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center bg-zinc-800">
                                        {platform.icon_url ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={platform.icon_url} alt={platform.label} className="w-full h-full object-cover" />
                                        ) : (
                                            <Globe className="w-3 h-3 text-zinc-400" />
                                        )}
                                    </div>
                                    <span className="font-medium text-sm text-zinc-200">{platform.label}</span>
                                </div>
                                {isEnabled && (
                                    <Input
                                        placeholder={`https://...`}
                                        value={existingLink.url}
                                        onChange={(e) => handleUrlChange(platform.key, e.target.value)}
                                        className="bg-black/40 border-zinc-700 h-9 text-sm"
                                    />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
