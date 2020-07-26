const Config = require('./config')
const Discord = require('discord.js')
const Issues = require('./app/issues');
const Milestone = require('./app/milestone');
const Commits = require('./app/commits');
const Mods = require('./app/mods');
const Echo = require('./app/echo');
const Rules = require('./app/rules');
const Help = require('./app/help');

class Bot {

  constructor() {
    this.client = new Discord.Client()
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
  
module.exports = new Bot();
