module.exports = {

  name: 'messageCreate',

  async execute(message) {

    const client = message.client;

    if (message.author.bot) return;

    if (!message.content.startsWith(client.prefix))
      return;

    const args = message.content
      .slice(client.prefix.length)
      .trim()
      .split(/ +/);

    const commandName =
      args.shift().toLowerCase();

    const command =
      client.commands.get(commandName);

    if (!command) return;

    try {

      await command.executePrefix(
        message,
        args
      );

    } catch (error) {

      console.error(error);

      message.reply(
        '❌ Error executing command.'
      );

    }

  },

};