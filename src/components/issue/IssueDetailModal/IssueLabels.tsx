import { GitHubLabel } from '@type/githubOctokitTypes';

type Props = {
  labels: (GitHubLabel | string)[];
};

export function IssueLabels({ labels }: Props) {
  const filteredLabels = labels.filter(
    (label): label is GitHubLabel => typeof label !== 'string'
  );

  return filteredLabels.length > 0 ? (
    <div className="flex flex-wrap gap-2">
      {filteredLabels.map((label) => (
        <span
          key={label.id}
          className="rounded-full px-2 py-1 text-xs"
          style={{
            backgroundColor: `#${label.color}`,
            color: 'white',
          }}
        >
          {label.name}
        </span>
      ))}
    </div>
  ) : (
    <p className="text-muted-foreground text-sm">라벨 없음</p>
  );
}
