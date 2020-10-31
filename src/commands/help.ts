import { Message, MessageEmbed } from 'discord.js';
import Command from './Command';
import bot from '../bot';

export default class Help implements Command {
  command = '!help';
  description = 'Shows all the commands to do with the bot :D';

  async parse(
    message: Message,
    content: string,
    command: string
  ): Promise<void> {
    const context = message.content.toLowerCase();
    if (!context.startsWith(this.command)) {
      return;
    }

    // now process the requests
    await this.sendMessages(message);
  }

  async sendMessages(msg: Message) {
    const commands = bot.commands;

    msg.channel.send(
      new MessageEmbed().setDescription(
        `Our bot is still being worked on, if you find any issues then let one of the team know :D\n` +
          `**Commands**\n${commands
            .filter((e) => !e.requiresAdmin)
            .map((e) => `*${e.command}* - ${e.description}`)
            .join('\n')}`
      )
    );
  }
}
