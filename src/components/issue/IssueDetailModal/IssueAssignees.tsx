import { GitHubIssueDetail } from '@type/githubOctokitTypes';

type Props = {
  assignees: GitHubIssueDetail['assignees'];
};

export function IssueAssignees({ assignees }: Props) {
  if (!assignees || assignees.length === 0) {
    return <p className="text-muted-foreground text-sm">담당자 없음</p>;
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {assignees.map((user) => (
        <div key={user.id} className="flex items-center gap-2">
          <img
            src={user.avatar_url}
            alt={user.login}
            className="h-6 w-6 rounded-full"
          />
          <span className="text-sm">{user.login}</span>
        </div>
      ))}
    </div>
  );
}
