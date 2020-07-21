const curse = require("./curse");

module.exports = class Mods {
  constructor() {
    this.types = ['info', 'downloads', 'files'];
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
    console.log(selectedMod);

    console.log((await curse.getModInfo(selectedMod)).data)
  }
}