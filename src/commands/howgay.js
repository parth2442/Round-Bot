const {
  SlashCommandBuilder,
  EmbedBuilder
} = require('discord.js');

module.exports = {

  data: new SlashCommandBuilder()

    .setName('howgay')

    .setDescription(
      'Check how gay someone is'
    )

    .addUserOption(option =>

      option

        .setName('user')

        .setDescription(
          'User to check'
        )

        .setRequired(false)

    ),

  async execute(interaction) {

    const user =
      interaction.options.getUser(
        'user'
      ) || interaction.user;

    const percentage =

      Math.floor(
        Math.random() * 101
      );

    const embed =

      new EmbedBuilder()

        .setColor('#ff66cc')

        .setTitle(
          '🌈 How Gay Machine'
        )

        .setDescription(
`${user} is **${percentage}%** gay 😭🔥`
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

  async executePrefix(message) {

    const user =
      message.mentions.users.first() ||
      message.author;

    const percentage =

      Math.floor(
        Math.random() * 101
      );

    const embed =

      new EmbedBuilder()

        .setColor('#ff66cc')

        .setTitle(
          '🌈 How Gay Machine'
        )

        .setDescription(
`${user} is **${percentage}%** gay 😭🔥`
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