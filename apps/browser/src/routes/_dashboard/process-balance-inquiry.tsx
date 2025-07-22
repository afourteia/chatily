import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Input, MaskedInput } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { relationshipMap } from '@/utils/sub-relationship-map';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import n2words from 'n2words';
import { convertHinduNumerals } from '@/utils/convert-hindu-numerals';

export const Route = createFileRoute('/_dashboard/process-balance-inquiry')({
  component: RouteComponent,
});

function RouteComponent() {
  const inquiryList = ['Inquiry 1', 'Inquiry 2', 'Inquiry 3'];

  return (
    <div className="flex flex-col gap-6 overflow-y-auto">
      <InquiryForm
        balanceReservationForm={{
          id: '1',
          approvalStatus: 'pending',
          amountCovered: 1000,
          amountRequested: 12003243,
          reservationUtilizationStatus: 'used',
          currency: 'TND',
          healthCareCenter: {
            id: 'health-center-1',
            name: 'Health Center A',
            address: {
              city: 'Tunis',
              country: 'Tunisia',
            },
            // phone: '123456789',
            branchNum: 3,
          },
          isActiveAtProcessing: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          beneficiary: {
            balance: {
              individualCeiling: 5000,
              entityCeiling: 10000,
              individualExpenditure: 2000,
              entityExpenditure: 3000,
            },
            reservation: {
              individualReserved: 1000,
              entityReserved: 2000,
            },
            id: 'beneficiary-1',
            name: 'عبدالرحمن محمد احمد عبدالحميد',
            workId: '12345',
            dalilId: 'dalil-123',
            relationship: 'spouse',
            isActive: true,
            description: 'Medical expenses for spouse',
          },
        }}
      />
      <InquiryForm
        balanceReservationForm={{
          id: '1',
          approvalStatus: 'pending',
          amountCovered: 1000,
          amountRequested: 12003243,
          reservationUtilizationStatus: 'used',
          currency: 'TND',
          healthCareCenter: {
            id: 'health-center-1',
            name: 'Health Center A',
            address: {
              city: 'Tunis',
              country: 'Tunisia',
            },
            // phone: '123456789',
            branchNum: 3,
          },
          isActiveAtProcessing: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          beneficiary: {
            balance: {
              individualCeiling: 5000,
              entityCeiling: 10000,
              individualExpenditure: 2000,
              entityExpenditure: 3000,
            },
            reservation: {
              individualReserved: 1000,
              entityReserved: 2000,
            },
            id: 'beneficiary-1',
            name: 'عبدالرحمن محمد احمد عبدالحميد',
            workId: '12345',
            dalilId: 'dalil-123',
            relationship: 'spouse',
            isActive: true,
            description: 'Medical expenses for spouse',
          },
        }}
      />
    </div>
  );
}

