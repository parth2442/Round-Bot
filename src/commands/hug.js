const {
  SlashCommandBuilder,
  EmbedBuilder
} = require('discord.js');

module.exports = {

  data: new SlashCommandBuilder()

    .setName('hug')

    .setDescription(
      'Hug someone'
    )

    .addUserOption(option =>

      option

        .setName('user')

        .setDescription(
          'User to hug'
        )

        .setRequired(true)

    ),

  async execute(interaction) {

    const user =
      interaction.options.getUser(
        'user'
      );

    const gifs = [

      'https://media.giphy.com/media/l2QDM9Jnim1YVILXa/giphy.gif',

      'https://media.giphy.com/media/od5H3PmEG5EVq/giphy.gif',

      'https://media.giphy.com/media/143vPc6b08locw/giphy.gif'

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

        .setColor('#ff66cc')

        .setTitle(
          '🤝 Hug'
        )

        .setDescription(
`${interaction.user} hugged ${user} 💖`
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

      'https://media.giphy.com/media/l2QDM9Jnim1YVILXa/giphy.gif',

      'https://media.giphy.com/media/od5H3PmEG5EVq/giphy.gif',

      'https://media.giphy.com/media/143vPc6b08locw/giphy.gif'

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

        .setColor('#ff66cc')

        .setTitle(
          '🤝 Hug'
        )

        .setDescription(
`${message.author} hugged ${user} 💖`
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