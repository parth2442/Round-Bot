module.exports = {

  name: 'interactionCreate',

  async execute(interaction) {

    if (!interaction.isStringSelectMenu())
      return;

    if (
      interaction.customId !== 'help_menu'
    ) return;

    const helpCommand =
      interaction.client.commands.get(
        'help'
      );

    if (!helpCommand) return;

    await helpCommand.handleMenu(
      interaction
    );

  },

};