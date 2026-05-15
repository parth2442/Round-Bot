const {
  EmbedBuilder
} = require('discord.js');

const db =
  require('../database/database');

module.exports = {
 
  name: 'clientReady',

  async execute(client) {

    /*
    =========================
    MESSAGE DELETE
    =========================
    */

    client.on(
      'messageDelete',
      async message => {

        if (
          !message.guild ||
          message.author?.bot
        ) return;

        const logChannelId =
          await db.get(
            `logs_${message.guild.id}`
          );

        if (!logChannelId) return;

        const logChannel =
          message.guild.channels.cache.get(
            logChannelId
          );

        if (!logChannel) return;

        const embed = new EmbedBuilder()

          .setColor('Red')

          .setTitle('🗑 Message Deleted')

          .addFields(

            {
              name: '👤 User',
              value: `${message.author}`,
              inline: true
            },

            {
              name: '📍 Channel',
              value: `${message.channel}`,
              inline: true
            },

            {
              name: '💬 Content',
              value:
                message.content || 'No content'
            }

          )

          .setTimestamp();

        logChannel.send({
          embeds: [embed]
        });

      }
    );

    /*
    =========================
    MESSAGE EDIT
    =========================
    */

    client.on(
      'messageUpdate',
      async (oldMessage, newMessage) => {

        if (
          !oldMessage.guild ||
          oldMessage.author?.bot
        ) return;

        if (
          oldMessage.content ===
          newMessage.content
        ) return;

        const logChannelId =
          await db.get(
            `logs_${oldMessage.guild.id}`
          );

        if (!logChannelId) return;

        const logChannel =
          oldMessage.guild.channels.cache.get(
            logChannelId
          );

        if (!logChannel) return;

        const embed = new EmbedBuilder()

          .setColor('Yellow')

          .setTitle('✏ Message Edited')

          .addFields(

            {
              name: '👤 User',
              value: `${oldMessage.author}`,
              inline: true
            },

            {
              name: '📍 Channel',
              value: `${oldMessage.channel}`,
              inline: true
            },

            {
              name: '📄 Before',
              value:
                oldMessage.content || 'No content'
            },

            {
              name: '📄 After',
              value:
                newMessage.content || 'No content'
            }

          )

          .setTimestamp();

        logChannel.send({
          embeds: [embed]
        });

      }
    );

    /*
    =========================
    MEMBER JOIN
    =========================
    */

    client.on(
      'guildMemberAdd',
      async member => {

        const logChannelId =
          await db.get(
            `logs_${member.guild.id}`
          );

        if (!logChannelId) return;

        const logChannel =
          member.guild.channels.cache.get(
            logChannelId
          );

        if (!logChannel) return;

        const embed = new EmbedBuilder()

          .setColor('Green')

          .setTitle('📥 Member Joined')

          .setDescription(
            `${member} joined the server.`
          )

          .setTimestamp();

        logChannel.send({
          embeds: [embed]
        });

      }
    );

    /*
    =========================
    MEMBER LEAVE
    =========================
    */

    client.on(
      'guildMemberRemove',
      async member => {

        const logChannelId =
          await db.get(
            `logs_${member.guild.id}`
          );

        if (!logChannelId) return;

        const logChannel =
          member.guild.channels.cache.get(
            logChannelId
          );

        if (!logChannel) return;

        const embed = new EmbedBuilder()

          .setColor('Red')

          .setTitle('📤 Member Left')

          .setDescription(
            `${member.user.tag} left the server.`
          )

          .setTimestamp();

        logChannel.send({
          embeds: [embed]
        });

      }
    );

  },

};