const bot = require("../bot");

module.exports = class Rules {
  constructor() {
    this.requiresAdmin = true;
    this.command = "!echo <anything>";
    this.description = "Posts anything you type after echo as the bot"
  }

  parse(msg) {
    const content = msg.content;
    if (!content.startsWith('!echo') || !msg.member.hasPermission('ADMINISTRATOR')) {
      return;
    }

    const message = content.split(' ');
    message.shift(); // remove the first item;
    const messageText = message.join(' ');

    msg.channel.send(messageText);
  }
}