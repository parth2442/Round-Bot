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

    .setName('setlog')

    .setDescription('Set logs channel')

    .addChannelOption(option =>
      option
        .setName('channel')
        .setDescription('Logs channel')
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
      `logs_${interaction.guild.id}`,
      channel.id
    );

    await interaction.reply({

      embeds: [

        createEmbed(
          '✅ Logs Channel Set',
          `Logs channel set to ${channel}`
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
      `logs_${message.guild.id}`,
      channel.id
    );

    await message.reply({

      embeds: [

        createEmbed(
          '✅ Logs Channel Set',
          `Logs channel set to ${channel}`
        )

      ]

    });

  },

};