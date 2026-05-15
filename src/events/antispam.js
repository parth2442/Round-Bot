const {
  EmbedBuilder
} = require('discord.js');

const spamMap = new Map();

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

    const key =
      `${message.guild.id}_${message.author.id}`;

    if (!spamMap.has(key)) {

      spamMap.set(key, 1);

      setTimeout(() => {

        spamMap.delete(key);

      }, 5000);

    } else {

      spamMap.set(
        key,
        spamMap.get(key) + 1
      );

    }

    const count =
      spamMap.get(key);

    if (count < 5) return;

    try {

      const messages =
        await message.channel.messages.fetch({
          limit: 10
        });

      const userMessages =
        messages.filter(msg =>
          msg.author.id === message.author.id
        );

      for (const msg of userMessages.values()) {

        await msg.delete().catch(() => {});

      }

      const embed = new EmbedBuilder()

        .setColor('Orange')

        .setTitle('⚠ Spam Detected')

        .setDescription(
          `Your messages were removed in **${message.guild.name}** because spam is not allowed.`
        )

        .addFields(

          {
            name: '📍 Channel',
            value: `${message.channel}`,
            inline: true
          },

          {
            name: '📊 Detection',
            value: 'Message Spam',
            inline: true
          }

        )

        .setFooter({
          text: 'Empire Bot Protection System'
        })

        .setTimestamp();

      await message.author.send({

        embeds: [embed]

      }).catch(() => {});

      spamMap.delete(key);

    } catch (error) {

      console.error(error);

    }

  },

};