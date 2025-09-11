import { REST, Routes, SlashCommandBuilder } from "discord.js";
import "dotenv/config";

const commands = [
    new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
    new SlashCommandBuilder()
    .setName("ask")
    .setDescription("Ask a question to the bot")
    .addStringOption(option =>
        option.setName("prompt")
        .setDescription("The question you want to ask the bot")
        .setRequired(true)
    ),
    new SlashCommandBuilder()
    .setName("connect")
    .setDescription("Connects to your voice channel"),
    new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a song from your query")
    .addStringOption(option => 
        option.setName("query")
        .setDescription("The song you want to play")
        .setRequired(true)
    ),
    new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pauses the current song"),
    new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stops the current song"),
    new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Resumes the paused song"),
    new SlashCommandBuilder()
    .setName("disconnect")
    .setDescription("Disconnects from the voice channel"),
    new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Mutes a member for a specified duration")
    .addUserOption(option =>
        option.setName("user")
        .setDescription("The user to mute")
        .setRequired(true)
    )
    .addIntegerOption(option =>
        option.setName("duration")
        .setDescription("Duration in minutes (default: 10, max: 40320)")
        .setRequired(false)
        .setMinValue(1)
        .setMaxValue(40320)
    )
    .addStringOption(option =>
        option.setName("reason")
        .setDescription("Reason for muting")
        .setRequired(false)
    ),
    new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("Unmutes a member")
    .addUserOption(option =>
        option.setName("user")
        .setDescription("The user to unmute")
        .setRequired(true)
    )
    .addStringOption(option =>
        option.setName("reason")
        .setDescription("Reason for unmuting")
        .setRequired(false)
    ),
    new SlashCommandBuilder()
    .setName("rename")
    .setDescription("Renames/update your server nickname")
    .addStringOption(option =>
        option.setName("nickname")
        .setDescription("Your new nickname")
        .setRequired(true)
    )
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN_ID || '');

(async () => {
    try {
        console.log("Started refreshing application (/) commands.");

        await rest.put(
            Routes.applicationCommands(process.env.DISCORD_CLIENT_ID || ''),
            {body: commands}
        );
        console.log("Successfully registered application (/) commands.");
    } catch (error) {
        console.error("Error refreshing application commands:", error);
    }
})();
