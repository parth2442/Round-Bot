const {
  EmbedBuilder
} = require('discord.js');

const db = require('../database/database');

module.exports = async (
  guild,
  executor,
  action,
  punishment
) => {

  const logChannelId =
    await db.get(
      `antinuke_log_${guild.id}`
    );

  if (!logChannelId) return;

  const logChannel =
    guild.channels.cache.get(
      logChannelId
    );

  if (!logChannel) return;

  const embed = new EmbedBuilder()
    .setColor('Red')
    .setTitle('🛡 Antinuke Triggered')
    .addFields(
      {
        name: '👤 User',
        value: `${executor.tag}`,
        inline: true
      },
      {
        name: '⚠ Action',
        value: action,
        inline: true
      },
      {
        name: '⚒ Punishment',
        value: punishment,
        inline: true
      }
    )
    .setTimestamp();

  logChannel.send({
    embeds: [embed]
  });

};