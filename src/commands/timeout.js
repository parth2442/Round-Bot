const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits
} = require('discord.js');

function createEmbed(title, description, color = 'Orange') {

  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setTimestamp();

}

module.exports = {

  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout a member')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('User to timeout')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName('minutes')
        .setDescription('Timeout duration in minutes')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('reason')
        .setDescription('Reason')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(
      PermissionFlagsBits.ModerateMembers
    ),

  async execute(interaction) {

    const target =
      interaction.options.getMember('user');

    const minutes =
      interaction.options.getInteger('minutes');

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

    if (!target.moderatable) {

      const embed = createEmbed(
        '❌ Error',
        'Cannot timeout this user.',
        'Red'
      );

      return interaction.reply({
        embeds: [embed],
        ephemeral: true
      });

    }

    await target.timeout(
      minutes * 60 * 1000,
      reason
    );

    const embed = createEmbed(
      '⏳ User Timed Out',
      `👤 ${target.user.tag}\n⏱ ${minutes} minute(s)\n📄 ${reason}`
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

    const minutes = parseInt(args[1]);

    const reason =
      args.slice(2).join(' ')
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

    if (isNaN(minutes)) {

      const embed = createEmbed(
        '❌ Error',
        'Provide valid minutes.',
        'Red'
      );

      return message.reply({
        embeds: [embed]
      });

    }

    if (!target.moderatable) {

      const embed = createEmbed(
        '❌ Error',
        'Cannot timeout this user.',
        'Red'
      );

      return message.reply({
        embeds: [embed]
      });

    }

    await target.timeout(
      minutes * 60 * 1000,
      reason
    );

    const embed = createEmbed(
      '⏳ User Timed Out',
      `👤 ${target.user.tag}\n⏱ ${minutes} minute(s)\n📄 ${reason}`
    );

    await message.channel.send({
      embeds: [embed]
    });

  },

};