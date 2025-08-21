import type { ChatInputCommandInteraction, GuildMember } from "discord.js";

export default async function handleMute(interaction: ChatInputCommandInteraction) {
    try {
        await interaction.deferReply();

        // Check if the user has permission to mute members
        const member = interaction.member as GuildMember;
        if (!member.permissions.has("ModerateMembers")) {
            return await interaction.editReply("❌ You don't have permission to mute members.");
        }

        // Get the target user
        const targetUser = interaction.options.getUser("user");
        if (!targetUser) {
            return await interaction.editReply("❌ Please specify a user to mute.");
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

        // Check if the target is already muted
        if (targetMember.isCommunicationDisabled()) {
            return await interaction.editReply("🔇 This user is already muted.");
        }

        // Get duration (optional, defaults to 10 minutes)
        const duration = interaction.options.getInteger("duration") || 10;
        const reason = interaction.options.getString("reason") || "No reason provided";

        // Validate duration (Discord allows max 28 days = 40320 minutes)
        if (duration < 1 || duration > 40320) {
            return await interaction.editReply("❌ Duration must be between 1 minute and 28 days (40320 minutes).");
        }

        // Calculate timeout duration in milliseconds
        const timeoutDuration = duration * 60 * 1000;

        // Mute the member
        try {
            await targetMember.timeout(timeoutDuration, reason);
        } catch (timeoutError) {
            console.error("Failed to mute user:", timeoutError);
            return await interaction.editReply("❌ Failed to mute the user. Check bot permissions or maybe user have moderation roles.");
        }

        const durationText = duration === 1 ? "1 minute" : `${duration} minutes`;
        await interaction.editReply(
            `🔇 **${targetUser.username}** has been muted for **${durationText}**.\n` +
            `**Reason:** ${reason}\n` +
            `**Moderator:** ${interaction.user.username}`
        );

    } catch (error) {
        console.error("Error in handleMute:", error);
        try {
            // Check if we can still edit the reply
            if (interaction.deferred || interaction.replied) {
                await interaction.editReply("❌ An error occurred while trying to mute the user.");
            } else {
                await interaction.reply("❌ An error occurred while trying to mute the user.");
            }
        } catch (err) {
            console.error("Failed to respond to interaction (interaction may be expired):", err);
        }
    }
}
