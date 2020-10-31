import Axios, { AxiosInstance } from 'axios';
import NodeCache from 'node-cache';
import { Addon, File } from './CurseResponse';

export type Mod = {
  id: number;
  short: string;
  name: string;
  slug: string;
};

export class Curse {
  public static mods: { [key: string]: Mod } = {
    bg: {
      id: 298187,
      short: 'bg',
      name: 'Building Gadgets',
      slug: 'building-gadgets',
    },
    mg: {
      id: 351748,
      short: 'mg',
      name: 'Mining Gadgets',
      slug: 'mining-gadgets',
    },
  };

  private cache: NodeCache;
  private instance: AxiosInstance;

  constructor() {
    this.cache = new NodeCache({
      stdTTL: 60 * 60 * 12,
    });

    this.instance = Axios.create({
      baseURL: 'https://addons-ecs.forgesvc.net/api/v2/',
    });

    this.instance.interceptors.response.use(undefined, (error) =>
      Promise.reject(new Error(error.response.data || error))
    );
  }

  async getModInfo(mod: Mod): Promise<Addon | null> {
    const key = `curse-${mod.short}`;
    if (!this.cache.has(key)) {
      try {
        const res = await this.instance.get(`addon/${mod.id}`); // keep for an hour
        if (res.data === null) {
          return null;
        }

        this.cache.set(key, res.data);
        return res.data;
      } catch {
        return null;
      }
    }

    return this.cache.get(key) as Addon;
  }

  async getModFiles(mod: Mod): Promise<File[] | null> {
    const key = `curse-${mod.short}-files`;
    if (!this.cache.has(key)) {
      try {
        const res = await this.instance.get(`addon/${mod.id}/files`);
        if (res.data === null) {
          return null;
        }

        this.cache.set(key, res.data);
        return res.data;
      } catch {
        return null;
      }
    }

    return this.cache.get(key) as File[];
  }

  getProjectUrl(mod: Mod): string {
    return `https://www.curseforge.com/minecraft/mc-mods/${mod.slug}`;
  }
}

export default new Curse();
