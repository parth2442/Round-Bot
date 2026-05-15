const {
  AuditLogEvent
} = require('discord.js');

const db = require('../database/database');

module.exports = {

  name: 'guildMemberAdd',

  async execute(member) {

    if (!member.user.bot) return;

    const guild = member.guild;

    const enabled =
      await db.get(
        `antinuke_enabled_${guild.id}`
      );

    if (!enabled) return;

    const logs =
      await guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.BotAdd
      });

    const entry = logs.entries.first();

    if (!entry) return;

    const executor = entry.executor;

    if (!executor) return;

    if (executor.id === guild.ownerId) return;

    const whitelist =
      await db.get(
        `whitelist_${guild.id}`
      ) || [];

    if (whitelist.includes(executor.id)) return;

    const punishment =
      await db.get(
        `antinuke_punishment_${guild.id}`
      ) || 'ban';

    const executorMember =
      await guild.members.fetch(
        executor.id
      ).catch(() => null);

    if (!executorMember) return;

    try {

      await member.ban({
        reason: 'Unauthorized Bot Add'
      });

      if (punishment === 'ban') {

        await executorMember.ban({
          reason: 'Antinuke Bot Add Protection'
        });

      }

      if (punishment === 'kick') {

        await executorMember.kick(
          'Antinuke Bot Add Protection'
        );

      }

    } catch (error) {

      console.error(error);

    }

  },

};