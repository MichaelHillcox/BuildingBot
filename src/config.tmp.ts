type Config = {
  discord: {
    token: string;
    channels: { [e: string]: string };
  };
  api: {
    github: string;
    discord: string;
  };
  github: {
    owner: string;
    repo: string;
  };
};

export default {
  discord: {
    token: '',
    channels: {
      issues: '',
      pr: '',
    },
  },
  api: {
    github: 'https://api.github.com/',
    discord: 'https://discord.com/api/',
  },
  github: {
    owner: 'Direwolf20-MC',
    repo: 'BuildingGadgets',
  },
} as Config;
