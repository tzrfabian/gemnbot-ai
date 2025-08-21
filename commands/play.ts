import type { ChatInputCommandInteraction, GuildMember } from "discord.js";
import { distube } from "../dcbot";
import { getVoiceConnection } from "@discordjs/voice";
import { searchYouTube, isYouTubeUrl, isSpotifyUrl, isSoundCloudUrl } from "../api/youtube";


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
            return await interaction.editReply("Please provide a song name, YouTube URL, or Spotify URL.");
        }

        // Check if the interaction is in a text channel
        if (!interaction.channel || interaction.channel.type !== 0) {
            return await interaction.editReply("This command can only be used in a text channel within a server.");
        }
        
        let playUrl = query;
        let searchMessage = "";

        // Check if it's a direct URL (YouTube, Spotify, SoundCloud)
        if (isYouTubeUrl(query) || isSpotifyUrl(query) || isSoundCloudUrl(query)) {
            playUrl = query;
            searchMessage = `▶️ Playing: **${query}** 🎶`;
        } else {
            // It's a search query, try to find on YouTube
            await interaction.editReply("🔍 Searching YouTube...");
            const youtubeUrl = await searchYouTube(query);
            
            if (!youtubeUrl) {
                return await interaction.editReply("❌ No results found on YouTube for your search. Try a more specific query or provide a direct URL.");
            }
            
            playUrl = youtubeUrl;
            searchMessage = `✅ Found and playing: **${query} 🎶**`;
        }

        // Destroy any existing connection not managed by DisTube
        const connection = getVoiceConnection(voiceChannel.guild.id);
        if(connection) {
            connection.destroy();
        }

        await distube.play(voiceChannel, playUrl, {
            member,
            textChannel: interaction.channel,
            metadata: interaction
        });

        return await interaction.editReply(searchMessage);

    } catch (error: any) {
        console.error("Error in handlePlay:\n", error);
        const message = error?.message?.includes("NO_RESULT")
            ? "❌ No result found for your query."
            : "❌ Failed to play the requested song.";
        try {
            await interaction.editReply(message);
        } catch (err) {
            // Optionally log if the interaction is already expired
            console.error("Failed to edit reply (interaction may be expired):", err);
        }
    }
}