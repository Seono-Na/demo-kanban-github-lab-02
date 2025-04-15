import { getLabels } from '@api/labelApi';
import { getUsers } from '@api/userApi';
import { GitHubLabel, GitHubUser } from '@type/githubOctokitTypes';

export async function fetchMeta(): Promise<{
  labels: GitHubLabel[];
  users: GitHubUser[];
}> {
  const [labelRes, userRes] = await Promise.all([getLabels(), getUsers()]);
  return {
    labels: labelRes,
    users: userRes,
  };
}
