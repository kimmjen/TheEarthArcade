'use server'

import { revalidatePath } from "next/cache"
import { actionClient as supabase } from "./client"

export async function addVideo(seasonId: string, formData: FormData) {
    const title = formData.get('title') as string
    const url = formData.get('url') as string
    const type = formData.get('type') as string
    const thumbnail_url = formData.get('thumbnail_url') as string
    const view_count = formData.get('view_count') as string
    const published_at = formData.get('published_at') as string // Optional currently until DB migrates

    if (!seasonId || !title || !url) return { error: 'Missing fields' }

    // Check for duplicates
    const { data: existing } = await supabase
        .from('season_videos')
        .select('id')
        .eq('season_id', seasonId)
        .eq('youtube_url', url)
        .single();

    if (existing) {
        return { success: true, skipped: true };
    }

    const payload: any = {
        season_id: seasonId,
        title,
        youtube_url: url,
        type,
        thumbnail_url,
        view_count
    };

    if (published_at) payload.published_at = published_at;

    const { error } = await supabase
        .from('season_videos')
        .insert(payload)

    if (error) {
        throw new Error('Failed to add video')
    }

    revalidatePath('/admin')
    return { success: true }
}

export async function deleteSeasonVideo(videoId: string) {
    const { error } = await supabase
        .from('season_videos')
        .delete()
        .eq('id', videoId)

    if (error) throw new Error('Failed to delete video')

    revalidatePath('/admin')
    return { success: true }
}

export async function updateSeasonVideo(videoId: string, type: string) {
    const { error } = await supabase
        .from('season_videos')
        .update({ type })
        .eq('id', videoId)

    if (error) throw new Error('Failed to update video type')

    revalidatePath('/admin')
    return { success: true }
}

export async function fetchYoutubeInfo(url: string, type: 'video' | 'playlist') {
    // Dynamically import to avoid build issues if env is missing during build time
    // Note: path is relative from this file's location. lib/actions/video.ts -> ../../lib/youtube -> ../youtube
    const { fetchVideoDetails, fetchPlaylistVideos } = await import('../youtube');

    if (type === 'video') {
        const data = await fetchVideoDetails(url);
        if (!data) return { error: 'Failed to fetch video details' };
        return { data: [data] };
    } else {
        const data = await fetchPlaylistVideos(url);
        if (data.length === 0) return { error: 'Failed to fetch playlist or empty' };
        return { data };
    }
}

export async function fetchMoreVideos(seasonId: string, page: number, limit: number = 20) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error } = await supabase
        .from('season_videos')
        .select('*')
        .eq('season_id', seasonId)
        .order('created_at', { ascending: false })
        .range(from, to);

    if (error) {
        console.error('Error fetching more videos:', error);
        return { error: 'Failed to fetch videos' };
    }


    return { data };
}

export async function getAllVideos(page: number = 1, limit: number = 50, seasonId?: string) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
        .from('season_videos')
        .select(`
            *,
            seasons (
                title,
                slug
            )
        `, { count: 'exact' })
        .order('created_at', { ascending: false });

    if (seasonId && seasonId !== 'all') {
        query = query.eq('season_id', seasonId);
    }

    const { data, error, count } = await query.range(from, to);

    if (error) {
        console.error('Error fetching all videos:', error);
        return { error: 'Failed to fetch videos' };
    }

    return { data, count };
}

export async function syncVideoStats(videoId: string) {
    // 1. Get video URL
    const { data: video, error: fetchError } = await supabase
        .from('season_videos')
        .select('youtube_url')
        .eq('id', videoId)
        .single();

    if (fetchError || !video) return { error: 'Video not found' };

    // 2. Fetch from YouTube
    const { fetchVideoDetails } = await import('../youtube');
    const youtubeData = await fetchVideoDetails(video.youtube_url);

    if (!youtubeData) return { error: 'Failed to fetch data from YouTube' };

    // 3. Update DB
    const updatePayload: any = {
        title: youtubeData.title, // Update title just in case
        thumbnail_url: youtubeData.thumbnailUrl,
        view_count: youtubeData.viewCount
    };

    if (youtubeData.publishedAt) {
        updatePayload.published_at = youtubeData.publishedAt;
    }

    const { error: updateError } = await supabase
        .from('season_videos')
        .update(updatePayload)
        .eq('id', videoId);

    if (updateError) return { error: 'Failed to update video stats' };


    revalidatePath('/admin/videos');
    return { success: true, data: updatePayload };
}

export async function syncAllVideos(seasonId?: string) {
    // Limit to 50 at a time to prevent timeouts
    let query = supabase
        .from('season_videos')
        .select('id, youtube_url')
        .order('updated_at', { ascending: true }) // Update oldest first
        .limit(20);

    if (seasonId && seasonId !== 'all') {
        query = query.eq('season_id', seasonId);
    }

    const { data: videos } = await query;
    if (!videos || videos.length === 0) return { success: true, count: 0 };

    const { fetchVideoDetails } = await import('../youtube');
    let updatedCount = 0;

    for (const video of videos) {
        const youtubeData = await fetchVideoDetails(video.youtube_url);
        if (youtubeData) {
            const updatePayload: any = {
                title: youtubeData.title,
                thumbnail_url: youtubeData.thumbnailUrl,
                view_count: youtubeData.viewCount,
                updated_at: new Date().toISOString() // Force update timestamp
            };
            if (youtubeData.publishedAt) updatePayload.published_at = youtubeData.publishedAt;

            await supabase.from('season_videos').update(updatePayload).eq('id', video.id);
            updatedCount++;
        }
    }

    revalidatePath('/admin/videos');
    return { success: true, count: updatedCount };
}
