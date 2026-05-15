const {
  SlashCommandBuilder,
  EmbedBuilder
} = require('discord.js');

module.exports = {

  data: new SlashCommandBuilder()

    .setName('8ball')

    .setDescription(
      'Ask the magic 8ball a question'
    )

    .addStringOption(option =>

      option

        .setName('question')

        .setDescription(
          'Your question'
        )

        .setRequired(true)

    ),

  async execute(interaction) {

    const question =
      interaction.options.getString(
        'question'
      );

    const replies = [

      'Yes 👀',
      'No 💀',
      'Definitely 😭🔥',
      'Probably 👑',
      'Never 😤',
      'Very likely 👀',
      'Ask again later 🤖',
      'Absolutely 💯',
      'I don’t think so 😭',
      'Without a doubt 🔥'

    ];

    const answer =

      replies[
        Math.floor(
          Math.random() *
          replies.length
        )
      ];

    const embed =

      new EmbedBuilder()

        .setColor('#00d5ff')

        .setTitle(
          '🎱 Magic 8Ball'
        )

        .addFields(

          {
            name:
              '❓ Question',

            value:
              question,

            inline: false
          },

          {
            name:
              '🎯 Answer',

            value:
              answer,

            inline: false
          }

        )

        .setFooter({

          text:
            'Round Bot • Fun Commands'

        })

        .setTimestamp();

    await interaction.reply({

      embeds: [embed]

    });

  },

  async executePrefix(message, args) {

    const question =
      args.join(' ');

    if (!question) {

      return message.reply(
        '❌ Ask a question.'
      );

    }

    const replies = [

      'Yes 👀',
      'No 💀',
      'Definitely 😭🔥',
      'Probably 👑',
      'Never 😤',
      'Very likely 👀',
      'Ask again later 🤖',
      'Absolutely 💯',
      'I don’t think so 😭',
      'Without a doubt 🔥'

    ];

    const answer =

      replies[
        Math.floor(
          Math.random() *
          replies.length
        )
      ];

    const embed =

      new EmbedBuilder()

        .setColor('#00d5ff')

        .setTitle(
          '🎱 Magic 8Ball'
        )

        .addFields(

          {
            name:
              '❓ Question',

            value:
              question,

            inline: false
          },

          {
            name:
              '🎯 Answer',

            value:
              answer,

            inline: false
          }

        )

        .setFooter({

          text:
            'Round Bot • Fun Commands'

        })

        .setTimestamp();

    await message.channel.send({

      embeds: [embed]

    });

  }

};