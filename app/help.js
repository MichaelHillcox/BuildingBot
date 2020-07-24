const { MessageEmbed } = require('discord.js');

module.exports = class Help {
  constructor() {
    this.command = "!help";
    this.description = "Shows all the commands to do with the bot :D"
  }

  parse(msg) {
    const context = msg.content.toLowerCase();
    if (!context.startsWith(this.command)) {
      return;
    }
    
    // now process the requests
    this.sendMessages(msg)
  }

  async sendMessages(msg) {
    const commands = require('../bot').commands;
    msg.channel.send(
      new MessageEmbed()
        .setDescription(`Our bot is still being worked on, if you find any issues then let one of the team know :D\n`+
        `**Commands**\n${commands.map(e => `*${e.command}* - ${e.description}`).join('\n')}`)
    )
  }
}