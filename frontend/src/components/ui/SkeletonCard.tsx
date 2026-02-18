import { memo, type HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface SkeletonCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'stat' | 'list';
}

function SkeletonCard({
  className,
  variant = 'list',
  ...props
}: SkeletonCardProps) {
  if (variant === 'stat') {
    return (
      <div
        className={cn(
          'bg-white dark:bg-stone-900 rounded-xl border border-stone-200/80 dark:border-stone-800 p-5 shadow-sm shadow-stone-900/3',
          className,
        )}
        {...props}
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-stone-200 dark:bg-stone-700 animate-pulse" />
          <div className="space-y-2">
            <div className="h-3 w-16 rounded bg-stone-200 dark:bg-stone-700 animate-pulse" />
            <div className="h-5 w-10 rounded bg-stone-200 dark:bg-stone-700 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'bg-white dark:bg-stone-900 rounded-xl border border-stone-200/80 dark:border-stone-800 p-5 shadow-sm shadow-stone-900/3 flex items-center gap-3',
        className,
      )}
      {...props}
    >
      <div className="h-9 w-9 rounded-lg bg-stone-200 dark:bg-stone-700 animate-pulse shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <div className="h-3.5 w-full max-w-[75%] rounded bg-stone-200 dark:bg-stone-700 animate-pulse" />
        <div className="h-3 w-24 rounded bg-stone-100 dark:bg-stone-800 animate-pulse" />
      </div>
    </div>
  );
}

export default memo(SkeletonCard);
