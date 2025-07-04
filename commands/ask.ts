import type { ChatInputCommandInteraction } from "discord.js";
import { askGemini } from "../api/gemini";

export default async function handleAsk(interaction: ChatInputCommandInteraction) {
    const prompt = interaction.options.getString("prompt", true);
    // Uncomment if you want to include the username in the reply
    // const username = interaction.user.username;
    await interaction.deferReply();
    try {
        const response = await askGemini(prompt);
        // Uncomment if you want to use the username in the reply
        // await interaction.editReply(`**${username}** used \`ask\`: ${prompt}\n\n**Answers:**\n${response}`);

        // Directly reply with the response
        await interaction.editReply(response);
    } catch (error) {
        console.error("Error handling ask command:", error);
        await interaction.editReply("An error occurred while processing your request.");
    }
}