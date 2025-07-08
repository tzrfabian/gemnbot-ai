import type { ChatInputCommandInteraction, GuildMember } from "discord.js";
import { distube } from "../dcbot";
import { getVoiceConnection } from "@discordjs/voice";


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
        // Check if the interaction is in a text channel
        if (!interaction.channel || interaction.channel.type !== 0) {
            return await interaction.editReply("This command can only be used in a text channel within a server.");
        }
        
        // Query only works with YouTube links/spotify links
        if(!query.startsWith("http") && !query.startsWith("https")) {
            return await interaction.editReply("Please provide a valid YouTube link or search query.");
        }
        // If the user is already in a voice channel, play the song
        const connection = getVoiceConnection(voiceChannel.guild.id);
        if(connection) {
            connection.destroy();
        }
        await distube.play(voiceChannel, query, {
            member,
            textChannel: interaction.channel,
            metadata: interaction
        });

        return await interaction.editReply(`Searching and playing for: **${query}**`);

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