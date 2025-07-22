//eslint-disable-next-line @typescript-eslint/ban-ts-comment
/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-ignore
// @ts-nocheck

import * as React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import {
  DayPicker,
  getDefaultClassNames,
  DateRange,
  isDateInRange,
} from 'react-day-picker';

import { cn } from '@/utils/cn';
import { buttonVariants } from '@/components/ui/button-variants';
import { Button } from './button';
import { enIE, arSA, tr } from 'date-fns/locale';
import { addDays, getMonth } from 'date-fns';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const today = new Date();
  const currentMonth = getMonth(today);
  //@ts-ignore: it is used inside tailwind
  const defaultClassNames = getDefaultClassNames();
  const [selected, setSelected] = React.useState<DateRange>({
    from: new Date(2024, 9, 20),
    to: addDays(new Date(2024, 9, 20), 20),
  });
  const [month, setMonth] = React.useState(today);
  return (
    <>
      <DayPicker
        showOutsideDays={showOutsideDays}
        mode="multiple"
        captionLayout="label"
        // month={today}
        // weekStartsOn={6}
        // locale={arSA}
        className={cn('p-3', className)}
        numberOfMonths={2}
        pagedNavigation
        selected={{
          from: new Date(2024, 9, 20),
          to: addDays(new Date(2024, 9, 20), 20),
        }}
        onDayClick={(date) => {
          console.log('date', date);
          console.log('selected', selected);
          // setSelected(date);
        }}
        // onMonthChange={setMonth}
        required
        excludeDisabled
        // footer={
        //   selected ? `Selected: ${selected.toLocaleDateString()}` : "Pick a day."
        // }
        classNames={{
          months:
            'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 relative',
          // month: " flex flex-col space-y-4",
          // month_caption: 'text-lg font-medium flex justify-center',
          // month_grid: " grid grid-cols-7 gap-1",
          // caption: "flex justify-center pt-1 relative items-center",
          // caption_label: "text-sm font-medium",
          button_next: cn(
            buttonVariants({ variant: 'ghost' }),
            'absolute right-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
          ),
          chevron: '${defaultClassNames.chevron} fill-primary',
          button_previous: cn(
            buttonVariants({ variant: 'ghost' }),
            'absolute left-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
          ),
          // week_number_header: "bg-red-200",
          weekday: 'w-7 h-8 px-1',
          day: 'h-8 w-8 p-0 font-normal text-center hover:rounded-lg hover:bg-accent hover:text-accent-foreground',
          day_button: 'w-full h-full p-0',
          // day_button: "w-8 h-8 p-0",

          // table: "w-full border-collapse space-y-1",
          // head_row: "flex",
          // head_cell:
          //   "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
          // row: "flex w-full mt-2",
          // cell: cn(
          //   "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
          //   props.mode === "range"
          //     ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
          //     : "[&:has([aria-selected])]:rounded-md",
          // ),
          // day: cn(
          //   buttonVariants({ variant: "ghost" }),
          //   "h-8 w-8 p-0 font-normal aria-selected:opacity-100",
          // ),

          range_start: 'font-color-red bg-blue-500',
          range_end: 'bg-red-500',
          range_middle: 'bg-green-500',
          // selected: "rounded-lg bg-accent",
          day_range_end: 'rounded-l-lg',
          // focused: "rounded-lg",
          // disabled: "text-muted-foreground opacity-50",
          outside: 'text-muted-foreground opacity-40',
          // day_selected:
          //   "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          today: 'text-cyan-400 font-bold', // "rounded-lg bg-accent outline outline-1 outline-cyan-500",

          // day_outside:
          //   "day-outside text-muted-foreground opacity-10  aria-selected:bg-accent/10 aria-selected:text-muted-foreground aria-selected:opacity-30",
          // day_disabled: "text-muted-foreground opacity-10",
          // day_range_middle:
          //   "aria-selected:bg-accent aria-selected:text-accent-foreground",
          // day_hidden: "invisible",

          ...classNames,
        }}
        components={{}}
        {...props}
      />
      <Button onClick={() => setMonth(today)}>Go to Today</Button>
    </>
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
