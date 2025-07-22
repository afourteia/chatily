import { cn } from '@/utils/cn';
import {
  parseDate,
  CalendarDate,
  getLocalTimeZone,
  today,
} from '@internationalized/date';

import { useEffect, useRef, useState } from 'react';
import {
  DateInput,
  DateRangePicker,
  DateSegment,
  Group,
  Label,
} from 'react-aria-components';

interface AriaDateRangeFieldProps {
  dateRangeLimit?: {
    min?: string;
    max?: string;
  };
  value: {
    startDate: Date;
    endDate: Date;
  };
  onChange: (newDate: { startDate: Date; endDate: Date }) => void;
}

type TypeDateRangePickerValue = {
  start: CalendarDate;
  end: CalendarDate;
};
export default function AriaDateRangeField({
  dateRangeLimit,
  value,
  onChange,
}: AriaDateRangeFieldProps) {
  const now = today(getLocalTimeZone());
  const targetTimezone = 'UTC'; //getLocalTimeZone();
  const minDate = (() => {
    if (!dateRangeLimit) {
      return null;
    }
    if (dateRangeLimit.min === undefined) {
      return null;
    }
    return parseDate(dateRangeLimit.min);
  })();

  const maxDate = (() => {
    if (!dateRangeLimit) {
      return null;
    }
    if (dateRangeLimit.max === undefined) {
      return null;
    }
    return parseDate(dateRangeLimit.max);
  })();

  // console.log('maxDate', maxDate);
  // console.log('minDate', minDate);

  // const [dateRange, setDateRange] = useState({
  //   start: value.startDate
  //     ? parseDate(value.startDate.toISOString()?.split('T')[0])
  //     : (minDate ?? maxDate ?? now),
  //   end: value.endDate
  //     ? parseDate(value.endDate.toISOString()?.split('T')[0])
  //     : (maxDate ?? minDate ?? now),
  // });

  const dateRange = useRef({
    start: value.startDate
      ? parseDate(value.startDate.toISOString()?.split('T')[0] ?? '')
      : (minDate ?? maxDate ?? now),
    end: value.endDate
      ? parseDate(value.endDate.toISOString()?.split('T')[0] ?? '')
      : (maxDate ?? minDate ?? now),
  });

  // useEffect(() => {
  //   onChange({
  //     startDate: dateRange.start.toDate(targetTimezone),
  //     endDate: dateRange.end.toDate(targetTimezone),
  //   });
  // }, []); // initial render only
  //TypeDateRangePickerValue
  const handleChange = (newDate: any) => {
    if (newDate === null) {
      // setValue(newDate);
      return;
    }
    if (minDate && newDate.start.compare(minDate) < 0) {
      newDate.start = minDate;
    }
    if (minDate && newDate.end.compare(minDate) < 0) {
      newDate.end = minDate;
    }
    if (newDate.end.compare(dateRange.current.start) < 0) {
      newDate.start = newDate.end;
    }
    if (newDate.start.compare(dateRange.current.end) > 0) {
      newDate.end = newDate.start;
    }
    if (maxDate && maxDate.compare(newDate.start) < 0) {
      newDate.start = maxDate;
    }
    if (maxDate && maxDate.compare(newDate.end) < 0) {
      newDate.end = maxDate;
    }

    onChange({
      startDate: newDate.start.toDate(targetTimezone),
      endDate: newDate.end.toDate(targetTimezone),
    });
    dateRange.current = newDate;
    // setDateRange(newDate);
  };

  return (
    <DateRangePicker
      className="space-y-2"
      // isReadOnly
      shouldForceLeadingZeros
      isRequired
      minValue={minDate ?? undefined}
      maxValue={maxDate ?? undefined}
      startName="startDate"
      endName="endDate"
      value={{
        start: parseDate(value.startDate.toISOString()?.split('T')[0] ?? ''),
        end: parseDate(value.endDate.toISOString()?.split('T')[0] ?? ''),
      }}
      onChange={handleChange}
    >
      <Label className="text-sm font-medium text-foreground">التاريــخ</Label>
      <div className="flex max-w-72">
        <Group className="inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-lg border border-input bg-background px-3 py-2 pr-9 text-sm shadow-sm shadow-black/[.04] ring-offset-background transition-shadow data-[focus-within]:border-ring data-[disabled]:opacity-50 data-[focus-within]:outline-none data-[focus-within]:ring-2 data-[focus-within]:ring-ring/30 data-[focus-within]:ring-offset-2">
          <DateInput slot="start">
            {(segment) => (
              <DateSegment
                segment={segment}
                className="inline rounded p-0.5 text-foreground caret-transparent outline outline-0 data-[disabled]:cursor-not-allowed data-[focused]:bg-accent data-[invalid]:data-[focused]:bg-destructive data-[type=literal]:px-0 data-[focused]:data-[placeholder]:text-foreground data-[focused]:text-foreground data-[invalid]:data-[focused]:data-[placeholder]:text-destructive-foreground data-[invalid]:data-[focused]:text-destructive-foreground data-[invalid]:data-[placeholder]:text-destructive data-[invalid]:text-destructive data-[placeholder]:text-muted-foreground/70 data-[type=literal]:text-muted-foreground/70 data-[disabled]:opacity-50"
              />
            )}
          </DateInput>
          <span aria-hidden="true" className="px-2 text-muted-foreground/70">
            -
          </span>
          <DateInput slot="end">
            {(segment) => (
              <DateSegment
                segment={segment}
                className="inline rounded p-0.5 text-foreground caret-transparent outline outline-0 data-[disabled]:cursor-not-allowed data-[focused]:bg-accent data-[invalid]:data-[focused]:bg-destructive data-[type=literal]:px-0 data-[focused]:data-[placeholder]:text-foreground data-[focused]:text-foreground data-[invalid]:data-[focused]:data-[placeholder]:text-destructive-foreground data-[invalid]:data-[focused]:text-destructive-foreground data-[invalid]:data-[placeholder]:text-destructive data-[invalid]:text-destructive data-[placeholder]:text-muted-foreground/70 data-[type=literal]:text-muted-foreground/70 data-[disabled]:opacity-50 data-[unavailable]:opacity-50"
              />
            )}
          </DateInput>
        </Group>
      </div>
    </DateRangePicker>
  );
}
