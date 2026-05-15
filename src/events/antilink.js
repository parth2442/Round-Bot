const {
  EmbedBuilder
} = require('discord.js');

module.exports = {

  name: 'messageCreate',

  async execute(message) {

    if (message.author.bot) return;

    if (!message.guild) return;

    if (
      message.member.permissions.has(
        'Administrator'
      )
    ) return;

    const content =
      message.content.toLowerCase();

    const blockedWords = [

      'http',
      'https',
      'discord.gg'

    ];

    const hasLink =
      blockedWords.some(word =>
        content.includes(word)
      );

    if (!hasLink) return;

    try {

      await message.delete();

      const embed = new EmbedBuilder()

        .setColor('Red')

        .setTitle('⚠ Link Blocked')

        .setDescription(
          `Your message was removed in **${message.guild.name}** because links are not allowed.`
        )

        .addFields(

          {
            name: '📍 Channel',
            value: `${message.channel}`,
            inline: true
          },

          {
            name: '💬 Message',
            value: message.content.slice(0, 1000),
            inline: false
          }

        )

        .setFooter({
          text: 'Empire Bot Protection System'
        })

        .setTimestamp();

      await message.author.send({

        embeds: [embed]

      }).catch(() => {});

    } catch (error) {

      console.error(error);

    }

  },

};