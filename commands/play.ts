import type { ChatInputCommandInteraction, GuildMember } from "discord.js";
import ytdl from "ytdl-core";
import ytSearch from "yt-search";
import { AudioPlayerStatus, createAudioPlayer, createAudioResource, getVoiceConnection, joinVoiceChannel } from "@discordjs/voice";

export default async function handlePlay(interaction: ChatInputCommandInteraction) {
    try{
        await interaction.deferReply();
    
        if(!interaction.guild || !interaction.member || !("voice" in interaction.member)) {
            return await interaction.editReply("You must be in a voice channel to play music.");
        }
        const member = interaction.member as GuildMember;
        const voiceChannel = member.voice.channel;
        if (!voiceChannel) {
            return await interaction.editReply("You must be in a voice channel to play music.");
        }
        const query = interaction.options.getString("query", true);
    
        // Validate the query, check if it's a valid YouTube URL or a search term
        let videoUrl = query;
        if(!ytdl.validateURL(query)) {
            const searchResult = await ytSearch(query);
            const video = searchResult.videos[0];
            if(!video) {
                return await interaction.editReply("No results found on YouTube for your query.");
            }
            videoUrl = video.url;
        }
    
        // Check Join or get existing voice connection
        let connection = getVoiceConnection(voiceChannel.guild.id);
        if(!connection) {
            connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            })
        }
    
        // create audio player
        const stream = ytdl(videoUrl, {filter: "audioonly", highWaterMark: 1 << 25});
        const resource = createAudioResource(stream);
        const audioPlayer = createAudioPlayer();
    
        audioPlayer.play(resource);
        connection.subscribe(audioPlayer);
    
        audioPlayer.once(AudioPlayerStatus.Playing, () => {
            interaction.editReply(`Now playing: ${videoUrl}`);
        });
    
        audioPlayer.once(AudioPlayerStatus.Idle, () => {
            connection.destroy();
            interaction.followUp("Playback finished, leaving the voice channel.");
        });
    
        audioPlayer.once("error", (error) => {
            console.error("Audio player error:", error);
            interaction.followUp("An error occurred while trying to play the audio.");
            connection.destroy();
        });
    } catch (error) {
        console.error("Error in handlePlay:", error);
        if (interaction.deferred || interaction.replied) {
            await interaction.editReply("An unexpected error occurred while trying to play music.");
        } else {
            await interaction.reply("An unexpected error occurred while trying to play music.");
        }
    }
}