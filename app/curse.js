const { default: Axios } = require("axios");
const NodeCache = require("node-cache");

class Curse {
  constructor() {
    this.cache = new NodeCache({
      stdTTL: 60 * 60 * 12, 
    });

    this.instance = Axios.create({
      baseURL: 'https://addons-ecs.forgesvc.net/api/v2/'
    })

    this.instance.interceptors.response.use(null, (error) => {
      return Promise.reject({
        error,
        data: error.response.data || null
      });
    });

    this.mods = {
      bg: {id: 298187, short: 'bg', name: 'Building Gadgets', slug: 'building-gadgets'},
      mg: {id: 351748, short: 'mg', name: 'Mining Gadgets', slug: 'mining-gadgets'}
    }
  }

  async getModInfo(mod) {
    const key = `curse-${mod.short}`;
    if (!this.cache.has(key)) {
      try {
        const res = await this.instance.get(`addon/${mod.id}`); // keep for an hour
        if (res.data === null) {
          return null;
        }

        this.cache.set(key, res.data)
        return res.data;
      } catch {
        return null;
      }
    }

    return this.cache.get(key);
  }
  
  async getModFiles(mod) {
    const key = `curse-${mod.short}-files`;
    if (!this.cache.has(key)) {
      try {
        const res = await this.instance.get(`addon/${mod.id}/files`);
        if (res.data === null) {
          return null;
        }

        this.cache.set(key, res.data)
        return res.data;
      } catch {
        return null;
      }
    }

    return this.cache.get(key);
  }

  getProjectUrl(mod) {
    return `https://www.curseforge.com/minecraft/mc-mods/${mod.slug}`
  }  
}

module.exports = new Curse();