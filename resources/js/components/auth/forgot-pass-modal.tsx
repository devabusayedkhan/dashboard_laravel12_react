import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

import Modal from '@/components/helper/Model';
import { normalizeBDPhone } from '@/components/helper/NormalizePhone';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onOtpSent?: (phone: string) => void;
};

type ForgotErrors = {
    phone?: string;
};

export default function ForgotModal({ isOpen, onClose, onOtpSent }: Props) {
    const [phone, setPhone] = useState('');
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<ForgotErrors>({});

    useEffect(() => {
        if (!isOpen) {
            setPhone('');
            setErrors({});
            setProcessing(false);
        }
    }, [isOpen]);

    const handleClose = () => {
        setPhone('');
        setErrors({});
        setProcessing(false);
        onClose();
    };

    const handleForgotSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const normalizedPhone = normalizeBDPhone(phone);

        setPhone(normalizedPhone);
        setProcessing(true);
        setErrors({});

        try {
            const response = await fetch('/api/v1/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    phone: normalizedPhone,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 422 && data.errors) {
                    setErrors({
                        phone: data.errors.phone?.[0],
                    });
                    return;
                }

                Swal.fire({
                    icon: 'error',
                    title: 'Request Failed',
                    text: data?.message || 'Something went wrong.',
                    confirmButtonColor: '#f97316',
                });

                return;
            }

            Swal.fire({
                icon: 'success',
                title: 'OTP Sent',
                text: data.message || 'OTP sent to your phone.',
                showConfirmButton: false,
                timer: 1500,
            });

            if (onOtpSent) {
                onOtpSent(normalizedPhone);
            }

            handleClose();
        } catch (error) {
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
            title="Forgot password"
            width="w-[92%] sm:w-[62%] md:w-[42%] xl:w-[37%] 2xl:w-[33%]"
        >
            <hr className="mb-2 border-gray-500" />

            <div className="skShadow space-y-6 rounded-lg px-6 py-15">
                <form onSubmit={handleForgotSubmit}>
                    <div className="grid gap-2">
                        <Label htmlFor="phone">Phone Number</Label>

                        <div className="relative">
                            <div className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-xs text-muted-foreground">
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
                                onChange={(e) => setPhone(e.target.value)}
                                onBlur={() =>
                                    setPhone(normalizeBDPhone(phone))
                                }
                            />

                            <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
                                BD
                            </div>
                        </div>

                        <p className="text-xs text-muted-foreground">
                            Format:{' '}
                            <span className="font-medium">+8801XXXXXXXXX</span>
                        </p>

                        <InputError message={errors.phone} />
                    </div>

                    <div className="my-6 flex items-center justify-start">
                        <Button
                            type="submit"
                            className="flex w-full items-center justify-center gap-1 rounded-md px-4 py-2 font-bold"
                            disabled={processing}
                        >
                            {processing ? 'Sending...' : 'Send OTP'}
                            {processing && <Spinner />}
                        </Button>
                    </div>
                </form>

                <div className="space-x-1 text-center text-sm text-muted-foreground">
                    <span>Or, return to</span>
                    <span
                        onClick={handleClose}
                        className="cursor-pointer font-bold hover:underline"
                    >
                        log in
                    </span>
                </div>
            </div>
        </Modal>
    );
}