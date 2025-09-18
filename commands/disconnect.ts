import { getVoiceConnection } from "@discordjs/voice";
import type { ChatInputCommandInteraction } from "discord.js";
import { distube } from "../dcbot";

export default async function handleDisconnect(interaction: ChatInputCommandInteraction) {
    try {
        await interaction.deferReply();

        if (!interaction.guild) {
            return await interaction.editReply("This command can only be used in a server.");
        }

        // Check if there's a DisTube queue (music connection)
        const queue = distube.getQueue(interaction.guild.id);
        if (queue) {
            // Use DisTube's voice connection to disconnect
            const voiceConnection = queue.voice.connection;
            if (voiceConnection) {
                voiceConnection.destroy();
            }
        }

        // Check for manual voice connections (from connect command)
        const connection = getVoiceConnection(interaction.guild?.id);
        if (!connection) {
            return await interaction.editReply("The bot is not connected to any voice channel.");
        }
        
        connection.destroy();
        await interaction.editReply("Disconnected from the voice channel.");
    } catch (error) {
        console.error("Error in handleDisconnect:", error);
        try {
            await interaction.editReply("An error occurred while trying to disconnect from the voice channel.");
        } catch (err) {
            console.error("Failed to edit reply (interaction may be expired):", err);
        }
    }
}