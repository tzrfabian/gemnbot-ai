import { getVoiceConnection, joinVoiceChannel } from "@discordjs/voice";
import type { ChatInputCommandInteraction, GuildMember } from "discord.js";

export default async function handleJoin(interaction: ChatInputCommandInteraction) {
    try {
        await interaction.deferReply();

        if (!interaction.guild || !interaction.member || !("voice" in interaction.member)) {
            return await interaction.editReply("You must be in a voice channel to connect.");
        }

        const member = interaction.member as GuildMember;
        const voiceChannel = member.voice.channel;

        if (!voiceChannel) {
            return await interaction.editReply("You must be in a voice channel to connect.");
        }
        const existingConnection = getVoiceConnection(interaction.guild.id);
        if (existingConnection) {
            if (existingConnection.joinConfig.channelId === voiceChannel.id) {
                return await interaction.editReply("Already connected to this voice channel.");
            }
            existingConnection.destroy();
            console.log(`Disconnected from previous voice channel: ${existingConnection.joinConfig.channelId}`);
        }

        joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: interaction.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });
        await interaction.editReply(`Connected to voice channel: **${voiceChannel.name}**`);
    } catch (error) {
        console.error("Error in handleConnect:", error);
        try {
            await interaction.editReply("An error occurred while trying to connect to the voice channel.");
        } catch (err) {
            console.error("Failed to edit reply (interaction may be expired):", err);
        }
    }
}