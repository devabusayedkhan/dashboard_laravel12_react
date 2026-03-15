import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

import Modal from '@/components/helper/Model';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { normalizeBDPhone } from '../helper/NormalizePhone';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    phone?: string;
};

type ResetErrors = {
    phone?: string;
    otp?: string;
    password?: string;
    password_confirmation?: string;
};

export default function ResetPasswordModal({
    isOpen,
    onClose,
    phone: initialPhone = '',
}: Props) {
    const [phone, setPhone] = useState(normalizeBDPhone(initialPhone));
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<ResetErrors>({});

    useEffect(() => {
        if (isOpen) {
            setPhone(normalizeBDPhone(initialPhone));
        } else {
            setOtp('');
            setPassword('');
            setPasswordConfirmation('');
            setErrors({});
            setProcessing(false);
        }
    }, [isOpen, initialPhone]);

    const handleClose = () => {
        setOtp('');
        setPassword('');
        setPasswordConfirmation('');
        setErrors({});
        setProcessing(false);
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const normalizedPhone = normalizeBDPhone(phone);

        setPhone(normalizedPhone);
        setProcessing(true);
        setErrors({});

        try {
            const response = await fetch('/api/v1/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    phone: normalizedPhone,
                    otp,
                    password,
                    password_confirmation: passwordConfirmation,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 422 && data.errors) {
                    setErrors({
                        phone: data.errors.phone?.[0],
                        otp: data.errors.otp?.[0],
                        password: data.errors.password?.[0],
                        password_confirmation:
                            data.errors.password_confirmation?.[0],
                    });
                    return;
                }

                Swal.fire({
                    icon: 'error',
                    title: 'Reset Failed',
                    text: data?.message || 'Something went wrong.',
                    confirmButtonColor: '#f97316',
                });
                return;
            }

            Swal.fire({
                icon: 'success',
                title: 'Password Reset Successful',
                text: data?.message || 'Password reset successful. Please log in.',
                confirmButtonColor: '#f97316',
            });

            handleClose();
        } catch {
            Swal.fire({
                icon: 'error',
                title: 'Network Error',
                text: 'Unable to connect to the server.',
                confirmButtonColor: '#f97316',
            });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Reset password"
            width="w-[92%] sm:w-[62%] md:w-[45%] xl:w-[38%] 2xl:w-[34%]"
        >
            <hr className="mb-2 border-gray-500" />

            <div className="skShadow space-y-6 rounded-lg px-6 py-8">
                <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                        Enter the OTP and your new password below
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                type="tel"
                                name="phone"
                                value={phone}
                                readOnly
                            />
                            <InputError message={errors.phone} />
                        </div>

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
                                value={otp}
                                onChange={(e) =>
                                    setOtp(e.target.value.replace(/\D/g, ''))
                                }
                            />
                            <InputError message={errors.otp} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">New Password</Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                autoComplete="new-password"
                                placeholder="New password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">
                                Confirm password
                            </Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                autoComplete="new-password"
                                placeholder="Confirm password"
                                required
                                value={passwordConfirmation}
                                onChange={(e) =>
                                    setPasswordConfirmation(e.target.value)
                                }
                            />
                            <InputError message={errors.password_confirmation} />
                        </div>

                        <Button
                            type="submit"
                            className="flex w-full justify-center gap-1 rounded-md px-4 py-2 font-bold"
                            disabled={processing}
                            data-test="reset-password-button"
                        >
                            Reset password
                            {processing && <Spinner />}
                        </Button>
                    </div>
                </form>

                <div className="space-x-1 text-center text-sm text-muted-foreground">
                    <span>Remember your password?</span>
                    <span
                        onClick={handleClose}
                        className="cursor-pointer font-bold hover:underline"
                    >
                        Back to log in
                    </span>
                </div>
            </div>
        </Modal>
    );
}