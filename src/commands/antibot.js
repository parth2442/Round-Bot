const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits
} = require('discord.js');

const db =
  require('../Database/database');

module.exports = {

  data: new SlashCommandBuilder()

    .setName('antibot')

    .setDescription(
      'Manage antibot system'
    )

    .addSubcommand(subcommand =>

      subcommand

        .setName('enable')

        .setDescription(
          'Enable antibot'
        )

    )

    .addSubcommand(subcommand =>

      subcommand

        .setName('disable')

        .setDescription(
          'Disable antibot'
        )

    )

    .addSubcommand(subcommand =>

      subcommand

        .setName('add')

        .setDescription(
          'Whitelist user'
        )

        .addUserOption(option =>

          option

            .setName('user')

            .setDescription(
              'User to whitelist'
            )

            .setRequired(true)

        )

    )

    .addSubcommand(subcommand =>

      subcommand

        .setName('remove')

        .setDescription(
          'Remove whitelist user'
        )

        .addUserOption(option =>

          option

            .setName('user')

            .setDescription(
              'User to remove'
            )

            .setRequired(true)

        )

    )

    .addSubcommand(subcommand =>

      subcommand

        .setName('wl')

        .setDescription(
          'Show whitelist'
        )

    )

    .setDefaultMemberPermissions(
      PermissionFlagsBits.Administrator
    ),

  async execute(interaction) {

    const sub =
      interaction.options.getSubcommand();

    /*
    =========================
    ENABLE
    =========================
    */

    if (sub === 'enable') {

      await db.set(
        `antibot_${interaction.guild.id}`,
        true
      );

      return interaction.reply({

        embeds: [

          new EmbedBuilder()

            .setColor('#00ff99')

            .setTitle(
              '🛡 Antibot Enabled'
            )

            .setDescription(
              'Round Bot antibot protection enabled.'
            )

        ]

      });

    }

    /*
    =========================
    DISABLE
    =========================
    */

    if (sub === 'disable') {

      await db.set(
        `antibot_${interaction.guild.id}`,
        false
      );

      return interaction.reply({

        embeds: [

          new EmbedBuilder()

            .setColor('#ff0000')

            .setTitle(
              '❌ Antibot Disabled'
            )

            .setDescription(
              'Round Bot antibot protection disabled.'
            )

        ]

      });

    }

    /*
    =========================
    ADD WL
    =========================
    */

    if (sub === 'add') {

      const user =
        interaction.options.getUser(
          'user'
        );

      await db.set(

        `antibotwl_${interaction.guild.id}_${user.id}`,

        true

      );

      return interaction.reply({

        embeds: [

          new EmbedBuilder()

            .setColor('#00d5ff')

            .setTitle(
              '✅ User Whitelisted'
            )

            .setDescription(
              `${user} added to antibot whitelist.`
            )

        ]

      });

    }

    /*
    =========================
    REMOVE WL
    =========================
    */

    if (sub === 'remove') {

      const user =
        interaction.options.getUser(
          'user'
        );

      await db.delete(

        `antibotwl_${interaction.guild.id}_${user.id}`

      );

      return interaction.reply({

        embeds: [

          new EmbedBuilder()

            .setColor('#ff0000')

            .setTitle(
              '❌ User Removed'
            )

            .setDescription(
              `${user} removed from antibot whitelist.`
            )

        ]

      });

    }

    /*
    =========================
    SHOW WL
    =========================
    */

    if (sub === 'wl') {

      const all =
        await db.all();

      const filtered =
        all.filter(data =>

          data.id.startsWith(

            `antibotwl_${interaction.guild.id}_`

          )

        );

      if (!filtered.length) {

        return interaction.reply({

          content:
            '❌ No whitelisted users.',

          ephemeral: true

        });

      }

      const users =
        filtered.map(data => {

          const id =
            data.id.split('_').pop();

          return `<@${id}>`;

        });

      return interaction.reply({

        embeds: [

          new EmbedBuilder()

            .setColor('#00d5ff')

            .setTitle(
              '📜 Antibot Whitelist'
            )

            .setDescription(
              users.join('\n')
            )

        ]

      });

    }

  },

  async executePrefix(message, args) {

    if (
      !message.member.permissions.has(
        PermissionFlagsBits.Administrator
      )
    ) {

      return message.reply(
        '❌ Administrator permission required.'
      );

    }

    const sub =
      args[0];

    /*
    =========================
    ENABLE
    =========================
    */

    if (sub === 'enable') {

      await db.set(
        `antibot_${message.guild.id}`,
        true
      );

      return message.channel.send({

        embeds: [

          new EmbedBuilder()

            .setColor('#00ff99')

            .setTitle(
              '🛡 Antibot Enabled'
            )

        ]

      });

    }

    /*
    =========================
    DISABLE
    =========================
    */

    if (sub === 'disable') {

      await db.set(
        `antibot_${message.guild.id}`,
        false
      );

      return message.channel.send({

        embeds: [

          new EmbedBuilder()

            .setColor('#ff0000')

            .setTitle(
              '❌ Antibot Disabled'
            )

        ]

      });

    }

    /*
    =========================
    ADD WL
    =========================
    */

    if (sub === 'add') {

      const user =
        message.mentions.users.first();

      if (!user)
        return message.reply(
          'Mention user.'
        );

      await db.set(

        `antibotwl_${message.guild.id}_${user.id}`,

        true

      );

      return message.channel.send({

        embeds: [

          new EmbedBuilder()

            .setColor('#00d5ff')

            .setTitle(
              '✅ User Whitelisted'
            )

            .setDescription(
              `${user} added to antibot whitelist.`
            )

        ]

      });

    }

    /*
    =========================
    REMOVE WL
    =========================
    */

    if (sub === 'remove') {

      const user =
        message.mentions.users.first();

      if (!user)
        return message.reply(
          'Mention user.'
        );

      await db.delete(

        `antibotwl_${message.guild.id}_${user.id}`

      );

      return message.channel.send({

        embeds: [

          new EmbedBuilder()

            .setColor('#ff0000')

            .setTitle(
              '❌ User Removed'
            )

            .setDescription(
              `${user} removed from antibot whitelist.`
            )

        ]

      });

    }

    /*
    =========================
    WL SHOW
    =========================
    */

    if (sub === 'wl') {

      const all =
        await db.all();

      const filtered =
        all.filter(data =>

          data.id.startsWith(

            `antibotwl_${message.guild.id}_`

          )

        );

      if (!filtered.length) {

        return message.reply(
          '❌ No whitelisted users.'
        );

      }

      const users =
        filtered.map(data => {

          const id =
            data.id.split('_').pop();

          return `<@${id}>`;

        });

      return message.channel.send({

        embeds: [

          new EmbedBuilder()

            .setColor('#00d5ff')

            .setTitle(
              '📜 Antibot Whitelist'
            )

            .setDescription(
              users.join('\n')
            )

        ]

      });

    }

  }

};