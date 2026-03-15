import { Form, Head } from '@inertiajs/react';
import React, { useState } from 'react';
import { normalizeBDPhone } from '@/components/helper/NormalizePhone';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/login';

type Props = {
  status?: string;
  canRegister: boolean;
};

export default function Login({ status }: Props) {
  const [phone, setPhone] = useState('');
  const [remember, setRemember] = useState(false);

  return (
    <AuthLayout
      title="Admin Login"
      description="Enter your Phone Number and password below to log in"
    >
      <Head title="Log in" />

      <Form
        {...store.form()}
        resetOnSuccess={['password']}
        className="skShadow flex flex-col gap-6 rounded-lg p-6"
      >
        {({ processing, errors }) => (
          <>
            <div className="grid gap-2">
              {/* Phone */}
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>

                <div className="relative">
                  <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    +880
                  </div>

                  <Input
                    id="phone"
                    type="tel"
                    name="phone"
                    inputMode="tel"
                    required
                    autoFocus
                    tabIndex={1}
                    autoComplete="tel"
                    placeholder="1XXXXXXXXX"
                    className="pl-14 border-orange-500"
                    value={phone}
                    onChange={(e) => setPhone(normalizeBDPhone(e.target.value))}
                    onBlur={() => setPhone(normalizeBDPhone(phone))}
                  />

                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    BD
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  Format: <span className="font-medium">+8801XXXXXXXXX</span>
                </p>

                <InputError message={errors.phone} />
              </div>

              {/* Password */}
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>

                    <TextLink
                      href={route('password.request')} 
                      className="ml-auto text-sm"
                      tabIndex={5}
                    >
                      Forgot password?
                    </TextLink>
                </div>

                <Input
                  id="password"
                  type="password"
                  name="password"
                  required
                  tabIndex={2}
                  autoComplete="current-password"
                  placeholder="Password"
                  className='border-orange-500'
                />
                <InputError message={errors.password} />
              </div>

              {/* Remember (shadcn checkbox safe submit) */}
              <div className="flex items-center space-x-3">
                <input type="hidden" name="remember" value={remember ? '1' : '0'} />
                <Checkbox
                  id="remember"
                  checked={remember}
                  onCheckedChange={(v) => setRemember(!!v)}
                  tabIndex={3}
                  className='border-orange-500'
                />
                <Label htmlFor="remember">Remember me</Label>
              </div>

              <Button
                type="submit"
                className="flex w-full items-center justify-center gap-1 rounded-md px-4 py-2 font-bold"
                tabIndex={4}
                disabled={processing}
                data-test="login-button"
              >
                Log in
                {processing && <Spinner />}
              </Button>
            </div>
          </>
        )}
      </Form>

      {status && (
        <div className="mb-4 text-center text-sm font-medium text-green-600">
          {status}
        </div>
      )}
    </AuthLayout>
  );
}