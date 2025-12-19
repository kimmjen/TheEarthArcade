import { google } from 'googleapis';

const youtube = google.youtube({
    version: 'v3',
    auth: process.env.YOUTUBE_API_KEY
});

export interface YoutubeVideoData {
    title: string;
    url: string;
    thumbnailUrl: string;
    publishedAt: string;
    viewCount?: string;
}

export async function fetchVideoDetails(url: string): Promise<YoutubeVideoData | null> {
    try {
        const videoId = extractVideoId(url);
        if (!videoId) return null;

        const response = await youtube.videos.list({
            part: ['snippet', 'statistics'],
            id: [videoId]
        });

        const item = response.data.items?.[0];
        if (!item?.snippet) return null;

        return {
            title: item.snippet.title ?? '',
            url: `https://youtube.com/watch?v=${videoId}`,
            thumbnailUrl: item.snippet.thumbnails?.high?.url ?? item.snippet.thumbnails?.default?.url ?? '',
            publishedAt: item.snippet.publishedAt ?? '',
            viewCount: item.statistics?.viewCount ?? '0'
        };
    } catch (error) {
        console.error('Error fetching YouTube video:', error);
        return null;
    }
}

export async function fetchPlaylistVideos(url: string): Promise<YoutubeVideoData[]> {
    try {
        const playlistId = extractPlaylistId(url);
        if (!playlistId) return [];

        let allItems: YoutubeVideoData[] = [];
        let nextPageToken: string | undefined = undefined;

        do {
            const response: any = await youtube.playlistItems.list({
                part: ['snippet'],
                playlistId: playlistId,
                maxResults: 50,
                pageToken: nextPageToken
            });

            const items = response.data.items || [];
            if (items.length === 0) break;

            const mappedItems = items
                .map((item: any) => { // Using explicit any to bypass complex Gaxios typings quickly, or imports
                    const snippet = item.snippet;
                    if (!snippet?.resourceId?.videoId) return null;

                    return {
                        title: snippet.title ?? '',
                        url: `https://youtube.com/watch?v=${snippet.resourceId.videoId}`,
                        thumbnailUrl: snippet.thumbnails?.high?.url ?? snippet.thumbnails?.default?.url ?? '',
                        publishedAt: snippet.publishedAt ?? ''
                    };
                })
                .filter((v: any): v is YoutubeVideoData => v !== null);

            allItems = [...allItems, ...mappedItems];
            nextPageToken = response.data.nextPageToken ?? undefined;

        } while (nextPageToken);

        return allItems;

    } catch (error) {
        console.error('Error fetching YouTube playlist:', error);
        return [];
    }
}

function extractVideoId(url: string) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function extractPlaylistId(url: string) {
    const regExp = /[&?]list=([^&]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
}
