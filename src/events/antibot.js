const db =
  require('../database/database');

module.exports = {

  name: 'guildMemberAdd',

  async execute(member) {

    /*
    =========================
    CHECK BOT
    =========================
    */

    if (!member.user.bot)
      return;

    /*
    =========================
    ANTIBOT ENABLED?
    =========================
    */

    const enabled =
      await db.get(
        `antibot_${member.guild.id}`
      );

    if (!enabled)
      return;

    /*
    =========================
    FETCH AUDIT LOGS
    =========================
    */

    const logs =
      await member.guild.fetchAuditLogs({

        limit: 1,

        type: 28

      });

    const entry =
      logs.entries.first();

    if (!entry)
      return;

    const executor =
      entry.executor;

    if (!executor)
      return;

    /*
    =========================
    OWNER BYPASS
    =========================
    */

    if (
      executor.id ===
      member.guild.ownerId
    ) return;

    /*
    =========================
    WHITELIST CHECK
    =========================
    */

    const whitelisted =
      await db.get(
        `antibotwl_${member.guild.id}_${executor.id}`
      );

    if (whitelisted)
      return;

    /*
    =========================
    KICK ADDED BOT
    =========================
    */

    try {

      await member.kick(
        'Round Bot Antibot Protection'
      );

    } catch (err) {}

    /*
    =========================
    PUNISH EXECUTOR
    =========================
    */

    try {

      const guildMember =
        await member.guild.members.fetch(
          executor.id
        );

      await guildMember.ban({

        reason:
          'Unauthorized bot added.'

      });

    } catch (err) {}

    /*
    =========================
    LOG
    =========================
    */

    console.log(

      `${executor.tag} added unauthorized bot in ${member.guild.name}`

    );

  }

};