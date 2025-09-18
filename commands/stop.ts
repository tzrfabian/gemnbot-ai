import type { ChatInputCommandInteraction } from "discord.js";
import { distube } from "../dcbot";


export default async function handleStop(interaction: ChatInputCommandInteraction) {
    try {
        await interaction.deferReply();
        const queue = distube.getQueue(interaction.guild!.id);
        if (!queue) {
            return await interaction.editReply("❌There is no music currently playing in this server.❌");
        }
        queue.stop();
        await interaction.editReply("⛔Stopped the music and cleared the queue.⛔");
    } catch (error) {
        console.error("Error in handleStop:", error);
        try {
            await interaction.editReply("❌An error occurred while trying to stop the music.❌");
        } catch (err) {
            console.error("Failed to edit reply (interaction may be expired):", err);
        }
    }
}