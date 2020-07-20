const Config = require('./config')
const Discord = require('discord.js')
const Issues = require('./app/issues');
const Milestone = require('./app/milestone');

class Bot {
  constructor() {
    this.client = new Discord.Client()
    this.commands = [
      new Issues(),
      new Milestone(),
    ]

    this.login()

    this.client.on('ready', this.botInit.bind(this))
    this.client.on('message', this.handleMessage.bind(this))

    // Handle random bot timeout crashes
    this.client.on('error', console.log);

    // Handle shard errors
    this.client.on('shardError', error => console.warn('A websocket connection encountered an error:' + error));
  }
  
  login() {
    this.client.login(Config.discord.token)
  }
  
  botInit() {
    console.log(`Logged in as ${this.client.user.tag}!`);        
  }
  
  handleMessage(msg) {
    if( this.client.user.id === msg.author.id || msg.author.bot )
      return;
    
    this.commands.forEach(e => e.parse(msg))
  }
}
  
module.exports = new Bot();
  