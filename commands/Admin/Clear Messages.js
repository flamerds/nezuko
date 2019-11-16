const Command = require('../../core/Command')
const config = require('../../data/config')
const { prefix } = config.general

class ClearMessages extends Command {
  constructor(client) {
    super(client, {
      name: 'clear',
      category: 'Moderation',
      description: 'Remove msg from msg.channels',
      usage: `${prefix}clear <0-100>`,
      aliases: ['delete', 'rm', 'purge'],
      args: true,
      guildOnly: true,
      adminOnly: true
    })
  }

  async run(msg, args, api) {
    if (args[0] === '1') args[0] = 2

    // .setFooter(`Requested by: ${msg.author.username}`, msg.author.avatarURL)
    //* if sent from a DM dont run
    if (msg.channel.type === 'dm') return
    const amount = args[0] //* Amount of messages which should be deleted
    if (isNaN(amount)) {
      return msg.channel
        .send({ embed: { title: 'The amount parameter isn`t a number!' } })
        .then((msg) => {
          msg.delete(5000)
        }) //* Checks if the `amount` parameter is a number. If not, the command throws an error
    } else if (amount > 100) {
      return msg.channel
        .send({
          embed: { title: 'You can`t delete more than 100 messages at once!' }
        })
        .then((msg) => {
          msg.delete(5000)
        }) //* Checks if the `amount` integer is bigger than 100
    } else if (amount < 1) {
      return msg.channel
        .send({ embed: { title: 'You have to delete at least 1 msg!' } })
        .then((msg) => {
          msg.delete(5000)
        })
    }
    await msg.channel.fetchMessages({ limit: amount }).then((messages) => {
      //* Fetches the messages
      return msg.channel.bulkDelete(
        messages //* Bulk deletes all messages that have been fetched and are not older than 14 days (due to the Discord API)
      )
    })
  }
}
module.exports = ClearMessages
