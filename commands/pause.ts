import type { ChatInputCommandInteraction } from "discord.js";
import { distube } from "../dcbot";


export default async function handlePause(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const queue = distube.getQueue(interaction.guildId!);
    if(!queue) {
        return await interaction.editReply("There is no music playing in this server.");
    }
    if(queue.paused) {
        return await interaction.editReply("The music is already paused.");
    }
    queue.pause();
    await interaction.editReply("The music has been paused.");
}