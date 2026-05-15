const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits
} = require('discord.js');

module.exports = {

  data: new SlashCommandBuilder()

    .setName('setup-ticket')

    .setDescription('Setup ticket panel')

    .addChannelOption(option =>
      option
        .setName('channel')
        .setDescription('Ticket panel channel')
        .setRequired(true)
    )

    .setDefaultMemberPermissions(
      PermissionFlagsBits.Administrator
    ),

  async execute(interaction) {

    const targetChannel =
      interaction.options.getChannel(
        'channel'
      );

    const embed = new EmbedBuilder()

      .setColor('#5865F2')

      .setTitle('🎫 Support Tickets')

      .setDescription(
`Need help?\nClick the button below to create a support ticket.`
      )

      .setFooter({
        text: 'Empire Bot Ticket System'
      })

      .setTimestamp();

    const button =
      new ButtonBuilder()

        .setCustomId('create_ticket')

        .setLabel('Create Ticket')

        .setEmoji('🎫')

        .setStyle(ButtonStyle.Primary);

    const row =
      new ActionRowBuilder()
        .addComponents(button);

    await targetChannel.send({

      embeds: [embed],
      components: [row]

    });

    await interaction.reply({

      content:
        `✅ Ticket panel sent in ${targetChannel}`,

      ephemeral: true

    });

  },

  async executePrefix(message, args) {

    if (
      !message.member.permissions.has(
        PermissionFlagsBits.Administrator
      )
    ) {

      return message.reply(
        '❌ Administrator permission required.'
      );

    }

    const targetChannel =
      message.mentions.channels.first();

    if (!targetChannel) {

      return message.reply(
        '❌ Mention a channel.'
      );

    }

    const embed = new EmbedBuilder()

      .setColor('#5865F2')

      .setTitle('🎫 Support Tickets')

      .setDescription(
`Need help?\nClick the button below to create a support ticket.`
      )

      .setFooter({
        text: 'Empire Bot Ticket System'
      })

      .setTimestamp();

    const button =
      new ButtonBuilder()

        .setCustomId('create_ticket')

        .setLabel('Create Ticket')

        .setEmoji('🎫')

        .setStyle(ButtonStyle.Primary);

    const row =
      new ActionRowBuilder()
        .addComponents(button);

    await targetChannel.send({

      embeds: [embed],
      components: [row]

    });

    await message.reply(
      `✅ Ticket panel sent in ${targetChannel}`
    );

  },

};