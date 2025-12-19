export interface Season {
    id: string; // UUID
    slug: string; // 's1', 's2'
    title: string;
    subtitle: string;
    year: number;
    location: string;
    description: string;
    main_poster_url: string;
    horizontal_poster_url?: string;
    color_theme: string;
    production_cost: string;
    air_date_start: string;
    air_date_end: string;
    type: 'regular' | 'spin-off';
    genre?: string;
    directors?: string;
    writers?: string;
    view_rating?: string;
    streaming?: string;
    // New Fields for S3
    title_en?: string;
    title_cn?: string;
    broadcast_time?: string;
    episode_count?: string;
    planning?: string;
    production_company?: string;
    channel?: string;
    additional_channels?: string;
    // Flexible Social Links
    links?: SocialLink[];
    // Streaming Platforms with Icons
    platforms?: StreamingPlatform[];
}

export interface SocialLink {
    id: string; // UUID or random ID
    type: string; // 'youtube', 'instagram', 'homepage', etc.
    label: string; // e.g. "Channel Full Moon"
    url: string;
}

export interface StreamingPlatform {
    id: string;
    name: string; // "TVING"
    icon_url: string;
    url?: string;
}

export interface CastMember {
    id: string; // UUID
    name: string;
    english_name?: string;
    english_role?: string;
    english_description?: string;
    english_motto?: string;
    instagram?: string;
    image_url?: string;
    role?: string;
    description?: string;
    // Extended Profile
    birth_date?: string;
    birthplace?: string;
    height?: string;
    blood_type?: string;
    mbti?: string;
    agency?: string;
    group?: string;
    debut_date?: string;
    motto?: string;
    detail_content?: string; // Markdown
    images?: CastImage[];
}

export interface CastImage {
    id: string;
    cast_id: string;
    image_url: string;
    caption?: string;
    year?: string;
    sort_order?: number;
}

export interface SeasonCast {
    id: string; // ID of the join table row
    season_id: string;
    cast_id: string;
    role: string;
    catchphrase: string;
    image_url: string;
    cast: CastMember; // Joined data
}

export interface SeasonImage {
    id: string;
    season_id: string;
    url: string;
    caption?: string;
    sort_order: number;
    created_at?: string;
}

export interface SocialPlatform {
    id: string;
    key: string;      // e.g. 'youtube'
    label: string;    // e.g. 'YouTube'
    icon_url?: string; // e.g. 'https://.../youtube.png'
    sort_order?: number;
}
export interface Mascot {
    id: string;
    name: string;
    slug: string;
}

export interface SeasonMascot {
    season_id: string;
    mascot_id: string;
    status: string;
    description: string;
    image_url: string;
    mascot: Mascot;
}

export interface MascotGalleryImage {
    id: string;
    mascot_id: string;
    image_url: string;
    created_at: string;
}


export const VIDEO_TYPES = [
    { value: 'highlight', label: 'Highlight' },
    { value: 'full', label: 'Full Episode' },
    { value: 'teaser', label: 'Teaser' },
    { value: 'live', label: 'Live' },
    { value: 'shorts', label: 'Shorts' },
    { value: 'fancam', label: 'Fancam' },
    { value: 'making', label: 'Making' },
    { value: 'interview', label: 'Interview' },
] as const;

export interface SeasonVideo {
    id: string;
    season_id: string;
    episode_id?: string; // Link to specific episode
    title: string;
    youtube_url: string;
    thumbnail_url?: string;
    view_count?: string;
    type: string;
}

export interface Rating {
    id: string;
    season_id: string;
    episode_number: number;
    air_date: string;
    rating: number; // Changed from rating_value to rating to match DB
    note?: string;
}

export interface Episode {
    id: string;
    season_id: string;
    episode_number: number;
    title: string;
    air_date: string;
    rating: number;
    description: string;
    videos?: SeasonVideo[]; // Highlight videos for this episode
    games?: Game[]; // Games played in this episode
}

export interface Game {
    id: string;
    episode_id: string;
    name: string;
    type: string;
    description: string;
    winner: string;
    result: string;
}

export interface Location {
    id: string;
    season_id: string;
    name: string;
    description: string;
    category: string;
    address: string;
    latitude?: number;
    longitude?: number;
    created_at?: string;
}
