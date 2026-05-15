const db =
require('../database/database');

module.exports = {

  name: 'messageCreate',

  async execute(message) {

    if (!message.guild)
      return;

    if (message.author.bot)
      return;

    /*
    =========================
    BADWORD ENABLED?
    =========================
    */

    const enabled =

      await db.get(
        `badword_${message.guild.id}`
      );

    if (!enabled)
      return;

    /*
    =========================
    GET WORDS FROM DB
    =========================
    */

    const words =

      await db.get(
        `badwords_${message.guild.id}`
      ) || [];

    if (!words.length)
      return;

    /*
    =========================
    CHECK MESSAGE
    =========================
    */

    const content =

      message.content.toLowerCase();

    const found =

      words.some(word =>

        content.includes(
          word.toLowerCase()
        )

      );

    if (!found)
      return;

    /*
    =========================
    DELETE MESSAGE
    =========================
    */

    try {

      await message.delete();

    } catch (err) {}

    /*
    =========================
    WARN USER
    =========================
    */

    message.channel.send({

      content:
`${message.author} ⚠ Bad words are not allowed.`

    });

  }

};