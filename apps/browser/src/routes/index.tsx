import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Input } from 'react-aria-components';
import { useDbReader } from '@/utils/api';
import type { Arguments, Results } from '@chatally/db';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import dalilLogo from '@/assets/img/name-logo-v.png'

export const Route = createFileRoute('/')({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {

    // throw redirect({
    //   to: '/',
    // });
  },
});


function RouteComponent() {


  return (
    <div className="relative p-1 ps-2">
      <h1 className="text-start text-2xl font-bold my-4">
        مرحباً بكم في بوابة الدليل الشافي لإدارة الخدمات الصحية
      </h1>
      <p className="indent-2 text-start text-secondary-foreground text-md mb-4">
        يمكن اختيار إحدى الخدمات المتوفرة أدناه للبدء في استخدام النظام:
      </p>
      <div className="flex min-h-14 gap-4 w-full min-w-fit flex-auto ">
        <Link
          to='/beneficiary-status'
        >
          <Card className="w-fit hover:shadow-md hover:border-2" >
            <CardContent className='p-2 px-4'>
              <CardTitle className="text-center text-xl font-bold my-auto">
                الكشف علي وضع المشتركيـن
              </CardTitle>
              {/* <CardDescription className="text-center text-sm">
          من فضلك أدخل رقم الهوية للبحث عن حالة المستفيدين.
        </CardDescription> */}
            </CardContent>

          </Card>
        </Link>
        <Link
          to='/beneficiary-balance-inquiry'
        >
          <Card className="w-fit hover:shadow-md hover:border-2" >
            <CardContent className='p-2 px-4'>
              <CardTitle className="text-center text-xl font-bold my-auto">
                طلب حجز قيمة من رصيـد المشترك
              </CardTitle>
              {/* <CardDescription className="text-center text-sm">
          من فضلك أدخل رقم الهوية للبحث عن حالة المستفيدين.
        </CardDescription> */}
            </CardContent>

          </Card>
        </Link>
      </div>
      <img src={dalilLogo} alt="شركة الدليل الشفافي لإدارة الخدمات الصحية" className="mx-auto sticky bottom-1 max-h-36 object-cover" />

    </div>
  )
}