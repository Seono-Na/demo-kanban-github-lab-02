import { CreateIssueInput } from '@type/githubOctokitTypes';

import { githubRepo } from '@/lib/githubRepoInfo';
import { octokit } from '@/lib/octokit';

export const getIssues = async () => {
  const res = await octokit.rest.issues.listForRepo({
    ...githubRepo,
  });
  return res.data;
};

export const getIssueDetail = async (issueNumber: number) => {
  const res = await octokit.rest.issues.get({
    ...githubRepo,
    issue_number: issueNumber,
  });
  return res.data;
};

export async function createIssue(input: CreateIssueInput) {
  return octokit.issues.create({
    ...githubRepo,
    ...input,
  });
}
