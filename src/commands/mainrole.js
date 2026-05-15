const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits
} = require('discord.js');

function createEmbed(title, description, color = 'Blue') {

  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setTimestamp();

}

module.exports = {

  data: new SlashCommandBuilder()
    .setName('mainrole')
    .setDescription('Manage user main roles')

    .addSubcommand(sub =>
      sub
        .setName('add')
        .setDescription('Add role to user')
        .addUserOption(option =>
          option
            .setName('user')
            .setDescription('Target user')
            .setRequired(true)
        )
        .addRoleOption(option =>
          option
            .setName('role')
            .setDescription('Role to add')
            .setRequired(true)
        )
    )

    .addSubcommand(sub =>
      sub
        .setName('remove')
        .setDescription('Remove role from user')
        .addUserOption(option =>
          option
            .setName('user')
            .setDescription('Target user')
            .setRequired(true)
        )
        .addRoleOption(option =>
          option
            .setName('role')
            .setDescription('Role to remove')
            .setRequired(true)
        )
    )

    .addSubcommand(sub =>
      sub
        .setName('list')
        .setDescription('List user roles')
        .addUserOption(option =>
          option
            .setName('user')
            .setDescription('Target user')
            .setRequired(true)
        )
    )

    .addSubcommand(sub =>
      sub
        .setName('reset')
        .setDescription('Remove all roles from user')
        .addUserOption(option =>
          option
            .setName('user')
            .setDescription('Target user')
            .setRequired(true)
        )
    )

    .setDefaultMemberPermissions(
      PermissionFlagsBits.ManageRoles
    ),

  async execute(interaction) {

    const sub =
      interaction.options.getSubcommand();

    const target =
      interaction.options.getMember('user');

    if (!target) {

      const embed = createEmbed(
        '❌ Error',
        'User not found.',
        'Red'
      );

      return interaction.reply({
        embeds: [embed],
        ephemeral: true
      });

    }

    if (sub === 'add') {

      const role =
        interaction.options.getRole('role');

      await target.roles.add(role);

      const embed = createEmbed(
        '✅ Role Added',
        `Added ${role} to ${target}`
      );

      return interaction.reply({
        embeds: [embed]
      });

    }

    if (sub === 'remove') {

      const role =
        interaction.options.getRole('role');

      await target.roles.remove(role);

      const embed = createEmbed(
        '🗑 Role Removed',
        `Removed ${role} from ${target}`
      );

      return interaction.reply({
        embeds: [embed]
      });

    }

    if (sub === 'list') {

      const roles =
        target.roles.cache
          .filter(role =>
            role.id !== interaction.guild.id
          )
          .map(role => role.toString())
          .join(', ');

      const embed = createEmbed(
        '📋 User Roles',
        roles || 'No roles.'
      );

      return interaction.reply({
        embeds: [embed]
      });

    }

    if (sub === 'reset') {

      const roles =
        target.roles.cache.filter(
          role => role.id !== interaction.guild.id
        );

      for (const role of roles.values()) {

        await target.roles.remove(role);

      }

      const embed = createEmbed(
        '♻ Roles Reset',
        `Removed all roles from ${target}`
      );

      return interaction.reply({
        embeds: [embed]
      });

    }

  },

  async executePrefix(message, args) {

    if (
      !message.member.permissions.has(
        PermissionFlagsBits.ManageRoles
      )
    ) {

      const embed = createEmbed(
        '❌ Error',
        'You need Manage Roles permission.',
        'Red'
      );

      return message.reply({
        embeds: [embed]
      });

    }

    const sub = args[0];

    const target =
      message.mentions.members.first();

    const role =
      message.mentions.roles.first();

    if (!target) {

      const embed = createEmbed(
        '❌ Error',
        'Mention a user.',
        'Red'
      );

      return message.reply({
        embeds: [embed]
      });

    }

    if (sub === 'add') {

      if (!role) {

        const embed = createEmbed(
          '❌ Error',
          'Mention a role.',
          'Red'
        );

        return message.reply({
          embeds: [embed]
        });

      }

      await target.roles.add(role);

      const embed = createEmbed(
        '✅ Role Added',
        `Added ${role} to ${target}`
      );

      return message.reply({
        embeds: [embed]
      });

    }

    if (sub === 'remove') {

      if (!role) {

        const embed = createEmbed(
          '❌ Error',
          'Mention a role.',
          'Red'
        );

        return message.reply({
          embeds: [embed]
        });

      }

      await target.roles.remove(role);

      const embed = createEmbed(
        '🗑 Role Removed',
        `Removed ${role} from ${target}`
      );

      return message.reply({
        embeds: [embed]
      });

    }

    if (sub === 'list') {

      const roles =
        target.roles.cache
          .filter(role =>
            role.id !== message.guild.id
          )
          .map(role => role.toString())
          .join(', ');

      const embed = createEmbed(
        '📋 User Roles',
        roles || 'No roles.'
      );

      return message.reply({
        embeds: [embed]
      });

    }

    if (sub === 'reset') {

      const roles =
        target.roles.cache.filter(
          role => role.id !== message.guild.id
        );

      for (const role of roles.values()) {

        await target.roles.remove(role);

      }

      const embed = createEmbed(
        '♻ Roles Reset',
        `Removed all roles from ${target}`
      );

      return message.reply({
        embeds: [embed]
      });

    }

  },

};