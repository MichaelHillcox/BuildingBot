import Discord, { Message } from 'discord.js';
import Config from './config';

import Help from './commands/help';
import Rules from './commands/rules';
import Echo from './commands/echo';
import Mods from './commands/mods';
import Commits from './commands/commits';
import Milestone from './commands/milestone';
import Command from './commands/Command';
import Issues from './commands/issues';

class Bot {
  public client: Discord.Client = new Discord.Client();
  private _commands: Command[] = [
    new Issues(),
    new Milestone(),
    new Commits(),
    new Mods(),
    new Rules(),
    new Echo(),
    new Help(),
  ];

  constructor() {
    this.client.once('ready', () => {
      console.log(`Logged in as ${this.client.user?.tag}!`);
    });

    this.client.on('message', this.handleMessage.bind(this));

    // Handle random bot timeout crashes
    this.client.on('error', console.log);

    // Handle shard errors
    this.client.on('shardError', (error) =>
      console.warn(`A websocket connection encountered an error: ${error}`)
    );

    this.client
      .login(Config.config.discord.token)
      .then(() => console.log('Bot logged in'));
  }

  handleMessage(msg: Message) {
    if (this.client.user?.id === msg.author.id || msg.author.bot) return;

    this._commands.forEach((e) =>
      e.parse(msg, msg.content, msg.content.split(' ')[0])
    );
  }

  get commands(): Command[] {
    return this._commands;
  }
}

export default new Bot();
