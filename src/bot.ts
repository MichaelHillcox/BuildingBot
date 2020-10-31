import Config from './config'
import Discord from 'discord.js';
import Issues from './commands/issues';
import Help from './commands/help';
import Rules from './commands/rules';
import Echo from './commands/echo';
import Mods from './commands/mods';
import Commits from './commands/commits';
import Milestone from './commands/milestone';

class Bot {
  public client: Discord.Client = new Discord.Client();


  constructor() {
    this.commands = [
      new Issues(),
      new Milestone(),
      new Commits(),
      new Mods(),
      new Rules(),
      new Echo(),
      new Help(),
    ];

    this.client.once('ready', () => {
      console.log(`Logged in as ${this.client.user.tag}!`);        
    });

    this.client.on('message', this.handleMessage.bind(this))

    // Handle random bot timeout crashes
    this.client.on('error', console.log);

    // Handle shard errors
    this.client.on('shardError', error => console.warn('A websocket connection encountered an error:' + error));

    this.client.login(Config.discord.token);
  }  

  
  handleMessage(msg) {
    if( this.client.user.id === msg.author.id || msg.author.bot )
      return;
    
    this.commands.forEach(e => e.parse(msg))
  }
}
  
export default new Bot();
