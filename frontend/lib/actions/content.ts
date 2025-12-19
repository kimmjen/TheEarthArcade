'use server'

import { revalidatePath } from "next/cache"
import { actionClient as supabase } from "./client"
import { Episode, Game } from "@/types"

// --- EPISODES ---

export async function upsertEpisode(episode: Partial<Episode>) {
    const { error } = await supabase
        .from('episodes')
        .upsert(episode)
        .select()
        .single();

    if (error) throw new Error(error.message);

    revalidatePath('/admin/season/[slug]', 'page');
}

export async function deleteEpisode(id: string) {
    const { error } = await supabase
        .from('episodes')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);

    revalidatePath('/admin/season/[slug]', 'page');
}


// --- GAMES ---

export async function upsertGame(game: Partial<Game>) {
    const { error } = await supabase
        .from('games')
        .upsert(game)
        .select()
        .single();

    if (error) throw new Error(error.message);

    revalidatePath('/admin/season/[slug]', 'page');
}

export async function deleteGame(id: string) {
    const { error } = await supabase
        .from('games')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);

    revalidatePath('/admin/season/[slug]', 'page');
}
// --- VIDEOS ---

/**
 * Links multiple videos to an episode.
 * Updates the episode_id for the given video IDs.
 */
export async function linkVideosToEpisode(videoIds: string[], episodeId: string) {
    if (!episodeId) throw new Error("Episode ID is required");

    // 1. Unlink any videos currently linked to this episode that are NOT in the new list
    // This makes the selection in the Dialog the source of truth.
    await supabase
        .from('season_videos')
        .update({ episode_id: null })
        .eq('episode_id', episodeId)
        .not('id', 'in', `(${videoIds.join(',')})`);

    // 2. Link the selected videos
    if (videoIds.length > 0) {
        const { error } = await supabase
            .from('season_videos')
            .update({ episode_id: episodeId })
            .in('id', videoIds);

        if (error) throw new Error(error.message);
    }

    revalidatePath('/admin/season/[slug]', 'page');
}

export async function unlinkVideoConfirm(videoId: string) {
    const { error } = await supabase
        .from('season_videos')
        .update({ episode_id: null })
        .eq('id', videoId);

    if (error) throw new Error(error.message);

    revalidatePath('/admin/season/[slug]', 'page');
}
