import * as React from 'react';

import { cn } from '@/utils/cn';
import { type HTMLMotionProps, motion } from 'framer-motion';

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  // <div className="w-full ">
  <table
    ref={ref}
    className={cn('w-full caption-bottom text-sm', className)}
    {...props}
  />
  // </div>
));
Table.displayName = 'Table';

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn('border-0', className)}
    {...props}
  />
));
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
));
TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      'border-t bg-muted/50 font-medium [&>tr]:last:border-b-0',
      className,
    )}
    {...props}
  />
));
TableFooter.displayName = 'TableFooter';

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      `border-b transition-colors hover:bg-muted/40
      data-[state=selected]:bg-primary/25
      data-[state=selected]:hover:bg-primary/45`,
      className,
    )}
    {...props}
  />
));
TableRow.displayName = 'TableRow';

const TableRowAnim = React.forwardRef<
  HTMLTableRowElement,
  HTMLMotionProps<'tr'>
>(({ className, ...props }, ref) => (
  <motion.tr
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.7 }}
    transition={{
      duration: 0.1,
      ease: 'easeInOut',
    }}
    layout
    ref={ref}
    className={cn(
      `border-b transition-colors hover:bg-muted/40
      data-[state=selected]:bg-primary/25
      data-[state=selected]:hover:bg-primary/45`,
      className,
    )}
    {...props}
  />
));
TableRowAnim.displayName = 'TableRowAnimation';

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    style={{
      border: '0px solid',
    }}
    className={cn(
      `h-10 px-2 text-left align-middle font-medium text-muted-foreground
      [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]`,
      className,
    )}
    {...props}
  />
));
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      `p-2 align-middle [&:has([role=checkbox])]:pr-0
      [&>[role=checkbox]]:translate-y-[2px]`,
      className,
    )}
    {...props}
  />
));
TableCell.displayName = 'TableCell';

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn('mt-4 text-sm text-muted-foreground', className)}
    {...props}
  />
));
TableCaption.displayName = 'TableCaption';

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableRowAnim,
  TableCell,
  TableCaption,
};
