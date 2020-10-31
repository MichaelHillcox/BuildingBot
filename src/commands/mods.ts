import { Message } from 'discord.js';
import { Curse } from '../services/curse';
import Command from './Command';

export default class Mods implements Command {
  private static types: string[] = ['info', 'stats', 'files', 'links'];

  command = `!mod {${Object.keys(Curse.mods).join('|')}} {${Mods.types.join(
    '|'
  )}}`;
  description = 'Shows information from Curse regarding our mods';

  async parse(message: Message, content: string): Promise<void> {
    if (!content.toLowerCase().startsWith('!mod')) {
      return;
    }

    const parts = content.split(' ');
    parts.shift(); // remove command
    if (parts.length !== 2) {
      return;
    }

    if (!Object.keys(Curse.mods).includes(parts[0])) {
      message.channel.send(
        `This mod does not exist in our list... Our mods: ${Object.keys(
          Curse.mods
        ).join('|')}`
      );
      return;
    }

    if (!Mods.types.includes(parts[1])) {
      message.channel.send(
        `This information is not a valid type. Valid types: ${Mods.types.join(
          '|'
        )}`
      );
      return;
    }

    await this.curseMessage(message, parts[0], parts[1]);
  }

  // eslint-disable-next-line no-unused-vars
  async curseMessage(msg: Message, mod: string, type: string) {
    // const selectedMod = Curse.mods[mod];
    //
    // const firstValid = (e) => e.find((a) => a.gameVersion.includes('1.'));
    //
    // const modInfo: Addon | null = await curse.getModInfo(selectedMod);
    // if (modInfo == null) {
    //   msg.channel.send('Something went wrong, contact <@196688486357663744>');
    //   return;
    // }
    //
    // if (type === 'stats') {
    //   msg.channel.send(
    //     `${
    //       selectedMod.name
    //     } currently has **${modInfo.downloadCount.toLocaleString()}** and counting!`
    //   );
    //   return;
    // }
    //
    // if (type === 'files') {
    //   const versionedFiles = {};
    //   modInfo.latestFiles.forEach((e: File) => {
    //     const valid = firstValid(e.sortableGameVersion);
    //     versionedFiles[valid.gameVersionPadded] = {
    //       ...e,
    //       version: valid.gameVersion,
    //     };
    //   });
    //
    //   const sortedAccessors = Object.keys(versionedFiles).sort().reverse();
    //
    //   const embed = new MessageEmbed()
    //     .setTitle(`${selectedMod.name} Downloads`)
    //     .setURL(curse.getProjectUrl(selectedMod) + '/files')
    //     .setDescription(
    //       `${selectedMod.name} is out for \`${sortedAccessors
    //         .map((e) => versionedFiles[e].version)
    //         .join('`, `')}\`! Below are the latest downloads:`
    //     );
    //
    //   sortedAccessors.forEach((e) => {
    //     const file = versionedFiles[e];
    //     const shortVersionParts = file.version.split('.');
    //     shortVersionParts.pop(); // Remove last number
    //     const shortVersion = shortVersionParts.join('.');
    //
    //     embed.addField(
    //       file.version,
    //       `
    //       [${file.displayName}](${file.downloadUrl})
    //       (${prettyBytes(file.fileLength)}) (Released ${moment(
    //         file.fileDate
    //       ).fromNow()}) ([Changelog](https://github.com/Direwolf20-MC/BuildingGadgets/wiki/Changelog-${shortVersion}))
    //     `,
    //       false
    //     );
    //   });
    //
    //   msg.channel.send(embed);
    //   return;
    // }
    //
    // if (type === 'info') {
    //   const files = await curse.getModFiles(selectedMod);
    //
    //   const totalFiles = files.reduce((total, e) => total + 1, 0);
    //
    //   const versions = [];
    //   files.forEach((e) => {
    //     const valid = e.gameVersion.find((a) => a.includes('1.'));
    //     if (!versions.includes(valid)) {
    //       versions.push(valid);
    //     }
    //   });
    //
    //   versions.sort();
    //
    //   msg.channel.send(
    //     new MessageEmbed()
    //       .setTitle(`${selectedMod.name}'s Info`)
    //       .setURL(modInfo.websiteUrl)
    //       .setDescription(
    //         `
    //         ${modInfo.summary}. ${
    //           selectedMod.name
    //         } has **${modInfo.downloadCount.toLocaleString()}** downloads over **${totalFiles}** releases and has been released for Minecraft **${versions.join(
    //           '**, **'
    //         )}**\n
    //         Created by [Direwolf20](https://www.curseforge.com/members/22300-direwolf20?username=direwolf20) and maintained by ${modInfo.authors
    //           .filter((e) => e.userId !== 22300)
    //           .map((e) => `[${e.name}](${e.url})`)
    //           .join(', ')}
    //       `
    //       )
    //       .addField('Links', this.getLinks(selectedMod, modInfo))
    //   );
    // }
    //
    // if (type === 'links') {
    //   msg.channel.send(
    //     new MessageEmbed()
    //       .setTitle(`${selectedMod.name}'s Links`)
    //       .setDescription(this.getLinks(selectedMod, modInfo))
    //   );
    // }
  }

  // getLinks(selectedMod, modInfo) {
  //   const github = modinfo[selectedMod.short].github;
  //   return (
  //     `[Repo](${github}), [Issues](${github}/issues), ` +
  //     `[Pull Requests](${github}/pulls), [Milestones](${github}/milestones), ` +
  //     `[Github Releases](${github}/releases), [Curse Forge](${modInfo.websiteUrl}), [Curse Forge all files](${modInfo.websiteUrl}/files/all), ` +
  //     `[Wiki](${modinfo[selectedMod.short].wiki}), [Changelog(s)](${
  //       modinfo[selectedMod.short].changelog
  //     })`
  //   );
  // }
}
