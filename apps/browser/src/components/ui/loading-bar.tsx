import { cn } from '@/utils/cn';

function LoadingBar({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'h-3 w-full animate-pulse rounded-md bg-primary/10',
        className,
      )}
      {...props}
    />
  );
}

export { LoadingBar };
