import { ApiError } from '@/lib/api-client';

export function EmptyMessage({ error }: { error: unknown }) {
  const message =
    error instanceof ApiError ? error.message : 'Something went wrong.';
  return <p className="font-body text-sm text-muted-foreground">{message}</p>;
}
