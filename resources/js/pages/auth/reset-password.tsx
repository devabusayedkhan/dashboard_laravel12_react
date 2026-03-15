import { Form, Head } from '@inertiajs/react';
import React, { useState } from 'react';
import { normalizeBDPhone } from '@/components/helper/NormalizePhone';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';

type Props = {
  phone?: string;   // from query (?phone=+8801...)
  status?: string;
};

export default function ResetPassword({ phone: initialPhone = '', status }: Props) {
  const [phone] = useState(normalizeBDPhone(initialPhone));

  return (
    <AuthLayout
      title="Reset password"
      description="Enter the OTP and your new password below"
    >
      <Head title="Reset password" />

      {status && (
        <div className="mb-4 text-center text-sm font-medium text-green-600">
          {status}
        </div>
      )}

      <Form
        action={route('password.update')}
        method="post"
        resetOnSuccess={['otp', 'password', 'password_confirmation']}
        className='skShadow p-6 rounded-lg'
      >
        {({ processing, errors }) => (
          <div className="grid gap-6">
            {/* Phone (readonly) */}
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                name="phone"
                value={phone}
                readOnly
              />
              <InputError message={(errors as any).phone} />
            </div>

            {/* OTP */}
            <div className="grid gap-2">
              <Label htmlFor="otp">OTP</Label>
              <Input
                id="otp"
                type="text"
                name="otp"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="6-digit OTP"
                maxLength={6}
                required
                autoFocus
              />
              <InputError message={(errors as any).otp} />
            </div>

            {/* New password */}
            <div className="grid gap-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                autoComplete="new-password"
                placeholder="New password"
                required
              />
              <InputError message={(errors as any).password} />
            </div>

            {/* Confirm password */}
            <div className="grid gap-2">
              <Label htmlFor="password_confirmation">Confirm password</Label>
              <Input
                id="password_confirmation"
                type="password"
                name="password_confirmation"
                autoComplete="new-password"
                placeholder="Confirm password"
                required
              />
              <InputError message={(errors as any).password_confirmation} />
            </div>

            <Button
              type="submit"
              className="w-full justify-center gap-1 rounded-md px-4 py-2 font-bold"
              disabled={processing}
              data-test="reset-password-button"
            >
              Reset password
              {processing && <Spinner />}
            </Button>
          </div>
        )}
      </Form>
    </AuthLayout>
  );
}