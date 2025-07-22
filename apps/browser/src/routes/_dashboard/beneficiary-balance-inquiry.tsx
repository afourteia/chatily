import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { createFileRoute } from '@tanstack/react-router';
import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Input, MaskedInput } from '@/components/ui/input';
import { useDbReader } from '@/utils/api';
import type { Results } from '@chatally/db';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { relationshipMap } from '@/utils/sub-relationship-map';
import { cn } from '@/utils/cn';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import n2words from 'n2words';
import { currencySymbols, type CurrencyCode } from '@/utils/currency';
import { convertHinduNumerals } from '@/utils/convert-hindu-numerals';
export const Route = createFileRoute('/_dashboard/beneficiary-balance-inquiry')(
  {
    component: RouteComponent,
  },
);

function RouteComponent() {
  const isMobile = useIsMobile();
  const debounceTimeout = useRef<number | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchState, setSearchState] = useState('5');
  const beneficiaryEntity = useDbReader(
    'BeneficiaryEntity',
    'findFirst',
    {
      where: {
        workId: {
          contains: searchState,
        }, // Example condition, adjust as needed
      },
      include: {
        beneficiaries: {
          where: {
            isHidden: false,
          },
        },
      },
    },
    {},
    {
      placeholderData: undefined,
      retryOnMount: true,
      staleTime: 1000 * 60,
      enabled: !!searchState, // Only fetch if searchState is not empty
    },
  );

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.code === 'Enter'
        // (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        handleSearch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = () => {
    if (searchInputRef.current) {
      setSearchState(searchInputRef.current.value);
    } else {
      setSearchState('');
    }
  };

  const handleAutoSearch = () => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      if (searchInputRef.current) {
        setSearchState(searchInputRef.current.value);
      } else {
        setSearchState('');
      }
    }, 1400); // adjust the debounce delay as needed (1500ms in this example)
  };
  return (
    <div className="flex min-h-14 w-full min-w-fit flex-auto overflow-y-auto">
      <div className="flex min-h-10 flex-auto flex-col p-1">
        <p className="mb-2 text-muted-foreground">
          حجز قيمة من رصيـد المشترك مقبـال خدمة
        </p>
        <div className="relative mb-5 flex h-6 items-center gap-1">
          <Search
            className="absolute start-2 top-1 size-4 text-muted-foreground"
          />
          <Input
            ref={searchInputRef}
            // defaultValue={searchTerm}
            type="search"
            onChange={handleAutoSearch}
            placeholder="ادخل الرقم الوظيفي"
            className="h-full ps-8"
          />
          <Button
            onClick={handleSearch}
            type="button"
            size="icon"
            className="h-full"
          >
            <Search className="size-4 text-primary-foreground" />
            <span className="sr-only">بحث</span>
          </Button>
          {!!searchState && beneficiaryEntity.isLoading && <Spinner />}
        </div>
        {beneficiaryEntity.error && (
          <div className="text-destructive">
            حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.
          </div>
        )}
        {!!!searchState && (
          <div className="text-muted-foreground">
            أدخل الرقم الوظيفي للبحث ثم اضغط علي زر البحث او Enter{' '}
          </div>
        )}
        {!!searchState &&
          (!beneficiaryEntity.data ||
            beneficiaryEntity.data.beneficiaries.length === 0) &&
          !beneficiaryEntity.error &&
          !beneficiaryEntity.isPending && (
            <div className="text-warning">
              الرقم الوظيفي غير موجود. يرجى التحقق من الرقم والمحاولة مرة أخرى.
            </div>
          )}
        {!!searchState &&
          beneficiaryEntity.data &&
          beneficiaryEntity.data.beneficiaries.length > 0 && (
            <ItemList beneficiaryEntity={beneficiaryEntity.data} />
          )}
      </div>
    </div>
  );
}

