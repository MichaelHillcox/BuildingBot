const Axios = require("axios");
const Config = require('../config');

class Github {
  constructor() {
    this.instance = Axios.create({
      baseURL: Config.api.github,
      headers: {
        auth: {
          username: 'michaelhillcox',
          password: Config.api.github.token
        }
      }
    });

    this.instance.interceptors.response.use(null, (error) => {
      // Do something with response error
      return Promise.reject({
        error,
        data: error.response.data || null
      });
    });
  }

  async getIssue(id) {
    return this.instance.get(`repos/${Config.github.owner}/${Config.github.repo}/issues/${id}`)
  }

  async getMilestone(id) {
    return this.instance.get(`repos/${Config.github.owner}/${Config.github.repo}/issues?milestone=${id}&state=all`)
  }

  logAndNull(e) {
    console.log(e.data);
    return null;
  }

  createLabelLink(label) {
    return encodeURI(`https://github.com/${Config.github.owner}/${Config.github.repo}/issues?q=is:issue+is:open+label:${label.includes(" ") ? '"' + label +'"' : label}`);
  }
}

module.exports = new Github();
