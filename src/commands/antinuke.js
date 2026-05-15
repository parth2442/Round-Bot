const {
  PermissionsBitField,
  EmbedBuilder,
  AuditLogEvent,
} = require("discord.js");

const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "antinuke",
  description: "Enable or disable anti nuke system",

  async execute(message, args) {
    if (
      !message.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      return message.reply("❌ You need Administrator permission.");
    }

    const option = args[0];

    if (!option) {
      return message.reply(
        "Usage: `!antinuke on` or `!antinuke off`"
      );
    }

    if (option === "on") {
      await db.set(`antinuke_${message.guild.id}`, true);

      const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("🛡️ Anti Nuke Enabled")
        .setDescription(
          "Anti Nuke system has been enabled successfully."
        )
        .setTimestamp();

      return message.channel.send({ embeds: [embed] });
    }

    if (option === "off") {
      await db.set(`antinuke_${message.guild.id}`, false);

      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("🛡️ Anti Nuke Disabled")
        .setDescription(
          "Anti Nuke system has been disabled successfully."
        )
        .setTimestamp();

      return message.channel.send({ embeds: [embed] });
    }

    return message.reply(
      "Usage: `!antinuke on` or `!antinuke off`"
    );
  },
};

module.exports.protection = async (client) => {

  client.on("channelDelete", async (channel) => {
    const enabled = await db.get(`antinuke_${channel.guild.id}`);
    if (!enabled) return;

    const logs = await channel.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.ChannelDelete,
    });

    const entry = logs.entries.first();
    if (!entry) return;

    const executor = entry.executor;

    if (!executor) return;
    if (executor.id === channel.guild.ownerId) return;
    if (executor.id === client.user.id) return;

    try {
      const member = await channel.guild.members.fetch(executor.id);

      await member.roles.set([]);

      await member.send(
        `🚨 You were punished in **${channel.guild.name}** for suspicious channel deletion activity.`
      ).catch(() => {});

      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("🚨 Anti Nuke Triggered")
        .setDescription(
          `**User:** ${executor.tag}\n**Action:** Channel Delete\n**Punishment:** Removed all roles`
        )
        .setTimestamp();

      const logChannel = channel.guild.systemChannel;

      if (logChannel) {
        logChannel.send({ embeds: [embed] }).catch(() => {});
      }

    } catch (err) {
      console.log(err);
    }
  });

  client.on("roleDelete", async (role) => {
    const enabled = await db.get(`antinuke_${role.guild.id}`);
    if (!enabled) return;

    const logs = await role.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.RoleDelete,
    });

    const entry = logs.entries.first();
    if (!entry) return;

    const executor = entry.executor;

    if (!executor) return;
    if (executor.id === role.guild.ownerId) return;
    if (executor.id === client.user.id) return;

    try {
      const member = await role.guild.members.fetch(executor.id);

      await member.roles.set([]);

      await member.send(
        `🚨 You were punished in **${role.guild.name}** for suspicious role deletion activity.`
      ).catch(() => {});

    } catch (err) {
      console.log(err);
    }
  });
};