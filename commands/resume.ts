import type { ChatInputCommandInteraction } from "discord.js";
import { distube } from "../dcbot";


export default async function handleResume(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const queue = distube.getQueue(interaction.guildId!);
    if(!queue) {
        return interaction.editReply("There is no music playing in this server.");
    }
    if(!queue.paused) {
        return await interaction.editReply("The music is already resumed.");
    }
    queue.resume();
    await interaction.editReply("The music has been resumed.");
}