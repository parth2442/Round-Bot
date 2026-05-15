const {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ComponentType
} = require('discord.js');

module.exports = {

  data: {
    name: 'help'
  },

  name: 'help',

  description: 'Round Bot Help Menu',

  async executePrefix(message) {

    const homeEmbed = new EmbedBuilder()

      .setColor('#00d5ff')

      .setTitle('✨ Round Bot Help Menu')

      .setDescription(
        'Advanced all in one Discord management, moderation, automod and security bot.'
      )

      .setThumbnail(
        'https://cdn.discordapp.com/attachments/000000000000000000/000000000000000000/roundbot.png'
      )

      .addFields(

        {
          name: '🛡 Security',
          value:
            'Antinuke • Antibot • Automod • Logging',
          inline: true
        },

        {
          name: '⚒ Management',
          value:
            'Moderation • Tickets • Giveaways',
          inline: true
        },

        {
          name: '🎮 Community',
          value:
            'Fun • Roleplay • Utility',
          inline: true
        }

      )

      .setFooter({
        text:
          'Round Bot • Crafted by parth.cd'
      })

      .setTimestamp();

    /*
    =========================
    DROPDOWN MENU
    =========================
    */

    const menu = new StringSelectMenuBuilder()

      .setCustomId('help-menu')

      .setPlaceholder(
        '📚 Select Help Category'
      )

      .addOptions([

        {
          label: 'Moderation',
          description:
            'View moderation commands',
          value: 'moderation',
          emoji: '🛡'
        },

        {
          label: 'Security',
          description:
            'View security commands',
          value: 'security',
          emoji: '🔒'
        },

        {
          label: 'Automod',
          description:
            'View automod commands',
          value: 'automod',
          emoji: '🤖'
        },

        {
          label: 'Utility',
          description:
            'View utility commands',
          value: 'utility',
          emoji: '⚒'
        },

        {
          label: 'Ticket',
          description:
            'View ticket commands',
          value: 'ticket',
          emoji: '🎫'
        },

        {
          label: 'Giveaways',
          description:
            'View giveaway commands',
          value: 'giveaways',
          emoji: '🎉'
        },

        {
          label: 'Fun',
          description:
            'View fun commands',
          value: 'fun',
          emoji: '🎮'
        },

        {
          label: 'Roleplay',
          description:
            'View roleplay commands',
          value: 'roleplay',
          emoji: '💖'
        },

        {
          label: 'Config',
          description:
            'View configuration commands',
          value: 'config',
          emoji: '⚙'
        },

        {
          label: 'Antibot',
          description:
            'View antibot commands',
          value: 'antibot',
          emoji: '👾'
        }

      ]);

    const row = new ActionRowBuilder()

      .addComponents(menu);

    const msg = await message.channel.send({

      embeds: [homeEmbed],

      components: [row]

    });

    const collector =

      msg.createMessageComponentCollector({

        componentType:
          ComponentType.StringSelect,

        time:
          300000

      });

    collector.on(

      'collect',

      async interaction => {

        if (
          interaction.user.id !==
          message.author.id
        ) {

          return interaction.reply({

            content:
              '❌ This menu is not for you.',

            ephemeral: true

          });

        }

        let embed;

        /*
        =========================
        MODERATION
        =========================
        */

        if (
          interaction.values[0] ===
          'moderation'
        ) {

          embed = new EmbedBuilder()

            .setColor('#ff4d4d')

            .setTitle(
              '🛡 Moderation Commands'
            )

            .setDescription(
              'Powerful moderation tools to manage and protect your server.'
            )

            .addFields(

              {
                name:
                  '🔨 User Punishment',

                value:
'`Rban <user>`\n`Rkick <user>`\n`Rtimeout <user>`',

                inline: false
              },

              {
                name:
                  '⚠ Warning System',

                value:
'`Rwarn <user>`',

                inline: false
              },

              {
                name:
                  '🧹 Chat Management',

                value:
'`Rclear <amount>`',

                inline: false
              }

            );

        }

        /*
        =========================
        SECURITY
        =========================
        */

        if (
          interaction.values[0] ===
          'security'
        ) {

          embed = new EmbedBuilder()

            .setColor('#00d5ff')

            .setTitle(
              '🔒 Security Commands'
            )

            .setDescription(
              'Advanced antinuke and protection system for server security.'
            )

            .addFields(

              {
                name:
                  '🛡 Antinuke System',

                value:
'`Rantinuke enable`\n`Rantinuke disable`',

                inline: false
              },

              {
                name:
                  '📜 Antinuke Logs',

                value:
'`Rantinukelog #channel`',

                inline: false
              },

              {
                name:
                  '✅ User Whitelist',

                value:
'`Rwhitelist add <user>`\n`Rwhitelist remove <user>`\n`Rwhitelist show`',

                inline: false
              },

              {
                name:
                  '🚫 Badword System',

                value:
'`Rbadword enable`\n`Rbadword disable`\n`Rbadword add <word>`\n`Rbadword remove <word>`\n`Rbadword list`',

                inline: false
              }

            );

        }

        /*
        =========================
        AUTOMOD
        =========================
        */

        if (
          interaction.values[0] ===
          'automod'
        ) {

          embed = new EmbedBuilder()

            .setColor('#00ffaa')

            .setTitle(
              '🤖 Automod Commands'
            )

            .setDescription(
              'Automatic moderation system with punishments, ignore system and whitelists.'
            )

            .addFields(

              {
                name:
                  '✅ Enable / Disable',

                value:
'`Rautomod enable`\n`Rautomod disable`',

                inline: false
              },

              {
                name:
                  '⚙ Punishment System',

                value:
'`Rautomod punishment <warn/kick/ban/timeout>`',

                inline: false
              },

              {
                name:
                  '📌 Ignore Channels',

                value:
'`Rautomod ignore #channel`\n`Rautomod ignore-show`',

                inline: false
              },

              {
                name:
                  '👤 User Whitelist',

                value:
'`Rautomod wl <user>`\n`Rautomod unwl <user>`',

                inline: false
              },

              {
                name:
                  '🎭 Role Whitelist',

                value:
'`Rautomod wlrole <role>`\n`Rautomod unwlrole <role>`',

                inline: false
              }

            );

        }

        /*
        =========================
        UTILITY
        =========================
        */

        if (
          interaction.values[0] ===
          'utility'
        ) {

          embed = new EmbedBuilder()

            .setColor('#5865F2')

            .setTitle(
              '⚒ Utility Commands'
            )

            .setDescription(
              'Useful utility and information commands.'
            )

            .addFields(

              {
                name:
                  '📌 Information',

                value:
'`Rserverinfo`\n`Ruserinfo <user>`',

                inline: false
              },

              {
                name:
                  '🏓 Bot Stats',

                value:
'`Rping`',

                inline: false
              },

              {
                name:
                  '📝 Logging',

                value:
'`Rsetlog #channel`',

                inline: false
              }

            );

        }

        /*
        =========================
        TICKET
        =========================
        */

        if (
          interaction.values[0] ===
          'ticket'
        ) {

          embed = new EmbedBuilder()

            .setColor('#ff9900')

            .setTitle(
              '🎫 Ticket Commands'
            )

            .setDescription(
              'Professional ticket management system.'
            )

            .addFields(

              {
                name:
                  '🎫 Ticket Setup',

                value:
'`Rsetup-ticket #channel`',

                inline: false
              },

              {
                name:
                  '👮 Staff Role',

                value:
'`Rsetstaffrole <role>`',

                inline: false
              },

              {
                name:
                  '📑 Transcript Logs',

                value:
'`Rsettranscript #channel`',

                inline: false
              }

            );

        }

        /*
        =========================
        GIVEAWAYS
        =========================
        */

        if (
          interaction.values[0] ===
          'giveaways'
        ) {

          embed = new EmbedBuilder()

            .setColor('#ffd700')

            .setTitle(
              '🎉 Giveaway Commands'
            )

            .setDescription(
              'Manage server giveaways and rewards.'
            )

            .addFields(

              {
                name:
                  '🎉 Giveaway Control',

                value:
'`Rgstart`\n`Rgreroll`\n`Rgend`',

                inline: false
              }

            );

        }

        /*
        =========================
        FUN
        =========================
        */

        if (
          interaction.values[0] ===
          'fun'
        ) {

          embed = new EmbedBuilder()

            .setColor('#ff9900')

            .setTitle(
              '🎮 Fun Commands'
            )

            .setDescription(
              'Fun and entertaining commands for your community.'
            )

            .addFields(

              {
                name:
                  '😂 Fun Commands',

                value:
'`R8ball <question>`\n`Rhowgay <user>`',

                inline: false
              }

            );

        }

        /*
        =========================
        ROLEPLAY
        =========================
        */

        if (
          interaction.values[0] ===
          'roleplay'
        ) {

          embed = new EmbedBuilder()

            .setColor('#ff66cc')

            .setTitle(
              '💖 Roleplay Commands'
            )

            .setDescription(
              'Interactive roleplay commands for your community.'
            )

            .addFields(

              {
                name:
                  '🤝 Friendly Actions',

                value:
'`Rhug <user>`',

                inline: false
              },

              {
                name:
                  '😈 Chaos Actions',

                value:
'`Rslap <user>`',

                inline: false
              }

            );

        }

        /*
        =========================
        CONFIG
        =========================
        */

        if (
          interaction.values[0] ===
          'config'
        ) {

          embed = new EmbedBuilder()

            .setColor('#808080')

            .setTitle(
              '⚙ Config Commands'
            )

            .setDescription(
              'Configure Round Bot systems and setup.'
            )

            .addFields(

              {
                name:
                  '👋 Welcome System',

                value:
'`Rsetwelcome #channel`',

                inline: false
              },

              {
                name:
                  '🎭 Roles',

                value:
'`Rautorole <role>`\n`Rmainrole <role>`',

                inline: false
              },

              {
                name:
                  '📝 Logs',

                value:
'`Rsetlog #channel`',

                inline: false
              }

            );

        }

        /*
        =========================
        ANTIBOT
        =========================
        */

        if (
          interaction.values[0] ===
          'antibot'
        ) {

          embed = new EmbedBuilder()

            .setColor('#8a2be2')

            .setTitle(
              '👾 Antibot Commands'
            )

            .setDescription(
              'Protect your server from unauthorized bot additions and raid bots.'
            )

            .addFields(

              {
                name:
                  '✅ Enable / Disable',

                value:
'`Rantibot enable`\n`Rantibot disable`',

                inline: false
              },

              {
                name:
                  '👤 User Whitelist',

                value:
'`Rantibot add <user>`\n`Rantibot remove <user>`',

                inline: false
              },

              {
                name:
                  '📜 Whitelist List',

                value:
'`Rantibot wl`',

                inline: false
              }

            );

        }

        embed

          .setThumbnail(
            'https://cdn.discordapp.com/attachments/000000000000000000/000000000000000000/roundbot.png'
          )

          .setFooter({

            text:
              'Round Bot • Crafted by parth.cd'

          })

          .setTimestamp();

        await interaction.update({

          embeds: [embed],

          components: [row]

        });

      }

    );

  }

};