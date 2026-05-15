const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits
} = require('discord.js');

function createEmbed(target, reason, user) {

  return new EmbedBuilder()
    .setColor('Red')
    .setTitle('🔨 User Banned')
    .addFields(
      {
        name: '👤 User',
        value: `${target.user.tag}`,
        inline: true
      },
      {
        name: '📄 Reason',
        value: reason,
        inline: true
      }
    )
    .setFooter({
      text: `Action by ${user.username}`
    })
    .setTimestamp();

}

module.exports = {

  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('User to ban')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('reason')
        .setDescription('Reason for ban')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(
      PermissionFlagsBits.BanMembers
    ),

  async execute(interaction) {

    const target =
      interaction.options.getMember('user');

    const reason =
      interaction.options.getString('reason')
      || 'No reason provided';

    if (!target) {

      return interaction.reply({
        content: '❌ User not found.',
        ephemeral: true
      });

    }

    if (!target.bannable) {

      return interaction.reply({
        content: '❌ Cannot ban this user.',
        ephemeral: true
      });

    }

    await target.ban({ reason });

    const embed = createEmbed(
      target,
      reason,
      interaction.user
    );

    await interaction.reply({
      embeds: [embed]
    });

  },

  async executePrefix(message, args) {

    if (
      !message.member.permissions.has(
        PermissionFlagsBits.BanMembers
      )
    ) {

      return message.reply(
        '❌ You do not have permission.'
      );

    }

    const target =
      message.mentions.members.first();

    const reason =
      args.slice(1).join(' ')
      || 'No reason provided';

    if (!target) {

      return message.reply(
        '❌ Mention a user to ban.'
      );

    }

    if (!target.bannable) {

      return message.reply(
        '❌ Cannot ban this user.'
      );

    }

    await target.ban({ reason });

    const embed = createEmbed(
      target,
      reason,
      message.author
    );

    await message.channel.send({
      embeds: [embed]
    });

  },

};