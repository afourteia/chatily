import { parse } from 'date-fns';

type GetDayOfWeekOutput =
  | 'Sunday'
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday';

const dayNames: Array<GetDayOfWeekOutput> = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export function getDayOfWeek(date: Date): GetDayOfWeekOutput {
  const dayOfWeekInt = date.getDay();

  return dayNames[dayOfWeekInt]!;
}

export function parseTime(time: string): Date {
  return parse(time, 'HH:mm:ss', new Date());
}
