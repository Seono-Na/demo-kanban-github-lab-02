import { octokit } from '@/lib/octokit';

export const fetchRateLimit = async () => {
  const res = await octokit.rest.rateLimit.get();
  return res.data.rate; // limit, remaining, reset 정보 포함
};
