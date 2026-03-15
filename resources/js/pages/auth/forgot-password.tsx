import { Form, Head } from '@inertiajs/react';
import React, { useState } from 'react';
import { normalizeBDPhone } from '@/components/helper/NormalizePhone';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';


export default function ForgotPassword({ status }: { status?: string }) {
  const [phone, setPhone] = useState('');

  return (
    <AuthLayout
      title="Forgot password"
      description="Enter your phone number to receive an OTP"
    >
      <Head title="Forgot password" />

      {status && (
        <div className="mb-4 text-center text-sm font-medium text-green-600">
          {status}
        </div>
      )}

      <div className="space-y-6 skShadow p-6 rounded-lg">
        <Form action={route('password.phone')} method="post">
          {({ processing, errors }) => (
            <>
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
                    autoComplete="tel"
                    autoFocus
                    required
                    placeholder="1XXXXXXXXX"
                    className="pl-14"
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

                <InputError message={(errors as any).phone} />
              </div>

              <div className="my-6 flex items-center justify-start">
                <Button
                type="submit"
                                className="flex w-full items-center justify-center gap-1 rounded-md px-4 py-2 font-bold"
                  disabled={processing}
                  data-test="send-otp-button"
                >
                  Send OTP
                  {processing && <Spinner />}
                </Button>
                
              </div>
            </>
          )}
        </Form>

        <div className="space-x-1 text-center text-sm text-muted-foreground">
          <span>Or, return to</span>
          <TextLink href={login()}>log in</TextLink>
        </div>
      </div>
    </AuthLayout>
  );
}