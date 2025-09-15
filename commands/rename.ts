import type { ChatInputCommandInteraction, GuildMember } from "discord.js";

export default async function handleRename(interaction: ChatInputCommandInteraction) {
    try {
        await interaction.deferReply();

        if (!interaction.guild || !interaction.member) {
            return await interaction.editReply("This command can only be used in a server.");
        }

        const executor = interaction.member as GuildMember;
        const targetUser = interaction.options.getUser("user");
        const newNickname = interaction.options.getString("nickname", true);

        // Determine if this is a self-rename or admin-rename
        let targetMember: GuildMember;
        let isAdminRename = false;

        if (targetUser) {
            // Admin rename - trying to rename another user
            isAdminRename = true;
            
            // Check if the executor has permission to manage nicknames of others
            const hasManageNicknamesPermission = executor.permissions.has("ManageNicknames");
            const hasModeratorRole = executor.roles.cache.some(role => 
                role.name.toLowerCase().includes("A") || 
                role.name.toLowerCase().includes("Delegates") || 
                role.permissions.has("ManageNicknames") ||
                role.permissions.has("Administrator")
            );

            if (!hasManageNicknamesPermission && !hasModeratorRole) {
                return await interaction.editReply("You don't have permission to rename other members. You can only rename yourself by using this command without specifying a user.");
            }

            // Get the target member
            try {
                targetMember = await interaction.guild.members.fetch(targetUser.id);
            } catch (error) {
                return await interaction.editReply("Could not find that user in this server.");
            }

            // Check if executor can manage the target member (role hierarchy)
            if (targetMember.roles.highest.position >= executor.roles.highest.position && executor.id !== interaction.guild.ownerId) {
                return await interaction.editReply("You cannot rename this user because their highest role is equal to or higher than yours.");
            }

            // Check if trying to rename the server owner
            if (targetMember.id === interaction.guild.ownerId && executor.id !== interaction.guild.ownerId) {
                return await interaction.editReply("You cannot rename the server owner.");
            }
        } else {
            // Self rename
            targetMember = executor;
        }

        // Validate nickname
        if (newNickname.length > 32) {
            return await interaction.editReply("Nickname cannot be longer than 32 characters.");
        }

        if (newNickname.trim().length === 0) {
            return await interaction.editReply("Nickname cannot be empty.");
        }

        // Check if the bot has permission to manage nicknames
        if (!interaction.guild.members.me?.permissions.has("ManageNicknames")) {
            return await interaction.editReply("I don't have permission to manage nicknames in this server.");
        }

        // Check if the bot's role is high enough to change the target member's nickname
        if (targetMember.roles.highest.position >= interaction.guild.members.me.roles.highest.position) {
            const targetName = isAdminRename ? `${targetMember.displayName}'s` : "your";
            return await interaction.editReply(`I cannot change ${targetName} nickname because ${isAdminRename ? "their" : "your"} highest role is equal to or higher than mine.`);
        }

        const oldNickname = targetMember.displayName;

        try {
            await targetMember.setNickname(newNickname);
            
            if (isAdminRename) {
                await interaction.editReply(`Successfully changed **${targetMember.user.username}**'s nickname from **${oldNickname}** to **${newNickname}**`);
            } else {
                await interaction.editReply(`Successfully changed your nickname from **${oldNickname}** to **${newNickname}**`);
            }
        } catch (error) {
            console.error("Error changing nickname:", error);
            const targetName = isAdminRename ? `${targetMember.displayName}'s` : "your";
            await interaction.editReply(`Failed to change ${targetName} nickname. This might be due to insufficient permissions or Discord API issues.`);
        }

    } catch (error) {
        console.error("Error in handleRename:", error);
        try {
            await interaction.editReply("An error occurred while trying to change the nickname.");
        } catch (err) {
            console.error("Failed to edit reply (interaction may be expired):", err);
        }
    }
}
