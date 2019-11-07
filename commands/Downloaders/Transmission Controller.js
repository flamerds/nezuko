const Transmission = require('transmission-promise')
const Discord = require('discord.js')
const config = require('../../data/config')
const { prefix } = config.general

module.exports = {
  help: {
    name: 'tor',
    category: 'Downloaders',
    description: 'Transmission Management',
    usage: `${prefix}tor list`,
    aliases: ['transmission']
  },
  options: {
    enabled: true,
    apiEnabled: true,
    showInHelp: true,
    ownerOnly: false,
    guildOnly: true,
    args: false,
    cooldown: 5
  },
  async execute(client, msg, args, api) {
    //* -------------------------- Setup --------------------------
    const { bytesToSize, sortByKey } = client.utils
    const logger = client.logger
    //* ------------------------- Config --------------------------

    const { host, port, ssl } = client.config.commands.transmission
    const trans = new Transmission({
      host: host, //* default 'localhost'
      port: port, //* default 9091
      ssl: ssl, //* default false use https
      url: '/transmission/rpc' //* default '/transmission/rpc'
    })

    //* ----------------------- Main Logic ------------------------

    const getStatus = (code) => {
      switch (code) {
        case 0:
          return 'stopped'
        case 1:
          return 'checkWait'
        case 2:
          return 'checking'
        case 3:
          return 'downloadWait'
        case 4:
          return 'downloading'
        case 5:
          return 'seedWait'
        case 6:
          return 'seeding'
        case 7:
          return 'No Peers'
      }
    }

    const getQueue = async () => {
      try {
        const response = await trans.get()
        const torrents = response.torrents
        const downloadQueue = []
        for (const item of torrents) {
          downloadQueue.push({
            name: item.name,
            id: item.id,
            status: getStatus(item.status),
            percentage: item.downloadedEver ? Math.round((item.downloadedEver / item.sizeWhenDone) * 100).toString() : '0',
            rate: {
              up: item.rateUpload ? bytesToSize(item.rateUpload) : 0,
              down: item.rateDownload ? bytesToSize(item.rateDownload) : 0
            },
            size: {
              current: item.downloadedEver ? bytesToSize(item.downloadedEver) : 0,
              complete: item.sizeWhenDone ? bytesToSize(item.sizeWhenDone) : 0
            }
          })
        }
        return sortByKey(downloadQueue, 'percentage')
      } catch (error) {
        logger.warn(error)
        return 'no connection'
      }
    }

    const addTorrent = async (magnet) => {
      try {
        const response = await trans.addUrl(magnet)
        return response.name
      } catch (error) {
        logger.warn(error)
      }
    }
    // todo need to add some type of pagination logic here
    // todo maybe limit number of results to 5 to a page?
    // todo also give options on how to sort/show

    //* ---------------------- Usage Logic ------------------------

    const embed = new Discord.RichEmbed()

    switch (args[0]) {
      case 'list': {
        embed.setTitle('Transmission Downloads')

        const dlQueue = await getQueue()
        if (dlQueue === 'no connection') {
          embed.setTitle('No connection to Transmission')
          return msg.channel.send({ embed })
        }

        if (dlQueue.length) {
          embed.setFooter(`Requested by: ${msg.author.username}`, msg.author.avatarURL)
          for (const item of dlQueue) {
            if (item.status === 'downloading') {
              const netStats = item.rate.up && item.rate.down === 0 ? `- [U ${item.rate.up} | D ${item.rate.down}]` : ''
              embed.addField(
                `${item.id} | ${item.name}`,
                `${item.percentage >= 100 ? ':white_check_mark:' : ':arrow_down:'} ${item.percentage}% | ${item.size.current}/${
                  item.size.complete
                } ${netStats}`
              )
            }
          }
          return msg.channel.send({ embed })
        } else {
          embed.setTitle("Nothing in Transmission's download queue.")
          return msg.channel.send({ embed }).then((msg) => msg.delete(5000))
        }
      }

      case 'add': {
        const status = await addTorrent(args[1])
        embed.setTitle(`**${status}**\nAdded to Transmission`)
        return msg.channel.send({ embed })
      }
    }
  }
}
