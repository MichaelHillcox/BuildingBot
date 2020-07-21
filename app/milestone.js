const github = require("./github");
const moment = require('moment')
const { MessageEmbed } = require("discord.js");

module.exports = class Milestone {
  constructor() {}

  async parse(msg) {
    const content = msg.content;
    if (!content.startsWith("!milestone")) {
      return;
    }

    const id = content.split(' ')[1] || null;
    if (id == null) {
      return;
    }

    this.sendMilestone(msg, id);
  }

  async sendMilestone(msg, id) {
    const req = await github.getMilestone(id).catch(github.logAndNull);
    const issues = req.data;
    if (issues.length === 0) {
      // Todo: maybe get the milestone regardless?
      msg.channel.send('This milestone contains no issues :(')
      return;
    }
    

    const milestone = issues[0].milestone;

    const openIssues = [];
    const closedIssues = [];

    issues.forEach(e => e.state === 'open' ? openIssues.push(e) : closedIssues.push(e))

    msg.channel.send(
      new MessageEmbed()
        .setAuthor(milestone.creator.login, milestone.creator.avatar_url, milestone.creator.html_url)
        .setColor(milestone.state === 'open' ? '#12FF50' : '#FF5050')
        .setTitle(`[${milestone.state === 'open' ? 'Open' : 'Closed'}] ${milestone.title}`)
        .setURL(milestone.html_url)
        .setDescription(`
          ${milestone.description}\n
          **Open Issues(${openIssues.length})**: ${openIssues.length ? openIssues.map(e => `[#${e.number}](${e.html_url})`).join(', ') : 'None'}
          **Closed Issues(${closedIssues.length})**: ${closedIssues.length ? closedIssues.map(e => `[#${e.number}](${e.html_url})`).join(', ') : 'None'}
          _____
        `)
        .addField('Complete', `${this.milestoneProgress(milestone, issues.length)}%`, true)
        .addField('Due', milestone.due ? moment(milestone.due).fromNow() : 'No due date', true)
        .addField('Created / Closed', milestone.closed_at ? `Closed ${moment(milestone.closed_at).fromNow()}`: `Created ${moment(milestone.created_at).fromNow()}`, true)
    )
  }

  milestoneProgress(milestone, issuesLength) {
    if (milestone.open_issues === 0 && milestone.closed_issues)
      return 100;

    if (milestone.open_issues === issuesLength)
      return 0;

    return 100 - ((milestone.open_issues / issuesLength) * 100);
  }
}