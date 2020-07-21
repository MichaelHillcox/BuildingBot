const axios = require('axios')
const moment = require('moment')
const github = require('./github')
const { MessageEmbed } = require('discord.js')
const bot = require('../bot')
const ScanForReferences = require('./../Utils').scanForReference

module.exports = class Issues {
  constructor() {
    this.command = "{#issue_id}";
    this.description = "This is not a command, use by typing #number anywhere in your message."
  }

  parse(msg) {
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
    msg.channel.send(
      new MessageEmbed()
        .setColor(data.state === 'closed' ? 14432055 : (data.pull_request ? 2932302 : 3558108))
        .setAuthor(data.user.login, data.user.avatar_url, data.user.html_url)
        .setTitle(`[${data.state}]${data.locked ? '[locked]': ''}: ${data.title}`)
        .setDescription(data.body.length > 220 ? data.body.substring(0, 220) + '...' : data.body)
        .setURL(data.html_url)
        .addField("Created:", moment(data.created_at).fromNow(), true)
        .addField("Labels:", !data.labels.length ? "N/a" : data.labels.map(e => `[${e.name}](${github.createLabelLink(e.name)})`).join(', '), true)
    );
  }
}