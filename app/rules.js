const { MessageEmbed } = require("discord.js");

module.exports = class Rules {
  constructor() {
    this.requiresAdmin = true;
    this.command = "!rules";
    this.description = "Posts rules"
  }

  async parse(msg) {
    const content = msg.content;
    if (!content.startsWith('!rules') || !msg.member.hasPermission('ADMINISTRATOR')) {
      return;
    }

    const rules = new MessageEmbed()
      .setTitle('Rules')
      .setDescription(`
        \`1.\` Do not ping Direwolf! I can not stress this enough. There is a reason we have the <@&736945772028755998> role! 
        \`1.1.\` Do not ping people unless you know they do not mind being pinged. You can always ping <@196688486357663744> :grin:.
        \`2.\` Be respectful, be kind / friendly, do not be offensive, be as [PG-13](https://en.wikipedia.org/wiki/Motion_Picture_Association_film_rating_system#Ratings) as possible inside public channels.
        \`3.\` Do not spam! Anyone found spamming will be Banned without warning.
        \`4.\` Stay on topic if you can. We're here for Building Gadgets so lets not spam up the public channels with DM worthy chat.
        \`5.\` Use the appropriate channels when possible. 
        \`6.\` Don't use the bot commands outside of <#736949641781706825>
        
        - **All rules will be enforced at the sole discretion of the Developers.**
      `);

    const info = new MessageEmbed()
      .setTitle('Info')
      .setDescription(`
      **Roles**
      Roles are given as the Developers see fit with the exception of the <@&546433718827352133> role as this is applied to anyone who has had a Pull Request pulled in.
      
      - Please note: Anyone with this role does not have special power or privileges over the Discord server or the Mod. It's just a thank you role. It does indicate some people that might know some bits and bobs about the mod though!

      **Bot**
      The bot can be used in the <#736949641781706825>. It's got some helpful commands for seeing specific information about the mod and some great integration with our Github Repo. It's not perfect so if it breaks please let <@196688486357663744> know.

      **Suggestions / Feedback**
      We're always looking for feedback and suggestions! Some really good features of the mod have come from community feedback :grin:. We do ask you keep it to the <#732684440433590417> channel as it allows us to track them.

      **Issues**
      Although we're here to help, if you do find an issue, the best place to report it is on our [Github Repo](https://github.com/Direwolf20-MC/BuildingGadgets/issues). We'd love to fix them all as they come in but we forget things super quickly so write them down for us haha.

      **Pull Requests**
      We are super strict with Pull Requests these days. Please do make one and discuss it on Github or Here but note that we're not being rude, we're just very specific about what we let into the project. We appreciate everyone that supports the project even if the PR gets rejected. We'd always recommend making any needed fixes and opening a new PR.
      `);

    msg.channel.send(info)
    msg.channel.send(rules)
  }
}