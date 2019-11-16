const { Client, RichEmbed } = require('discord.js')
const Enmap = require('enmap')
const messageLogging = require('../core/utils/messageLogging')
const chalk = require('chalk')

module.exports = class CommandManager {
  constructor(client) {
    this.client = client
    this.commands = new Enmap()
    this.aliases = new Enmap()
    this.prefix = client.config.general.prefix
    this.ownerId = client.config.general.ownerId
    this.logger = client.logger

    if (!this.client || !(this.client instanceof Client)) {
      throw new Error('Discord Client is required')
    }
  }

  loadCommands(directory) {
    const cmdFiles = this.client.utils.findNested(directory, '.js')
    cmdFiles.forEach((file) => {
      this.startModule(file)
    })
  }

  startModule(location) {
    const Command = require(location)
    const instance = new Command(this.client)
    const commandName = instance.name.toLowerCase()
    instance.location = location

    if (instance.disabled) return
    if (this.commands.has(commandName)) {
      this.logger.error('Start Module', `"${commandName}" already exists!`)
      throw new Error('Commands cannot have the same name')
    }

    this.commands.set(commandName, instance)

    for (const alias of instance.aliases) {
      if (this.aliases.has(alias)) {
        throw new Error(`Commands cannot share aliases: ${instance.name} has ${alias}`)
      } else {
        this.aliases.set(alias, instance)
      }
    }
  }

  runCommand(command, msg, args, api = false) {
    try {
      this.logger.info('Command Parser', `Matched ${command.name}, Running...`)
      return command.run(msg, args, api)
    } catch (err) {
      return //error('Command', err)
    }
  }

  findCommand(commandName) {
    return this.commands.get(commandName) || this.aliases.get(commandName)
  }

  async handleMessage(msg) {
    const content = msg.content

    // if msg is sent by bot then ignore
    if (msg.author.bot) return

    // send all messages to our logger
    await messageLogging(this.client, msg)

    // if msg doesnt start with prefix then ignore msg
    if (!content.startsWith(this.prefix)) return

    // anything after command becomes a list of args
    const args = content.slice(this.prefix.length).split(/ +/)

    // command name without prefix
    const commandName = args.shift().toLowerCase()

    // set command name and aliases
    const instance = this.findCommand(commandName)

    // if no command or alias do nothing
    if (!instance)
      return msg.channel.send(`No command: **${commandName}**`).then((msg) => msg.delete(5000))

    const command = instance

    // assign variables
    msg.context = this
    msg.command = instance.commandName
    msg.prefix = this.prefix
    msg.getAdministrators = this.getAdministrators

    // Check if command is enabled
    if (command.disabled) return

    // print to console hwne user runs any command
    this.logger.info(
      chalk.green(
        `${chalk.yellow(msg.author.tag)} ran command ${chalk.yellow(commandName)} ${chalk.yellow(
          args.join(' ')
        )}`
      )
    )
    // if command is marked 'guildOnly: true' then don't excecute
    if (command.guildOnly && msg.channel.type === 'dm') {
      return msg.reply({ embed: { title: 'This command cannot be slid into my DM.' } })
    }

    // if command is marked 'ownerOnly: true' then don't excecute
    if (command.ownerOnly && msg.author.id !== this.ownerId) {
      return msg
        .reply('Only my master can use that command you fucking weaboo warrior')
        .then((msg) => {
          msg.delete(10000)
        })
    }

    let adminList
    if (msg.channel.type !== 'dm') {
      adminList = this.getAdministrators(msg.guild)
    }
    // if command is marked 'adminOnly: true' then don't excecute
    if (command.adminOnly && !adminList.includes(msg.author.id)) {
      return msg.reply('Command is reserved for Admins.').then((msg) => {
        msg.delete(10000)
      })
    }

    // if commands is marked 'args: true' run this if no args sent
    if (command.args && !args.length) {
      const embed = new RichEmbed()
        .setTitle("You didn't provide any arguments")
        .addField('**Example Usage**', '```css' + `\n${command.usage.replace(' | ', '\n')}` + '```')
      return msg.reply({ embed }).then((msg) => {
        msg.delete(10000)
      })
    }

    // Run Command
    msg.channel.startTyping()
    await this.runCommand(command, msg, args)
    return msg.channel.stopTyping()
  }

  getAdministrators(guild) {
    let owners = []

    for (const member of guild.members.values()) {
      if (member.hasPermission('ADMINISTRATOR')) {
        owners.push(member.user.id)
      }
    }

    return owners
  }
}
