import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type ToolTipWrapperProps = {
  children: React.ReactElement;
  label: string | React.ReactElement;
  className?: string;
  delayDuration?: number;
};

const TooltipWrapper = ({
  children,
  label,
  className,
  delayDuration,
}: ToolTipWrapperProps) => {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className={className}>
          {typeof label === 'string' ? (
            <p className="max-w-64 rounded-md bg-primary-foreground p-1 text-sm opacity-70">
              {label}
            </p>
          ) : (
            label
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export { TooltipWrapper };
