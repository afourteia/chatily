import type { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

export const DataPoint = ({
  children,
  title,
  Icon,
  className,
}: {
  title: string;
  Icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn('flex flex-auto items-center', className)}>
      {Icon && <Icon className="me-1 h-5 w-5 text-muted-foreground" />}
      <div>
        <p className="select-none text-sm font-medium text-muted-foreground">
          {title}
        </p>
        {children}
      </div>
    </div>
  );
};
DataPoint.displayName = 'DataPoint';
