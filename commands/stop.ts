import type { ChatInputCommandInteraction } from "discord.js";
import { distube } from "../dcbot";


export default async function handleStop(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const queue = distube.getQueue(interaction.guildId!);
    if (!queue) {
        return interaction.editReply("There is no music currently playing in this server.");
    }
    queue.stop();
    await interaction.editReply("Stopped the music and cleared the queue.");
}