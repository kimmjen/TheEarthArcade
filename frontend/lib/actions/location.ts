'use server'

import { revalidatePath } from "next/cache"
import { actionClient as supabase } from "./client"
import { Location } from "@/types"

export async function upsertLocation(location: Partial<Location>) {
    const { error } = await supabase
        .from('locations')
        .upsert(location)
        .select()
        .single();

    if (error) throw new Error(error.message);

    revalidatePath('/admin/season/[slug]', 'page');
}

export async function deleteLocation(id: string) {
    const { error } = await supabase
        .from('locations')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);

    revalidatePath('/admin/season/[slug]', 'page');
}
