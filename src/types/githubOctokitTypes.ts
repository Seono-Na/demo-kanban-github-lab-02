import { RestEndpointMethodTypes } from '@octokit/rest';

//
// 📦 GitHub API Response 타입들
//

export type GitHubIssue =
  RestEndpointMethodTypes['issues']['listForRepo']['response']['data'][number];

export type GitHubIssueDetail =
  RestEndpointMethodTypes['issues']['get']['response']['data'];

export type GitHubLabel =
  RestEndpointMethodTypes['issues']['listLabelsForRepo']['response']['data'][number];

export type GitHubUser =
  RestEndpointMethodTypes['repos']['listCollaborators']['response']['data'][number];

export type GitHubMilestone =
  RestEndpointMethodTypes['issues']['get']['response']['data']['milestone'];

export type GitHubComment =
  RestEndpointMethodTypes['issues']['listComments']['response']['data'][number];

export type GitHubRateLimit =
  RestEndpointMethodTypes['rateLimit']['get']['response']['data'];

//
// 🛠️ GitHub API Parameters 타입들
//

export type CreateIssueParams =
  RestEndpointMethodTypes['issues']['create']['parameters'];

export type CreateIssueRequest =
  RestEndpointMethodTypes['issues']['create']['parameters'];

export type UpdateIssueParams =
  RestEndpointMethodTypes['issues']['update']['parameters'];

//
// ✍️ 사용자 정의 입력 타입
//

export type CreateIssueInput = {
  title: string;
  body?: string;
  labels?: string[];
  assignees?: string[];
};

export type UpdateIssueInput = {
  issueNumber: number;
  title?: string;
  body?: string;
  labels?: string[];
  assignees?: string[];
  state?: 'open' | 'closed';
};
