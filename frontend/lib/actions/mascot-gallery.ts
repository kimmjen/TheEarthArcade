'use server'

import { revalidatePath } from "next/cache"
import { actionClient as supabase } from "./client"
import { getMascotId } from "./mascot"

export async function uploadMascotGalleryImage(
    imageUrl: string,
    mascotSlug: string = 'torong'
) {
    const mascotId = await getMascotId(mascotSlug);
    if (!mascotId) throw new Error("Mascot not found");

    const { error } = await supabase
        .from('mascot_gallery')
        .insert({
            mascot_id: mascotId,
            image_url: imageUrl
        });

    if (error) throw new Error(error.message);

    revalidatePath('/admin/mascots');
    revalidatePath('/admin/season/[slug]', 'page');
}

export async function deleteMascotGalleryImage(id: string) {
    const { error } = await supabase
        .from('mascot_gallery')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);

    revalidatePath('/admin/mascots');
    revalidatePath('/admin/season/[slug]', 'page');
}
