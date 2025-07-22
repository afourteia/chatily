import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { createFileRoute } from '@tanstack/react-router';
import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Input } from 'react-aria-components';
import { useDbReader } from '@/utils/api';
import type { Results } from '@chatally/db';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { relationshipMap } from '@/utils/sub-relationship-map';

export const Route = createFileRoute('/_dashboard/beneficiary-status')({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    console.log('Beneficiary Status Route fullPath:', Route.fullPath);
    // throw redirect({
    //   to: '/',
    // });
  },
});


function RouteComponent() {

  const isMobile = useIsMobile();
  const debounceTimeout = useRef<number | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchState, setSearchState] = useState('');
  const beneficiaryEntity = useDbReader('BeneficiaryEntity', 'findFirst', {
    where: {
      workId: { contains: searchState }, // Example condition, adjust as needed
    },
    include: {
      beneficiaries: {
        where: {
          isHidden: false,
        }
      },
    }
  },
    {

    },
    {
      placeholderData: undefined,
      retryOnMount: true,
      staleTime: 1000 * 60,
      enabled: !!searchState, // Only fetch if searchState is not empty
    }
  )

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
        event.code === "Enter"
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
  }

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
    <div className="flex min-h-14 w-full min-w-fit flex-auto overflow-y-clip">
      <div className="flex min-h-10 flex-auto flex-col p-1">
        <p className='text-muted-foreground mb-2'>عرض منتسبي عقد شركة الزاوية لتكرير النفط
          فقط الآن</p>
        <div className="relative flex gap-1 mb-2 h-6">
          <Search className="absolute start-2 top-1 size-4 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            // defaultValue={searchTerm}
            type="search"
            onChange={handleAutoSearch}
            placeholder="الرقم الوظيفي"
            className="ps-8 outline outline-2 outline-secondary-foreground  focus:outline focus:outline-2  focus:outline-primary"
          />
          <Button onClick={handleSearch} type="button" size='icon' className='h-full'>
            <Search className="size-4 text-primary-foreground" />
            <span className="sr-only">بحث</span>
          </Button>
          {!!searchState && beneficiaryEntity.isLoading && (
            <Spinner />
          )}
        </div>
        {beneficiaryEntity.error && (
          <div className="text-destructive">
            حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.</div>
        )}
        {!!!searchState && (
          <div className="text-muted-foreground">
            أدخل الرقم الوظيفي للبحث ثم اضغط علي زر البحث او Enter    </div>
        )}
        {!!searchState && (!beneficiaryEntity.data || beneficiaryEntity.data.beneficiaries.length === 0) && !beneficiaryEntity.error && !beneficiaryEntity.isPending && (
          <div className="text-warning">
            الرقم الوظيفي غير موجود. يرجى التحقق من الرقم والمحاولة مرة أخرى.
          </div>
        )}
        {!!searchState && beneficiaryEntity.data && beneficiaryEntity.data.beneficiaries.length > 0 && <ItemList
          beneficiaryEntity={beneficiaryEntity.data}
        />}
      </div>
    </div>
  )
}

function ItemList({ beneficiaryEntity }: {
  beneficiaryEntity: Results<'BeneficiaryEntity', {
    include: {
      beneficiaries: true,
    }
  }, 'findFirstOrThrow'>
}) {
  // return a table of name workId, relationship and active status
  return (
    <table className="w-full">
      <thead>
        <tr className='border-b border-secondary-foreground bg-secondary-foreground/5'>
          <th>الاسم</th>
          <th>الرقم الوظيفي</th>
          <th>العلاقة</th>
          <th>حالة التأميـن</th>
          <th>تاريخ آخر تغيـر (UTC)</th>
        </tr>
      </thead>
      <tbody>
        {beneficiaryEntity?.beneficiaries.map((beneficiary) => (
          <tr key={beneficiary.id} className='h-8 even:bg-secondary-foreground/10 border-b border-secondary-foreground hover:bg-secondary-foreground/30'>
            <td className='ps-1'>{beneficiary.name}</td>
            <td className='text-center'>{beneficiary.workId.replace(/\D/g, '')}</td>
            <td className='text-center'>{relationshipMap[beneficiary.relationship as keyof typeof relationshipMap] ?? beneficiary.relationship}</td>
            <td className='text-center'>{beneficiary.isActive ?
              <Badge variant='success'>مفعل</Badge> : <Badge variant='destructive'>غير مفعل</Badge>}</td>
            <td className='text-center'>{new Date(beneficiary.updatedAt).toLocaleString('ar', {
              timeZone: 'UTC',
              dateStyle: 'long',
            })}</td>
          </tr>
        ))}
      </tbody>
    </table >
  );
}