import { supabase } from "@/utils/supabase/client";
import { Season, CastMember, SeasonCast, SeasonVideo, Rating, SeasonImage, SocialPlatform, SeasonMascot, MascotGalleryImage, Episode, Game, Location } from "@/types";

// Fetch all seasons, ordered by year desc, with stats
export async function getSeasons(): Promise<Season[]> {
    const { data, error } = await supabase
        .from("seasons")
        .select(`
            *,
            episodes:episodes(count),
            videos:season_videos(count),
            ratings:ratings(rating)
        `)
        .order("year", { ascending: false });

    if (error) {
        console.error("Error fetching seasons:", error);
        return [];
    }

    // Transform data to match Season interface
    return data.map((season: any) => {
        const ratingAvg = season.ratings?.length
            ? season.ratings.reduce((acc: number, curr: any) => acc + (curr.rating || 0), 0) / season.ratings.length
            : 0;

        return {
            ...season,
            episode_count: season.episodes?.[0]?.count || 0,
            video_count: season.videos?.[0]?.count || 0,
            rating_avg: parseFloat(ratingAvg.toFixed(1))
        };
    });
}

// Fetch single season by Slug (e.g. 's1')
export async function getSeasonBySlug(slug: string): Promise<Season | null> {
    const { data, error } = await supabase
        .from("seasons")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error) {
        console.error(`Error fetching season ${slug}:`, error);
        return null;
    }
    return data;
}

// Fetch Cast for a specific season
export async function getSeasonCast(seasonId: string): Promise<SeasonCast[]> {
    const { data, error } = await supabase
        .from("season_cast")
        .select(`
      *,
      cast:cast_members(*)
    `)
        .eq("season_id", seasonId)
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Error fetching season cast:", error);
        return [];
    }

    // Need to map the joined data correctly if Supabase returns array
    // The type definition expects 'cast' to be a single object, which Supabase returns for foreign keys
    return data as unknown as SeasonCast[];
}

// Fetch all unique cast members (for Agents page)
// We might want to show their "latest" image or a default one. 
// For now, we'll just fetch the base info.
export async function getAllAgents() {
    const { data, error } = await supabase
        .from("cast_members")
        .select("*");

    if (error) {
        console.error("Error fetching agents:", error);
        return [];
    }
    return data;
}

export async function getAgentById(id: string): Promise<CastMember | null> {
    const { data, error } = await supabase
        .from("cast_members")
        .select(`
            *,
            images:cast_images(*)
        `)
        .eq("id", id)
        .order('year', { ascending: false, referencedTable: 'cast_images' })
        .single();

    if (error) {
        console.error(`Error fetching agent ${id}:`, error);
        return null;
    }
    return data;
}

export async function getMascot(slug: string = 'torong') {
    const { data, error } = await supabase
        .from("mascots")
        .select(`
      *,
      season_mascots(image_url, description, status)
    `)
        .eq("slug", slug)
        .single();

    if (error) {
        console.error(`Error fetching mascot ${slug}:`, error);
        return null;
    }
    return data;
}


export async function getSeasonVideos(seasonId: string, limit: number = 20) {
    const { data, error } = await supabase
        .from("season_videos")
        .select("*")
        .eq("season_id", seasonId)
        .order('created_at', { ascending: false }) // Consistent ordering
        .range(0, limit - 1);

    if (error) {
        console.error("Error fetching videos:", error);
        return [];
    }
    return data;
}

export async function getSeasonRatings(seasonId: string) {
    const { data, error } = await supabase
        .from("ratings")
        .select("*")
        .eq("season_id", seasonId)
        .order("episode_number", { ascending: true });

    if (error) {
        console.error("Error fetching ratings:", error);
        return [];
    }
    return data;
}

export async function getSeasonImages(seasonId: string) {
    const { data, error } = await supabase
        .from("season_images")
        .select("*")
        .eq("season_id", seasonId)
        .order("sort_order", { ascending: true });

    if (error) {
        console.error("Error fetching season images:", error);
        return [];
    }
    return data;
}

export async function getSocialPlatforms(): Promise<SocialPlatform[]> {
    const { data: platforms, error } = await supabase
        .from('social_platforms')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('label', { ascending: true });

    if (error) {
        console.error('Error fetching social platforms:', error);
        return [];
    }

    return platforms;
}

export async function getSeasonMascot(seasonId: string, mascotSlug: string = 'torong'): Promise<SeasonMascot | null> {
    // First get mascot ID
    const { data: mascot } = await supabase.from('mascots').select('id').eq('slug', mascotSlug).single();
    if (!mascot) return null;

    // Get join table data
    const { data, error } = await supabase
        .from('season_mascots')
        .select(`
            *,
            mascot:mascots(*)
        `)
        .eq('season_id', seasonId)
        .eq('mascot_id', mascot.id)
        .single();

    if (error && error.code !== 'PGRST116') { // Ignore not found error
        console.error('Error fetching season mascot:', error);
    }

    return data || null;
}