function ItemList({
  beneficiaryEntity,
}: {
  beneficiaryEntity: Results<
    'BeneficiaryEntity',
    {
      include: {
        beneficiaries: true;
      };
    },
    'findFirstOrThrow'
  >;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  useEffect(() => {
    setSelectedId(beneficiaryEntity.beneficiaries[0]?.id ?? null);
  }, [beneficiaryEntity]);

  // return a table of name workId, relationship and active status
  return (
    <>
      {!selectedId && (
        <h2 className="mb-4 text-center text-lg font-bold text-primary">
          الرجاء إختيار مستفيد من الأسفل بالضغط عليه
        </h2>
      )}
      <table className="w-full">
        <thead>
          <tr
            className="border-b border-secondary-foreground
              bg-secondary-foreground/5"
          >
            <th>الاسم</th>
            <th>الرقم الوظيفي</th>
            <th>العلاقة</th>
            <th>حالة التأميـن</th>
            <th>تاريخ آخر تغيـر (UTC)</th>
          </tr>
        </thead>
        <tbody>
          {beneficiaryEntity?.beneficiaries.map((beneficiary) => (
            <tr
              tabIndex={-1}
              onClick={() => setSelectedId(beneficiary.id)}
              key={beneficiary.id}
              className={cn(
                `h-8 border-b border-secondary-foreground
                even:bg-secondary-foreground/10
                hover:bg-secondary-foreground/30`,
                `${
                  selectedId === beneficiary.id
                    ? 'bg-primary/50 even:bg-primary/50 hover:bg-primary/60'
                    : ''
                }`,
              )}
            >
              <td className="ps-1">{beneficiary.name}</td>
              <td className="text-center">
                {beneficiary.workId.replace(/\D/g, '')}
              </td>
              <td className="text-center">
                {relationshipMap[
                  beneficiary.relationship as keyof typeof relationshipMap
                ] ?? beneficiary.relationship}
              </td>
              <td className="text-center">
                {beneficiary.isActive ? (
                  <Badge variant="success">مفعل</Badge>
                ) : (
                  <Badge variant="destructive">غير مفعل</Badge>
                )}
              </td>
              <td className="text-center">
                {new Date(beneficiary.updatedAt).toLocaleString('ar', {
                  timeZone: 'UTC',
                  dateStyle: 'long',
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedId ? (
        <InquiryForm
          selectedId={selectedId}
          beneficiary={
            beneficiaryEntity.beneficiaries.find((b) => b.id === selectedId)!
          }
        />
      ) : (
        'لم يتم تحديد أي عنصر'
      )}
    </>
  );
}

function InquiryForm({
  selectedId,
  beneficiary,
}: {
  selectedId: string;
  beneficiary: {
    name: string;
    workId: string;
    relationship: string;
    isActive: boolean;
  };
}) {
  const [amount, setAmount] = useState<string>('');
  const [amountWord, setAmountWord] = useState<string>('');
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>(
    currencySymbols.LYD.code,
  );
  const inputAmount = useRef<HTMLInputElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  }, [selectedId]);
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const handleBeforeInput: EventListener = (e: Event) => {
      const inputEvent = e as InputEvent;
      if (
        inputEvent.data &&
        /[\u0660-\u0669\u06f0-\u06f9]/.test(inputEvent.data)
      ) {
        // e.preventDefault();
        const western = convertHinduNumerals(inputEvent.data);
        const start = input.selectionStart ?? 0;
        const end = input.selectionEnd ?? 0;
        const newValue =
          input.value.slice(0, start) + western + input.value.slice(end);
        input.value = newValue;
        input.setSelectionRange(start + western.length, start + western.length);
        // Optionally update your state here
        // setAmount(newValue);
        // setAmountWord(n2words(newValue, { lang: 'ar' }));
      }
    };

    input.addEventListener('beforeinput', handleBeforeInput);

    return () => {
      input.removeEventListener('beforeinput', handleBeforeInput);
    };
  }, []);

  return (
    <Card
      ref={ref}
      className="mt-3"
    >
      <CardContent className="p-4">
        <CardTitle className="mb-4 text-center text-lg text-muted-foreground">
          نموذج حجز قيمة من رصيـد المستفيـد المحدد ادناه
        </CardTitle>
        <dl className="flex flex-wrap gap-4">
          <div>
            <dt className="inline text-muted-foreground">الاسم: </dt>
            <dd className="inline">{beneficiary.name}</dd>
          </div>
          <div>
            <dt className="inline text-muted-foreground">الرقم الوظيفي: </dt>
            <dd className="inline">{beneficiary.workId}</dd>
          </div>
          <div>
            <dt className="inline text-muted-foreground">العلاقة: </dt>
            <dd className="inline">
              {relationshipMap[
                beneficiary.relationship as keyof typeof relationshipMap
              ] ?? beneficiary.relationship}
            </dd>
          </div>
          <div className="me-auto">
            <dt className="inline text-muted-foreground">حالة التأميـن: </dt>
            <dd className="inline">
              {beneficiary.isActive ? (
                <Badge variant="success">مفعل</Badge>
              ) : (
                <Badge variant="destructive">غير مفعل</Badge>
              )}
            </dd>
          </div>
        </dl>
        <Separator className="my-2" />
        <div className="flex w-full flex-wrap justify-start gap-4">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="amount"
              className="mb-1 text-muted-foreground"
            >
              القيمة المراد حجزها:
            </label>
            <div className="relative flex flex-nowrap items-start">
              <div className="absolute end-0 text-secondary-foreground">
                <Select
                  defaultValue={selectedCurrency}
                  onValueChange={(value) =>
                    setSelectedCurrency(value as CurrencyCode)
                  }
                >
                  <SelectTrigger className="w-fit">
                    <SelectValue placeholder="Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(currencySymbols)
                      .filter(([, { isVisible }]) => isVisible)
                      .map(([code, { symbol }]) => (
                        <SelectItem
                          onClick={() =>
                            setSelectedCurrency(code as CurrencyCode)
                          }
                          key={code}
                          value={code}
                        >
                          {code}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <MaskedInput
                mask={Number}
                scale={2}
                radix="."
                thousandsSeparator=","
                min={0}
                maxLength={11}
                padFractionalZeros={true}
                unmask="typed" // true|false|'typed'
                ref={maskRef}
                inputRef={inputRef}
                onAccept={
                  // depending on prop above first argument is
                  // `value` if `unmask=false`,
                  // `unmaskedValue` if `unmask=true`,
                  // `typedValue` if `unmask='typed'`
                  // (value, mask, e) => {
                  (value) => {
                    setAmount(value);
                    setAmountWord(
                      n2words(value, {
                        lang: 'ar',
                      }),
                    );
                    // console.log("value", value);
                    // console.log('writtenNumber', n2words(value, { lang: 'ar' }));
                  }
                }
                // onChange={(e?) => inputAmount.current = e.target.valueAsNumber.toLocaleString('ar-LY', { style: 'currency', currency: 'LYD' }))}
                placeholder="أدخل القيمة"
                className="w-52 pe-[80px] text-lg"
              />
            </div>
          </div>
          <div className="flex flex-auto flex-col gap-1">
            <label
              htmlFor="description"
              className="mb-1 text-muted-foreground"
            >
              تفاصيل عن الخدمة:
            </label>
            <Textarea
              required
              id="description"
              placeholder="أدخل تفاصيل عن الخدمة"
              className="min-w-64 text-lg"
            />
          </div>
        </div>
        <Separator className="my-2" />
        <div className="flex flex-nowrap gap-1">
          {amountWord ? (
            <p>
              <span className="text-muted-foreground">
                سيتم طلب حجز قيمة و قدّرها{' '}
              </span>
              <span
                id="amount-word"
                className="text-nowrap text-lg text-secondary-foreground"
              >
                <span className="font-bold text-primary">{amountWord} </span>
                <span className="text-sm font-semibold">
                  {currencySymbols[selectedCurrency].name}
                </span>
              </span>
            </p>
          ) : (
            <p className="text-muted-foreground">لم يتم إدخال قيمة بعد</p>
          )}
        </div>
        <CardFooter className="mt-4 flex-col gap-2">
          <Button
            // onClick={() =>
            //   alert(
            //     // {/* @ts-ignore */}
            //     `تم ارسال طلب حجز بالقيمة ${amount} و التفاصيل ${document.getElementById('description')?.value}`,
            //   )
            // }
            className="w-full"
            variant="default"
          >
            إرسال طلب حجز
          </Button>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
