import { Message } from 'discord.js';
import Command from './Command';
import Config from '../config';
import github from '../services/github';

export default class issueManage implements Command {
  requiresAdmin = true;
  command = '!im <issue_number> <close/open>';
  description = 'Allows trusted users to close github issues';

  async parse(message: Message, content: string): Promise<void> {
    if (
      !content.startsWith('!im') ||
      (!message.member?.hasPermission('ADMINISTRATOR') &&
        !message.member?.roles.cache.has(
          Config.config.discord.canManageIssuesRole
        ))
    ) {
      return;
    }

    const spitContent: string[] = content.split(' ');
    spitContent.shift(); // remove the first item;

    if (spitContent.length < 2) {
      await message.reply(
        'You must provide an issue number and then the issues state.'
      );
      return;
    }

    const issueNumber: number = parseInt(spitContent[0], 10);
    const state: string = spitContent[1];
    const reply: string | null = spitContent[2]
      ? spitContent.slice(2).join(' ')
      : null;

    if (!Number.isInteger(issueNumber)) {
      await message.reply('The issue number must be a int');
      return;
    }

    if (state !== 'close' && state !== 'open') {
      await message.reply('You must set the state to either [open] or [close]');
      return;
    }

    try {
      if (state === 'close') {
        await github.closeIssue(issueNumber);
        await github.commentOn(
          issueNumber,
          `This issue has been closed by one of our team ${
            reply &&
            `with an attached reply: 
          
> "${reply}"

`
          } If you feel this has been done incorrectly then please mention @MichaelHillcox.`
        );
      } else {
        await github.openIssue(issueNumber);
      }
    } catch (e) {
      await message.reply(
        e.status === 404 ? 'Issue not found' : 'Something went wrong'
      );
      return;
    }

    message.channel.send(
      `Issue https://github.com/direwolf20-mc/buildinggadgets/issues/${issueNumber} has been ${
        state === 'close' ? 'closed' : 'opened'
      }`
    );
  }
}
