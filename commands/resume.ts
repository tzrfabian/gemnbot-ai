import type { ChatInputCommandInteraction } from "discord.js";
import { distube } from "../dcbot";


export default async function handleResume(interaction: ChatInputCommandInteraction) {
    try {
        await interaction.deferReply();
        const queue = distube.getQueue(interaction.guildId!);
        if(!queue) {
            return await interaction.editReply("❌There is no music playing in this server.❌");
        }
        if(!queue.paused) {
            return await interaction.editReply("▶️ The music is already resumed. ▶️");
        }
        queue.resume();
        await interaction.editReply("▶️ The music has been resumed. ▶️");
    } catch (error) {
        console.error("Error in handleResume:", error);
        try {
            await interaction.editReply("❌An error occurred while trying to resume the music.❌");
        } catch (err) {
            console.error("Failed to edit reply (interaction may be expired):", err);
        }
    }
}