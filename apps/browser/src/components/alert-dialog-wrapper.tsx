import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';

type AlertDialogWrapperProps = {
  children: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  onAction: () => void;
  actionLabel?: string;
  cancelLabel?: string;
  variant?: string;
  actionDisabled?: boolean;
};

const variantRingClass: Record<string, string> = {
  success: 'ring-green-500',
  warning: 'ring-yellow-500',
  destructive: 'ring-red-500',
};

const variantBgClass: Record<string, string> = {
  success: 'bg-green-600 hover:bg-green-700',
  warning: 'bg-yellow-600 hover:bg-yellow-700',
  destructive: 'bg-red-600 hover:bg-red-700',
};

export function AlertDialogWrapper({
  children,
  title,
  description,
  onAction,
  actionLabel = 'متابعة',
  cancelLabel = 'إلغاء',
  variant,
  actionDisabled,
}: AlertDialogWrapperProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent
        className={
          variant ? `ring-2 ${variantRingClass[variant] ?? ''}` : undefined
        }
      >
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            className={variant ? variantBgClass[variant] : undefined}
            onClick={onAction}
            disabled={actionDisabled}
          >
            {actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
