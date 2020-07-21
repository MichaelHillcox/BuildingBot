const axios = require('axios')
const moment = require('moment')
const github = require('./github')
const { MessageEmbed } = require('discord.js')
const bot = require('../bot')
const ScanForReferences = require('./../Utils').scanForReference

module.exports = class Issues {
  constructor() {}

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
    let issue = null;
    try {
      issue = await github.getIssue(id);
    } catch(e) {
      console.error(e)
      return;
    }

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

  // async issues(msg) {
  //   const refs = ScanForReferences(msg.content)
  //   if( refs.length === 0 )
  //   return;
    
  //   const messages = refs.map( async e => {
  //     const number = e.replace("#", "")
  //     return this.createMessage(number).catch(() => undefined);
  //   })
    
  // Promise.all(messages).then((e) => {
  //   const messageList = e.filter( e => typeof e !== 'undefined' );
    
  //   let prs = 0, issues = 0;
  //   messageList.forEach(a => a.isPr ? prs ++ : issues ++)
    
  //   if( issues > 0 || prs > 0 )
  //   msg.channel.send(
  //     `${issues > 0 ? `\`${issues}\` ${issues === 1 ? 'issue has' : 'issues have'} been referenced` : ''} ${issues > 0 && prs > 0 ? ` and ` : ''} ${prs > 0 ? `\`${prs}\` ${prs === 1 ? 'PR has' : 'PR\'s have'} been referenced` : ''}`
  //     )
      
  //     messageList.forEach((a) => msg.channel.send(a.message))
  //   })
  // }
  
  // async createMessage(number) {
  //   return new Promise((resolve, reject) => {
  //     axios.get(
  //       `${Config.api.github}repos/${Config.github.owner}/${Config.github.repo}/issues/${number}`,
  //       {
  //         auth: {
  //           username: 'michaelhillcox',
  //           password: Config.api.github.token
  //         }
  //       }).then(e => {
  //         let isPr = typeof e.data.pull_request !== 'undefined'
          
  //         resolve({isPr: isPr, message:{
  //           embed: {
  //             color: isPr ? 2932302 : e.data.state === 'closed' ? 14432055 : 3558108,
  //             author: {
  //               name: this.client.user.username + " Issue Linker",
  //               icon_url: this.client.user.avatarURL
  //             },
  //             title: `[${e.data.state}]${e.data.locked ? '[locked]': ''}: ${e.data.title}`,
  //             description: e.data.body.length > 220 ? e.data.body.substring(0, 220) + '...' : e.data.body,
  //             url: e.data.html_url,
  //             fields: [{
  //               name: "Created: ",
  //               value: moment(e.data.created_at).fromNow(),
  //               inline: true
  //             },
  //             {
  //               name: "Labels: ",
  //               value: e.data.labels.length !== 0 ? e.data.labels.map((e) => e.name).join(", ") : 'N/a',
  //               inline: true
  //             },
  //           ],
  //         }
  //       }});
        
  //     }).catch((e) => reject(e))
  //   })
  // }
}