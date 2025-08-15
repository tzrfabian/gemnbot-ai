interface YouTubeSearchResult {
    id: {
        videoId: string;
    };
    snippet: {
        title: string;
        channelTitle: string;
    };
}

interface YouTubeSearchResponse {
    items: YouTubeSearchResult[];
}

export async function searchYouTube(query: string): Promise<string | null> {
    const apiKey = process.env.YOUTUBE_API_KEY;
    
    if (!apiKey) {
        console.warn("YouTube API key not found. Please set YOUTUBE_API_KEY in your environment variables.");
        return null;
    }

    try {
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(query)}&key=${apiKey}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            console.error("YouTube API request failed:", response.status, response.statusText);
            return null;
        }

        const data: YouTubeSearchResponse = await response.json() as YouTubeSearchResponse;
        
        if (data.items && data.items.length > 0) {
            const videoId = data.items[0].id.videoId;
            return `https://www.youtube.com/watch?v=${videoId}`;
        }
        
        return null;
    } catch (error) {
        console.error("Error searching YouTube:", error);
        return null;
    }
}

export function isYouTubeUrl(url: string): boolean {
    return url.includes("youtube.com/watch") || url.includes("youtu.be/");
}

export function isSpotifyUrl(url: string): boolean {
    return url.includes("open.spotify.com");
}

export function isSoundCloudUrl(url: string): boolean {
    return url.includes("soundcloud.com");
}
