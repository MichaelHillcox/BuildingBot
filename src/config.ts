import toml from 'toml';
import * as fs from 'fs';
import path from 'path';

type ConfigType = {
  discord: {
    token: string;
    canManageIssuesRole: string;
  };
  github: {
    owner: string;
    repo: string;
    token: string;
  };
};

class Config {
  private readonly configData: ConfigType;

  constructor() {
    try {
      const tomlFile: string = fs.readFileSync(
        path.join(__dirname, '..', 'config.toml'),
        'utf-8'
      );

      this.configData = toml.parse(tomlFile);
    } catch (e) {
      console.error(
        `Parsing error on line ${e.line}, column ${e.column}: ${e.message}`
      );

      throw new Error('TOML config file failed to read');
    }
  }

  get config() {
    return this.configData;
  }
}

export default new Config();
