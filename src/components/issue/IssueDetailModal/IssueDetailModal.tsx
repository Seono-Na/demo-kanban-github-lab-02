import { getIssueDetail, updateIssue } from '@api/issueApi';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@shared/shadcn/ui/dialog';
import { Skeleton } from '@shared/shadcn/ui/skeleton';
import { formatRelativeTime } from '@shared/utils/date';
import { GitHubIssueDetail, GitHubLabel } from '@type/githubOctokitTypes';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/shared/shadcn/ui/button';

import { IssueAssignees } from './IssueAssignees';
import { IssueLabels } from './IssueLabels';
import { IssueMilestone } from './IssueMilestone';

type Props = {
  issueNumber: number;
  onClose: () => void;
};

export function IssueDetailModal({ issueNumber, onClose }: Props) {
  const navigate = useNavigate();

  const [issue, setIssue] = useState<GitHubIssueDetail | null>(null);
  const [closing, setClosing] = useState(false); // 상태 추가

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        if (isNaN(issueNumber)) {
          throw new Error('올바르지 않은 이슈 번호입니다.');
        }

        const data = await getIssueDetail(issueNumber);
        setIssue(data);
      } catch (error) {
        console.error('이슈 상세 정보를 가져오는 데 실패했습니다.', error);
        setError('이슈를 불러올 수 없습니다.');

        setTimeout(() => {
          onClose();
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [issueNumber, onClose]);

  const handleCloseIssue = async () => {
    if (!issue) return;
    try {
      setClosing(true);
      await updateIssue({
        issueNumber: issue.number,
        state: 'closed',
      });
      setTimeout(() => {
        onClose(); // 성공 시 모달 닫기
      }, 2400);
    } catch (err) {
      console.error('이슈를 닫는 데 실패했습니다.', err);
      alert('이슈를 닫는 데 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setClosing(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          {loading || !issue ? (
            <>
              <DialogTitle>
                <VisuallyHidden>이슈 상세 정보 로딩 중</VisuallyHidden>
              </DialogTitle>
              <DialogDescription>
                <VisuallyHidden>
                  로딩 중입니다. 잠시만 기다려 주세요.
                </VisuallyHidden>
              </DialogDescription>
            </>
          ) : (
            <>
              <DialogTitle className="text-xl">{issue.title}</DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm">
                #{issue.number} • 작성자: {issue.user?.login} •{' '}
                {formatRelativeTime(issue.created_at)}
              </DialogDescription>
            </>
          )}
        </DialogHeader>

        {loading && <Skeleton className="h-48 rounded-xl" />}

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

        {!loading && !error && issue && (
          <>
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/issues/${issueNumber}/edit`)}
              >
                ✏️ 수정
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleCloseIssue}
                disabled={closing}
              >
                🛑 닫기
              </Button>
            </div>
            <div className="my-4 text-sm whitespace-pre-wrap">
              {issue.body ? (
                issue.body
              ) : (
                <p className="text-gray-400">내용이 없습니다.</p>
              )}
            </div>

            <div className="mt-4 space-y-4">
              <section>
                <h4 className="mb-1 text-sm font-semibold">라벨</h4>
                <IssueLabels
                  labels={issue.labels.filter(
                    (label): label is GitHubLabel =>
                      typeof label !== 'string' &&
                      label.id !== undefined &&
                      label.name !== undefined &&
                      label.color !== undefined
                  )}
                />{' '}
              </section>

              <section>
                <h4 className="mb-1 text-sm font-semibold">담당자</h4>
                <IssueAssignees assignees={issue.assignees} />
              </section>

              <section>
                <h4 className="mb-1 text-sm font-semibold">마일스톤</h4>
                <IssueMilestone milestone={issue.milestone} />
              </section>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
