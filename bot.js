const Config = require('./config')
const ScanForReferences = require('./Utils').scanForReference
const Discord = require('discord.js')
const axios = require('axios')
const moment = require('moment')

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

        if( msg.channel.id === Config.discord.channels.issues || msg.channel.id === Config.discord.channels.pr )
            this.issues(msg);
    }

    async issues(msg) {
        const refs = ScanForReferences(msg.content)
        if( refs.length === 0 )
            return;

        msg.channel.send(`${refs.length} ${refs.length === 1 ? 'issue has' : 'issues have'} been referenced`)
        
        const messages = refs.map( async e => {
            const number = e.replace("#", "")
            return this.createMessage(number).catch(e => console.log(e));
        })

        Promise.all(messages).then((e) => {
            let prs = [], issues = [];
            e.forEach()
            e.forEach((e) => msg.channel.send(e))
        })
    }

    async createMessage(number) {
        return new Promise((resolve, reject) => {
            axios.get(`${Config.api.github}repos/${Config.github.owner}/${Config.github.repo}/issues/${number}`).then(e => {
                
                resolve({isPr: ,message:{
                    embed: {
                        author: {
                            name: this.client.user.username + " Issue Linker",
                            icon_url: this.client.user.avatarURL
                        },
                        title: `[${e.data.state}]${e.data.locked ? '[locked]': ''}: ${e.data.title}`,
                        description: e.data.body.length > 220 ? e.data.body.substring(0, 220) + '...' : e.data.body,
                        url: e.data.url,
                        fields: [{
                                name: "Created: ",
                                value: moment(e.data.created_at).fromNow(),
                                inline: true
                            },
                            {
                                name: "Labels: ",
                                value: e.data.labels.map((e) => e.name).join(", "),
                                inline: true
                            },
                        ],
                    }
                }});
    
            }).catch((e) => reject(e))
        })
    }
}

module.exports = Bot;