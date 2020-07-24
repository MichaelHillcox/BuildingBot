const curse = require("./curse");
const { MessageEmbed } = require("discord.js");
const prettyBytes = require('pretty-bytes');
const moment = require('moment');

module.exports = class Mods {
  constructor() {
    this.types = ['info', 'stats', 'files'];
    this.command = `!mod {${Object.keys(curse.mods).join('|')}} {${this.types.join('|')}}`;
    this.description = "Shows information from Curse regarding our mods"
  }

  parse(msg) {
    const content = msg.content.toLowerCase();
    if (!content.startsWith('!mod')) {
      return;
    }

    const parts = content.split(' ');
    parts.shift(); // remove command
    if (parts.length !== 2) {
      return;
    }

    if (!Object.keys(curse.mods).includes(parts[0])) {
      msg.channel.send(`This mod does not exist in our list... Our mods: ${Object.keys(curse.mods).join('|')}`);
      return;
    }

    if (!this.types.includes(parts[1])) {
      msg.channel.send(`This information is not a valid type. Valid types: ${this.types.join('|')}`);
      return;
    }

    this.curseMessage(msg, parts[0], parts[1]);
  }

  async curseMessage(msg, mod, type) {
    const selectedMod = curse.mods[mod];
    
    const modInfo = await curse.getModInfo(selectedMod);
    if (modInfo == null) {
      msg.channel.send("Something went wrong, contact <@196688486357663744>")
      return;
    }

    if (type === 'stats') {
      msg.channel.send(`${selectedMod.name} currently has **${modInfo.downloadCount.toLocaleString()}** and counting!`)
      return;
    }

    const firstValid = (e) => e.find(a => a.gameVersion.includes('1.'))
    if (type === 'files') {
      console.dir(modInfo, { depth: null });

      const versionedFiles = {};
      modInfo.latestFiles.forEach(e => {
        const valid = firstValid(e.sortableGameVersion);
        return versionedFiles[valid.gameVersionPadded] = {...e, version: valid.gameVersion};
      })

      const sortedAccessors = Object.keys(versionedFiles).sort().reverse();

      const embed = new MessageEmbed()
        .setTitle(`${selectedMod.name} Downloads`)
        .setURL(curse.getProjectUrl(selectedMod) + '/files')
        .setDescription(`${selectedMod.name} is out for \`${sortedAccessors.map(e => versionedFiles[e].version).join('\`, \`')}\`! Below are the latest downloads:`)

      sortedAccessors.forEach(e => {
        const file = versionedFiles[e];
        const shortVersionParts = file.version.split('.'); shortVersionParts.pop(); // Remove last number
        const shortVersion = shortVersionParts.join('.')

        embed.addField(file.version, `
          [${file.displayName}](${file.downloadUrl}) 
          (${prettyBytes(file.fileLength)}) (Released ${moment(file.fileDate).fromNow()}) ([Changelog](https://github.com/Direwolf20-MC/BuildingGadgets/wiki/Changelog-${shortVersion}))
        `, false);
      });

      msg.channel.send(embed)
    }
  }
}