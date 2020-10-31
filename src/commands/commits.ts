import github from '../services/github';
import { MessageEmbed } from 'discord.js';

export default class Commits {
  constructor() {
    this.command = "!commit {commit_sha}";
    this.description = "Displays information about a commit hash"
  }

  parse(msg) {
    const content = msg.content;
    if (!content.startsWith('!commit')) {
      return;
    }

    const sha = content.split(' ')[1] || null;
    if (sha === null) {
      return;
    }

    this.commitMessage(msg, sha);
  }

  async commitMessage(msg, sha) {
    const res = await github.getCommit(sha).catch(github.logAndNull);
    const commit = res.data;
    
    const messageParts = commit.commit.message.split('\n');
    const title = messageParts[0];
    
    // remove the title
    messageParts.shift();
    const message = messageParts.join('\n');
    const description = `
      **Message**: ${messageParts.length ? (message.startsWith('\n') ? message.substr(1, message.length) : message) : ''}
      **Author**: \`${commit.commit.author.name} / ${commit.commit.author.email}\`
    `;
    msg.channel.send(
      new MessageEmbed()
        .setColor('#00a8ff')
        .setAuthor(commit.author.login, commit.author.avatar_url, commit.author.html_url)
        .setTitle(title)
        .setURL(commit.html_url)
        .setDescription(description)
        .addField('Stats', `Total: **${commit.stats.total}** \`+${commit.stats.additions}/-${commit.stats.deletions}\``, true)
        .addField('Files Changed', commit.files.length , true)
        .addField('Verified', commit.commit.verification.verified ? ' ✅ Verified!' : '❌ Nope' , true)
        .setFooter(`Commit ${commit.sha}`)
    )
  }
}