export async function getAllSeasonMascots(): Promise<SeasonMascot[]> {
    const { data, error } = await supabase
        .from('season_mascots')
        .select(`
           *,
           mascot:mascots(*)
       `);

    if (error) {
        console.error('Error fetching all season mascots:', error);
        return [];
    }

    return data || [];
}

export async function getMascotGallery(slug: string = 'torong'): Promise<MascotGalleryImage[]> {
    // 1. Get Mascot ID
    const { data: mascot } = await supabase.from('mascots').select('id').eq('slug', slug).single();
    if (!mascot) return [];

    // 2. Fetch Gallery
    const { data, error } = await supabase
        .from('mascot_gallery')
        .select('*')
        .eq('mascot_id', mascot.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching mascot gallery:', error);
        return [];
    }

    return data || [];
}

export async function getDashboardStats() {
    // 1. Total Video Count
    const { count: videoCount, error: vError } = await supabase
        .from('season_videos')
        .select('*', { count: 'exact', head: true });

    if (vError) console.error('Error fetching video count:', vError);

    // 2. Cast Count
    const { count: castCount, error: cError } = await supabase
        .from('cast_members')
        .select('*', { count: 'exact', head: true });

    if (cError) console.error('Error fetching cast count:', cError);

    // 3. Gallery Count (Torong)
    const { count: galleryCount, error: gError } = await supabase
        .from('mascot_gallery')
        .select('*', { count: 'exact', head: true });

    if (gError) console.error('Error fetching gallery count:', gError);

    // 4. All Ratings with Season Info (for Chart)
    const { data: ratings, error: rError } = await supabase
        .from('ratings')
        .select(`
            episode_number,
            rating,
            season:seasons (
                id,
                slug,
                title,
                color_theme
            )
        `)
        .order('season_id', { ascending: true })
        .order('episode_number', { ascending: true });

    if (rError) console.error('Error fetching ratings:', rError);

    // Filter out invalid ratings
    const validRatings = ratings?.filter(r => r.season) || [];

    return {
        videoCount: videoCount || 0,
        castCount: castCount || 0,
        galleryCount: galleryCount || 0,
        ratings: validRatings
    };
}

export async function getTableData(tableName: string, page: number = 1, pageSize: number = 50, seasonId?: string) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
        .from(tableName)
        .select('*', { count: 'exact' })
        .range(from, to)
        .order('created_at', { ascending: false });

    if (seasonId && seasonId !== 'all') {
        // Only apply if table actually has season_id?
        // Risky if table doesn't have it.
        // But for this use case, we can assume UI only shows filter if applicable, or we let it fail/ignore.
        // Better: The UI will pass it. If table doesn't have season_id, Supabase might error.
        // We will handle the 42703 error (undefined column) in the catch block or assume UI logic.
        query = query.eq('season_id', seasonId);
    }

    const { data, error, count } = await query;

    if (error) {
        // If ordering fails (no created_at), try without order
        if (error.code === '42703') { // Undefined column
            const { data: retryData, error: retryError, count: retryCount } = await supabase
                .from(tableName)
                .select('*', { count: 'exact' })
                .range(from, to);
            return { data: retryData, count: retryCount, error: retryError };
        }
        return { data: null, count: 0, error };
    }

    return { data, count, error };
}

export async function getSeasonEpisodes(seasonId: string): Promise<Episode[]> {
    // Fetch episodes with their games
    const { data, error } = await supabase
        .from('episodes')
        .select(`
           *,
           games(*),
           videos:season_videos(*)
       `)
        .eq('season_id', seasonId)
        .order('episode_number', { ascending: true });

    if (error) {
        console.error('Error fetching season episodes:', error);
        return [];
    }

    return data as unknown as Episode[];
    return data as unknown as Episode[];
    // Note: The 'games' field will be present in runtime but might need type assertion or extending the Episode type if we want to use it typed.
}

export async function getSeasonLocations(seasonId: string): Promise<Location[]> {
    const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('season_id', seasonId)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching season locations:', error);
        return [];
    }

    return data || [];
}

export async function getAllLocations() {
    const { data, error } = await supabase
        .from('locations')
        .select(`
            *,
            season:seasons(slug, color_theme)
        `)
        .not('latitude', 'is', null) // Only fetch mappable locations
        .order('season_id');

    if (error) {
        console.error('Error fetching all locations:', error);
        return [];
    }

    return data || [];
}
