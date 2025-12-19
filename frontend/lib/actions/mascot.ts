'use server'

import { revalidatePath } from "next/cache"
import { actionClient as supabase } from "./client"

export async function getMascotId(slug: string = 'torong') {
    const { data } = await supabase.from('mascots').select('id').eq('slug', slug).single();
    return data?.id;
}

export async function updateSeasonMascot(
    seasonId: string,
    status: string,
    description: string,
    imageUrl: string,
    mascotSlug: string = 'torong'
) {
    // Get Mascot ID
    const mascotId = await getMascotId(mascotSlug);
    if (!mascotId) throw new Error("Mascot not found");

    // Upsert season_mascots
    const { error } = await supabase
        .from('season_mascots')
        .upsert({
            season_id: seasonId,
            mascot_id: mascotId,
            status,
            description,
            image_url: imageUrl
        }, { onConflict: 'season_id, mascot_id' });

    if (error) throw new Error(error.message);

    revalidatePath('/admin/season/[slug]', 'page');
}
