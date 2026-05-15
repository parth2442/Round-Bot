module.exports = async (
  guild,
  executorId,
  punishment,
  reason
) => {

  const member =
    await guild.members.fetch(
      executorId
    ).catch(() => null);

  if (!member) return false;

  try {

    if (punishment === 'ban') {

      await member.ban({ reason });

    }

    if (punishment === 'kick') {

      await member.kick(reason);

    }

    return true;

  } catch (error) {

    console.error(error);

    return false;

  }

};