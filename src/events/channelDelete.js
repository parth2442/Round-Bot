const {
  AuditLogEvent
} = require('discord.js');

const db = require('../database/database');

const antinukeLogger =
  require('../utils/antinukeLogger');

const punishExecutor =
  require('../utils/punishExecutor');

const deleteMap = new Map();

module.exports = {

  name: 'channelDelete',

  async execute(channel) {

    const guild = channel.guild;

    const enabled =
      await db.get(
        `antinuke_enabled_${guild.id}`
      );

    if (!enabled) return;

    const logs =
      await guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.ChannelDelete
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

    if (!deleteMap.has(key)) {

      deleteMap.set(key, 1);

      setTimeout(() => {
        deleteMap.delete(key);
      }, 10000);

    } else {

      deleteMap.set(
        key,
        deleteMap.get(key) + 1
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
      deleteMap.get(key);

    if (count >= limit) {

      const success =
        await punishExecutor(
          guild,
          executor.id,
          punishment,
          'Antinuke Channel Delete Protection'
        );

      if (!success) return;

      await antinukeLogger(
        guild,
        executor,
        'Channel Delete Spam',
        punishment
      );

      deleteMap.delete(key);

    }

  },

};