import { Octokit } from '@octokit/rest';

export const octokit = new Octokit({
  auth: import.meta.env.VITE_GITHUB_PAT,
});
