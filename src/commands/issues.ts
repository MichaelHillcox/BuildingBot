import axios from 'axios';
import moment from 'moment';
import github from '../services/github';
import { Message, MessageEmbed } from 'discord.js';
import Milestone from './milestone';
import { scanForReference as ScanForReferences } from '../Utils';

export default class Issues {
  constructor() {
    this.command = "{#issue_id}";
    this.description = "This is not a command, use by typing #number anywhere in your message."
  }

  parse(msg: Message) {
    const refs = ScanForReferences(msg.content)
    if (refs.length === 0) {
      return;
    }

    // Make sure it's not in a quote...
    msg.content.split('\n').forEach(e => {
      if (e.startsWith('>')) {
        refs.forEach((a, index) => {
          if (e.includes(a))
            refs.splice(index, 1)
        })
      }
    });
    
    // now process the requests
    refs.forEach(id => this.sendMessages(msg, id.replace('#', '')).catch(console.log));
  }

  async sendMessages(msg, id) {
    let issue = await github.getIssue(id).catch(github.logAndNull);

    if (issue === null) {
      return;
    }

    const data = issue.data;

    // Count tasks if they exist.
    const tasks = {complete: 0, incomplete: 0};
    data.body.split('\n').forEach(e => {
      const line = e.trim().toLowerCase();
      if (line.startsWith('- [ ]'))
        tasks.incomplete ++;
      if (line.startsWith('- [x]'))
        tasks.complete ++;
    });

    const embed = new MessageEmbed()
      .setColor(data.state === 'closed' ? 14432055 : (data.pull_request ? 2932302 : 3558108))
      .setAuthor(data.user.login, data.user.avatar_url, data.user.html_url)
      .setTitle(`[${data.state}]${data.locked ? '[locked]': ''}: ${data.title}`)
      .setDescription(data.body.length > 220 ? data.body.substring(0, 220) + '...' : data.body)
      .setURL(data.html_url)
      .addField("Created", moment(data.created_at).fromNow(), true)

    if (data.labels.length) {
      embed.addField("Labels", data.labels.map(e => `[${e.name}](${github.createLabelLink(e.name)})`).join(', '), true)
    }

    if (data.assignees.length) {
      embed.addField("Assignees", `${data.assignees.map(e => `[${e.login}](${e.html_url})`).join(', ')}`, true)
    }

    if (tasks.incomplete > 0 || tasks.complete > 0) {
      const total = tasks.complete + tasks.incomplete;
      embed.addField("Tasks", `${tasks.complete} of ${total} completed`, true);
    }

    if (data.milestone) {
      const total = data.milestone.open_issues + data.milestone.closed_issues;
      embed.addField("Milestone", `[${data.milestone.title}](${data.milestone.html_url}) (${Milestone.milestoneProgress(data.milestone, total)}%)`, true)
    }

    msg.channel.send(embed);
  }
}