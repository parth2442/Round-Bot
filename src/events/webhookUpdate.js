const {
  AuditLogEvent
} = require('discord.js');

const db = require('../database/database');

const webhookMap = new Map();

module.exports = {

  name: 'webhookUpdate',

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
        type: AuditLogEvent.WebhookCreate
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

    if (!webhookMap.has(key)) {

      webhookMap.set(key, 1);

      setTimeout(() => {
        webhookMap.delete(key);
      }, 10000);

    } else {

      webhookMap.set(
        key,
        webhookMap.get(key) + 1
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
      webhookMap.get(key);

    if (count >= limit) {

      const member =
        await guild.members.fetch(
          executor.id
        ).catch(() => null);

      if (!member) return;

      try {

        if (punishment === 'ban') {

          await member.ban({
            reason: 'Antinuke Webhook Protection'
          });

        }

        if (punishment === 'kick') {

          await member.kick(
            'Antinuke Webhook Protection'
          );

        }

        webhookMap.delete(key);

      } catch (error) {

        console.error(error);

      }

    }

  },

};