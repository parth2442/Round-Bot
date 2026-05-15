const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits
} = require('discord.js');

function createEmbed(amount, user) {

  return new EmbedBuilder()
    .setColor('Blue')
    .setTitle('🧹 Messages Cleared')
    .setDescription(`Successfully deleted ${amount} messages.`)
    .setFooter({
      text: `Action by ${user.username}`
    })
    .setTimestamp();

}

module.exports = {

  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Deletes messages')
    .addIntegerOption(option =>
      option
        .setName('amount')
        .setDescription('Number of messages to delete')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(
      PermissionFlagsBits.ManageMessages
    ),

  async execute(interaction) {

    const amount =
      interaction.options.getInteger('amount');

    if (amount < 1 || amount > 100) {

      return interaction.reply({
        content: '❌ Amount must be between 1-100.',
        ephemeral: true
      });

    }

    await interaction.channel.bulkDelete(amount, true);

    const embed = createEmbed(
      amount,
      interaction.user
    );

    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    });

  },

  async executePrefix(message, args) {

    if (
      !message.member.permissions.has(
        PermissionFlagsBits.ManageMessages
      )
    ) {

      return message.reply(
        '❌ You do not have permission.'
      );

    }

    const amount = parseInt(args[0]);

    if (isNaN(amount) || amount < 1 || amount > 100) {

      return message.reply(
        '❌ Provide number between 1-100.'
      );

    }

    await message.channel.bulkDelete(amount, true);

    const embed = createEmbed(
      amount,
      message.author
    );

    await message.channel.send({
      embeds: [embed]
    });

  },

};