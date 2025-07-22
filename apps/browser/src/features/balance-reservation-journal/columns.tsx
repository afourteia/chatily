import { TooltipWrapper } from '@/components/tooltip-wrapper';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  type ColumnDef,
  type ColumnHelper,
  createColumnHelper,
  type RowData,
} from '@tanstack/react-table';
import Decimal from 'decimal.js';
import { ChevronsDown, ChevronsUp, CircleCheck, CircleX } from 'lucide-react';

export type TableRowData = {
  id: string;
  beneficiary: {
    id: string;
    workId: string;
    name: string;
    relationship: string;
  };
  requestedAmount: Decimal;
  reservedAmount: Decimal;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  reservationUtilizationStatus: 'pending' | 'used' | 'unused';
  currency: string;
  isBeneficiaryActiveWhenProcessed: boolean;
  healthCareCenter: {
    id: string;
    name: string;
    address: {
      city: string;
      country: string;
    };
    // phone: string;
    branchNum: number;
  };
  createdAt: Date;
  updatedAt: Date;
};

// | { contract: string; healthcareFacility: string; totalValue: number };

const columnHelper = createColumnHelper<TableRowData>();

export const columns = [
  columnHelper.accessor('id', {
    header: 'الرمز',
    // maxSize: 120,
    cell: ({ getValue }) => {
      const value = getValue();
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="link"
              size="sm"
              className="m-0 p-0"
              onClick={(e) => e.stopPropagation()}
            >
              إظهار الرمز
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="h-fit w-auto px-2 py-1"
            side="left"
          >
            <span className="select-all text-xs text-muted-foreground">
              {value}
            </span>
          </PopoverContent>
        </Popover>
      );
    },
    // footer: () => <span className="block text-start">المجموع:</span>,
  }),
  columnHelper.accessor('beneficiary', {
    id: 'beneficiaryName',
    header: 'اسم المستفيد',
    enableSorting: true,
    cell: ({ getValue }) => {
      const value = getValue();
      return <span className="block text-start">{value.name}</span>;
    },
  }),

  columnHelper.accessor('beneficiary', {
    id: 'beneficiaryWorkId',
    header: 'رقم الوظيفي',
    enableSorting: true,
    cell: ({ getValue }) => {
      const value = getValue();
      return <span className="block text-start">{value.workId}</span>;
    },
  }),

  columnHelper.accessor('beneficiary', {
    id: 'beneficiaryRelationship',
    header: 'العلاقة',
    enableSorting: true,
    cell: ({ getValue }) => {
      const value = getValue();
      return value.relationship;
    },
  }),
  columnHelper.accessor('reservedAmount', {
    header: 'القيمة المحجوزة',
    enableSorting: true,
    sortingFn: (a, b) =>
      a.original.reservedAmount.comparedTo(b.original.reservedAmount),
    cell: ({ getValue, row }) => {
      const value = getValue();
      return (
        <TooltipWrapper
          className="m-0 bg-transparent p-0"
          label={
            <Card className="p-2">
              <dt>القيمة المطالب بها</dt>
              <dd className="inline">
                {row.original.requestedAmount.toNumber().toLocaleString('ar', {
                  style: 'currency',
                  currency: row.original.currency,
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </dd>
            </Card>
          }
        >
          <span className="block text-start">
            {value.toNumber().toLocaleString('ar', {
              style: 'currency',
              currency: row.original.currency,
              compactDisplay: 'short',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </TooltipWrapper>
      );
    },
  }),
  columnHelper.accessor('approvalStatus', {
    header: 'حالة الموافقة',
    enableSorting: true,
    cell: ({ getValue }) => {
      const value = getValue();
      return (
        <Badge
          variant={
            value === 'approved'
              ? 'success'
              : value === 'rejected'
                ? 'destructive'
                : 'outline'
          }
        >
          {value}
        </Badge>
      );
    },
  }),
  columnHelper.accessor('reservationUtilizationStatus', {
    header: 'حالة الاستخدام',
    enableSorting: true,
    cell: ({ getValue }) => {
      const value = getValue();
      return (
        <Badge
          variant={
            value === 'used'
              ? 'success'
              : value === 'unused'
                ? 'destructive'
                : 'outline'
          }
        >
          {value}
        </Badge>
      );
    },
  }),
  columnHelper.accessor('healthCareCenter', {
    id: 'healthCareCenterName',
    header: 'مركز الرعاية الصحية',
    enableSorting: true,
    cell: ({ getValue }) => {
      const value = getValue();
      return <span className="block text-start">{value.name}</span>;
    },
  }),
  columnHelper.accessor('healthCareCenter', {
    id: 'healthCareCenterAddress',
    header: 'عنوان المركز',
    enableSorting: true,
    cell: ({ getValue }) => {
      const value = getValue();
      return (
        <span className="block text-start">
          {value.address.city}, {value.address.country}
        </span>
      );
    },
  }),
  columnHelper.accessor('createdAt', {
    header: 'تاريخ الإنشاء',
    enableSorting: true,
    cell: ({ getValue }) => {
      const value = getValue();
      return (
        <span className="block text-start">
          {new Date(value).toLocaleDateString('ar-LY', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
      );
    },
  }),
];
