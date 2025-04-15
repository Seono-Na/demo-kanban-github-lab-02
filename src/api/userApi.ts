import { githubRepo } from '@/lib/githubRepoInfo';
import { octokit } from '@/lib/octokit';

export const getUsers = async () => {
  const res = await octokit.rest.repos.listCollaborators({
    ...githubRepo,
  });
  return res.data;
};
