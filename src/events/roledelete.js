const {
  AuditLogEvent
} = require('discord.js');

const db = require('../database/database');

const roleDeleteMap = new Map();

module.exports = {

  name: 'roleDelete',

  async execute(role) {

    const guild = role.guild;

    const enabled =
      await db.get(
        `antinuke_enabled_${guild.id}`
      );

    if (!enabled) return;

    const logs =
      await guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.RoleDelete
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

    const key =
      `${guild.id}_${executor.id}`;

    if (!roleDeleteMap.has(key)) {

      roleDeleteMap.set(key, 1);

      setTimeout(() => {
        roleDeleteMap.delete(key);
      }, 10000);

    } else {

      roleDeleteMap.set(
        key,
        roleDeleteMap.get(key) + 1
      );

    }

    const limit =
      await db.get(
        `antinuke_limit_${guild.id}`
      ) || 3;

    const punishment =
      await db.get(
        `antinuke_punishment_${guild.id}`
      ) || 'ban';

    const count =
      roleDeleteMap.get(key);

    if (count >= limit) {

      const member =
        await guild.members.fetch(
          executor.id
        ).catch(() => null);

      if (!member) return;

      try {

        if (punishment === 'ban') {

          await member.ban({
            reason: 'Antinuke Role Delete Protection'
          });

        }

        if (punishment === 'kick') {

          await member.kick(
            'Antinuke Role Delete Protection'
          );

        }

        roleDeleteMap.delete(key);

      } catch (error) {

        console.error(error);

      }

    }

  },

};