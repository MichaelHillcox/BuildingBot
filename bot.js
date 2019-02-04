const Config = require('./config')
const ScanForReferences = require('./Utils').scanForReference
const Discord = require('discord.js')
class Bot {
    constructor() {
        this.client = new Discord.Client()
        this.login()
        
        this.client.on('ready', this.botInit.bind(this))
        this.client.on('message', this.handleMessage.bind(this))
    }

    login() {
        this.client.login(Config.discord.token)
    }

    botInit() {
        console.log(`Logged in as ${this.client.user.tag}!`);        
    }

    handleMessage(msg) {
        if( this.client.user.id === msg.author.id ) 
            return;

        if( msg.channel.id === Config.discord.channels.issues )
            this.issues(msg);
        
        if( msg.channel.id === Config.discord.channels.pr )
            this.prs(msg);
    }

    issues(msg) {
        const refs = ScanForReferences(msg.content)
        refs.map(e => {
            msg.reply("Found: "+e)
        })
    }
    
    prs(msg) {
        console.log("hi pr", msg)
    }
}

module.exports = Bot;