function InquiryForm({
  balanceReservationForm,
}: {
  balanceReservationForm: {
    id: string;
    approvalStatus: 'pending' | 'approved' | 'rejected';
    reservationUtilizationStatus: 'used' | 'not-used' | 'pending'; // renamed from reservationUtilizationStatus
    amountCovered: number;
    amountRequested: number;
    isActiveAtProcessing?: boolean | null;
    healthCareCenter: {
      id: string;
      name: string;
      address: {
        city: string;
        country: string;
      };
      // phone: string;
      branchNum: 3;
    };
    currency: string;
    createdAt: Date;
    updatedAt: Date;
    beneficiary: {
      id: string;
      name: string;
      workId: string;
      dalilId: string;
      relationship: string;
      isActive: boolean;
      description: string;
      balance: {
        individualCeiling?: number;
        entityCeiling?: number;
        individualExpenditure: number;
        entityExpenditure: number;
      };
      reservation: {
        individualReserved: number;
        entityReserved: number;
      };
    };
  };
}) {
  const maskRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [coveredAmount, setCoveredAmount] = useState<number | null>(null);
  const [coveredAmountWord, setCoveredAmountWord] = useState<string>('');
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
  // const ref = useRef<HTMLDivElement>(null);
  // useEffect(() => {
  //   if (ref.current) {
  //     ref.current.scrollIntoView({behavior: 'smooth', block: 'end' });
  //   }
  // }, [selectedId]);
  return (
    <Card className="mt-3">
      <CardContent className="p-4">
        <div className="flex flex-nowrap items-center justify-between gap-2">
          <h2 className="mb-4 text-2xl font-bold">
            {balanceReservationForm.beneficiary.name}
          </h2>
          <div>
            <span className="text-muted-foreground">تاريخ الطلب:</span>
            <Badge
              className="text-md h-fit"
              variant="secondary"
            >
              {balanceReservationForm.createdAt.toLocaleDateString('ar', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Badge>
          </div>
        </div>
        <dl className="flex flex-wrap items-end gap-4">
          <div>
            <dt className="inline text-muted-foreground">الرقم الوظيفي: </dt>
            <dd className="inline">
              {balanceReservationForm.beneficiary.workId}
            </dd>
          </div>
          <div>
            <dt className="inline text-muted-foreground">العلاقة: </dt>
            <dd className="inline">
              {relationshipMap[
                balanceReservationForm.beneficiary
                  .relationship as keyof typeof relationshipMap
              ] ?? balanceReservationForm.beneficiary.relationship}
            </dd>
          </div>
          <div>
            <dt className="inline text-muted-foreground">حالة التأميـن: </dt>
            <dd className="inline">
              {balanceReservationForm.beneficiary.isActive ? (
                <Badge variant="success">مفعل</Badge>
              ) : (
                <Badge variant="destructive">غير مفعل</Badge>
              )}
            </dd>
          </div>
        </dl>
        <Separator className="my-2" />
        <h2 className="mb-4 text-2xl font-bold">
          {balanceReservationForm.healthCareCenter.name}
        </h2>
        <dl className="flex flex-wrap items-center gap-4">
          <div>
            <dt className="inline text-muted-foreground">رقم الفرع: </dt>
            <dd className="inline">
              {balanceReservationForm.healthCareCenter.branchNum}
            </dd>
          </div>
          <div>
            <dt className="inline text-muted-foreground">الموقع: </dt>
            <dd className="inline">
              {balanceReservationForm.healthCareCenter.address.city},{' '}
              {balanceReservationForm.healthCareCenter.address.country}
            </dd>
          </div>
          <div>
            <dt className="inline text-muted-foreground">
              القيمة المراد حجزها:
            </dt>
            <dd className="inline">
              <Badge className="text-md">
                {balanceReservationForm.amountRequested.toLocaleString('ar', {
                  style: 'currency',
                  currency: balanceReservationForm.currency,
                  currencyDisplay: 'name',
                  maximumFractionDigits: 2,
                })}
              </Badge>
            </dd>
          </div>
          <div>
            <dt className="inline text-muted-foreground">تفاصيل الخدمة: </dt>
            <dd className="inline">
              {balanceReservationForm.beneficiary.description}
            </dd>
          </div>
        </dl>
        <Separator className="my-2" />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <table className="border text-center text-sm">
            <thead className="bg-secondary text-secondary-foreground">
              <tr>
                <th className="border px-2 py-1">وصف القيمة</th>
                <th className="border px-2 py-1">المستفيد</th>
                <th className="border px-2 py-1">الكيان</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-2 py-1">السقف</td>
                <td className="border px-2 py-1">
                  {balanceReservationForm.beneficiary.balance.individualCeiling?.toLocaleString(
                    'ar',
                  ) ?? 'غير محدد'}
                </td>
                <td className="border px-2 py-1">
                  {balanceReservationForm.beneficiary.balance.entityCeiling?.toLocaleString(
                    'ar',
                  ) ?? 'غير محدد'}
                </td>
              </tr>
              <tr>
                <td className="border px-2 py-1">المستنفذ</td>
                <td className="border px-2 py-1">
                  {balanceReservationForm.beneficiary.balance.individualExpenditure?.toLocaleString(
                    'ar',
                  )}
                </td>
                <td className="border px-2 py-1">
                  {balanceReservationForm.beneficiary.balance.entityExpenditure?.toLocaleString(
                    'ar',
                  )}
                </td>
              </tr>
              <tr>
                <td className="border px-2 py-1">المحجوز</td>
                <td className="border px-2 py-1">
                  {balanceReservationForm.beneficiary.reservation.individualReserved?.toLocaleString(
                    'ar',
                  )}
                </td>
                <td className="border px-2 py-1">
                  {balanceReservationForm.beneficiary.reservation.entityReserved?.toLocaleString(
                    'ar',
                  )}
                </td>
              </tr>
              <tr>
                <td className="border px-2 py-1">المتبقي</td>
                <td className="border px-2 py-1">
                  {(
                    balanceReservationForm.beneficiary.balance
                      .individualCeiling ??
                    0 -
                      balanceReservationForm.beneficiary.balance
                        .individualExpenditure -
                      balanceReservationForm.beneficiary.reservation
                        .individualReserved
                  ).toLocaleString('ar')}
                </td>
                <td className="border px-2 py-1">
                  {(
                    balanceReservationForm.beneficiary.balance.entityCeiling ??
                    0 -
                      balanceReservationForm.beneficiary.balance
                        .entityExpenditure -
                      balanceReservationForm.beneficiary.reservation
                        .entityReserved
                  ).toLocaleString('ar')}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="flex flex-auto flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="amount"
                className="mb-1 text-muted-foreground"
              >
                تعديــل القيمة المحجوزة:
              </label>
              <div className="relative flex w-fit flex-nowrap items-start">
                <div className="absolute end-0 h-full text-secondary-foreground">
                  <Badge className="text-md h-full">
                    {balanceReservationForm.currency}
                  </Badge>
                </div>
                <MaskedInput
                  mask={Number}
                  scale={2}
                  radix="."
                  thousandsSeparator=","
                  min={0}
                  max={balanceReservationForm.amountRequested}
                  padFractionalZeros={true}
                  autofix={true}
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
                      // console.log('value', value);
                      const number = Number(value);
                      // console.log('number', number);
                      setCoveredAmount(isNaN(number) ? null : number);
                      setCoveredAmountWord(
                        isNaN(number)
                          ? ''
                          : n2words(number, {
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
                معلومات أخرى:
              </label>
              <Textarea
                required
                id="description"
                placeholder="أدخل سبب الرفض أو تقليص القيمة المحجوزة أو معلومات أخرى"
                className="min-w-64 text-lg"
              />
            </div>
          </div>
        </div>
        <Separator className="my-2" />
        <CardFooter className="mt-4 flex-col">
          <div className="flex w-full justify-around gap-2">
            {coveredAmount !== null &&
            coveredAmount > 0 &&
            coveredAmount < balanceReservationForm.amountRequested ? (
              <Button variant="warning">قبول الطلب مع قيمة مخفضة</Button>
            ) : (
              <>
                <Button variant="success">قبول الطلب</Button>
                <Button variant="destructive">رفض الطلب</Button>
              </>
            )}
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
