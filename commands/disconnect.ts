import { getVoiceConnection } from "@discordjs/voice";
import type { ChatInputCommandInteraction } from "discord.js";

export default async function handleDisconnect(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const connection = getVoiceConnection(interaction.guildId!);
    if(!connection) {
        return await interaction.editReply("You are not connected to a voice channel.");
    } else {
        connection.destroy();
        await interaction.editReply("Disconnected from the voice channel.");
    }
}