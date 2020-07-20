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
  }

  async getIssue(id) {
    return this.instance.get(`repos/${Config.github.owner}/${Config.github.repo}/issues/${id}`)
  }

  async getMilestone(id) {
    return this.instance.get(`repos/${Config.github.owner}/${Config.github.repo}/issues/${id}`)
  }

  createLabelLink(label) {
    return encodeURI(`https://github.com/${Config.github.owner}/${Config.github.repo}/issues?q=is:issue+is:open+label:${label.includes(" ") ? '"' + label +'"' : label}`);
  }
}

module.exports = new Github();
