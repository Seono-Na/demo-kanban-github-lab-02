import { githubRepo } from '@/lib/githubRepoInfo';
import { octokit } from '@/lib/octokit';

export const getLabels = async () => {
  const res = await octokit.rest.issues.listLabelsForRepo({
    ...githubRepo,
  });
  return res.data;
};
