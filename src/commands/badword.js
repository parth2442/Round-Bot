const {
  SlashCommandBuilder,
  EmbedBuilder
} = require('discord.js');

const db =
require('../database/database');

module.exports = {

  data: new SlashCommandBuilder()

    .setName('badword')

    .setDescription(
      'Manage badword system'
    ),

  name: 'badword',

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

    const word =
      args[1]?.toLowerCase();

    /*
    =========================
    ENABLE
    =========================
    */

    if (
      sub === 'enable'
    ) {

      await db.set(
        `badword_${message.guild.id}`,
        true
      );

      return message.reply(
        '✅ Badword system enabled.'
      );

    }

    /*
    =========================
    DISABLE
    =========================
    */

    if (
      sub === 'disable'
    ) {

      await db.delete(
        `badword_${message.guild.id}`
      );

      return message.reply(
        '✅ Badword system disabled.'
      );

    }

    /*
    =========================
    ADD WORD
    =========================
    */

    if (
      sub === 'add'
    ) {

      if (!word) {

        return message.reply(
          '❌ Provide a word.'
        );

      }

      let words =

        await db.get(
          `badwords_${message.guild.id}`
        ) || [];

      if (
        words.includes(word)
      ) {

        return message.reply(
          '❌ Word already exists.'
        );

      }

      words.push(word);

      await db.set(

        `badwords_${message.guild.id}`,

        words

      );

      return message.reply(
`✅ Added badword: \`${word}\``
      );

    }

    /*
    =========================
    REMOVE WORD
    =========================
    */

    if (
      sub === 'remove'
    ) {

      if (!word) {

        return message.reply(
          '❌ Provide a word.'
        );

      }

      let words =

        await db.get(
          `badwords_${message.guild.id}`
        ) || [];

      words =

        words.filter(
          w => w !== word
        );

      await db.set(

        `badwords_${message.guild.id}`,

        words

      );

      return message.reply(
`✅ Removed badword: \`${word}\``
      );

    }

    /*
    =========================
    LIST
    =========================
    */

    if (
      sub === 'list'
    ) {

      const words =

        await db.get(
          `badwords_${message.guild.id}`
        ) || [];

      if (!words.length) {

        return message.reply(
          '❌ No badwords set.'
        );

      }

      const embed =

        new EmbedBuilder()

          .setColor('#ff4d4d')

          .setTitle(
            '🚫 Badword List'
          )

          .setDescription(
            words.map(w => `• ${w}`).join('\n')
          );

      return message.channel.send({

        embeds: [embed]

      });

    }

  }

};