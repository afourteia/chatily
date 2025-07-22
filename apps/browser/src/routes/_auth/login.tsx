import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { queryClient } from '@/query-client';
import type { FileRouteTypes } from '@/routeTree.gen';
import { useStore } from '@/store/use-store';
import { useProcedure } from '@/utils/api';
import { getResolver } from '@/utils/zod-resolver';
import { loginInputSchema as formSchema } from '@project-name/api';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type SearchParams = {
  redirect?: FileRouteTypes['fullPaths'];
  redirectReason?: 'unAuthenticated' | 'loggedOut';
};

export const Route = createFileRoute('/_auth/login')({
  validateSearch: (search: SearchParams) => {
    return search;
  },
  component: Login,
});

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const AuthState = useStore((state) => state.authState);
  const updateAccessToken = useStore((state) => state.updateAccessToken);
  const updateRefreshToken = useStore((state) => state.updateRefreshToken);
  const updateAuthState = useStore((state) => state.updateAuthState);

  const navigate = useNavigate();

  const loginMutation = useProcedure({
    procedureEndpoint: 'login',
    onSettled: () => {
      queryClient.invalidateQueries();
    },
  });

  const form = useForm<z.input<typeof formSchema>>({
    resolver: getResolver(formSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  async function onSubmit(data: z.input<typeof formSchema>) {
    await loginMutation.mutateAsync(data, {
      onSuccess: (result) => {
        updateAccessToken(result.data.accessToken);
        updateRefreshToken(result.data.refreshToken);
        updateAuthState({
          status: 'LoggedIn',
          ...result.data.info,
        });

        // console.log('auth state should be updated to true');
      },
    });
  }

  const { redirect, redirectReason, ...extraSearchParams } = Route.useSearch();

  useEffect(() => {
    if (AuthState) {
      console.log('auth state is true');
      console.log('redirect', redirect);
      navigate({
        to: redirect ?? '/',
        search: redirect ? { ...extraSearchParams } : undefined,
      });
    }
  }, [AuthState]);

  return (
    <div className="mx-auto mt-10">
      <div className='mb-8'>
        <h1 className="text-2xl font-bold text-center">تسجيل الدخول</h1>
        {redirectReason === 'loggedOut' && (
          <p className="text-center text-primary">
            تم تسجيل خروجك. يرجى تسجيل الدخول مرة أخرى.
          </p>
        )}
        {redirectReason === 'unAuthenticated' && (
          <p className="text-center text-warning">
            يجب عليك تسجيل الدخول قبل إمكانية إستخدام المنظومة.
          </p>
        )}
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>رمز المستخدم</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="رقم الهاتف أو اسم المستخدم أو بريد إلكتروني"
                      dir="rtl"
                      type="text"
                      {...field}
                      autoComplete="username"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          {/* Render the password field with toggle button */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>كلمة المرور</FormLabel>
                  <FormControl>
                    <div className="flex flex-nowrap">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="كلمة المرور"
                        {...field}
                        autoComplete="current-password"
                      />
                      <Button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? 'إخفاء' : 'إظهار'}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <Button type="submit">ارسل</Button>
          {loginMutation.isPending ? <div>loading...</div> : null}
          {loginMutation.isError ? <div>error...</div> : null}
        </form>
      </Form>
    </div>
  );
}
