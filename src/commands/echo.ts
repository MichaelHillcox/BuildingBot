import Command from './Command';
import { Message } from 'discord.js';

export default class Echo implements Command {
  requiresAdmin = true;
  command = '!echo <anything>';
  description = 'Posts anything you type after echo as the bot';

  async parse(
    message: Message,
    content: string,
    command: string
  ): Promise<void> {
    if (
      !content.startsWith('!echo') ||
      !message.member?.hasPermission('ADMINISTRATOR')
    ) {
      return;
    }

    const spitContent: string[] = content.split(' ');
    spitContent.shift(); // remove the first item;
    const messageText = spitContent.join(' ');

    message.channel.send(messageText);
  }
}
