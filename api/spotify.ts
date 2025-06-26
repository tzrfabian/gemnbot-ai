// not sure this will work
const SpotifyWebApi = require("spotify-web-api-node");

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

export async function getSpotifyTrack(query: string) {
    if(!spotifyApi.getAccessToken()) {
        try {
            const data = await spotifyApi.clientCredentialsGrant();
            spotifyApi.setAccessToken(data.body["access_token"]);
        } catch (error) {
            console.error("Error getting Spotify access token:", error);
            throw new Error("Failed to authenticate with Spotify API");
        }
    }
    const result = await spotifyApi.searchTracks(query);
    return result.body.tracks.items[0];
}