import type { ChatInputCommandInteraction, GuildMember } from "discord.js";
import { distube } from "../dcbot";
import { getVoiceConnection } from "@discordjs/voice";
import { searchYouTube, getUrlType } from "../api/youtube";


export default async function handlePlay(interaction: ChatInputCommandInteraction) {
    try {
        await interaction.deferReply();

        if(!interaction.guild || !interaction.member || !("voice" in interaction.member)) {
            return await interaction.editReply("This command can only be used in a voice channel.");
        }
        
        const member = interaction.member as GuildMember;
        const voiceChannel = member.voice.channel;
        // Check if the user is in a voice channel
        if(!voiceChannel) {
            return await interaction.editReply("You need to be in a voice channel to use this command.");
        }

        const query = interaction.options.getString("query", true).trim();
        
        if (!query) {
            return await interaction.editReply("Please provide a song name, YouTube URL, Spotify URL, or SoundCloud URL.");
        }

        // Check if the interaction is in a text channel
        if (!interaction.channel || interaction.channel.type !== 0) {
            return await interaction.editReply("This command can only be used in a text channel within a server.");
        }
        
        const urlType = getUrlType(query);
        let playUrl = query;
        let searchMessage = "";

        switch (urlType) {
            case 'youtube':
                playUrl = query;
                searchMessage = `▶️ Playing YouTube: **${query}** 🎶`;
                break;
                
            case 'spotify':
                playUrl = query;
                searchMessage = `▶️ Playing Spotify: **${query}** 🎶`;
                break;
                
            case 'soundcloud':
                playUrl = query;
                searchMessage = `▶️ Playing SoundCloud: **${query}** 🎶`;
                break;
                
            case 'other':
                // Try to play as URL first, fallback to search if it fails
                playUrl = query;
                searchMessage = `▶️ Playing URL: **${query}** 🎶`;
                break;
                
            case 'text':
            default:
                // It's a search query, try to find on YouTube
                await interaction.editReply("🔍 Searching YouTube...");
                const youtubeUrl = await searchYouTube(query);
                
                if (!youtubeUrl) {
                    return await interaction.editReply("❌ No results found on YouTube for your search. Try a more specific query or provide a direct URL.");
                }
                
                playUrl = youtubeUrl;
                searchMessage = `✅ Found and playing: **${query}** 🎶`;
                break;
        }

        // Destroy any existing connection not managed by DisTube
        const connection = getVoiceConnection(voiceChannel.guild.id);
        if(connection) {
            connection.destroy();
        }

        try {
            await distube.play(voiceChannel, playUrl, {
                member,
                textChannel: interaction.channel,
                metadata: interaction
            });

            return await interaction.editReply(searchMessage);
        } catch (playError: any) {
            // If URL failed, try searching instead (for both URL and text searches)
            if (playError?.message?.includes("NO_RESULT") || playError?.message?.includes("NOT_SUPPORTED_URL")) {
                console.log(`Playback failed, trying search fallback for: ${query}`);
                await interaction.editReply("🔍 Trying alternative search...");
                
                // Try a different search approach
                const searchUrl = await searchYouTube(query);
                if (searchUrl) {
                    try {
                        await distube.play(voiceChannel, searchUrl, {
                            member,
                            textChannel: interaction.channel,
                            metadata: interaction
                        });
                        return await interaction.editReply(`✅ Found alternative: **${query}** 🎶`);
                    } catch (searchError) {
                        console.log(`Search fallback also failed: ${searchError}`);
                        // Continue to throw the original error
                    }
                }
            }
            
            // Re-throw the error to be handled by the outer catch block
            throw playError;
        }

    } catch (error: any) {
        console.error("Error in handlePlay:\n", error);
        
        let message = "❌ Failed to play the requested song.";
        
        if (error?.message?.includes("NO_RESULT")) {
            message = "❌ No result found for your query.";
        } else if (error?.message?.includes("JSON Parse error") || error?.message?.includes("Unexpected identifier")) {
            message = "❌ There was an issue processing the audio source. Please try a different song or URL.";
        } else if (error?.message?.includes("NO_EXTRACTOR_PLUGIN")) {
            message = "❌ The bot doesn't have the required plugins to play this type of content.";
        } else if (error?.message?.includes("NOT_SUPPORTED_URL")) {
            message = "❌ This URL is not supported. Try searching for the song name instead.";
        } else if (error?.message?.includes("NO_QUERY")) {
            message = "❌ Please provide a song name or URL.";
        }
        
        try {
            await interaction.editReply(message);
        } catch (err) {
            // Optionally log if the interaction is already expired
            console.error("Failed to edit reply (interaction may be expired):", err);
        }
    }
}