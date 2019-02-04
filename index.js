const Config = require('./config')
const Bot = require('./bot')
const Discord = require('discord.js');
const axios = require('axios');

console.log("Server started")

const client = new Discord.Client();
const bot = new Bot();



scanForReference = (msg) => {
    matches = []

    reg = /#[0-9]+/gm
    while ((m = reg.exec(msg)) !== null) {
        if (m.index === reg.lastIndex) {
            reg.lastIndex++;
        }
        
        m.forEach((match, groupIndex) => matches.push(match));
    }

    return matches
}

client.login(Config.discord.token);