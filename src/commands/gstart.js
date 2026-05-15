const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

module.exports = {

  data: new SlashCommandBuilder()

    .setName('gstart')

    .setDescription('Start a giveaway')

    .addIntegerOption(option =>
      option
        .setName('minutes')
        .setDescription('Giveaway duration')
        .setRequired(true)
    )

    .addIntegerOption(option =>
      option
        .setName('winners')
        .setDescription('Number of winners')
        .setRequired(true)
    )

    .addStringOption(option =>
      option
        .setName('prize')
        .setDescription('Giveaway prize')
        .setRequired(true)
    )

    .setDefaultMemberPermissions(
      PermissionFlagsBits.ManageGuild
    ),

  async execute(interaction) {

    const minutes =
      interaction.options.getInteger(
        'minutes'
      );

    const winnersCount =
      interaction.options.getInteger(
        'winners'
      );

    const prize =
      interaction.options.getString(
        'prize'
      );

    const endTime =
      Date.now() + minutes * 60 * 1000;

    const embed = new EmbedBuilder()

      .setColor('#5865F2')

      .setTitle('🎉 Giveaway')

      .setDescription(
`Prize: **${prize}**

⏰ Ends: <t:${Math.floor(endTime / 1000)}:R>
🏆 Winners: ${winnersCount}
🎁 Hosted by: ${interaction.user}`
      )

      .setFooter({
        text: 'Click the button below to join!'
      })

      .setTimestamp();

    const button =
      new ButtonBuilder()

        .setCustomId('join_giveaway')

        .setLabel('Join Giveaway')

        .setEmoji('🎉')

        .setStyle(ButtonStyle.Primary);

    const row =
      new ActionRowBuilder()
        .addComponents(button);

    const giveawayMessage =
      await interaction.channel.send({

        embeds: [embed],

        components: [row]

      });

    await interaction.reply({

      content:
        '✅ Giveaway started.',

      ephemeral: true

    });

    const participants =
      new Set();

    const collector =
      giveawayMessage.createMessageComponentCollector({

        time: minutes * 60 * 1000

      });

    collector.on(
      'collect',
      async i => {

        if (
          i.customId !== 'join_giveaway'
        ) return;

        participants.add(i.user.id);

        await i.reply({

          content:
            '✅ You joined the giveaway.',

          ephemeral: true

        });

      }
    );

    collector.on(
      'end',
      async () => {

        const users =
          [...participants];

        if (
          users.length === 0
        ) {

          return interaction.channel.send(
            '❌ No participants joined.'
          );

        }

        const winners = [];

        for (
          let i = 0;
          i < winnersCount;
          i++
        ) {

          const random =
            users[
              Math.floor(
                Math.random() * users.length
              )
            ];

          if (!winners.includes(random)) {

            winners.push(random);

          }

        }

        interaction.channel.send({

          content:
`🎉 Congratulations ${winners.map(id => `<@${id}>`).join(', ')}

You won **${prize}**!`

        });

      }
    );

  },

  async executePrefix(message, args) {

    if (
      !message.member.permissions.has(
        PermissionFlagsBits.ManageGuild
      )
    ) {

      return message.reply(
        '❌ Manage Server permission required.'
      );

    }

    const minutes =
      parseInt(args[0]);

    const winnersCount =
      parseInt(args[1]);

    const prize =
      args.slice(2).join(' ');

    if (
      !minutes ||
      !winnersCount ||
      !prize
    ) {

      return message.reply(
`❌ Usage:
!gstart <minutes> <winners> <prize>`
      );

    }

    const endTime =
      Date.now() + minutes * 60 * 1000;

    const embed = new EmbedBuilder()

      .setColor('#5865F2')

      .setTitle('🎉 Giveaway')

      .setDescription(
`Prize: **${prize}**

⏰ Ends: <t:${Math.floor(endTime / 1000)}:R>
🏆 Winners: ${winnersCount}
🎁 Hosted by: ${message.author}`
      )

      .setFooter({
        text: 'Click the button below to join!'
      })

      .setTimestamp();

    const button =
      new ButtonBuilder()

        .setCustomId('join_giveaway')

        .setLabel('Join Giveaway')

        .setEmoji('🎉')

        .setStyle(ButtonStyle.Primary);

    const row =
      new ActionRowBuilder()
        .addComponents(button);

    const giveawayMessage =
      await message.channel.send({

        embeds: [embed],

        components: [row]

      });

    const participants =
      new Set();

    const collector =
      giveawayMessage.createMessageComponentCollector({

        time: minutes * 60 * 1000

      });

    collector.on(
      'collect',
      async i => {

        if (
          i.customId !== 'join_giveaway'
        ) return;

        participants.add(i.user.id);

        await i.reply({

          content:
            '✅ You joined the giveaway.',

          ephemeral: true

        });

      }
    );

    collector.on(
      'end',
      async () => {

        const users =
          [...participants];

        if (
          users.length === 0
        ) {

          return message.channel.send(
            '❌ No participants joined.'
          );

        }

        const winners = [];

        for (
          let i = 0;
          i < winnersCount;
          i++
        ) {

          const random =
            users[
              Math.floor(
                Math.random() * users.length
              )
            ];

          if (!winners.includes(random)) {

            winners.push(random);

          }

        }

        message.channel.send({

          content:
`🎉 Congratulations ${winners.map(id => `<@${id}>`).join(', ')}

You won **${prize}**!`

        });

      }
    );

  },

};