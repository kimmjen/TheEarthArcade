'use server'

import { revalidatePath } from "next/cache"
import { actionClient as supabase } from "./client"

export async function uploadImage(formData: FormData) {
    const file = formData.get('file') as File;
    if (!file) return { error: 'No file provided' };

    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    // Convert File to Buffer for reliable Node.js upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
        .from('earth-arcade-assets')
        .upload(filePath, buffer, {
            contentType: file.type,
            upsert: false
        });

    if (uploadError) {
        console.error('Upload Error:', uploadError);
        return { error: 'Upload failed' };
    }

    const { data: { publicUrl } } = supabase.storage
        .from('earth-arcade-assets')
        .getPublicUrl(filePath);

    return { success: true, url: publicUrl };
}

export async function addSeasonImage(seasonId: string, formData: FormData) {
    const url = formData.get('url') as string
    const caption = formData.get('caption') as string

    if (!seasonId || !url) return { error: 'Missing fields' }

    const { error } = await supabase
        .from('season_images')
        .insert({
            season_id: seasonId,
            url,
            caption
        })

    if (error) {
        console.error('Error adding image:', error)
        throw new Error('Failed to add image')
    }

    revalidatePath('/admin')
    return { success: true }
}

export async function deleteSeasonImage(imageId: string) {
    const { error } = await supabase
        .from('season_images')
        .delete()
        .eq('id', imageId)

    if (error) throw new Error('Failed to delete image')

    revalidatePath('/admin')
    return { success: true }
}

export async function addSocialPlatform(formData: FormData) {
    const key = formData.get('key') as string
    const label = formData.get('label') as string
    const icon_url = formData.get('icon_url') as string

    if (!key || !label) return { error: 'Key and Label are required' }

    const { error } = await supabase
        .from('social_platforms')
        .insert({
            key,
            label,
            icon_url,
            sort_order: 0
        })

    if (error) {
        // Handle unique constraint error
        if (error.code === '23505') {
            return { error: 'Platform key already exists' };
        }
        throw new Error('Failed to add platform')
    }

    revalidatePath('/admin')
    revalidatePath('/admin/assets')
    return { success: true }
}

export async function deleteSocialPlatform(id: string) {
    const { error } = await supabase
        .from('social_platforms')
        .delete()
        .eq('id', id)

    if (error) throw new Error('Failed to delete platform')

    revalidatePath('/admin')
    revalidatePath('/admin/assets')
    return { success: true }
}
