import moment from 'moment';
import { Message, MessageEmbed } from 'discord.js';
import github from '../services/github';
import Milestone from './milestone';
import scanForReference from '../Utils';
import Command from './Command';

export default class Issues implements Command {
  public command = '{#issue_id}';
  public description =
    'This is not a command, use by typing #number anywhere in your message.';

  async parse(message: Message): Promise<void> {
    const refs = scanForReference(message.content);
    if (refs.length === 0) {
      return;
    }

    // Make sure it's not in a quote...
    message.content.split('\n').forEach((e) => {
      if (e.startsWith('>')) {
        refs.forEach((a, index) => {
          if (e.includes(a)) refs.splice(index, 1);
        });
      }
    });

    // now process the requests
    refs.forEach((id) =>
      this.sendMessages(message, id.replace('#', '')).catch(console.log)
    );
  }

  async sendMessages(msg: Message, id: string) {
    console.log(id, parseInt(id, 10));

    const issue = await github
      .getIssue(parseInt(id, 10))
      .catch(github.logAndNull);

    if (issue === null) {
      return;
    }

    const { data } = issue;

    // Count tasks if they exist.
    const tasks = { complete: 0, incomplete: 0 };
    data.body.split('\n').forEach((e: string) => {
      const line = e.trim().toLowerCase();
      if (line.startsWith('- [ ]')) tasks.incomplete += 1;
      if (line.startsWith('- [x]')) tasks.complete += 1;
    });

    let color = 3558108;
    if (data.state === 'closed') {
      color = 14432055;
    } else if (data.pull_request) {
      color = 2932302;
    }

    const embed = new MessageEmbed()
      .setColor(color)
      .setAuthor(data.user.login, data.user.avatar_url, data.user.html_url)
      .setTitle(
        `[${data.state}]${data.locked ? '[locked]' : ''}: ${data.title}`
      )
      .setDescription(
        data.body.length > 220 ? `${data.body.substring(0, 220)}...` : data.body
      )
      .setURL(data.html_url)
      .addField('Created', moment(data.created_at).fromNow(), true);

    if (data.labels.length) {
      embed.addField(
        'Labels',
        data.labels
          .map(
            (e: { name: string }) =>
              `[${e.name}](${github.createLabelLink(e.name)})`
          )
          .join(', '),
        true
      );
    }

    if (data.assignees.length) {
      embed.addField(
        'Assignees',
        `${data.assignees
          .map(
            (e) =>
              `[${e.login}](${e.html_url})`
          )
          .join(', ')}`,
        true
      );
    }

    if (tasks.incomplete > 0 || tasks.complete > 0) {
      const total = tasks.complete + tasks.incomplete;
      embed.addField('Tasks', `${tasks.complete} of ${total} completed`, true);
    }

    if (data.milestone) {
      const total = data.milestone.open_issues + data.milestone.closed_issues;
      embed.addField(
        'Milestone',
        `[${data.milestone.title}](${
          data.milestone.html_url
        }) (${Milestone.milestoneProgress(data.milestone, total)}%)`,
        true
      );
    }

    msg.channel.send(embed);
  }
}
