require('dotenv').config();

const fs = require('fs');
const path = require('path');

const {
  Client,
  Collection,
  GatewayIntentBits,
  Events
} = require('discord.js');

const client = new Client({

  intents: [

    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildWebhooks

  ]

});

client.commands = new Collection();

/*
=========================
BOT PREFIX
=========================
*/

client.prefix = 'R';

/*
=========================
COMMAND LOADER
=========================
*/

const commandsPath =
  path.join(__dirname, 'commands');

const commandFiles =
  fs.readdirSync(commandsPath)
    .filter(file => file.endsWith('.js'));

for (const file of commandFiles) {

  const filePath =
    path.join(commandsPath, file);

  const command =
    require(filePath);

  client.commands.set(
    command.data.name,
    command
  );

}

/*
=========================
EVENT LOADER
=========================
*/

const eventsPath =
  path.join(__dirname, 'events');

const eventFiles =
  fs.readdirSync(eventsPath)
    .filter(file => file.endsWith('.js'));

for (const file of eventFiles) {

  const filePath =
    path.join(eventsPath, file);

  const event =
    require(filePath);

  client.on(
    event.name,
    async (...args) => {

      try {

        await event.execute(...args);

      } catch (error) {

        console.error(
          `Error in event ${event.name}:`,
          error
        );

      }

    }
  );

}

/*
=========================
BOT READY
=========================
*/

client.once(Events.ClientReady, c => {

  console.log(
    `✅ ${c.user.tag} is online`
  );

  client.user.setPresence({

    activities: [

      {

        name:
          `Crafted by parth.cd || ${client.prefix}help`,

        type: 0

      }

    ],

    status: 'online'

  });

});

/*
=========================
SLASH COMMAND HANDLER
=========================
*/

client.on(
  Events.InteractionCreate,
  async interaction => {

    if (!interaction.isChatInputCommand())
      return;

    const command =
      client.commands.get(
        interaction.commandName
      );

    if (!command) return;

    try {

      await command.execute(interaction);

    } catch (error) {

      console.error(error);

      await interaction.reply({

        content:
          '❌ Error while executing command.',

        ephemeral: true

      });

    }

  }
);

client.login(process.env.TOKEN);