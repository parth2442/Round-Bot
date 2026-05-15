const {
  ChannelType,
  PermissionsBitField,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

const {
  createTranscript
} = require('discord-html-transcripts');

const db =
  require('../database/database');

module.exports = {

  name: 'interactionCreate',

  async execute(interaction) {

    if (!interaction.isButton()) return;

    /*
    =========================
    CREATE TICKET
    =========================
    */

    if (
      interaction.customId === 'create_ticket'
    ) {

      const existing =
        interaction.guild.channels.cache.find(
          c =>
            c.topic === interaction.user.id
        );

      if (existing) {

        return interaction.reply({

          content:
            `❌ You already have a ticket: ${existing}`,

          ephemeral: true

        });

      }

      const staffRoleId =
        await db.get(
          `staffrole_${interaction.guild.id}`
        );

      const supportRole =
        interaction.guild.roles.cache.get(
          staffRoleId
        );

      const channel =
        await interaction.guild.channels.create({

          name:
            `ticket-${interaction.user.username}`,

          type: ChannelType.GuildText,

          topic: interaction.user.id,

          permissionOverwrites: [

            {
              id: interaction.guild.id,

              deny: [
                PermissionsBitField.Flags.ViewChannel
              ]

            },

            {
              id: interaction.user.id,

              allow: [

                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages,
                PermissionsBitField.Flags.ReadMessageHistory

              ]

            },

            ...(supportRole ? [{

              id: supportRole.id,

              allow: [

                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages,
                PermissionsBitField.Flags.ReadMessageHistory

              ]

            }] : [])

          ]

        });

      const embed = new EmbedBuilder()

        .setColor('#5865F2')

        .setTitle('🎫 Ticket Created')

        .setDescription(
`Support will assist you shortly.`
        )

        .addFields(

          {
            name: '👤 User',
            value: `${interaction.user}`,
            inline: true
          },

          {
            name: '📌 Ticket',
            value: `${channel}`,
            inline: true
          }

        )

        .setFooter({
          text: 'Empire Bot Ticket System'
        })

        .setTimestamp();

      const closeButton =
        new ButtonBuilder()

          .setCustomId('close_ticket')

          .setLabel('Close Ticket')

          .setEmoji('🔒')

          .setStyle(ButtonStyle.Danger);

      const row =
        new ActionRowBuilder()
          .addComponents(closeButton);

      await channel.send({

        content:
          `${interaction.user} ${supportRole ? `<@&${supportRole.id}>` : ''}`,

        embeds: [embed],

        components: [row]

      });

      return interaction.reply({

        content:
          `✅ Ticket created: ${channel}`,

        ephemeral: true

      });

    }

    /*
    =========================
    CLOSE TICKET
    =========================
    */

    if (
      interaction.customId === 'close_ticket'
    ) {

      await interaction.reply({

        content:
          '📁 Saving transcript...\n🔒 Closing ticket in 5 seconds.',

        ephemeral: true

      });

      const transcript =
        await createTranscript(
          interaction.channel,
          {

            limit: -1,

            returnType: 'attachment',

            filename:
              `${interaction.channel.name}.html`

          }
        );

      const transcriptChannelId =
        await db.get(
          `transcript_${interaction.guild.id}`
        );

      const transcriptChannel =
        interaction.guild.channels.cache.get(
          transcriptChannelId
        );

      if (transcriptChannel) {

        await transcriptChannel.send({

          content:
            `📁 Transcript from ${interaction.channel.name}`,

          files: [transcript]

        });

      }

      setTimeout(async () => {

        await interaction.channel.delete()
          .catch(() => {});

      }, 5000);

    }

  },

};