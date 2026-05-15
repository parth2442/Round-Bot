const {
  EmbedBuilder
} = require('discord.js');

const db = require('../database/database');

module.exports = {

  name: 'guildMemberAdd',

  async execute(member) {

    const channelId =
      await db.get(
        `welcome_${member.guild.id}`
      );

    const autoroleId =
      await db.get(
        `autorole_${member.guild.id}`
      );

    if (autoroleId) {

      const role =
        member.guild.roles.cache.get(
          autoroleId
        );

      if (role) {

        await member.roles.add(role)
          .catch(() => {});

      }

    }

    if (!channelId) return;

    const channel =
      member.guild.channels.cache.get(
        channelId
      );

    if (!channel) return;

    const embed = new EmbedBuilder()

      .setColor('#5865F2')

      .setTitle('🎉 Welcome to the Server')

      .setDescription(
`Welcome ${member} to **${member.guild.name}**!`
      )

      .addFields(

        {
          name: '👤 Member',
          value: `${member.user.tag}`,
          inline: true
        },

        {
          name: '📊 Member Count',
          value: `${member.guild.memberCount}`,
          inline: true
        }

      )

      .setThumbnail(
        member.user.displayAvatarURL({
          dynamic: true
        })
      )

      .setFooter({
        text: 'Empire Bot Welcome System'
      })

      .setTimestamp();

    channel.send({
      embeds: [embed]
    });

  },

};