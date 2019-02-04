class Bot {
    constructor(client) {
        this.client = client

        this.client.on('ready', this.botInit)
        this.client.on('message', this.handleMessage)
    }

    botInit() {
        console.log(`Logged in as ${client.user.tag}!`);        
    }

    handleMessage(msg) {
        if( msg.channel.id === Config.discord.channels.issues )
            this.issues(msg);
        
        if( msg.channel.id === Config.discord.channels.pr )
            this.prs(msg);
    }

    issues = (msg) => {
        console.log(msg)
    }
    
    prs = (msg) => {
        console.log("hi pr", msg)
    }
}

module.exports = Bot;