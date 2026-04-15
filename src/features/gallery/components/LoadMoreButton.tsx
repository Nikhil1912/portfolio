import { Button } from '@/components';

interface LoadMoreButtonProps {
  hasMore: boolean;
  onLoadMore: () => void;
}

export function LoadMoreButton({
  hasMore,
  onLoadMore,
}: LoadMoreButtonProps): React.ReactElement {
  if (!hasMore) {
    return (
      <p className="text-label-sm text-on-surface-variant" aria-live="polite">
        That&apos;s everything — for now.
      </p>
    );
  }

  return (
    <Button variant="secondary" onClick={onLoadMore}>
      Load More
    </Button>
  );
}
