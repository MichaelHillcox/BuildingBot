export type ModInfoData = {
  github: string;
  wiki: string;
  changelog: string;
};

export type ModInfo = {
  [key: string]: ModInfoData;
};

export default {
  bg: {
    github: 'https://github.com/Direwolf20-MC/BuildingGadgets',
    wiki: 'https://github.com/Direwolf20-MC/BuildingGadgets/wiki',
    changelog:
      'https://github.com/Direwolf20-MC/BuildingGadgets/wiki/Changelogs',
  },
  mg: {
    github: 'https://github.com/Direwolf20-MC/MiningGadgets',
    wiki:
      'https://github.com/Direwolf20-MC/MiningGadgets/blob/master/README.md',
    changelog:
      'https://github.com/Direwolf20-MC/MiningGadgets/blob/master/CHANGELOG.md',
  },
} as ModInfo;
