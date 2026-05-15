const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits
} = require('discord.js');

const db =
  require('../database/database');

function createEmbed(title, description, color = 'Blue') {

  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setTimestamp();

}

module.exports = {

  data: new SlashCommandBuilder()

    .setName('settranscript')

    .setDescription('Set transcript logs channel')

    .addChannelOption(option =>
      option
        .setName('channel')
        .setDescription('Transcript channel')
        .setRequired(true)
    )

    .setDefaultMemberPermissions(
      PermissionFlagsBits.Administrator
    ),

  async execute(interaction) {

    const channel =
      interaction.options.getChannel(
        'channel'
      );

    await db.set(
      `transcript_${interaction.guild.id}`,
      channel.id
    );

    await interaction.reply({

      embeds: [

        createEmbed(
          '✅ Transcript Channel Set',
          `Transcript channel set to ${channel}`
        )

      ]

    });

  },

  async executePrefix(message) {

    if (
      !message.member.permissions.has(
        PermissionFlagsBits.Administrator
      )
    ) {

      return message.reply({
        embeds: [

          createEmbed(
            '❌ Error',
            'Administrator permission required.',
            'Red'
          )

        ]
      });

    }

    const channel =
      message.mentions.channels.first();

    if (!channel) {

      return message.reply({
        embeds: [

          createEmbed(
            '❌ Error',
            'Mention a channel.',
            'Red'
          )

        ]
      });

    }

    await db.set(
      `transcript_${message.guild.id}`,
      channel.id
    );

    return message.reply({

      embeds: [

        createEmbed(
          '✅ Transcript Channel Set',
          `Transcript channel set to ${channel}`
        )

      ]

    });

  },

};