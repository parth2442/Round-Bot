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
    .setName('kick')
    .setDescription('Kick a member')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('User to kick')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('reason')
        .setDescription('Reason')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(
      PermissionFlagsBits.KickMembers
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

    if (!target.kickable) {

      const embed = createEmbed(
        '❌ Error',
        'Cannot kick this user.',
        'Red'
      );

      return interaction.reply({
        embeds: [embed],
        ephemeral: true
      });

    }

    await target.kick(reason);

    const embed = createEmbed(
      '👢 User Kicked',
      `👤 ${target.user.tag}\n📄 ${reason}`,
      'Orange'
    );

    await interaction.reply({
      embeds: [embed]
    });

  },

  async executePrefix(message, args) {

    if (
      !message.member.permissions.has(
        PermissionFlagsBits.KickMembers
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

    if (!target.kickable) {

      const embed = createEmbed(
        '❌ Error',
        'Cannot kick this user.',
        'Red'
      );

      return message.reply({
        embeds: [embed]
      });

    }

    await target.kick(reason);

    const embed = createEmbed(
      '👢 User Kicked',
      `👤 ${target.user.tag}\n📄 ${reason}`,
      'Orange'
    );

    await message.channel.send({
      embeds: [embed]
    });

  },

};