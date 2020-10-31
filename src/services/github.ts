import { request } from '@octokit/request';
import Config from '../config';

class Github {
  private request = request.defaults({
    headers: {
      accept: 'application/vnd.github.v3+json',
    },
  });

  async getIssue(id: number) {
    return this.request('GET /repos/:owner/:repo/issues/:issue_number', {
      owner: Config.config.github.owner,
      repo: Config.config.github.repo,
      issue_number: id,
    });
  }

  async getMilestone(id: string) {
    return this.request('GET /repos/:owner/:repo/issues', {
      owner: Config.config.github.owner,
      repo: Config.config.github.repo,
      milestone: id,
      state: 'all',
    });
  }

  async getCommit(sha: string) {
    return this.request('GET /repos/:owner/:repo/commits/:ref', {
      owner: Config.config.github.owner,
      repo: Config.config.github.repo,
      ref: sha,
    });
  }

  logAndNull(e: any) {
    console.log(e.errors || e);
    return null;
  }

  createLabelLink(label: string) {
    return encodeURI(
      `https://github.com/${Config.config.github.owner}/${
        Config.config.github.repo
      }/issues?q=is:issue+is:open+label:${
        label.includes(' ') ? `"${label}"` : label
      }`
    );
  }
}

export default new Github();
