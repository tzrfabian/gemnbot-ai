import type { ChatInputCommandInteraction, GuildMember } from "discord.js";

export default async function handleRename(interaction: ChatInputCommandInteraction) {
    try {
        await interaction.deferReply();

        if (!interaction.guild || !interaction.member) {
            return await interaction.editReply("This command can only be used in a server.");
        }

        const member = interaction.member as GuildMember;
        const newNickname = interaction.options.getString("nickname", true);

        // Check if the nickname is too long (Discord limit is 32 characters)
        if (newNickname.length > 32) {
            return await interaction.editReply("Nickname cannot be longer than 32 characters.");
        }

        // Check if the nickname is empty or only whitespace
        if (newNickname.trim().length === 0) {
            return await interaction.editReply("Nickname cannot be empty.");
        }

        // Check if the bot has permission to manage nicknames
        if (!interaction.guild.members.me?.permissions.has("ManageNicknames")) {
            return await interaction.editReply("I don't have permission to manage nicknames in this server.");
        }

        // Check if the user is trying to change the server owner's nickname
        if (member.id === interaction.guild.ownerId) {
            return await interaction.editReply("Server owners cannot change their nickname using this command.");
        }

        // Check if the bot's role is high enough to change this user's nickname
        if (member.roles.highest.position >= interaction.guild.members.me.roles.highest.position) {
            return await interaction.editReply("I cannot change your nickname because your highest role is equal to or higher than mine.");
        }

        const oldNickname = member.displayName;

        try {
            await member.setNickname(newNickname);
            await interaction.editReply(`Successfully changed your nickname from **${oldNickname}** to **${newNickname}**`);
        } catch (error) {
            console.error("Error changing nickname:", error);
            await interaction.editReply("Failed to change your nickname. This might be due to insufficient permissions or Discord API issues.");
        }

    } catch (error) {
        console.error("Error in handleRename:", error);
        try {
            await interaction.editReply("An error occurred while trying to change your nickname.");
        } catch (err) {
            console.error("Failed to edit reply (interaction may be expired):", err);
        }
    }
}
