import { Client, GatewayIntentBits, TextChannel } from "discord.js";
import handleAsk from "./commands/ask";
import handleConnect from "./commands/connect";
import handleDisconnect from "./commands/disconnect";
import handlePlay from "./commands/play";
import { DisTube, Queue, Song, type DisTubeEvents} from "distube";
import SpotifyPlugin from "@distube/spotify";
import { config } from "dotenv";
import { YtDlpPlugin } from "@distube/yt-dlp";
import { YouTubePlugin } from "@distube/youtube";
import handlePause from "./commands/pause";
import handleStop from "./commands/stop";
import handleResume from "./commands/resume";
import handleMute from "./commands/mute";
import handleUnmute from "./commands/unmute";

config();

export const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

export const distube = new DisTube(client, {
    plugins: [
        new SpotifyPlugin({
            api: {
                clientId: process.env.SPOTIFY_CLIENT_ID || "",
                clientSecret: process.env.SPOTIFY_CLIENT_SECRET || "",
            },
        }),
        new YtDlpPlugin()
    ],
    emitNewSongOnly: true,
    joinNewVoiceChannel: true,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false,
});

let defaultChannel: TextChannel | null = null;

client.once("ready", () => {
    console.log(`Logged in as ${client.user?.tag}!`);
    const defaultChannelId = process.env.DISCORD_CHANNEL_ID;
    // Find the default channel to send messages
    if (!defaultChannelId) {
        console.warn("DEFAULT_CHANNEL_ID is not set in environment variables.");
        return;
    }
    const channel = client.channels.cache.get(defaultChannelId) as TextChannel;
    if (!channel) {
        console.warn("Default channel not found.");
    } else {
        defaultChannel = channel;
        console.log(`Default channel set to: ${defaultChannel.name}`);
    }
});

distube
    .on("playSong" as keyof DisTubeEvents, (queue: Queue, song: Song) => {
    (queue.textChannel as TextChannel).send(`Now playing: **${song.name}** - \`${song.formattedDuration}\``);
    })
    .on("addSong" as keyof DisTubeEvents, (queue: Queue, song: Song) => {
        (queue.textChannel as TextChannel).send(`Added to queue: **${song.name}** - \`${song.formattedDuration}\``);
    })
    .on("finish" as keyof DisTubeEvents, (queue: Queue) => {
        queue.voice.leave();
        (queue.textChannel as TextChannel).send("Queue finished, leaving voice channel.");
    })
    .on("empty" as keyof DisTubeEvents, (queue: Queue) => {
        queue.voice.leave();
        (queue.textChannel as TextChannel).send("Voice channel is empty, leaving.");
    })
    .on("disconnect" as keyof DisTubeEvents, (queue: Queue) => {
        (queue.textChannel as TextChannel).send("Disconnected from voice channel.");
    })
    .on("error" as keyof DisTubeEvents, (error: Error, queue?: Queue) => {
        console.error("Error occurred:", error);
        if (queue && queue.textChannel) {
            (queue.textChannel as TextChannel).send(`An error occurred: ${error.message}`);
        }
    });

// Uncomment the following code to handle messages and commands
// Note: This code is commented out to avoid conflicts with the server's message handling.
// If you want to enable command handling, you can uncomment this section.
// client.on("messageCreate", async (message) => {
//     if (message.author.bot) return; // Ignore bot messages

//     // Check if the message is a command
//     if (message.content === "!ping") {
//         await message.reply("Pong!");
//     }
// });

// Interaction handling for slash commands
client.on("interactionCreate", async (interaction) => {
    if(!interaction.isChatInputCommand()) return;

    switch (interaction.commandName) {
        case "ping":
            await interaction.reply("Pong!");
            break;
        case "ask":
            await handleAsk(interaction);
            break;
        case "connect":
            await handleConnect(interaction);
            break;
        case "play":
            await handlePlay(interaction);
            break;
        case "pause":
            await handlePause(interaction);
            break;
        case "stop":
            await handleStop(interaction);
            break;
        case "resume":
            await handleResume(interaction);
            break;
        case "disconnect":
            await handleDisconnect(interaction);
            break;
        case "mute":
            await handleMute(interaction);
            break;
        case "unmute":
            await handleUnmute(interaction);
            break;
        default:
            await interaction.reply("Unknown command.");
            break;
    }
});

export const sendMessageToChannel = async (text: string) => {
    if (!defaultChannel) throw new Error("Default channel is not set.");
    await defaultChannel.send(text);
}

export const startBot = async () => {
    const token = process.env.DISCORD_TOKEN_ID;
    if (!token) {
        throw new Error("DISCORD_BOT_TOKEN is not set in environment variables.");
    }
    await client.login(token);
};
