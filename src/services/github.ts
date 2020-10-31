import Axios from 'axios';
import Config from '../config';

class Github {
  constructor() {
    this.instance = Axios.create({
      baseURL: Config.api.github,
      headers: {
        auth: {
          username: 'michaelhillcox',
          password: Config.api.github.token,
        },
        accept: 'application/vnd.github.v3+json',
      },
    });

    this.instance.interceptors.response.use(null, (error) => {
      // Do something with response error
      return Promise.reject({
        error,
        data: error.response.data || null,
      });
    });
  }

  async getIssue(id) {
    return this.instance.get(
      `repos/${Config.github.owner}/${Config.github.repo}/issues/${id}`
    );
  }

  async getMilestone(id) {
    return this.instance.get(
      `repos/${Config.github.owner}/${Config.github.repo}/issues?milestone=${id}&state=all`
    );
  }

  async getCommit(sha) {
    return this.instance.get(
      `repos/${Config.github.owner}/${Config.github.repo}/commits/${sha}`
    );
  }

  logAndNull(e) {
    console.log(e.data);
    return null;
  }

  createLabelLink(label) {
    return encodeURI(
      `https://github.com/${Config.github.owner}/${
        Config.github.repo
      }/issues?q=is:issue+is:open+label:${
        label.includes(' ') ? '"' + label + '"' : label
      }`
    );
  }
}

export default new Github();
