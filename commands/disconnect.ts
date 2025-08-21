import { getVoiceConnection } from "@discordjs/voice";
import type { ChatInputCommandInteraction } from "discord.js";

export default async function handleDisconnect(interaction: ChatInputCommandInteraction) {
    try {
        await interaction.deferReply();

        const connection = getVoiceConnection(interaction.guildId!);
        if(!connection) {
            return await interaction.editReply("You are not connected to a voice channel.");
        } else {
            connection.destroy();
            await interaction.editReply("Disconnected from the voice channel.");
        }
    } catch (error) {
        console.error("Error in handleDisconnect:", error);
        try {
            await interaction.editReply("An error occurred while trying to disconnect from the voice channel.");
        } catch (err) {
            console.error("Failed to edit reply (interaction may be expired):", err);
        }
    }
}