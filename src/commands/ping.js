const {
  SlashCommandBuilder,
  EmbedBuilder
} = require('discord.js');

function createEmbed(user, ping) {

  return new EmbedBuilder()
    .setColor('Blue')
    .setTitle('🏓 Pong!')
    .setDescription(`API Latency: ${ping}ms`)
    .setFooter({
      text: `Requested by ${user.username}`
    })
    .setTimestamp();

}

module.exports = {

  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Shows bot latency'),

  async execute(interaction) {

    const embed = createEmbed(
      interaction.user,
      interaction.client.ws.ping
    );

    await interaction.reply({
      embeds: [embed]
    });

  },

  async executePrefix(message) {

    const embed = createEmbed(
      message.author,
      message.client.ws.ping
    );

    await message.reply({
      embeds: [embed]
    });

  },

};