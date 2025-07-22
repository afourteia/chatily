import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useProcedure } from '@/utils/api';
import { getResolver } from '@/utils/zod-resolver';
import { updateUserPasswordInputSchema as formSchema } from '@project-name/api';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { useDashboardContext } from '@/hooks/use-dashboard-context';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/_dashboard/account-info')({
  component: AccountInfo,
});

function AccountInfo() {
  const { userId } = useDashboardContext();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const changePasswordMutation = useProcedure({
    procedureEndpoint: 'updateUserPassword',
    onSettled: () => { },
  });

  const form = useForm<
    z.input<typeof formSchema> & { confirmPassword: string }
  >({
    resolver: getResolver(formSchema),
    defaultValues: {
      userId,
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      otp: '',
    },
  });

  async function onSubmit(
    data: z.input<typeof formSchema> & { confirmPassword: string },
  ) {
    setSuccessMsg('');
    setErrorMsg('');
    if (data.newPassword !== data.confirmPassword) {
      form.setError('confirmPassword', {
        message: 'كلمتا المرور غير متطابقتين',
      });
      return;
    }
    // Only send fields required by backend
    const { confirmPassword, ...toSend } = data;
    await changePasswordMutation.mutateAsync(
      { ...toSend, userId },
      {
        onSuccess: () => {
          setSuccessMsg('تم تغيير كلمة المرور بنجاح');
          form.reset();
        },
        onError: () => {
          setErrorMsg('حدث خطأ أثناء تغيير كلمة المرور');
          form.setError('oldPassword', {
            message: 'كلمة المرور الحالية غير صحيحة',
          });
        },
      },
    );
  }

  return (
    <div className="mx-auto mt-10 max-w-md">
      <p>هذه الخدمة غير مدعومة حاليا</p>
      <Link to="/"><Button>العودة إلى الصفحة الرئيسية</Button></Link>
    </div>
  );

  return (
    <div className="mx-auto mt-10 max-w-md">
      <h2 className="mb-6 text-xl font-bold">تغيير كلمة المرور</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>كلمة المرور الحالية</FormLabel>
                <FormControl>
                  <div className="flex flex-nowrap">
                    <Input
                      type={showOldPassword ? 'text' : 'password'}
                      placeholder="كلمة المرور الحالية"
                      {...field}
                      autoComplete="current-password"
                    />
                    <Button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                    >
                      {showOldPassword ? 'إخفاء' : 'إظهار'}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>كلمة المرور الجديدة</FormLabel>
                <FormControl>
                  <div className="flex flex-nowrap">
                    <Input
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="كلمة المرور الجديدة"
                      {...field}
                      autoComplete="new-password"
                    />
                    <Button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? 'إخفاء' : 'إظهار'}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            rules={{ required: 'يرجى تأكيد كلمة المرور الجديدة' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>تأكيد كلمة المرور الجديدة</FormLabel>
                <FormControl>
                  <div className="flex flex-nowrap">
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="تأكيد كلمة المرور الجديدة"
                      {...field}
                      autoComplete="new-password"
                    />
                    <Button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? 'إخفاء' : 'إظهار'}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">تغيير كلمة المرور</Button>
          {changePasswordMutation.isPending ? <div>جاري التغيير...</div> : null}
          {successMsg && <div className="text-green-600">{successMsg}</div>}
          {errorMsg && <div className="text-red-600">{errorMsg}</div>}
        </form>
      </Form>
    </div>
  );
}
