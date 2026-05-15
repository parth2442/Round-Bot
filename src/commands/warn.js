const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits
} = require('discord.js');

function createEmbed(title, description, color = 'Yellow') {

  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setTimestamp();

}

module.exports = {

  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a member')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('User to warn')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('reason')
        .setDescription('Reason for warning')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(
      PermissionFlagsBits.ModerateMembers
    ),

  async execute(interaction) {

    const target =
      interaction.options.getMember('user');

    const reason =
      interaction.options.getString('reason')
      || 'No reason provided';

    if (!target) {

      const embed = createEmbed(
        '❌ Error',
        'User not found.',
        'Red'
      );

      return interaction.reply({
        embeds: [embed],
        ephemeral: true
      });

    }

    const embed = createEmbed(
      '⚠️ User Warned',
      `👤 ${target.user.tag}\n📄 ${reason}`,
      'Yellow'
    );

    await interaction.reply({
      embeds: [embed]
    });

  },

  async executePrefix(message, args) {

    if (
      !message.member.permissions.has(
        PermissionFlagsBits.ModerateMembers
      )
    ) {

      const embed = createEmbed(
        '❌ Error',
        'You do not have permission.',
        'Red'
      );

      return message.reply({
        embeds: [embed]
      });

    }

    const target =
      message.mentions.members.first();

    const reason =
      args.slice(1).join(' ')
      || 'No reason provided';

    if (!target) {

      const embed = createEmbed(
        '❌ Error',
        'Mention a user.',
        'Red'
      );

      return message.reply({
        embeds: [embed]
      });

    }

    const embed = createEmbed(
      '⚠️ User Warned',
      `👤 ${target.user.tag}\n📄 ${reason}`,
      'Yellow'
    );

    await message.channel.send({
      embeds: [embed]
    });

  },

};