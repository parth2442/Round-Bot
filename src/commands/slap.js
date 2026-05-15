const {
  SlashCommandBuilder,
  EmbedBuilder
} = require('discord.js');

module.exports = {

  data: new SlashCommandBuilder()

    .setName('slap')

    .setDescription(
      'Slap someone'
    )

    .addUserOption(option =>

      option

        .setName('user')

        .setDescription(
          'User to slap'
        )

        .setRequired(true)

    ),

  async execute(interaction) {

    const user =
      interaction.options.getUser(
        'user'
      );

    const gifs = [

      'https://media.giphy.com/media/Gf3AUz3eBNbTW/giphy.gif',

      'https://media.giphy.com/media/Zau0yrl17uzdK/giphy.gif',

      'https://media.giphy.com/media/jLeyZWgtwgr2U/giphy.gif'

    ];

    const gif =

      gifs[
        Math.floor(
          Math.random() *
          gifs.length
        )
      ];

    const embed =

      new EmbedBuilder()

        .setColor('#ff4d4d')

        .setTitle(
          '👋 Slap'
        )

        .setDescription(
`${interaction.user} slapped ${user} 😭🔥`
        )

        .setImage(gif)

        .setFooter({

          text:
            'Round Bot • Roleplay'

        });

    await interaction.reply({

      embeds: [embed]

    });

  },

  async executePrefix(message) {

    const user =
      message.mentions.users.first();

    if (!user) {

      return message.reply(
        '❌ Mention a user.'
      );

    }

    const gifs = [

      'https://media.giphy.com/media/Gf3AUz3eBNbTW/giphy.gif',

      'https://media.giphy.com/media/Zau0yrl17uzdK/giphy.gif',

      'https://media.giphy.com/media/jLeyZWgtwgr2U/giphy.gif'

    ];

    const gif =

      gifs[
        Math.floor(
          Math.random() *
          gifs.length
        )
      ];

    const embed =

      new EmbedBuilder()

        .setColor('#ff4d4d')

        .setTitle(
          '👋 Slap'
        )

        .setDescription(
`${message.author} slapped ${user} 😭🔥`
        )

        .setImage(gif)

        .setFooter({

          text:
            'Round Bot • Roleplay'

        });

    await message.channel.send({

      embeds: [embed]

    });

  }

};