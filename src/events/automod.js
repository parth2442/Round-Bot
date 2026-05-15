const db =
  require('../database/database');

module.exports = {

  name: 'messageCreate',

  async execute(message) {

    /*
    =========================
    BASIC CHECKS
    =========================
    */

    if (!message.guild)
      return;

    if (message.author.bot)
      return;

    /*
    =========================
    AUTOMOD ENABLED?
    =========================
    */

    const enabled =
      await db.get(
        `automod_${message.guild.id}`
      );

    if (!enabled)
      return;

    /*
    =========================
    USER WHITELIST
    =========================
    */

    const userWL =
      await db.get(

        `automodwl_${message.guild.id}_${message.author.id}`

      );

    if (userWL)
      return;

    /*
    =========================
    ROLE WHITELIST
    =========================
    */

    const roleWL =
      await Promise.all(

        message.member.roles.cache.map(

          async role =>

            await db.get(

              `automodwlrole_${message.guild.id}_${role.id}`

            )

        )

      );

    if (roleWL.includes(true))
      return;

    /*
    =========================
    IGNORED CHANNEL CHECK
    =========================
    */

    const ignored =
      await db.get(

        `automodignore_${message.guild.id}_${message.channel.id}`

      );

    if (ignored)
      return;

    /*
    =========================
    GET PUNISHMENT
    =========================
    */

    const punishment =
      await db.get(
        `automodpunishment_${message.guild.id}`
      ) || 'warn';

    /*
    =========================
    FILTERS
    =========================
    */

    const content =
      message.content.toLowerCase();

    let triggered = false;

    /*
    =========================
    ANTI LINK
    =========================
    */

    if (

      content.includes('http://') ||

      content.includes('https://') ||

      content.includes('discord.gg')

    ) {

      triggered = true;

    }

    /*
    =========================
    ANTI EVERYONE
    =========================
    */

    if (

      content.includes('@everyone') ||

      content.includes('@here')

    ) {

      triggered = true;

    }

    /*
    =========================
    ANTI BADWORD
    =========================
    */

    const badwords = [

      'badword1',
      'badword2'

    ];

    if (

      badwords.some(word =>

        content.includes(word)

      )

    ) {

      triggered = true;

    }

    /*
    =========================
    STOP IF CLEAN
    =========================
    */

    if (!triggered)
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
    WARN
    =========================
    */

    if (punishment === 'warn') {

      return message.channel.send({

        content:
`${message.author} ⚠ Automod detected prohibited content.`

      });

    }

    /*
    =========================
    TIMEOUT
    =========================
    */

    if (punishment === 'timeout') {

      try {

        await message.member.timeout(

          10 * 60 * 1000,

          'Round Bot Automod'

        );

      } catch (err) {}

      return;

    }

    /*
    =========================
    KICK
    =========================
    */

    if (punishment === 'kick') {

      try {

        await message.member.kick(

          'Round Bot Automod'

        );

      } catch (err) {}

      return;

    }

    /*
    =========================
    BAN
    =========================
    */

    if (punishment === 'ban') {

      try {

        await message.member.ban({

          reason:
            'Round Bot Automod'

        });

      } catch (err) {}

      return;

    }

  }

};