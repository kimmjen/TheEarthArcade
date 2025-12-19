'use server'

import { revalidatePath } from "next/cache"
import { actionClient as supabase } from "./client"

export async function updateSeason(slug: string, formData: FormData) {
    const title = formData.get('title') as string
    const subtitle = formData.get('subtitle') as string
    const directors = formData.get('directors') as string
    const writers = formData.get('writers') as string
    const genre = formData.get('genre') as string
    const location = formData.get('location') as string
    const description = formData.get('description') as string
    const air_date_start = formData.get('air_date_start') as string
    const air_date_end = formData.get('air_date_end') as string
    const production_cost = formData.get('production_cost') as string
    const view_rating = formData.get('view_rating') as string
    const streaming = formData.get('streaming') as string
    const color_theme = formData.get('color_theme') as string
    const main_poster_url = formData.get('main_poster_url') as string
    const horizontal_poster_url = formData.get('horizontal_poster_url') as string

    const { error } = await supabase
        .from('seasons')
        .update({
            title,
            subtitle,
            directors,
            writers,
            genre,
            location,
            description,
            air_date_start,
            air_date_end,
            production_cost,
            view_rating,
            streaming,
            color_theme,
            main_poster_url,
            horizontal_poster_url
        })
        .eq('slug', slug)

    if (error) {
        console.error('Update Season Error:', error)
        throw new Error('Failed to update season')
    }

    revalidatePath(`/season/${slug}`)
    revalidatePath('/admin')
    revalidatePath(`/admin/season/${slug}`)
    return { success: true }
}

export async function addSeasonRating(seasonId: string, formData: FormData) {
    const episode_number = parseInt(formData.get('episode_number') as string)
    const rating_value = parseFloat(formData.get('rating_value') as string)
    const air_date = formData.get('air_date') as string
    const note = formData.get('note') as string

    if (!seasonId || isNaN(episode_number)) return { error: 'Invalid data' }

    const { error } = await supabase
        .from('ratings')
        .insert({
            season_id: seasonId,
            episode_number,
            rating: rating_value,
            air_date,
            note
        })

    if (error) {
        console.error(error)
        throw new Error('Failed to add rating')
    }

    revalidatePath('/admin')
    return { success: true }
}

export async function deleteSeasonRating(ratingId: string) {
    const { error } = await supabase
        .from('ratings')
        .delete()
        .eq('id', ratingId)

    if (error) throw new Error('Failed to delete rating')

    revalidatePath('/admin')
    return { success: true }
}
