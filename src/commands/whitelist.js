const {
  SlashCommandBuilder,
  EmbedBuilder
} = require('discord.js');

const db =
require('../database/database');

module.exports = {

  data: new SlashCommandBuilder()

    .setName('whitelist')

    .setDescription(
      'Manage whitelist system'
    ),

  name: 'whitelist',

  async executePrefix(message, args) {

    if (
      !message.member.permissions.has(
        'Administrator'
      )
    ) {

      return message.reply(
        '❌ Administrator only.'
      );

    }

    const sub =
      args[0];

    const user =
      message.mentions.users.first();

    if (
      sub === 'add'
    ) {

      if (!user) {

        return message.reply(
          '❌ Mention a user.'
        );

      }

      await db.set(

        `whitelist_${message.guild.id}_${user.id}`,

        true

      );

      return message.reply(
`✅ ${user.tag} added to whitelist.`
      );

    }

    if (
      sub === 'remove'
    ) {

      if (!user) {

        return message.reply(
          '❌ Mention a user.'
        );

      }

      await db.delete(

        `whitelist_${message.guild.id}_${user.id}`

      );

      return message.reply(
`✅ ${user.tag} removed from whitelist.`
      );

    }

    if (
      sub === 'show'
    ) {

      const all =
        await db.all();

      const data =
        all.filter(

          entry =>

            entry.id.startsWith(
              `whitelist_${message.guild.id}_`
            )

        );

      if (!data.length) {

        return message.reply(
          '❌ No whitelisted users.'
        );

      }

      const users =

        data.map(entry => {

          const id =

            entry.id.split('_')[2];

          return `<@${id}>`;

        });

      const embed =

        new EmbedBuilder()

          .setColor('#00d5ff')

          .setTitle(
            '👑 Whitelisted Users'
          )

          .setDescription(
            users.join('\n')
          );

      return message.channel.send({

        embeds: [embed]

      });

    }

  }

};