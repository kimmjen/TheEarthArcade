'use server'

import { revalidatePath } from "next/cache"
import { actionClient as supabase } from "./client"

export async function addAgent(formData: FormData) {
    const name = formData.get('name') as string
    const role = formData.get('role') as string
    const description = formData.get('description') as string
    const image_url = formData.get('image_url') as string

    // New Fields
    const english_name = formData.get('english_name') as string
    const instagram = formData.get('instagram') as string
    const birth_date = formData.get('birth_date') as string
    const birthplace = formData.get('birthplace') as string
    const height = formData.get('height') as string
    const blood_type = formData.get('blood_type') as string
    const mbti = formData.get('mbti') as string
    const agency = formData.get('agency') as string
    const group = formData.get('group') as string
    const debut_date = formData.get('debut_date') as string
    const motto = formData.get('motto') as string
    const detail_content = formData.get('detail_content') as string

    // If name/role missing, use defaults
    const finalName = name || 'New Member'
    const finalRole = role || 'TBD'

    // if (!name || !role) return { error: 'Name and Role are required' }

    const { error } = await supabase
        .from('cast_members')
        .insert({
            name: finalName,
            role: finalRole,
            description,
            image_url,
            english_name,
            instagram,
            birth_date,
            birthplace,
            height,
            blood_type,
            mbti,
            agency,
            "group": group, // reserved keyword
            debut_date,
            motto,
            detail_content
        })

    if (error) throw new Error('Failed to add agent')

    revalidatePath('/admin')
    revalidatePath('/admin/cast')
    return { success: true }
}

export async function updateAgent(id: string, formData: FormData) {
    const name = formData.get('name') as string
    const role = formData.get('role') as string
    const description = formData.get('description') as string
    const image_url = formData.get('image_url') as string

    const english_name = formData.get('english_name') as string
    const instagram = formData.get('instagram') as string
    const birth_date = formData.get('birth_date') as string
    const birthplace = formData.get('birthplace') as string
    const height = formData.get('height') as string
    const blood_type = formData.get('blood_type') as string
    const mbti = formData.get('mbti') as string
    const agency = formData.get('agency') as string
    const group = formData.get('group') as string
    const debut_date = formData.get('debut_date') as string
    const motto = formData.get('motto') as string
    const detail_content = formData.get('detail_content') as string

    const { error } = await supabase
        .from('cast_members')
        .update({
            name,
            role,
            description,
            image_url,
            english_name,
            instagram,
            birth_date,
            birthplace,
            height,
            blood_type,
            mbti,
            agency,
            "group": group,
            debut_date,
            motto,
            detail_content
        })
        .eq('id', id)

    if (error) {
        console.error('Update Error Details:', error)
        throw new Error(error.message)
    }

    revalidatePath('/admin')
    revalidatePath('/admin/cast')
    return { success: true }
}

export async function deleteAgent(agentId: string) {
    const { error } = await supabase
        .from('cast_members')
        .delete()
        .eq('id', agentId)

    if (error) throw new Error('Failed to delete agent')

    revalidatePath('/admin')
    revalidatePath('/admin/cast')
    return { success: true }
}

export async function updateSeasonCast(castId: string, formData: FormData) {
    const role = formData.get('role') as string
    const catchphrase = formData.get('catchphrase') as string
    const image_url = formData.get('image_url') as string

    const { error } = await supabase
        .from('season_cast')
        .update({ role, catchphrase, image_url })
        .eq('id', castId)

    if (error) throw new Error('Failed to update cast info')

    revalidatePath('/admin')
    return { success: true }
}

export async function deleteSeasonCast(castId: string) {
    const { error } = await supabase
        .from('season_cast')
        .delete()
        .eq('id', castId)

    if (error) throw new Error('Failed to remove cast')

    revalidatePath('/admin')
    return { success: true }
}

export async function addCastImage(castId: string, formData: FormData) {
    const image_url = formData.get('image_url') as string
    const caption = formData.get('caption') as string
    const year = formData.get('year') as string

    if (!castId || !image_url) return { error: 'Image is required' }

    const { error } = await supabase
        .from('cast_images')
        .insert({
            cast_id: castId,
            image_url,
            caption,
            year
        })

    if (error) throw new Error('Failed to add image')

    revalidatePath('/admin/cast/[id]', 'page')
    return { success: true }
}

export async function deleteCastImage(imageId: string) {
    const { error } = await supabase
        .from('cast_images')
        .delete()
        .eq('id', imageId)

    if (error) throw new Error('Failed to delete image')

    revalidatePath('/admin/cast/[id]', 'page')
    return { success: true }
}
