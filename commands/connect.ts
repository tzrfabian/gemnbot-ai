import { getVoiceConnection, joinVoiceChannel } from "@discordjs/voice";
import type { ChatInputCommandInteraction, GuildMember } from "discord.js";

export default async function handleConnect(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    if(!interaction.guild || !interaction.member || !("voice" in interaction.member)) {
        return await interaction.editReply("You must be in a voice channel to connect.");
    }
    const member = interaction.member as GuildMember;
    const voiceChannel = member.voice.channel;

    if(!voiceChannel) {
        return await interaction.editReply("You must be in a voice channel to connect.");
    }
    const existingConnection = getVoiceConnection(voiceChannel.guild.id);
    if(existingConnection) {
        if(existingConnection.joinConfig.channelId === voiceChannel.id) {
            return await interaction.editReply("Already connected to this voice channel.");
        }
        existingConnection.destroy();
        console.log(`Disconnected from previous voice channel: ${existingConnection.joinConfig.channelId}`);
    }

    joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId:voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });
    await interaction.editReply(`Connected to voice channel: **${voiceChannel.name}**`);
}