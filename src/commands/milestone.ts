import moment from 'moment';
import { Message, MessageEmbed } from 'discord.js';
import github from '../services/github';
import Command from './Command';

export default class Milestone implements Command {
  command: string = '!milestone {milestone_id}';
  description: string = 'Displayed a detailed breakdown of a milestone';

  async parse(message: Message, content: string): Promise<void> {
    if (!content.startsWith('!milestone')) {
      return;
    }

    const id: string | null = content.split(' ')[1] || null;
    if (id == null) {
      return;
    }

    await this.sendMilestone(message, id);
  }

  async sendMilestone(msg: Message, id: string): Promise<void> {
    const req = await github.getMilestone(id).catch(github.logAndNull);
    const issues = req?.data;

    if (typeof issues === 'undefined' || issues.length === 0) {
      // Todo: maybe get the milestone regardless?
      msg.channel.send('This milestone contains no issues :(');
      return;
    }

    const { milestone } = issues[0];

    const openIssues: any[] = [];
    const closedIssues: any[] = [];

    issues.forEach((e) =>
      e.state === 'open' ? openIssues.push(e) : closedIssues.push(e)
    );

    const description = `${milestone.description}\n
      **Open Issues(${openIssues.length})**: ${
      openIssues.length
        ? openIssues.map((e) => `[#${e.number}](${e.html_url})`).join(', ')
        : 'None'
    }
      **Closed Issues(${closedIssues.length})**: ${
      closedIssues.length
        ? closedIssues.map((e) => `[#${e.number}](${e.html_url})`).join(', ')
        : 'None'
    }
    _____`;

    msg.channel.send(
      new MessageEmbed()
        .setAuthor(
          milestone.creator.login,
          milestone.creator.avatar_url,
          milestone.creator.html_url
        )
        .setColor(milestone.state === 'open' ? '#12FF50' : '#FF5050')
        .setTitle(
          `[${milestone.state === 'open' ? 'Open' : 'Closed'}] ${
            milestone.title
          }`
        )
        .setURL(milestone.html_url)
        .setDescription(
          description.length > 2000
            ? `${description.substr(0, 2000)}...`
            : description
        )
        .addField(
          'Complete',
          `${Milestone.milestoneProgress(milestone, issues.length)}%`,
          true
        )
        .addField(
          'Due',
          milestone.due_on ? moment(milestone.due_on).fromNow() : 'No due date',
          true
        )
        .addField(
          'Created / Closed',
          milestone.closed_at
            ? `Closed ${moment(milestone.closed_at).fromNow()}`
            : `Created ${moment(milestone.created_at).fromNow()}`,
          true
        )
    );
  }

  static milestoneProgress(milestone: any, issuesLength: number) {
    if (milestone.open_issues === 0 && milestone.closed_issues) return 100;

    if (milestone.open_issues === issuesLength) return 0;

    return 100 - (milestone.open_issues / issuesLength) * 100;
  }
}
