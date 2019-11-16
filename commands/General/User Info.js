const Command = require('../../core/Command')
const config = require('../../data/config')
const { prefix } = config.general

class UserInfo extends Command {
  constructor(client) {
    super(client, {
      name: 'userinfo',
      category: 'General',
      description: 'Get info on yourself and others.',
      usage: `${prefix}userinfo | ${prefix}userinfo @user`,
      aliases: ['user'],
      guildOnly: true
    })
  }

  async run(msg, args, api) {
    const user = args[0] ? msg.mentions.members.first() : msg.author
    if (!user) {
      return client.functions.get('argFix')(
        client,
        msg.channel,
        1,
        'Did not find a user with that query.'
      )
    }

    const inGuild = msg.guild.members.has(user.id)

    const embed = new Discord.RichEmbed()
      .setFooter(`Requested by: ${msg.author.username}`, msg.author.avatarURL)
      .setTitle(`${user.user.tag}'s User Info`)
      .setColor(inGuild ? msg.guild.members.get(user.user.id).displayHexColor : 0xa2ba00)
      .setTimestamp()
      .setThumbnail(user.user.avatarURL)
      .addField('Created At', client.dateFormat(user.user.createdAt), true)
      .addField('Status', client.utils.capitalize(user.user.presence.status), true)

    if (inGuild) {
      const member = msg.guild.members.get(user.user.id)

      const memSort = msg.guild.members
        .sort((a, b) => {
          return a.joinedTimestamp - b.joinedTimestamp
        })
        .array()
      let position = 0
      for (let i = 0; i < memSort.length; i++) {
        position++
        if (memSort[i].id === user.id) break
      }

      embed
        .addField('Joined At', client.dateFormat(member.joinedAt), true)
        .addField('Joined Position', position, true)
    }

    if (user.user.presence.activity) embed.addField('Game', user.user.presence.activity.name)

    return msg.channel.send(embed)
  }
}
module.exports = UserInfo
