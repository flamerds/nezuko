const { Device } = require('google-home-notify-client')
const Discord = require('discord.js')
const config = require('../../data/config')
const { prefix } = config.general

module.exports = {
  help: {
    name: 'say',
    category: 'Smart Home',
    description: 'Speak through Google Home',
    usage: `${prefix}say <msg>`,
    aliases: ['speak']
  },
  options: {
    enabled: true,
    apiEnabled: true,
    showInHelp: true,
    ownerOnly: true,
    guildOnly: true,
    args: true,
    cooldown: 5
  },
  async execute(client, msg, args, api) {
    //* -------------------------- Setup --------------------------

    //* ------------------------- Config --------------------------

    const { ip, name, language, accent } = client.config.commands.googleHome

    //* ----------------------- Main Logic ------------------------

    /**
     * send text to Google Home to TTS
     * @param {String} speach text to have spoken
     */
    const googleSpeak = async (speach) => {
      try {
        const device = new Device(ip, name, language, accent)
        await device.notify(speach)
        return 'success'
      } catch (error) {
        return 'no connection'
      }
    }

    //* ---------------------- Usage Logic ------------------------

    const command = args.join(' ')
    const status = await googleSpeak(command)
    const embed = new Discord.RichEmbed()

    if (!api) {
      embed.setFooter(`Requested by: ${msg.author.username}`, msg.author.avatarURL)
    }

    if (api) return

    if (status === 'success') {
      embed.setTitle(`Told Google Home to say: **${command}**`)
      return msg.channel.send({ embed })
    } else {
      embed.setTitle('No connection to Google Home.')
      return msg.channel.send({ embed })
    }
  }
}
