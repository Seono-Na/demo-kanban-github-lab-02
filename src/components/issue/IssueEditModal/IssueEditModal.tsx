import { updateIssue } from '@api/issueApi';
import { Button } from '@shared/shadcn/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@shared/shadcn/ui/dialog';
import { Input } from '@shared/shadcn/ui/input';
import { Textarea } from '@shared/shadcn/ui/textarea';
import {
  GitHubLabel,
  GitHubUser,
  UpdateIssueInput,
} from '@type/githubOctokitTypes';
import { useEffect, useState } from 'react';

import { getIssueDetail } from '@/api/issueApi';
import { MultiSelect } from '@/shared/MultiSelect';
import { fetchMeta } from '@/utils/fetchMeta';

type Props = {
  issueNumber: number;
  open: boolean;
  onClose: () => void;
  onUpdated?: () => void;
};

export function IssueEditModal({
  issueNumber,
  open,
  onClose,
  onUpdated,
}: Props) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [labels, setLabels] = useState<GitHubLabel[]>([]);
  const [users, setUsers] = useState<GitHubUser[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    Promise.all([getIssueDetail(issueNumber), fetchMeta()])
      .then(([issue, meta]) => {
        setTitle(issue.title);
        setBody(issue.body || '');

        setSelectedLabels(
          issue.labels
            .map((label) => (typeof label === 'string' ? label : label.name))
            .filter((name): name is string => !!name)
        );

        setSelectedAssignees((issue.assignees ?? []).map((user) => user.login));

        setLabels(meta.labels);
        setUsers(meta.users);
      })
      .catch((err) => {
        console.error('이슈 정보 또는 메타데이터 로딩 실패', err);
        alert('이슈 정보를 불러오는 데 실패했습니다.');
        onClose();
      });
  }, [open, issueNumber, onClose]);

  const handleSubmit = async () => {
    if (!title.trim()) return alert('제목을 입력해주세요.');
    setLoading(true);
    try {
      const params: UpdateIssueInput = {
        issueNumber,
        title,
        body,
        labels: selectedLabels,
        assignees: selectedAssignees,
      };
      await updateIssue(params);
      onUpdated?.();
      setTimeout(() => {
        onClose();
      }, 2400);
    } catch (err) {
      console.error('이슈 수정 실패', err);
      alert('이슈 수정 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>이슈 수정</DialogTitle>
          <DialogDescription>
            제목, 설명, 라벨, 담당자를 수정할 수 있어요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="설명"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />

          <div>
            <h4 className="mb-2 text-sm font-semibold">라벨 선택</h4>
            <MultiSelect
              items={labels}
              selectedItems={selectedLabels}
              onChange={setSelectedLabels}
              getKey={(label) => label.name}
              renderLabel={(label) => (
                <span
                  className="rounded px-2 py-0.5"
                  style={{ backgroundColor: `#${label.color}` }}
                >
                  {label.name}
                </span>
              )}
            />
          </div>

          <div>
            <h4 className="mb-2 text-sm font-semibold">담당자 선택</h4>
            <MultiSelect
              items={users}
              selectedItems={selectedAssignees}
              onChange={setSelectedAssignees}
              getKey={(user) => user.login}
              renderLabel={(user) => (
                <>
                  <img
                    src={user.avatar_url}
                    alt={user.login}
                    className="mr-2 inline-block h-5 w-5 rounded-full"
                  />
                  {user.login}
                </>
              )}
            />
          </div>

          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? '수정 중...' : '이슈 저장'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
