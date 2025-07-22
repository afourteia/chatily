import { type MutableRefObject, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
// import { Switch } from '@/components/ui/switch';
import { cn } from '@/utils/cn';

const locales = {
  'en-US': {
    title: 'Period Selection',
    placeholder: 'Select period',
    quarters: ['Q1', 'Q2', 'Q3', 'Q4'],
    months: [
      ['Jan', 'Feb', 'Mar'],
      ['Apr', 'May', 'Jun'],
      ['Jul', 'Aug', 'Sep'],
      ['Oct', 'Nov', 'Dec'],
    ],
    quartersLabel: 'Quarters',
    monthsLabel: 'Months',
    selected: 'Selected:',
    language: 'العربية',
  },
  ar: {
    title: 'اختيار الفترة',
    placeholder: 'حدد الفترة',
    quarters: ['الربع الأول', 'الربع الثاني', 'الربع الثالث', 'الربع الرابع'],
    months: [
      ['يناير', 'فبراير', 'مارس'],
      ['أبريل', 'مايو', 'يونيو'],
      ['يوليو', 'أغسطس', 'سبتمبر'],
      ['أكتوبر', 'نوفمبر', 'ديسمبر'],
    ],
    quartersLabel: 'الأرباع',
    monthsLabel: 'الأشهر',
    selected: 'المحدد:',
    language: 'English',
  },
};

type Locale = keyof typeof locales;

interface MonthlyPeriodSelectProps {
  onChange: (
    selected:
      | {
        startDate: Date;
        endDate: Date;
      }
      | undefined,
  ) => void;
  dateText: MutableRefObject<string | null>;
}

export default function MonthlyPeriodSelect({
  onChange,
  dateText,
}: MonthlyPeriodSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [displayYear, setDisplayYear] = useState(new Date().getFullYear());
  const [selected, setSelected] = useState<{
    type: 'year' | 'quarter' | 'month';
    value: string;
    year: number;
  } | null>(null);
  const [locale] = useState<Locale>('ar');
  // const popupRef = useRef<HTMLDivElement>(null);

  const t = locales[locale];

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       popupRef.current &&
  //       !popupRef.current.contains(event.target as Node)
  //     ) {
  //       setIsOpen(false);
  //     }
  //   };

  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => document.removeEventListener('mousedown', handleClickOutside);
  // }, []);

  const handlePreviousYear = () => setDisplayYear((prev) => prev - 1);
  const handleNextYear = () => setDisplayYear((prev) => prev + 1);

  const handleYearSelect = () => {
    const newSelection = {
      type: 'year',
      value: displayYear.toString(),
      year: displayYear,
    } as const;
    setSelected(newSelection);
    dateText.current = `${newSelection.year}`;
    onChange({
      startDate: new Date(displayYear, 0, 1),
      endDate: new Date(displayYear, 11, 31),
    });
    setIsOpen(false);
  };

  const handleQuarterSelect = (quarter: string, index: number) => {
    const newSelection = {
      type: 'quarter',
      value: quarter,
      year: displayYear,
    } as const;
    setSelected(newSelection);
    dateText.current = `${newSelection.value} ${newSelection.year}`;
    onChange({
      startDate: new Date(displayYear, index * 3, 1),
      endDate: new Date(displayYear, index * 3 + 3, 0),
    });
    setIsOpen(false);
  };

  const handleMonthSelect = (month: string, index: number) => {
    const newSelection = {
      type: 'month',
      value: month,
      year: displayYear,
    } as const;
    setSelected(newSelection);
    dateText.current = `${newSelection.value} ${newSelection.year}`;
    onChange({
      startDate: new Date(displayYear, index, 1),
      endDate: new Date(displayYear, index + 1, 0),
    });
    setIsOpen(false);
  };

  const handleInputClick = () => {
    setIsOpen(true);
  };

  // const handleKeyDown = (event: React.KeyboardEvent) => {
  //   if (event.key === 'Enter' || event.key === ' ') {
  //     setIsOpen(true);
  //   }
  // };

  const getDisplayValue = () => {
    if (dateText.current) return dateText.current;
    if (!selected) return '';
    switch (selected.type) {
      case 'year':
        return `${selected.year}`;
      case 'quarter':
        return `${selected.value} ${selected.year}`;
      case 'month':
        return `${selected.value} ${selected.year}`;
      default:
        return '';
    }
  };

  // const toggleLocale = () => {
  //   setLocale((prev) => (prev === 'en-US' ? 'ar' : 'en-US'));
  // };

  return (
    <Popover open={isOpen}>
      <PopoverTrigger>
        <div className="relative flex items-center">
          <Input
            type="text"
            placeholder={t.placeholder}
            value={getDisplayValue()}
            onClick={handleInputClick}
            // onKeyDown={handleKeyDown}
            className={cn('w-40', locale === 'ar' ? 'pr-10' : 'pl-10')}
            readOnly
          />
          <Calendar
            className={cn(
              'absolute h-5 w-5 text-gray-400',
              locale === 'ar' ? 'right-3' : 'left-3',
            )}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className={cn('relative mx-9 w-fit', locale === 'ar' ? 'rtl' : 'ltr')}
        dir="rtl"
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold">{t.title}</h2>
          </div>
          {/* <div className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              <Switch
                checked={locale === 'ar'}
                onCheckedChange={toggleLocale}
              />
              <span className="text-sm">{t.language}</span>
            </div> */}
        </div>

        <div className="mb-6 flex items-center justify-between border-b pb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePreviousYear}
            className="h-8 w-8"
          >
            {locale === 'ar' ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            className={cn(
              'text-lg font-medium',
              selected?.type === 'year' && selected.year === displayYear
                ? 'bg-blue-600 text-white hover:bg-blue-600 hover:text-white'
                : '',
            )}
            onClick={handleYearSelect}
          >
            {displayYear}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextYear}
            className="h-8 w-8"
          >
            {locale === 'ar' ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="flex justify-start gap-x-6">
          <div className="col-span-3">
            <h3 className="mb-3 text-sm font-medium text-gray-500">
              {t.quartersLabel}
            </h3>
            <div className="flex flex-col gap-2">
              {t.quarters.map((quarter, index) => (
                <Button
                  key={quarter}
                  variant="outline"
                  className={cn(
                    'justify-start',
                    selected?.type === 'quarter' &&
                      selected.value === quarter &&
                      selected.year === displayYear
                      ? 'bg-blue-600 text-white hover:bg-blue-600 hover:text-white'
                      : '',
                  )}
                  onClick={() => handleQuarterSelect(quarter, index)}
                >
                  {quarter}
                </Button>
              ))}
            </div>
          </div>
          <div className="col-span-9 w-fit">
            <h3 className="mb-3 text-sm font-medium text-gray-500">
              {t.monthsLabel}
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {t.months.flat().map((month, index) => (
                <Button
                  key={month}
                  variant="outline"
                  className={cn(
                    'p-2',
                    selected?.type === 'month' &&
                      selected.value === month &&
                      selected.year === displayYear
                      ? 'bg-blue-600 text-white hover:bg-blue-600 hover:text-white'
                      : '',
                  )}
                  onClick={() => handleMonthSelect(month, index)}
                >
                  {month}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 text-sm">
          <span className="font-bold">{t.selected}</span> {getDisplayValue()}
        </div>
      </PopoverContent>
    </Popover>
  );
}
