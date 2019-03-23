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

        this.issues(msg);
    }

    async issues(msg) {
        const refs = ScanForReferences(msg.content)
        if( refs.length === 0 )
            return;

        const messages = refs.map( async e => {
            const number = e.replace("#", "")
            return this.createMessage(number).catch(() => undefined);
        })

        Promise.all(messages).then((e) => {
            const messageList = e.filter( e => typeof e !== 'undefined' );

            let prs = 0, issues = 0;
            messageList.forEach(a => a.isPr ? prs ++ : issues ++)

            if( issues > 0 || prs > 0 )
                msg.channel.send(
                    `${issues > 0 ? `\`${issues}\` ${issues === 1 ? 'issue has' : 'issues have'} been referenced` : ''} ${issues > 0 && prs > 0 ? ` and ` : ''} ${prs > 0 ? `\`${prs}\` ${prs === 1 ? 'PR has' : 'PR\'s have'} been referenced` : ''}`
                )

            messageList.forEach((a) => msg.channel.send(a.message))
        })
    }

    async createMessage(number) {
        return new Promise((resolve, reject) => {
            axios.get(
                `${Config.api.github}repos/${Config.github.owner}/${Config.github.repo}/issues/${number}`,
                {
                    auth: {
                        username: 'michaelhillcox',
                        password: Config.api.github.token
                    }
                }
            ).then(e => {
                let isPr = typeof e.data.pull_request !== 'undefined'

                resolve({isPr: isPr, message:{
                    embed: {
                        color: isPr ? 2932302 : e.data.state === 'closed' ? 14432055 : 3558108,
                        author: {
                            name: this.client.user.username + " Issue Linker",
                            icon_url: this.client.user.avatarURL
                        },
                        title: `[${e.data.state}]${e.data.locked ? '[locked]': ''}: ${e.data.title}`,
                        description: e.data.body.length > 220 ? e.data.body.substring(0, 220) + '...' : e.data.body,
                        url: e.data.html_url,
                        fields: [{
                                name: "Created: ",
                                value: moment(e.data.created_at).fromNow(),
                                inline: true
                            },
                            {
                                name: "Labels: ",
                                value: e.data.labels.length !== 0 ? e.data.labels.map((e) => e.name).join(", ") : 'N/a',
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
