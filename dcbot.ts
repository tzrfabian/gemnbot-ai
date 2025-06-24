import { Client, GatewayIntentBits, TextChannel } from "discord.js";

export const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

let defaultChannel: TextChannel | null = null;

client.once("ready", () => {
    console.log(`Logged in as ${client.user?.tag}!`);
    const defaultChannelId = process.env.DEFAULT_CHANNEL_ID;
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

client.on("messageCreate", async (message) => {
    if (message.author.bot) return; // Ignore bot messages

    // Check if the message is a command
    if (message.content === "!ping") {
        await message.reply("Pong!");
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