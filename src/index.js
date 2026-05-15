require("dotenv").config();

const fs = require("fs");
const path = require("path");

const {
    Client,
    Collection,
    GatewayIntentBits,
    Partials
} = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
    ],
    partials: [Partials.Channel]
});

client.commands = new Collection();

const commands = [];

// Load Commands
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
    .readdirSync(commandsPath)
    .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);

    try {
        const command = require(filePath);

        // Skip broken command files
        if (!command) continue;

        // Support both slash + prefix commands
        const commandName =
            command.data?.name || command.name;

        if (!commandName) {
            console.log(`❌ Invalid command file: ${file}`);
            continue;
        }

        client.commands.set(commandName, command);

        // Only push slash commands
        if (command.data) {
            commands.push(command.data.toJSON());
        }

        console.log(`✅ Loaded command: ${commandName}`);

    } catch (err) {
        console.log(`❌ Failed to load ${file}`);
        console.error(err);
    }
}

// Ready Event
client.once("ready", () => {
    console.log(`🤖 Logged in as ${client.user.tag}`);
});

// Message Commands
client.on("messageCreate", async message => {
    if (message.author.bot) return;

    const prefix = "!";

    if (!message.content.startsWith(prefix)) return;

    const args = message.content
        .slice(prefix.length)
        .trim()
        .split(/ +/);

    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);

    if (!command) return;

    try {
        if (command.execute) {
            command.execute(message, args, client);
        }
    } catch (error) {
        console.error(error);
        message.reply("❌ Error executing command.");
    }
});

// Slash Commands
client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(
        interaction.commandName
    );

    if (!command) return;

    try {
        if (command.execute) {
            await command.execute(interaction, client);
        }
    } catch (error) {
        console.error(error);

        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: "❌ Error executing slash command.",
                ephemeral: true
            });
        } else {
            await interaction.reply({
                content: "❌ Error executing slash command.",
                ephemeral: true
            });
        }
    }
});

// Login
client.login(process.env.TOKEN);