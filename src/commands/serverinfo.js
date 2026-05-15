const {
  SlashCommandBuilder,
  EmbedBuilder
} = require('discord.js');

module.exports = {

  data: new SlashCommandBuilder()

    .setName('serverinfo')

    .setDescription(
      'Show server information'
    ),

  async execute(interaction) {

    const guild =
      interaction.guild;

    const embed =
      new EmbedBuilder()

        .setColor('#00d5ff')

        .setTitle(
          `📌 ${guild.name} Server Info`
        )

        .setThumbnail(
          guild.iconURL({
            dynamic: true
          })
        )

        .addFields(

          {
            name: '👑 Owner',
            value:
              `<@${guild.ownerId}>`,
            inline: true
          },

          {
            name: '👥 Members',
            value:
              `${guild.memberCount}`,
            inline: true
          },

          {
            name: '📅 Created',
            value:
              `<t:${parseInt(guild.createdTimestamp / 1000)}:R>`,
            inline: true
          },

          {
            name: '🆔 Server ID',
            value:
              guild.id,
            inline: false
          }

        )

        .setFooter({

          text:
            'Round Bot • Server Information'

        })

        .setTimestamp();

    await interaction.reply({

      embeds: [embed]

    });

  },

  async executePrefix(message) {

    const guild =
      message.guild;

    const embed =
      new EmbedBuilder()

        .setColor('#00d5ff')

        .setTitle(
          `📌 ${guild.name} Server Info`
        )

        .setThumbnail(
          guild.iconURL({
            dynamic: true
          })
        )

        .addFields(

          {
            name: '👑 Owner',
            value:
              `<@${guild.ownerId}>`,
            inline: true
          },

          {
            name: '👥 Members',
            value:
              `${guild.memberCount}`,
            inline: true
          },

          {
            name: '📅 Created',
            value:
              `<t:${parseInt(guild.createdTimestamp / 1000)}:R>`,
            inline: true
          },

          {
            name: '🆔 Server ID',
            value:
              guild.id,
            inline: false
          }

        )

        .setFooter({

          text:
            'Round Bot • Server Information'

        })

        .setTimestamp();

    await message.channel.send({

      embeds: [embed]

    });

  }

};