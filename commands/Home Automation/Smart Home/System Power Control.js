
const fetch = require('node-fetch')
const wol = require('wol')
const Discord = require('discord.js')
const Command = require('../../../core/Command')

class SystemPowerController extends Command {
  constructor(client) {
    super(client, {
      name: 'pc',
      category: 'Smart Home',
      description: 'Power linux systems on/off',
      usage: `system gaara off | pc thinkboi reboot`,
      aliases: ['system'],
      ownerOnly: true,
      webUI: true,
      args: true
    })
  }

  async run(client, msg, args, api) {
    // -------------------------- Setup --------------------------
    const { Log } = client

    // ------------------------- Config --------------------------

    const { devices } = client.config.commands.systemPowerControl

    // ----------------------- Main Logic ------------------------

    const sendCommand = async (host, mac, command) => {
      const options = ['reboot', 'off', 'on']
      if (!options.includes(command)) {
        return 'bad params'
      }
      if (command === 'reboot' || command === 'off') {
        try {
          const response = await fetch(`${host}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command })
          })
          const statusCode = response.status
          if (statusCode === 200) {
            const text = command === 'reboot' ? 'reboot' : 'power off'
            return `${text}`
          }
        } catch (error) {
          Log.warn(error)
          return 'error'
        }
      } else if (command === 'on') {
        await wol.wake(mac)
        return 'on'
      }
    }

    // ---------------------- Usage Logic ------------------------

    const embed = new Discord.RichEmbed()
    if (!api) {
      embed.setFooter(`Requested by: ${msg.author.username}`, msg.author.avatarURL)
    }

    switch (args[0]) {
      case 'list': {
        // todo add listing functionality
        return msg.channel.send({ embed })
      }

      default: {
        const system = args[0]
        const command = args[1]
        const index = devices.findIndex((d) => d.name === system)
        const host = devices[index]
        const status = await sendCommand(host.host, host.mac, command)

        switch (status) {
          case 'reboot':
          case 'power off':
            if (api) return `Told ${system} to ${status}`

            embed.setTitle(`:desktop: Told ${system} to ${status}`)
            return msg.channel.send({ embed })

          case 'on':
            if (api) return `Sent  WOL to ${system}`

            embed.setTitle(`:desktop: Sent  WOL to ${system}`)
            return msg.channel.send({ embed })

          case 'bad params':
            if (api) return 'Valid options are `reboot, off, on`'

            embed.setTitle(':interrobang: Valid options are `reboot, off, on`')
            return msg.channel.send({ embed })

          default:
            if (api) return `Failed to connect to ${system}`

            embed.setTitle(`:desktop: Failed to connect to ${system}`)
            return msg.channel.send({ embed })
        }
      }
    }
  }
}
module.exports = SystemPowerController