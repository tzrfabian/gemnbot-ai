import type { ChatInputCommandInteraction, GuildMember } from "discord.js";

export default async function handleUnmute(interaction: ChatInputCommandInteraction) {
    try {
        await interaction.deferReply();

        // Check if the user has permission to moderate members
        const member = interaction.member as GuildMember;
        if (!member.permissions.has("ModerateMembers")) {
            return await interaction.editReply("❌ You don't have permission to unmute members.");
        }

        // Get the target user
        const targetUser = interaction.options.getUser("user");
        if (!targetUser) {
            return await interaction.editReply("❌ Please specify a user to unmute.");
        }

        // Get the target member - use fetch instead of cache for more reliability
        let targetMember;
        try {
            targetMember = await interaction.guild?.members.fetch(targetUser.id);
        } catch (fetchError) {
            return await interaction.editReply("❌ User not found in this server.");
        }

        if (!targetMember) {
            return await interaction.editReply("❌ User not found in this server.");
        }

        // Check if the target is actually muted
        if (!targetMember.isCommunicationDisabled()) {
            return await interaction.editReply("🔊 This user is not currently muted.");
        }

        const reason = interaction.options.getString("reason") || "No reason provided";

        // Remove the timeout (unmute the member)
        try {
            await targetMember.timeout(null, reason);
        } catch (timeoutError) {
            console.error("Failed to unmute user:", timeoutError);
            return await interaction.editReply("❌ Failed to unmute the user. Check bot permissions.");
        }

        await interaction.editReply(
            `🔊 **${targetUser.username}** has been unmuted.\n` +
            `**Reason:** ${reason}\n` +
            `**Moderator:** ${interaction.user.username}`
        );

    } catch (error) {
        console.error("Error in handleUnmute:", error);
        try {
            // Check if we can still edit the reply
            if (interaction.deferred || interaction.replied) {
                await interaction.editReply("❌ An error occurred while trying to unmute the user.");
            } else {
                await interaction.reply("❌ An error occurred while trying to unmute the user.");
            }
        } catch (err) {
            console.error("Failed to respond to interaction (interaction may be expired):", err);
        }
    }
}
