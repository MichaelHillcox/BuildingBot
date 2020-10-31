import github from '../services/github';
import { Message, MessageEmbed } from 'discord.js';
import Command from './Command';

export default class Commits implements Command {
  command: string = '!commit {commit_sha}';
  description: string = 'Displays information about a commit hash';

  async parse(
    message: Message,
    content: string,
    command: string
  ): Promise<void> {
    if (!content.startsWith('!commit')) {
      return;
    }

    const sha = content.split(' ')[1] || null;
    if (sha === null) {
      return;
    }

    await this.commitMessage(message, sha);
  }

  async commitMessage(msg: Message, sha: string) {
    const res = await github.getCommit(sha).catch(github.logAndNull);
    const commit = res.data;

    const messageParts = commit.commit.message.split('\n');
    const title = messageParts[0];

    // remove the title
    messageParts.shift();
    const message = messageParts.join('\n');
    const description = `
      **Message**: ${
        messageParts.length
          ? message.startsWith('\n')
            ? message.substr(1, message.length)
            : message
          : ''
      }
      **Author**: \`${commit.commit.author.name} / ${
      commit.commit.author.email
    }\`
    `;
    msg.channel.send(
      new MessageEmbed()
        .setColor('#00a8ff')
        .setAuthor(
          commit.author.login,
          commit.author.avatar_url,
          commit.author.html_url
        )
        .setTitle(title)
        .setURL(commit.html_url)
        .setDescription(description)
        .addField(
          'Stats',
          `Total: **${commit.stats.total}** \`+${commit.stats.additions}/-${commit.stats.deletions}\``,
          true
        )
        .addField('Files Changed', commit.files.length, true)
        .addField(
          'Verified',
          commit.commit.verification.verified ? ' ✅ Verified!' : '❌ Nope',
          true
        )
        .setFooter(`Commit ${commit.sha}`)
    );
  }
}
